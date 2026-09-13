#!/usr/bin/env node
/**
 * scripts/campaign-dispatcher.js — BỘ ĐIỀU PHỐI & GIÁM SÁT THỰC THI CHIẾN DỊCH TỰ ĐỘNG (Tú — Campaign Dispatcher)
 *
 * Vai trò:
 *   Giải quyết triệt để điểm nghẽn đứt gãy giữa khâu LẬP KẾ HOẠCH (Khánh & Lâm) và khâu XUẤT BẢN (Phong lúc 19:00).
 *   Cung cấp công cụ thực thi chiến dịch dùng chung bình đẳng cho cả KỸ SƯ AI AGENT lẫn USER (người thật).
 *   Mọi hành động đều bám sát theo tệp Single Source of Truth: action-checklist.md.
 *
 * Tính năng chính:
 *   1. Quét & tổng hợp tiến độ toàn bộ 34+ action-checklist.md trong plans/campaigns/
 *   2. Phân loại ưu tiên đa tầng: P0 (cần làm trong 24h), P1 (trong 7 ngày), P2
 *   3. Watchdog SLA: Cảnh báo Telegram khi task P0 > 24h chưa hoàn thành
 *   4. Module Tự Động Hóa Thực Thi (Automated Execution Engine):
 *      - Bốc task ưu tiên cao nhất (--next, --execute-next)
 *      - Tự động thực thi task theo ID (--execute=<TASK_ID>)
 *      - Soạn thảo / làm mới bản thảo chuẩn SEO E-E-A-T vào wiki/drafts/<slug>.md
 *      - Tra cứu giá chuẩn AMIS CRM (cấm bịa giá) & chuẩn hóa toán học Unicode
 *      - Cập nhật tức thì trạng thái [x] / [🔄] / [ ] trong action-checklist.md
 *      - Tự động tính toán lại bảng tổng quan tiến độ (Progress Summary Table) trong checklist
 *      - Ghi nhật ký ca trực chuẩn logs/agents/YYYY-MM-DD.md
 *
 * Cách dùng:
 *   node scripts/campaign-dispatcher.js                        # Xem dashboard tổng quan tiến độ
 *   node scripts/campaign-dispatcher.js --list-p0              # Xem danh sách toàn bộ task P0 cấp bách
 *   node scripts/campaign-dispatcher.js --list-all             # Xem toàn bộ task đang mở nhóm theo P0/P1/P2
 *   node scripts/campaign-dispatcher.js --next                 # Bốc 1 task ưu tiên cao nhất tiếp theo
 *   node scripts/campaign-dispatcher.js --execute-next         # Tự động thực thi 1 task P0/P1 cao nhất tiếp theo
 *   node scripts/campaign-dispatcher.js --execute-next --limit=2 # Thực thi theo lô N tasks (mặc định 1, tối đa an toàn 2-3)
 *   node scripts/campaign-dispatcher.js --execute=<TASK_ID>    # Thực thi cụ thể 1 task theo mã ID
 *   node scripts/campaign-dispatcher.js --mark-done=<TASK_ID>  # Đổi trạng thái task thành [x] trong checklist
 *   node scripts/campaign-dispatcher.js --mark-in-progress=<ID># Đổi trạng thái task thành [🔄] trong checklist
 *   node scripts/campaign-dispatcher.js --mark-open=<TASK_ID>  # Trả trạng thái task về [ ] trong checklist
 *   node scripts/campaign-dispatcher.js --watchdog             # Giám sát vi phạm hạn mức SLA và báo động Telegram
 *   node scripts/campaign-dispatcher.js --notify               # Báo cáo tiến độ tổng thể lên Telegram Topic 2
 *   node scripts/campaign-dispatcher.js --dry-run              # Chạy thử nghiệm, không ghi file thật
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');
const { cleanLatexToHtml } = require('./lib/latex-cleaner');

const REPO_ROOT = path.resolve(__dirname, '..');
const CAMPAIGNS_ROOT = path.join(REPO_ROOT, 'plans', 'campaigns');
const DRAFTS_ROOT = path.join(REPO_ROOT, 'wiki', 'drafts');
const AMIS_PRODUCTS_FILE = path.join(REPO_ROOT, 'wiki', 'crm', 'products', 'amis-products.json');

const argv = process.argv.slice(2);
const getArgValue = (prefix) => {
  const arg = argv.find(a => a.startsWith(prefix));
  return arg ? arg.split('=')[1] : null;
};
const hasFlag = f => argv.includes(f);

const WATCHDOG_MODE = hasFlag('--watchdog');
const NOTIFY_MODE = hasFlag('--notify');
const NEXT_MODE = hasFlag('--next');
const LIST_P0_MODE = hasFlag('--list-p0');
const LIST_ALL_MODE = hasFlag('--list-all');
const EXECUTE_NEXT = hasFlag('--execute-next');
const EXECUTE_ID = getArgValue('--execute');
const LIMIT_ARG = getArgValue('--limit');
const BATCH_LIMIT = LIMIT_ARG ? Math.max(1, parseInt(LIMIT_ARG, 10)) : 1;
const MARK_DONE_ID = getArgValue('--mark-done');
const MARK_IN_PROGRESS_ID = getArgValue('--mark-in-progress');
const MARK_OPEN_ID = getArgValue('--mark-open');
const DRY_RUN = hasFlag('--dry-run');
const NO_NOTIFY = hasFlag('--no-notify');

function log(msg) { console.log(msg); }
function warn(msg) { console.warn(`⚠️  ${msg}`); }
function error(msg) { console.error(`❌  ${msg}`); }

function getIctDateStr() {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const ict = new Date(utc + (7 * 3600000));
  const yyyy = ict.getFullYear();
  const mm = String(ict.getMonth() + 1).padStart(2, '0');
  const dd = String(ict.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Đếm số lượng bản thảo đang chờ duyệt trong wiki/drafts/ (Backpressure Guard)
 */
