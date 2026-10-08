#!/usr/bin/env node

/**
 * 📋 AGENT OPERATIONAL DAILY LOGGER
 * 
 * Ghi nhận nhật ký ca trực hàng ngày của các Kỹ sư AI Agent vào thư mục nội bộ cục bộ:
 * File đích: logs/agents/YYYY-MM-DD.md
 * (Quy tắc an toàn: Thư mục logs/agents/*.md được gitignore — không bao giờ push lên remote)
 * 
 * Cách dùng qua CLI:
 *   node scripts/agent-logger.js \
 *     --agent="Vũ" \
 *     --role="Kỹ Sư CRM & Tự Động Hóa" \
 *     --task="Ca trực 07:00 AM — Delta Sync AMIS CRM ⟷ Brevo" \
 *     --status="success" \
 *     --checklist="10/10" \
 *     --summary="Đồng bộ 645+ sản phẩm AMIS, cập nhật 28 contacts Brevo" \
 *     --files="wiki/crm/products/amis-products.json" \
 *     --notes="Không phát hiện lỗi PII, hoàn tất trong 45s"
 * 
 * Trạng thái (--status):
 *   success  ➔ ✅ Thành công
 *   warning  ➔ ⚠️ Cảnh báo / Dừng giữa đường
 *   error    ➔ ❌ Thất bại / Sự cố
 */

const fs = require('fs');
const path = require('path');

const LOGS_DIR = path.resolve(__dirname, '../logs/agents');
const DEFAULT_RETENTION_DAYS = 30;

/**
 * Tự động dọn dẹp các tệp nhật ký cũ hơn số ngày quy định (mặc định: 30 ngày)
 * File đích: logs/agents/YYYY-MM-DD.md
 */
function pruneOldLogs(maxDays = DEFAULT_RETENTION_DAYS) {
  if (!fs.existsSync(LOGS_DIR)) return [];
  const files = fs.readdirSync(LOGS_DIR);
  const now = new Date();
  const deleted = [];
  const logRegex = /^(\d{4})-(\d{2})-(\d{2})\.md$/;

  for (const file of files) {
    const match = file.match(logRegex);
    if (!match) continue; // Bỏ qua README.md và các file không phải định dạng ngày

    const fileDateStr = `${match[1]}-${match[2]}-${match[3]}`;
    const fileTime = new Date(`${fileDateStr}T00:00:00+07:00`).getTime();
    if (isNaN(fileTime)) continue;

    // Tính tuổi của tệp theo ngày
    const ageDays = (now.getTime() - fileTime) / (1000 * 60 * 60 * 24);
    if (ageDays > maxDays) {
      const fullPath = path.join(LOGS_DIR, file);
      try {
        fs.unlinkSync(fullPath);
        deleted.push(file);
      } catch (err) {
        console.warn(`[AgentLogger] ⚠️ Không thể xóa tệp nhật ký cũ ${file}: ${err.message}`);
      }
    }
  }

  if (deleted.length > 0) {
    console.log(`[AgentLogger] 🗑️ Đã xoay vòng & dọn dẹp ${deleted.length} tệp nhật ký cũ hơn ${maxDays} ngày: ${deleted.join(', ')}`);
  }
  return deleted;
}

function getIctDate() {
  const now = new Date();
  // Chuyển sang múi giờ ICT (UTC+7)
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const ict = new Date(utc + (7 * 3600000));
  
  const yyyy = ict.getFullYear();
  const mm = String(ict.getMonth() + 1).padStart(2, '0');
  const dd = String(ict.getDate()).padStart(2, '0');
  const hh = String(ict.getHours()).padStart(2, '0');
  const min = String(ict.getMinutes()).padStart(2, '0');
  const ss = String(ict.getSeconds()).padStart(2, '0');

  return {
    dateStr: `${yyyy}-${mm}-${dd}`,
    timeStr: `${hh}:${min}:${ss}`,
    fullStr: `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss} ICT`
  };
}

