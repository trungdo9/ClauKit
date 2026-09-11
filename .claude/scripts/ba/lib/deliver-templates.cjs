/**
 * deliver-templates.cjs — the six template renderers for owned and derived
 * deliverables. Each exported function `render(ctx)` takes { projectDir, index,
 * gaps, crs, SIGN_BLOCK } and returns markdown text. Byte-stable (no timestamps).
 */

const { rawBody, stripHeading, finalize } = require('./spine-compose.cjs');
const path = require('path');

/** The real project dir name for the class marker — the same value `project:` carries. */
const slug = (projectDir) => path.basename(path.resolve(projectDir || '.'));

function renderScope({ index, projectDir }) {
  const prd = index.nodes.find((n) => n.id === 'PRD-001');
  const title = prd ? prd.title : 'PRD-001';
  const vision = prd ? stripHeading(rawBody(path.join(projectDir, prd.file))).trim() : '[UNKNOWN]';
  const epics = index.nodes.filter((n) => n.kind === 'EPIC').sort((a, b) => a.id.localeCompare(b.id));
  const nfrs = index.nodes.filter((n) => n.kind === 'NFR').sort((a, b) => a.id.localeCompare(b.id));
  const exclusions = new Set();
  for (const n of index.nodes) {
    if (n.out_of_scope) exclusions.add(`${n.id}: ${n.out_of_scope}`);
  }
  return finalize([
    `<!-- ba-deliverable: scope · class: derived · nguồn: plans/ba/${slug(projectDir)}/entities/ -->`,
    ``, `# SCOPE-001 — ${title}`, ``, `## Tầm nhìn (vision)`, ``, vision, ``,
    `## Phạm vi (in scope)`, ``, `| EPIC | Tiêu đề | Ngoài phạm vi |`, `|---|---|---|`,
    ...epics.map((e) => `| ${e.id} | ${e.title} | ${e.out_of_scope || '[UNKNOWN]'} |`), ``,
    `## Ràng buộc (constraints)`, ``, `| NFR | Tiêu đề |`, `|---|---|`,
    ...nfrs.map((n) => `| ${n.id} | ${n.title} |`), ``,
    `## Ngoài phạm vi (exclusions)`, ``, ...Array.from(exclusions).sort().map((e) => `- ${e}`),
  ].join('\n'));
}

function renderUAT({ index, gaps, SIGN_BLOCK, projectDir }) {
  const tcs = index.nodes.filter((n) => n.kind === 'TC').sort((a, b) => a.id.localeCompare(b.id));
  const byId = new Map(index.nodes.map((n) => [n.id, n]));
  const tcRows = tcs.map((tc) => {
    const parentId = tc.parents.length > 0 ? (byId.get(tc.parents[0])?.id || '[UNKNOWN]') : '[UNKNOWN]';
    return `| ${tc.id} | ${parentId} | [TO FILL] | [TO FILL] | [TO FILL] |`;
  });
  const acCount = index.nodes.filter((n) => n.kind === 'AC').length;
  const acWithTC = index.nodes.filter((n) => n.kind === 'AC' && index.nodes.some((t) => t.kind === 'TC' && t.parents.includes(n.id))).length;
  return finalize([
    `<!-- ba-deliverable: uat · class: owned · nguồn: plans/ba/${slug(projectDir)}/entities/ -->`, ``,
    `<!-- Seeded bởi \`/ba:deliver uat\`. Sau khi seed, file này do người dùng sở hữu — điền các ô \`[TO FILL]\`. Chạy lại sẽ bị từ chối; cần \`--force\`. -->`, ``,
    `# UAT-001 — Báo cáo kiểm thử chấp nhận`, ``,
    `| TC | AC cha | Kết quả (pass/fail/blocked) | Ngày | Người kiểm thử |`,
    `|---|---|---|---|---|`, ...tcRows, ``,
    `**Độ phủ:** TC=${tcs.length} · AC có TC=${acWithTC}/${acCount} · orphans=${gaps.orphans.length} · unsourced=${gaps.unsourced.length}`, ``,
    SIGN_BLOCK,
  ].join('\n'));
}

function renderAcceptance({ index, SIGN_BLOCK, projectDir }) {
  const frs = index.nodes.filter((n) => n.kind === 'FR').sort((a, b) => a.id.localeCompare(b.id));
  const byId = new Map(index.nodes.map((n) => [n.id, n]));
  const crs = index.nodes.filter((n) => n.kind === 'CR' && n.status === 'approved').sort((a, b) => a.id.localeCompare(b.id));
  const frLines = frs.map((fr) => {
    const epic = fr.parents.length > 0 ? byId.get(fr.parents[0]) : null;
    return `| ${fr.id} | ${fr.title} | ${epic?.id || '[UNKNOWN]'} |`;
  });
  return finalize([
    `<!-- ba-deliverable: acceptance · class: owned · nguồn: plans/ba/${slug(projectDir)}/entities/ -->`, ``,
    `<!-- Seeded bởi \`/ba:deliver acceptance\`. Sau khi seed, file này do người dùng sở hữu — điền các ô \`[TO FILL]\`. Chạy lại sẽ bị từ chối. -->`, ``,
    `# ACCEPTANCE-001 — Biên bản nghiệm thu`, ``,
    `## Phạm vi đã bàn giao`, ``, `| FR | Tiêu đề | EPIC |`, `|---|---|---|`, ...frLines, ``,
    `## Lỗi còn mở`, ``, `Chạy \`/ba:deliver uat\`, điền UAT-001.md, rồi re-seed với \`--force\`.`, ``,
    `## Thay đổi trong quá trình thực hiện (variance)`, ``,
    `| CR | Ảnh hưởng | Liên quan |`, `|---|---|---|`,
    ...crs.map((cr) => `| ${cr.id} | ${cr.impact || '[UNKNOWN]'} | ${cr.parents.join(', ')} |`), ``,
    SIGN_BLOCK,
  ].join('\n'));
}