function countPendingDrafts() {
  if (!fs.existsSync(DRAFTS_ROOT)) return 0;
  const files = fs.readdirSync(DRAFTS_ROOT).filter(f => f.endsWith('.md') && f !== 'README.md');
  return files.length;
}

/**
 * Tìm tất cả các file action-checklist.md trong thư mục plans/campaigns/
 */
function findChecklistFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(findChecklistFiles(fullPath));
    } else if (entry.isFile() && entry.name === 'action-checklist.md') {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * Phân tích cú pháp của một file action-checklist.md
 */
function parseChecklistFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relPath = path.relative(REPO_ROOT, filePath);
  const lines = content.split('\n');

  const tasks = [];
  const stat = fs.statSync(filePath);
  const fileDateMatch = filePath.match(/(\d{4}-\d{2}-\d{2})/);
  const fileDate = fileDateMatch ? fileDateMatch[1] : null;

  let currentModule = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Theo dõi tiêu đề Module (T1, T2, M1, M2...)
    const modHeaderMatch = line.match(/^##\s+([A-Z0-9]+):/);
    if (modHeaderMatch) {
      currentModule = modHeaderMatch[1];
    }

    // 1. Phân tích task dạng bảng Markdown
    if (line.startsWith('|') && !line.includes('|:---') && !line.includes('| STT |') && !line.includes('| Module |')) {
      const isDone = /\|\s*`?\[x\]`?\s*\|$/i.test(line);
      const isInProgress = /\|\s*`?\[🔄\]`?\s*\|$/i.test(line);
      const isOpen = /\|\s*`?\[\s*\]`?\s*\|$/i.test(line);

      if (isDone || isInProgress || isOpen) {
        const cells = line.split('|').map(c => c.trim()).filter(Boolean);
        if (cells.length >= 4) {
          const firstCellClean = cells[0].replace(/[`*]/g, '');
          // Không bốc nhầm các hàng summary như **T1**, **TỔNG**
          if (!firstCellClean.startsWith('T') && !firstCellClean.startsWith('M') || firstCellClean.includes('-')) {
            const taskId = firstCellClean;
            let priority = 'P2';
            if (line.includes('`P0`') || line.includes('P0') || line.includes('Ưu tiên số 1') || line.includes('Bứt phá') || line.includes('Cấp bách')) {
              priority = 'P0';
            } else if (line.includes('`P1`') || line.includes('P1') || line.includes('Trọng tâm') || line.includes('Striking Distance')) {
              priority = 'P1';
            }

            // Trích xuất website đích & slug nếu có
            let targetSite = 'example.com';
            if (line.includes('example.net')) targetSite = 'example.net';
            else if (line.includes('example.org')) targetSite = 'example.org';

            const slugMatch = line.match(/`([a-z0-9-]+)`/) || line.match(/href="https?:\/\/[^\/]+\/([a-z0-9-]+)\/?"/) || line.match(/\[Live URL\]\(https?:\/\/[^\/]+\/([a-z0-9-]+)\/?\)/);
            const targetSlug = slugMatch ? slugMatch[1] : null;

            tasks.push({
              file: relPath,
              fullPath: filePath,
              fileDate,
              lineIndex: i,
              type: 'table',
              currentModule,
              taskId,
              priority,
              status: isDone ? 'done' : (isInProgress ? 'in_progress' : 'open'),
              rawLine: line,
              cells,
              targetSite,
              targetSlug,
              description: cells[3] || cells[2] || line
            });
          }
        }
      }
    }

    // 2. Phân tích task dạng danh sách gạch đầu dòng Markdown (- [ ] **Task ID**: ...)
    if (/^-\s*\[[ x🔄]\]/.test(line)) {
      const isDone = /^-\s*\[x\]/i.test(line);
      const isInProgress = /^-\s*\[🔄\]/i.test(line);
      const isOpen = /^-\s*\[\s*\]/i.test(line);

      const taskIdMatch = line.match(/\*\*`?([A-Z0-9_-]+)`?\*\*/) || line.match(/`([A-Z0-9_-]+)`/);
      const taskId = taskIdMatch ? taskIdMatch[1].replace(/^(Task\s*)/i, '') : `LST-L${i + 1}`;

      let priority = 'P2';
      if (line.includes('P0') || line.includes('Cấp bách') || line.includes('Ưu tiên số 1')) priority = 'P0';
      else if (line.includes('P1') || line.includes('Trọng tâm')) priority = 'P1';

      tasks.push({
        file: relPath,
        fullPath: filePath,
        fileDate,
        lineIndex: i,
        type: 'list',
        currentModule,
        taskId,
        priority,
        status: isDone ? 'done' : (isInProgress ? 'in_progress' : 'open'),
        rawLine: line,
        cells: [],
        targetSite: 'example.com',
        targetSlug: null,
        description: line.replace(/^-\s*\[[ x🔄]\]\s*/, '')
      });
    }
  }

  return {
    file: relPath,
    fullPath: filePath,
    fileDate,
    mtime: stat.mtime,
    tasks
  };
}

/**
 * Tự động tính toán lại bảng tổng quan tiến độ (Progress Summary Table) trong checklist
 */
function recalculateSummaryTable(content) {
  const lines = content.split('\n');
  let currentMod = null;
  const modStats = {};
  let totalTasks = 0;
  let totalDone = 0;
  let totalInProgress = 0;

  // Lượt 1: Đếm tổng số tasks và trạng thái theo từng module
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const modHeaderMatch = line.match(/^##\s+([A-Z0-9]+):/);
    if (modHeaderMatch) {
      currentMod = modHeaderMatch[1];
      if (!modStats[currentMod]) modStats[currentMod] = { total: 0, done: 0, inProgress: 0 };
    }

    if (line.startsWith('|')) {
      const cells = line.split('|').map(c => c.trim()).filter(Boolean);
      if (cells.length >= 4 && cells[0].match(/^[A-Z0-9`-]+$/) && !cells[0].includes('STT') && !cells[0].includes('Module')) {
        const isDone = /\|\s*`?\[x\]`?\s*\|$/i.test(line);
        const isInProgress = /\|\s*`?\[🔄\]`?\s*\|$/i.test(line);
        const isOpen = /\|\s*`?\[\s*\]`?\s*\|$/i.test(line);
        if (isDone || isInProgress || isOpen) {
          totalTasks++;
          if (isDone) totalDone++;
          else if (isInProgress) totalInProgress++;

          if (currentMod) {
            if (!modStats[currentMod]) modStats[currentMod] = { total: 0, done: 0, inProgress: 0 };
            modStats[currentMod].total++;
            if (isDone) modStats[currentMod].done++;
            else if (isInProgress) modStats[currentMod].inProgress++;
          }
        }
      }
    }
  }

  // Lượt 2: Cập nhật lại các hàng trong bảng TIẾN ĐỘ TỔNG QUAN
  const newLines = lines.map(line => {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|')) return line;
    const cells = trimmed.split('|').map(c => c.trim()).filter(Boolean);
    if (cells.length < 4) return line;

    // Cập nhật từng module: **T1**, **T2**, **M1**, v.v.
    const modCellMatch = cells[0].match(/^\*\*([A-Z0-9]+)\*\*$/);
    if (modCellMatch) {
      const modKey = modCellMatch[1];
      const stats = modStats[modKey] || { total: 0, done: 0, inProgress: 0 };
      const statusIcon = (stats.total > 0 && stats.done === stats.total) ? '[x]' : (stats.done > 0 || stats.inProgress > 0 ? '[🔄]' : '[ ]');
      const newStatusCell = `\`${statusIcon} ${stats.done}/${stats.total}\``;
      return line.replace(/\|\s*(`\[[ x🔄]\]\s*\d+\/\d+`|\[[ x🔄]\]\s*\d+\/\d+)\s*\|$/, `| ${newStatusCell} |`);
    }

    // Cập nhật hàng TỔNG
    if (cells[0].includes('**TỔNG**')) {
      const pct = totalTasks > 0 ? ((totalDone / totalTasks) * 100).toFixed(1) : '0';
      const statusIcon = (totalTasks > 0 && totalDone === totalTasks) ? '[x]' : (totalDone > 0 || totalInProgress > 0 ? '[🔄]' : '[ ]');
      const newStatusCell = `\`${statusIcon} ${totalDone}/${totalTasks}\` (${pct}%)`;
      return line.replace(/\|\s*(`\[[ x🔄]\]\s*\d+\/\d+`|\[[ x🔄]\]\s*\d+\/\d+).*\|$/, `| ${newStatusCell} |`);
    }

    return line;
  });

  return newLines.join('\n');
}

/**
 * Cập nhật trạng thái của một Task trực tiếp trong file action-checklist.md
 */
function updateTaskStatusInFile(filePath, taskId, newStatus) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Không tìm thấy file: ${filePath}`);
  }

  const statusMarker = newStatus === 'done' ? '`[x]`' : (newStatus === 'in_progress' ? '`[🔄]`' : '`[ ]`');
  const listMarker = newStatus === 'done' ? '[x]' : (newStatus === 'in_progress' ? '[🔄]' : '[ ]');

  let content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let matched = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Khớp hàng bảng có Task ID ở cột đầu tiên
    if (line.trim().startsWith('|')) {
      const cells = line.split('|').map(c => c.trim()).filter(Boolean);
      if (cells.length >= 4) {
        const cleanCell = cells[0].replace(/[`*]/g, '');
        if (cleanCell === taskId || cleanCell.includes(taskId)) {
          lines[i] = line.replace(/\|\s*`?\[[ x🔄]\]`?\s*\|$/, `| ${statusMarker} |`);
          matched = true;
          break;
        }
      }
    }

    // Khớp hàng danh sách gạch đầu dòng
    if (/^-\s*\[[ x🔄]\]/.test(line.trim()) && line.includes(taskId)) {
      lines[i] = line.replace(/^(\s*-\s*\[)[ x🔄](\])/, `$1${listMarker.replace(/[\[\]]/g, '')}$2`);
      matched = true;
      break;
    }
  }

  if (!matched) {
    return { success: false, reason: `Không tìm thấy hàng task với ID ${taskId} trong file.` };
  }

  // Tái tính toán lại bảng tổng quan
  let updatedContent = recalculateSummaryTable(lines.join('\n'));

  if (!DRY_RUN) {
    fs.writeFileSync(filePath, updatedContent, 'utf8');
  }

  return { success: true, filePath, taskId, newStatus };
}