function parseArgs() {
  const args = process.argv.slice(2);
  const params = {
    agent: 'Agent',
    role: 'Kỹ sư chuyên trách',
    task: 'Ca trực tự động',
    taskId: '',
    mode: 'LIVE',
    duration: '',
    metrics: '',
    handover: '',
    status: 'success',
    checklist: 'N/A',
    progress: '',
    completed: '',
    summary: '',
    files: '',
    issue: '',
    nextStep: '',
    eta: '',
    needSupport: '',
    notes: '',
    date: '',
    pruneOnly: false,
    retentionDays: DEFAULT_RETENTION_DAYS
  };

  for (const arg of args) {
    if (arg === '--prune') {
      params.pruneOnly = true;
    } else if (arg.startsWith('--prune=')) {
      params.pruneOnly = true;
      params.retentionDays = Number(arg.split('=')[1].trim()) || DEFAULT_RETENTION_DAYS;
    } else if (arg.startsWith('--retention-days=')) {
      params.retentionDays = Number(arg.split('=')[1].trim()) || DEFAULT_RETENTION_DAYS;
    } else if (arg.startsWith('--agent=')) params.agent = arg.split('=')[1].trim();
    else if (arg.startsWith('--role=')) params.role = arg.split('=')[1].trim();
    else if (arg.startsWith('--task=')) params.task = arg.split('=')[1].trim();
    else if (arg.startsWith('--taskId=') || arg.startsWith('--task-id=')) params.taskId = arg.split('=')[1].trim();
    else if (arg.startsWith('--mode=')) params.mode = arg.split('=')[1].trim().toUpperCase();
    else if (arg.startsWith('--duration=')) params.duration = arg.split('=')[1].trim();
    else if (arg.startsWith('--metrics=')) params.metrics = arg.split('=')[1].trim();
    else if (arg.startsWith('--handover=')) params.handover = arg.split('=')[1].trim();
    else if (arg.startsWith('--status=')) params.status = arg.split('=')[1].trim().toLowerCase();
    else if (arg.startsWith('--checklist=')) params.checklist = arg.split('=')[1].trim();
    else if (arg.startsWith('--progress=')) params.progress = arg.split('=')[1].trim();
    else if (arg.startsWith('--completed=')) params.completed = arg.split('=')[1].trim();
    else if (arg.startsWith('--result=')) params.summary = arg.split('=')[1].trim();
    else if (arg.startsWith('--summary=')) params.summary = arg.split('=')[1].trim();
    else if (arg.startsWith('--issue=') || arg.startsWith('--issues=')) params.issue = arg.split('=')[1].trim();
    else if (arg.startsWith('--next-step=') || arg.startsWith('--next=')) params.nextStep = arg.split('=')[1].trim();
    else if (arg.startsWith('--eta=')) params.eta = arg.split('=')[1].trim();
    else if (arg.startsWith('--need-support=') || arg.startsWith('--support=')) params.needSupport = arg.split('=')[1].trim();
    else if (arg.startsWith('--files=')) params.files = arg.split('=')[1].trim();
    else if (arg.startsWith('--notes=')) params.notes = arg.split('=')[1].trim();
    else if (arg.startsWith('--date=')) params.date = arg.split('=')[1].trim();
  }

  return params;
}