function renderReleaseNotes({ index, projectDir }) {
  const items = index.nodes.filter((n) => (n.kind === 'FR' || n.kind === 'US') && n.release);
  const unreleased = index.nodes.filter((n) => (n.kind === 'FR' || n.kind === 'US') && !n.release);
  const byRelease = new Map();
  for (const item of items) {
    if (!byRelease.has(item.release)) byRelease.set(item.release, []);
    byRelease.get(item.release).push(item);
  }
  const sections = [
    `<!-- ba-deliverable: release-notes · class: derived · nguồn: plans/ba/${slug(projectDir)}/entities/ -->`, ``,
    `# RELEASE-NOTES-001 — Thông báo phát hành`, ``,
  ];
  for (const rel of Array.from(byRelease.keys()).sort().reverse()) {
    sections.push(`## ${rel}`, '', ...byRelease.get(rel).map((i) => `- ${i.id} — ${i.title}`), '');
  }
  if (unreleased.length) {
    sections.push(`## Unreleased`, '', ...unreleased.map((i) => `- ${i.id} — ${i.title}`), '');
  }
  return finalize(sections.join('\n'));
}

function renderGoLive({ projectDir } = {}) {
  return finalize([
    `<!-- ba-deliverable: golive · class: owned · nguồn: plans/ba/${slug(projectDir)}/entities/ -->`, ``,
    `<!-- Seeded bởi \`/ba:deliver golive\`. Sau khi seed, điền các ô \`[TO FILL]\`. Chạy lại sẽ bị từ chối. -->`, ``,
    `# GOLIVE-001 — Danh sách kiểm tra sẵn sàng`, ``,
    `## Danh sách kiểm tra sẵn sàng (Business)`, ``,
    `1. **Đào tạo (training) đã hoàn tất** — [TO FILL]`,
    `2. **Dữ liệu đã đối chiếu (data reconciled)** — AC id: [TO FILL]`,
    `3. **UAT đã ký** — xem UAT-001.md sign block`,
    `4. **Thông báo (comms) đã gửi** — [TO FILL]`,
    `5. **Người quyết định rollback (rollback decision owner)** — [TO FILL]`, ``,
    `**Ghi chú:** Nửa kỹ thuật (deploy, rollback, cut-over) trong \`docs/deployment-guide.md\`. Tạo nếu chưa có — chạy \`/ck:docs\`.`,
  ].join('\n'));
}

function renderHandover({ projectDir } = {}) {
  return finalize([
    `<!-- ba-deliverable: handover · class: owned · nguồn: plans/ba/${slug(projectDir)}/entities/ -->`, ``,
    `<!-- Seeded bởi \`/ba:deliver handover\`. Sau khi seed, điền các ô \`[TO FILL]\`. Chạy lại sẽ bị từ chối. -->`, ``,
    `# HANDOVER-001 — Bàn giao vận hành`, ``,
    `**Ghi chú:** Nội dung là trách nhiệm của agent \`docs-manager\` (engineer kit). Template cung cấp hình dạng. Không credentials — chỉ tên nơi secret được lưu.`, ``,
    `## Tài khoản (Accounts)`, ``, `| Hệ thống | Tên tài khoản | Ghi chú |`, `|---|---|---|`, `| [TO FILL] | [TO FILL] | [TO FILL] |`, ``,
    `## Môi trường (Environments)`, ``, `| Tên | URL / Host | Trạng thái |`, `|---|---|---|`, `| [TO FILL] | [TO FILL] | [TO FILL] |`, ``,
    `## Cấu hình (Configurations)`, ``, `| Tham số | Giá trị | Ghi chú |`, `|---|---|---|`, `| [TO FILL] | [TO FILL] | [TO FILL] |`, ``,
    `## Quy trình vận hành (Procedures)`, ``, `| Thao tác | Mô tả | Người chịu trách nhiệm |`, `|---|---|---|`, `| [TO FILL] | [TO FILL] | [TO FILL] |`, ``,
    `## Liên hệ (Contacts)`, ``, `| Vai trò | Họ tên | Email / SĐT | Giờ làm việc |`, `|---|---|---|---|`, `| [TO FILL] | [TO FILL] | [TO FILL] | [TO FILL] |`,
  ].join('\n'));
}

module.exports = {
  scope: renderScope,
  uat: renderUAT,
  acceptance: renderAcceptance,
  'release-notes': renderReleaseNotes,
  golive: renderGoLive,
  handover: renderHandover,
};