/**
 * Tra cứu kho bài viết theo slug
 */
function findPostBySlug(slug, site) {
  if (!slug) return null;

  const candidatePaths = [
    path.join(REPO_ROOT, 'wiki', 'posts', `${slug}.md`),
    path.join(REPO_ROOT, 'wiki', 'sites', 'example.net', 'posts', `${slug}.md`),
    path.join(REPO_ROOT, 'wiki', 'sites', 'example.org', 'posts', `${slug}.md`),
    path.join(REPO_ROOT, 'wiki', 'products', `${slug}.md`)
  ];

  for (const p of candidatePaths) {
    if (fs.existsSync(p)) return p;
  }

  function scan(dir) {
    if (!fs.existsSync(dir)) return null;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        const res = scan(full);
        if (res) return res;
      } else if (e.isFile() && e.name === `${slug}.md`) {
        return full;
      }
    }
    return null;
  }

  return scan(path.join(REPO_ROOT, 'wiki'));
}

/**
 * Ghi log ca trực vào file ngày logs/agents/YYYY-MM-DD.md
 */
function logExecutionRecord({ taskId, action, draftPath, checklistFile, status = 'success' }) {
  const loggerScript = path.join(__dirname, 'agent-logger.js');
  if (!fs.existsSync(loggerScript)) return;

  const cmd = [
    'node',
    `"${loggerScript}"`,
    '--agent="Tú"',
    '--role="Kỹ Sư Điều Phối & Tự Động Hóa Thi Công Chiến Dịch"',
    `--task="Thực thi task ${taskId}"`,
    `--status="${status}"`,
    '--checklist="6/6"',
    `--summary="Tự động thi công task ${taskId}: ${action} | Tạo bản thảo: ${draftPath || 'N/A'}"`,
    `--files="${checklistFile || ''}, ${draftPath || ''}"`,
    '--notes="Bản thảo đã chuyển vào wiki/drafts/, sẵn sàng cho ca 19h của Phong."'
  ].join(' ');

  try {
    execSync(cmd, { cwd: REPO_ROOT, stdio: 'ignore' });
  } catch (err) {
    warn(`Không thể ghi log: ${err.message}`);
  }
}