function logAgentActivity(options = {}) {
  // Tự động xoay vòng nhật ký: dọn dẹp các tệp nhật ký cũ hơn 30 ngày
  try {
    pruneOldLogs(options.retentionDays || DEFAULT_RETENTION_DAYS);
  } catch (_) {}

  // Rào chắn bảo vệ: Từ chối log rác rỗng không có danh tính hoặc tóm tắt
  if ((!options.agent || options.agent === 'Agent') && (!options.summary || options.summary.trim().length === 0)) {
    console.warn('[AgentLogger] ⚠️ Bỏ qua ghi nhật ký: Thiếu thông tin Agent hoặc nội dung tóm tắt (ngăn chặn ghost log rác).');
    return null;
  }

  const ict = getIctDate();
  const targetDate = options.date || ict.dateStr;
  
  if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
  }

  const logFilePath = path.join(LOGS_DIR, `${targetDate}.md`);
  const isNewFile = !fs.existsSync(logFilePath);

  let statusBadge = '✅ Thành công';
  if (options.status === 'warning' || options.status === 'warn') {
    statusBadge = '⚠️ Cảnh báo / Dừng giữa chừng';
  } else if (options.status === 'error' || options.status === 'fail') {
    statusBadge = '❌ Thất bại / Sự cố';
  }

  let content = '';

  if (isNewFile) {
    content += `# 📋 Nhật Ký Hoạt Động Kỹ Sư AI Agent — Ngày ${targetDate}\n`;
    content += `*Tập tin nhật ký công việc tự động cục bộ (Local Operational Log — Không push lên Git)*\n\n`;
    content += `> Thư mục lưu trữ: \`logs/agents/${targetDate}.md\` | Múi giờ ghi nhận: ICT (UTC+7)\n\n`;
    content += `---\n\n`;
  }

  const taskTitle = options.taskId ? `[${options.taskId}] ${options.task}` : options.task;
  content += `## [${ict.timeStr}] [${options.agent} — ${options.role}] — ${taskTitle}\n\n`;
  
  const statusLine = [`- **Trạng thái:** ${statusBadge}`];
  if (options.mode) statusLine.push(`**Chế độ:** \`${options.mode}\``);
  if (options.progress) statusLine.push(`**Tiến độ:** \`${options.progress}\``);
  if (options.checklist && options.checklist !== 'N/A') statusLine.push(`**Checklist:** \`${options.checklist}\``);
  content += `${statusLine.join(' | ')}\n`;
  
  const durationText = options.duration ? ` (${options.duration})` : '';
  content += `- **Thời gian:** ${ict.fullStr}${durationText}\n`;
  
  if (options.completed) {
    content += `- **Đã hoàn thành:** ${options.completed}\n`;
  }
  if (options.metrics) {
    content += `- **Chỉ số:** ${options.metrics}\n`;
  }
  if (options.summary) {
    content += `- **Kết quả / Tóm tắt:** ${options.summary}\n`;
  }
  if (options.issue) {
    content += `- **Vấn đề:** ${options.issue}\n`;
  }
  if (options.nextStep) {
    content += `- **Việc tiếp theo:** ${options.nextStep}\n`;
  }
  if (options.eta) {
    content += `- **Dự kiến hoàn thành:** ${options.eta}\n`;
  }
  if (options.needSupport) {
    content += `- **Cần quản lý hỗ trợ:** ${options.needSupport}\n`;
  }
  if (options.files) {
    const rawList = Array.isArray(options.files) ? options.files : options.files.split(',').map(f => f.trim()).filter(Boolean);
    const repoRoot = path.resolve(__dirname, '..');
    const verified = rawList.map(f => {
      const fullPath = path.isAbsolute(f) ? f : path.join(repoRoot, f);
      const exists = fs.existsSync(fullPath);
      return { path: f, exists };
    });

    if (verified.length === 1) {
      const item = verified[0];
      content += `- **Tệp tác động:** \`${item.path}\`${item.exists ? '' : ' *(dự kiến / dry-run)*'}\n`;
    } else if (verified.length <= 5) {
      content += `- **Tệp tác động (${verified.length}):**\n`;
      verified.forEach(item => {
        content += `  - \`${item.path}\`${item.exists ? '' : ' *(dự kiến / dry-run)*'}\n`;
      });
    } else {
      // Thu gọn danh sách khi > 5 tệp để chống tràn dòng nhật ký
      content += `- **Tệp tác động (${verified.length} tệp):**\n`;
      verified.slice(0, 3).forEach(item => {
        content += `  - \`${item.path}\`${item.exists ? '' : ' *(dự kiến / dry-run)*'}\n`;
      });
      content += `  - *... và ${verified.length - 3} tệp khác*\n`;
    }
  }
  if (options.handover) {
    content += `- **Bàn giao:** ${options.handover}\n`;
  }
  if (options.notes) {
    content += `- **Ghi chú:** ${options.notes}\n`;
  }

  content += `\n---\n\n`;

  fs.appendFileSync(logFilePath, content, 'utf8');

  console.log(`[AgentLogger] ✓ Đã ghi nhật ký ca trực vào: ${path.relative(process.cwd(), logFilePath)}`);
  return logFilePath;
}

if (require.main === module) {
  const params = parseArgs();
  if (params.pruneOnly) {
    pruneOldLogs(params.retentionDays);
    process.exit(0);
  }
  logAgentActivity(params);
}

module.exports = {
  logAgentActivity,
  getIctDate,
  pruneOldLogs,
  DEFAULT_RETENTION_DAYS
};