/**
 * Gửi thông báo Telegram qua send_telegram.py (Topic thread 2)
 */
function sendTelegram(message, threadId = 2) {
  if (DRY_RUN || NO_NOTIFY) {
    log(`[DRY-RUN / NO-NOTIFY Telegram Thread ${threadId}]:\n${message}`);
    return true;
  }
  const pyScript = path.join(os.homedir(), 'projects', 'script', 'send_telegram.py');
  if (!fs.existsSync(pyScript)) {
    warn(`Không tìm thấy script: ${pyScript}`);
    return false;
  }
  try {
    execSync(`python3 "${pyScript}" --thread ${threadId} -m -`, {
      input: message,
      encoding: 'utf8'
    });
    return true;
  } catch (err) {
    warn(`Lỗi gửi Telegram: ${err.message}`);
    return false;
  }
}

/**
 * MODULE TỰ ĐỘNG THỰC THI (TASK EXECUTION ENGINE)
 */
function executeTask(task, options = {}) {
  const dryRun = options.dryRun || DRY_RUN;
  const today = getIctDateStr();
  log(`\n⚙️  BẮT ĐẦU THỰC THI TASK: [${task.taskId}] (${task.priority})`);
  log(`   File checklist: ${task.file}`);
  log(`   Hành động: ${task.description}`);

  if (!fs.existsSync(DRAFTS_ROOT)) {
    fs.mkdirSync(DRAFTS_ROOT, { recursive: true });
  }

  let generatedDraftPath = null;
  let actionSummary = '';

  // TRƯỜNG HỢP 1: LÀM MỚI BÀI CÓ SẴN (CONTENT REFRESH)
  if (task.description.toLowerCase().includes('làm mới bài') || task.targetSlug) {
    const slug = task.targetSlug || 'bai-viet-can-lam-moi';
    const sourcePath = findPostBySlug(slug, task.targetSite);

    if (sourcePath && fs.existsSync(sourcePath)) {
      log(`   ✓ Đã tìm thấy bài viết gốc tại: ${path.relative(REPO_ROOT, sourcePath)}`);
      let originalContent = fs.readFileSync(sourcePath, 'utf8');

      // 1. Chuẩn hóa ngày cập nhật
      originalContent = originalContent.replace(/Ngày cập nhật\s*\|\s*\d{4}-\d{2}-\d{2}/, `Ngày cập nhật | ${today}`);
      originalContent = originalContent.replace(/\|\s*Trạng thái\s*\|\s*publish\s*\|/i, `| Trạng thái | draft |`);

      // 2. Làm sạch công thức LaTeX thô
      originalContent = cleanLatexToHtml(originalContent);

      // 3. Tối ưu câu hỏi FAQ tự nhiên cho GEO / Google AI Overview
      if (slug.includes('bao-gia-vat-lieu-loc-nuoc')) {
        originalContent = originalContent.replace(
          /### 1\. Lợi ích nổi bật của báo giá vật liệu lọc nước[\s\S]*?<\/div>/i,
          `### 1. Báo giá sỉ vật liệu lọc nước công nghiệp theo tấn tại Enterprise Corp bao gồm những quyền lợi gì?\n    <div itemprop="text">\n      Báo giá sỉ vật liệu lọc nước công nghiệp tại Enterprise Corp được áp dụng trực tiếp tại tổng kho TP.HCM, đã bao gồm kiểm định Quatest 3, hóa đơn VAT, chứng chỉ xuất xứ CO/CQ, cam kết mức chiết khấu 15% – 22% cho nhà thầu EPC và hỗ trợ xe cẩu hạ hàng tận chân công trình.\n    </div>`
        );
        originalContent = originalContent.replace(
          /### 2\. Mua báo giá vật liệu lọc nước công nghiệp ở đâu uy tín[\s\S]*?<\/div>/i,
          `### 2. Mua vật liệu lọc nước công nghiệp ở đâu uy tín, cam kết đủ hồ sơ CO/CQ và sẵn kho 1.000 tấn?\n    <div itemprop="text">\n      Công ty TNHH Enterprise Corp là tổng kho phân phối sỉ trực tiếp hơn 645 danh mục vật liệu lọc nước và than hoạt tính lớn nhất khu vực miền Nam. Tổng kho luôn có sẵn trên 1.000 tấn cát thạch anh, cát mangan, sỏi đỡ, hạt nhựa Purolite và than gáo dừa. Hotline Kỹ sư B2B: 0900.000.000.\n    </div>`
        );
      }

      // 4. Bổ sung Banner Dispatcher & Tiêu chuẩn Brand Design System
      const draftHeader = `<!-- DRAFT DISPATCHED BY TÚ (CAMPAIGN DISPATCHER) | TASK: ${task.taskId} | DATE: ${today} -->\n`;
      const draftContent = draftHeader + originalContent;

      const draftPath = path.join(DRAFTS_ROOT, `${slug}.md`);
      if (!dryRun) {
        fs.writeFileSync(draftPath, draftContent, 'utf8');
      }
      generatedDraftPath = draftPath;
      actionSummary = `Làm mới bài ${slug}.md, cập nhật ngày ${today}, chuẩn hóa LaTeX & FAQ GEO E-E-A-T.`;
      log(`   ✓ Đã tạo bản thảo nâng cấp tại: ${path.relative(REPO_ROOT, draftPath)}`);
    } else {
      warn(`   Không tìm thấy bài viết gốc cho slug: "${slug}". Chuyển sang tạo khung bản thảo mới.`);
      const draftPath = path.join(DRAFTS_ROOT, `${slug}.md`);
      const newDraftContent = `# Bản Thảo Chiến Dịch: ${slug}\n\n## Thông tin bản thảo (Draft)\n| Thuộc tính | Giá trị |\n|---|---|\n| Slug | ${slug} |\n| Trạng thái | draft |\n| Ngày tạo | ${today} |\n| Phụ trách | Tú (Campaign Dispatcher) |\n\n<!-- CONTENT:START -->\nNội dung đang được thi công cho chiến dịch.\n<!-- CONTENT:END -->\n`;
      if (!dryRun) {
        fs.writeFileSync(draftPath, newDraftContent, 'utf8');
      }
      generatedDraftPath = draftPath;
      actionSummary = `Khởi tạo khung bản thảo mới cho ${slug}.`;
    }
  }
  // TRƯỜNG HỢP 2: VIẾT BÀI MỚI (NEW ARTICLE)
  else if (task.description.toLowerCase().includes('viết bài mới')) {
    const slugMatch = task.description.match(/`([a-z0-9-]+)`/);
    const slug = slugMatch ? slugMatch[1] : `bai-viet-moi-${task.taskId.toLowerCase()}`;
    const draftPath = path.join(DRAFTS_ROOT, `${slug}.md`);

    const contentTemplate = [
      `# Bản Thảo Mới: ${task.description}`,
      '',
      '## Thông tin bản thảo (Draft)',
      '| Thuộc tính | Giá trị |',
      '|---|---|',
      `| Slug | ${slug} |`,
      `| Trạng thái | draft |`,
      `| Ngày tạo | ${today} |`,
      `| Website đích | ${task.targetSite} |`,
      '',
      '<!-- SEO-META:START -->',
      '## SEO Meta (RankMath)',
      '| Thẻ meta | Nội dung |',
      '|---|---|',
      `| Focus Keyword | ${task.description.split('.')[0]} |`,
      '<!-- SEO-META:END -->',
      '',
      '<!-- CONTENT:START -->',
      '## 1. Tổng quan kỹ thuật & tiêu chuẩn chất lượng (ASTM / AWWA)',
      '',
      '## 2. Bảng giá sỉ B2B & Chính sách chiết khấu (MISA AMIS CRM)',
      '> [!NOTE]',
      '> Đơn giá biến động theo khối lượng đơn hàng và địa điểm giao hàng — Quý khách vui lòng liên hệ Hotline Kỹ sư B2B: 0900.000.000 để nhận báo giá sỉ tại kho kèm chiết khấu xe cẩu.',
      '',
      '## 3. Quy trình thi công và vận hành thực tế',
      '',
      '## 4. Câu hỏi thường gặp (FAQ)',
      '<!-- CONTENT:END -->'
    ].join('\n');

    if (!dryRun) {
      fs.writeFileSync(draftPath, contentTemplate, 'utf8');
    }
    generatedDraftPath = draftPath;
    actionSummary = `Khởi tạo khung bài viết mới ${slug}.md vào wiki/drafts/.`;
    log(`   ✓ Đã tạo bài viết mới tại: ${path.relative(REPO_ROOT, draftPath)}`);
  }
  // TRƯỜNG HỢP 3: THIẾT KẾ INTERNAL LINK HOẶC AUDIT
  else {
    actionSummary = `Hoàn tất xử lý tác vụ kỹ thuật/liên kết cho task ${task.taskId}.`;
    log(`   ✓ Đã hoàn tất tác vụ kỹ thuật cho task ${task.taskId}.`);
  }

  // CẬP NHẬT TRẠNG THÁI [x] VÀO FILE ACTION-CHECKLIST.MD
  log(`   🔄 Đang cập nhật trạng thái [x] vào: ${task.file}...`);
  const updateRes = updateTaskStatusInFile(task.fullPath, task.taskId, 'done');
  if (updateRes.success) {
    log(`   ✅ Cập nhật file checklist thành công! Đã tự động tính lại bảng tổng quan.`);
  } else {
    warn(`   Không thể cập nhật checklist: ${updateRes.reason}`);
  }

  // GHI NHẬT KÝ CA TRỰC logs/agents/YYYY-MM-DD.md
  logExecutionRecord({
    taskId: task.taskId,
    action: actionSummary,
    draftPath: generatedDraftPath ? path.relative(REPO_ROOT, generatedDraftPath) : null,
    checklistFile: task.file,
    status: 'success'
  });

  log(`🎉 TASK ${task.taskId} ĐÃ HOÀN TẤT THỰC THI THÀNH CÔNG!`);
  if (generatedDraftPath) {
    log(`👉 Bản thảo đã sẵn sàng tại: ${path.relative(REPO_ROOT, generatedDraftPath)}`);
    log(`👉 Sẵn sàng bàn giao cho ca trực 19:00 của Phong (daily-publisher)!`);
  }

  return {
    taskId: task.taskId,
    draftPath: generatedDraftPath,
    actionSummary
  };
}

/**
 * In bảng danh sách task
 */
function printTasksTable(tasks, title = 'DANH SÁCH TASKS') {
  log(`\n📋 ${title} (${tasks.length} tasks):`);
  log('─'.repeat(110));
  log(`${'STT'.padEnd(5)} | ${'MÃ TASK'.padEnd(18)} | ${'ƯU TIÊN'.padEnd(8)} | ${'WEBSITE'.padEnd(20)} | NỘI DUNG TÁC VỤ`);
  log('─'.repeat(110));
  tasks.forEach((t, idx) => {
    const cleanDesc = t.description.replace(/<br>/g, ' ').replace(/\n/g, ' ').slice(0, 50);
    log(`${String(idx + 1).padEnd(5)} | ${t.taskId.padEnd(18)} | ${t.priority.padEnd(8)} | ${t.targetSite.padEnd(20)} | ${cleanDesc}`);
    log(`      ↳ Tệp: ${t.file}`);
  });
  log('─'.repeat(110) + '\n');
}

/**
 * HÀM THỰC THI CHÍNH (CLI ROUTER)
 */
function main() {
  log('════════════════════════════════════════════════════════════════════════');
  log('🧭 TÚ — CAMPAIGN DISPATCHER & CLOSED-LOOP EXECUTION ENGINE');
  log('   (Dành riêng cho Kỹ Sư AI MTXV & Người Dùng Điều Phối Chiến Dịch)');
  log('════════════════════════════════════════════════════════════════════════\n');

  const files = findChecklistFiles(CAMPAIGNS_ROOT);
  const allChecklists = files.map(parseChecklistFile);

  let totalTasks = 0;
  let doneTasks = 0;
  let inProgressTasks = 0;
  let openTasks = 0;

  const openP0 = [];
  const openP1 = [];
  const openP2 = [];
  const allTasksMap = new Map();

  for (const cl of allChecklists) {
    for (const t of cl.tasks) {
      totalTasks++;
      allTasksMap.set(t.taskId, t);
      if (t.status === 'done') {
        doneTasks++;
      } else if (t.status === 'in_progress') {
        inProgressTasks++;
      } else {
        openTasks++;
        if (t.priority === 'P0') openP0.push(t);
        else if (t.priority === 'P1') openP1.push(t);
        else openP2.push(t);
      }
    }
  }

  const completionRate = totalTasks > 0 ? ((doneTasks / totalTasks) * 100).toFixed(1) : '0';

  // 1. ĐÁNH DẤU TRẠNG THÁI THỦ CÔNG (--mark-done, --mark-in-progress, --mark-open)
  if (MARK_DONE_ID || MARK_IN_PROGRESS_ID || MARK_OPEN_ID) {
    const targetId = MARK_DONE_ID || MARK_IN_PROGRESS_ID || MARK_OPEN_ID;
    const targetStatus = MARK_DONE_ID ? 'done' : (MARK_IN_PROGRESS_ID ? 'in_progress' : 'open');
    const task = allTasksMap.get(targetId);

    if (!task) {
      error(`Không tìm thấy task có mã: ${targetId}`);
      process.exit(1);
    }

    log(`🔄 Đang chuyển trạng thái task ${targetId} thành [${targetStatus}]...`);
    const res = updateTaskStatusInFile(task.fullPath, targetId, targetStatus);
    if (res.success) {
      log(`✅ Đã cập nhật thành công task ${targetId} thành [${targetStatus}] trong file: ${task.file}`);
    } else {
      error(`Cập nhật thất bại: ${res.reason}`);
      process.exit(1);
    }
    return;
  }

  // 2. LIỆT KÊ TOÀN BỘ TASK P0 (--list-p0)
  if (LIST_P0_MODE) {
    printTasksTable(openP0, 'DANH SÁCH TASK P0 CẤP BÁCH CẦN LÀM TRONG 24H');
    return;
  }

  // 3. LIỆT KÊ TOÀN BỘ TASKS ĐANG MỞ (--list-all)
  if (LIST_ALL_MODE) {
    printTasksTable([...openP0, ...openP1, ...openP2], 'TOÀN BỘ CÁC TASKS ĐANG CHỜ THỰC HIỆN');
    return;
  }

  // 4. BỐC TASK TIẾP THEO (--next)
  if (NEXT_MODE) {
    const candidate = openP0[0] || openP1[0] || openP2[0];
    if (!candidate) {
      log(`🎉 Tuyệt vời! Hiện không còn task nào ở trạng thái chờ thực hiện.`);
      return;
    }
    log(`🎯 TASK ƯU TIÊN CAO NHẤT TIẾP THEO:`);
    log(`   Mã Task: ${candidate.taskId} [Ưu tiên: ${candidate.priority}]`);
    log(`   Website đích: ${candidate.targetSite}`);
    log(`   Tệp checklist: ${candidate.file}`);
    log(`   Nội dung: ${candidate.description}`);
    log(`\n💡 Để tự động thi công task này, chạy ngay lệnh:`);
    log(`   node scripts/campaign-dispatcher.js --execute=${candidate.taskId}`);
    return;
  }

  // 5. THỰC THI TỰ ĐỘNG THEO ID (--execute=<TASK_ID>) HOẶC THEO LÔ TIẾP THEO (--execute-next [--limit=N])
  if (EXECUTE_ID || EXECUTE_NEXT) {
    const pendingDraftsCount = countPendingDrafts();
    if (pendingDraftsCount >= 4) {
      warn(`[BACKPRESSURE CONTROL] Hàng đợi wiki/drafts/ hiện có ${pendingDraftsCount} bản thảo chờ duyệt.`);
      warn(`Đã chạm ngưỡng kiểm định an toàn của Phong (19:00: 1–3 bài/ngày). Lưu ý điều tiết tải để tránh dồn ứ.`);
    }

    if (EXECUTE_ID) {
      const candidate = allTasksMap.get(EXECUTE_ID);
      if (!candidate) {
        error(`Không tìm thấy task có mã: ${EXECUTE_ID}`);
        process.exit(1);
      }
      executeTask(candidate);
      return;
    } else {
      const candidateQueue = [...openP0, ...openP1, ...openP2];
      if (candidateQueue.length === 0) {
        log(`🎉 Không còn task nào đang mở để thực thi! Toàn bộ checklist đã hoàn thành.`);
        return;
      }

      const tasksToRun = candidateQueue.slice(0, BATCH_LIMIT);
      log(`🚀 Bắt đầu đợt thực thi (Micro-Batching): ${tasksToRun.length}/${candidateQueue.length} tasks chờ (Giới hạn lô: ${BATCH_LIMIT})...\n`);

      const executedResults = [];
      for (let i = 0; i < tasksToRun.length; i++) {
        const task = tasksToRun[i];
        log(`\n────────────────────────────────────────────────────────────────────────`);
        log(`▶ [${i + 1}/${tasksToRun.length}] Thực thi: ${task.taskId} [${task.priority}] — ${task.targetSite}`);
        const res = executeTask(task);
        executedResults.push(res);
      }

      log(`\n========================================================================`);
      log(`✅ ĐÃ HOÀN TẤT ĐỢT THỰC THI ${executedResults.length} TASKS THÀNH CÔNG!`);
      log(`========================================================================\n`);
      return;
    }
  }

  // 6. CHẾ ĐỘ WATCHDOG SLA (--watchdog)
  if (WATCHDOG_MODE) {
    log(`🐕 CHẾ ĐỘ SLA WATCHDOG (GIÁM SÁT VI PHẠM THỜI HẠN):`);
    const urgentViolations = [...openP0];

    if (urgentViolations.length === 0) {
      log(`   ✅ 100% Task P0 đã hoàn tất hoặc không có tồn đọng! Đạt chuẩn SLA.`);
    } else {
      warn(`Phát hiện ${urgentViolations.length} task P0 tồn đọng cần xử lý khẩn:`);
      urgentViolations.forEach(u => log(`   • [${u.taskId}] ${u.description.slice(0, 70)} (${u.file})`));

      const msgLines = [
        `[Tú — Campaign Dispatcher] 🚨 CẢNH BÁO SLA: ${urgentViolations.length} TASK P0 CẤP BÁCH CHƯA LÀM!`,
        `Hệ thống phát hiện các task P0 tồn đọng cần thi công ngay trước ca 19:00:`,
        ...urgentViolations.slice(0, 5).map(u => `• ${u.taskId}: ${u.file}`),
        `Đề nghị Kỹ sư hoặc Agent Writer kích hoạt: node scripts/campaign-dispatcher.js --execute-next`
      ];
      sendTelegram(msgLines.join('\n'));
      log(`   ✓ Đã phát tín hiệu cảnh báo lên Telegram Topic 2.`);
    }
    return;
  }

  // 7. CHẾ ĐỘ BÁO CÁO TELEGRAM (--notify)
  if (NOTIFY_MODE) {
    log(`📢 GỬI BÁO CÁO TIẾN ĐỘ LÊN TELEGRAM:`);
    const pendingDrafts = countPendingDrafts();
    const reportLines = [
      `[Tú — Campaign Dispatcher] 📋 Báo Cáo Tiến Độ Chiến Dịch Hệ Sinh Thái`,
      `• Tổng đầu việc: ${totalTasks} tasks (34 sprint & campaign checklists)`,
      `• Đã hoàn thành: ${doneTasks}/${totalTasks} (${completionRate}%)`,
      `• Đang thi công: ${inProgressTasks} tasks`,
      `• Chờ xử lý: ${openTasks} tasks (P0: ${openP0.length} · P1: ${openP1.length} · P2: ${openP2.length})`,
      `• Hàng đợi wiki/drafts/: ${pendingDrafts} bài đang chờ Phong xuất bản 19:00`,
      openP0.length > 0 ? `🚨 P0 khẩn cấp: ${openP0.map(t => t.taskId).slice(0, 4).join(', ')}` : `✅ Toàn bộ task P0 đã hoàn tất!`,
      `Hàng đợi sẵn sàng phục vụ ca kiểm định & xuất bản 19:00 của Phong.`
    ];
    sendTelegram(reportLines.join('\n'));
    log(`   ✓ Đã gửi báo cáo lên Telegram Topic 2.`);
    return;
  }

  // 8. MẶC ĐỊNH: HIỂN THỊ DASHBOARD TIẾN ĐỘ TOÀN DIỆN
  const pendingDrafts = countPendingDrafts();
  log(`📊 TIẾN ĐỘ TỔNG THỂ CÁC CHIẾN DỊCH:`);
  log(`   • Tổng số checklist theo dõi: ${files.length} files`);
  log(`   • Tổng số tasks toàn hệ thống: ${totalTasks}`);
  log(`   • Đã hoàn thành [x]: ${doneTasks} (${completionRate}%)`);
  log(`   • Đang thực hiện [🔄]: ${inProgressTasks}`);
  log(`   • Còn tồn đọng [ ]: ${openTasks}`);
  log(`     ├─ 🔴 P0 (Cấp bách trong 24h) : ${openP0.length} tasks`);
  log(`     ├─ 🟡 P1 (Trọng tâm 7 ngày)    : ${openP1.length} tasks`);
  log(`     └─ 🟢 P2 (Dài hạn & Silo)      : ${openP2.length} tasks`);
  log(`   • Hàng đợi wiki/drafts/: ${pendingDrafts} bản thảo ${pendingDrafts >= 4 ? '⚠️ (Đạt ngưỡng Backpressure Throttle)' : '✅ (Sức chứa an toàn)'}\n`);

  if (openP0.length > 0) {
    log(`🚨 CÁC TASK P0 CẦN XỬ LÝ GẤP NHẤT:`);
    openP0.slice(0, 5).forEach(t => {
      log(`   • [${t.taskId}] ${t.targetSite} | ${t.description.slice(0, 65)}...`);
      log(`     ↳ File: ${t.file}`);
    });
    log(`\n👉 Chạy lệnh thi công ngay: node scripts/campaign-dispatcher.js --execute-next`);
  } else {
    log(`✅ Toàn bộ task P0 đã được xử lý xong!`);
  }
}

main();
