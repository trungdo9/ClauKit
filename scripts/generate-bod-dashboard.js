#!/usr/bin/env node

/**
 * 📊 GENERATE BOD DASHBOARD & WORK REPORT
 * 
 * Script tổng hợp báo cáo công việc hàng ngày của các Kỹ sư AI MTXV
 * phục vụ Giám đốc công ty theo dõi trên Web Dashboard và Telegram:
 * 
 * Tính năng chính:
 *   1. Quét và phân tích nhật ký logs/agents/YYYY-MM-DD.md
 *   2. Chuẩn hóa thành cấu trúc JSON 9 trường thông tin SSOT:
 *      - Công việc
 *      - Trạng thái
 *      - Tiến độ (%)
 *      - Đã hoàn thành
 *      - Kết quả đầu ra
 *      - Vấn đề / Trở ngại
 *      - Việc tiếp theo
 *      - Dự kiến hoàn thành (ETA)
 *      - Cần quản lý hỗ trợ (Có / Không + Chi tiết)
 *   3. Xuất file reports/dashboard/data/YYYY-MM-DD.json và latest.json
 *   4. Xuất định dạng tin nhắn Telegram an toàn, chống vỡ layout
 * 
 * Cách dùng:
 *   node scripts/generate-bod-dashboard.js                      # Chạy cho ngày hôm nay
 *   node scripts/generate-bod-dashboard.js --date=2026-10-08    # Chạy cho ngày cụ thể
 *   node scripts/generate-bod-dashboard.js --telegram-preview   # Xem trước định dạng Telegram
 *   node scripts/generate-bod-dashboard.js --notify             # Bắn bản tin tổng hợp lên Telegram BOD
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '..');
const LOGS_DIR = path.join(REPO_ROOT, 'logs/agents');
const DASHBOARD_DIR = path.join(REPO_ROOT, 'reports/dashboard');
const DATA_DIR = path.join(DASHBOARD_DIR, 'data');
const TELEGRAM = path.join(process.env.HOME || '/home/trungdo', 'projects/script/send_telegram.py');

function getIctDateStr() {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const ict = new Date(utc + (7 * 3600000));
  const yyyy = ict.getFullYear();
  const mm = String(ict.getMonth() + 1).padStart(2, '0');
  const dd = String(ict.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

const args = process.argv.slice(2);
const dateArg = args.find(a => a.startsWith('--date='));
const TARGET_DATE = dateArg ? dateArg.split('=')[1].trim() : getIctDateStr();
const PREVIEW_TELEGRAM = args.includes('--telegram-preview');
const NOTIFY_MODE = args.includes('--notify');

function parseLogFile(dateStr) {
  const logFile = path.join(LOGS_DIR, `${dateStr}.md`);
  if (!fs.existsSync(logFile)) {
    console.warn(`[BodDashboard] ⚠️ Không tìm thấy file nhật ký: ${path.relative(REPO_ROOT, logFile)}`);
    return [];
  }

  const raw = fs.readFileSync(logFile, 'utf8');
  const sections = raw.split(/^##\s+/m).slice(1);
  const entries = [];

  sections.forEach((sec, idx) => {
    const lines = sec.trim().split('\n');
    const header = lines[0]; // [HH:MM:SS] [Agent — Role] — Task title
    
    const headerMatch = header.match(/\[(\d{2}:\d{2}:\d{2})\]\s*\[([^—\]]+)\s*—\s*([^\]]+)\]\s*—\s*(.+)/);
    if (!headerMatch) return;

    const time = headerMatch[1];
    const agent = headerMatch[2].trim();
    const role = headerMatch[3].trim();
    const taskName = headerMatch[4].trim();

    let status = 'Đang thực hiện';
    let statusBadge = 'warning';
    let checklist = '';
    let summary = '';
    let files = [];
    let notes = '';
    let explicitProgress = '';
    let explicitCompleted = '';
    let explicitIssue = '';
    let explicitNextStep = '';
    let explicitEta = '';
    let explicitNeedSupport = '';

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('- **Trạng thái:**')) {
        if (line.includes('✅') || line.toLowerCase().includes('thành công')) {
          status = 'Hoàn thành';
          statusBadge = 'success';
        } else if (line.includes('❌') || line.toLowerCase().includes('thất bại')) {
          status = 'Gặp sự cố';
          statusBadge = 'danger';
        } else {
          status = 'Đang thực hiện';
          statusBadge = 'warning';
        }
        const chkMatch = line.match(/\*\*Checklist:\*\*\s*`([^`]+)`/);
        if (chkMatch) checklist = chkMatch[1];
        const prgMatch = line.match(/\*\*Tiến độ:\*\*\s*`([^`]+)`/);
        if (prgMatch) explicitProgress = prgMatch[1];
      } else if (line.startsWith('- **Đã hoàn thành:**')) {
        explicitCompleted = line.replace('- **Đã hoàn thành:**', '').trim();
      } else if (line.startsWith('- **Tóm tắt:**') || line.startsWith('- **Kết quả / Tóm tắt:**') || line.startsWith('- **Kết quả:**')) {
        summary = line.replace(/^- \*\*(Kết quả \/ Tóm tắt|Tóm tắt|Kết quả):\*\*/, '').trim();
      } else if (line.startsWith('- **Vấn đề:**')) {
        explicitIssue = line.replace('- **Vấn đề:**', '').trim();
      } else if (line.startsWith('- **Việc tiếp theo:**')) {
        explicitNextStep = line.replace('- **Việc tiếp theo:**', '').trim();
      } else if (line.startsWith('- **Dự kiến hoàn thành:**')) {
        explicitEta = line.replace('- **Dự kiến hoàn thành:**', '').trim();
      } else if (line.startsWith('- **Cần quản lý hỗ trợ:**')) {
        explicitNeedSupport = line.replace('- **Cần quản lý hỗ trợ:**', '').trim();
      } else if (line.startsWith('- **Ghi chú:**')) {
        notes = line.replace('- **Ghi chú:**', '').trim();
      } else if (line.startsWith('- **Tệp tác động')) {
        // Collect files
      }
    }

    // Ước lượng tiến độ từ checklist hoặc trạng thái nếu không có explicit
    let progress = explicitProgress || '100%';
    let completedWork = explicitCompleted || summary || 'Hoàn tất nhiệm vụ';
    if (!explicitProgress && (statusBadge === 'warning' || statusBadge === 'danger')) {
      if (checklist && checklist.includes('/')) {
        const [cDone, cTotal] = checklist.split('/').map(Number);
        if (!isNaN(cDone) && !isNaN(cTotal) && cTotal > 0) {
          const pct = Math.round((cDone / cTotal) * 100);
          progress = `${pct}%`;
          if (!explicitCompleted) completedWork = `Đã hoàn thành ${checklist} tiêu chí checklist`;
        } else {
          progress = '60%';
        }
      } else {
        progress = '70%';
      }
    }

    // Nhận diện Vấn đề (Issue)
    let issue = explicitIssue || 'Không có';
    if (!explicitIssue) {
      if (notes.toLowerCase().includes('lỗi') || notes.toLowerCase().includes('cần') || statusBadge !== 'success') {
        if (notes) issue = notes;
        else if (statusBadge !== 'success') issue = 'Dừng giữa chừng theo luật an toàn';
      }
    }

    // Nhận diện Cần quản lý hỗ trợ (Need Support)
    let needSupport = 'Không';
    let supportDetails = '';
    if (explicitNeedSupport) {
      if (explicitNeedSupport.toLowerCase().startsWith('có')) {
        needSupport = 'Có';
        supportDetails = explicitNeedSupport;
      } else {
        needSupport = 'Không';
      }
    } else if (notes.toLowerCase().includes('cần cấp quyền') || notes.toLowerCase().includes('cần người thật') || notes.toLowerCase().includes('cần quản lý') || notes.toLowerCase().includes('401')) {
      needSupport = 'Có';
      supportDetails = notes;
    }

    // Định hình việc tiếp theo
    let nextStep = explicitNextStep || 'Duy trì vận hành & kiểm tra định kỳ trong ca tiếp theo';
    if (!explicitNextStep) {
      if (agent === 'Khoa') nextStep = 'Quét luân phiên KCN dệt nhuộm & xi mạ theo ma trận ngày tiếp theo';
      else if (agent === 'Vũ') nextStep = 'Thực hiện đồng bộ contacts sang Brevo ngay sau khi IP được cấp quyền';
      else if (agent === 'Ngân') nextStep = 'Hoàn thành các ca trực tối còn lại và tổng hợp tín hiệu nhu cầu';
      else if (agent === 'Tú') nextStep = 'Bàn giao các bản thảo đạt chuẩn cho ca xuất bản của Phong';
      else if (agent === 'Phong') nextStep = 'Theo dõi index bài viết trên Google Search Console';
      else if (agent === 'Hải') nextStep = 'Bàn giao trạng thái hạ tầng cho ca sáng hôm sau';
    }

    entries.push({
      id: `RPT-${dateStr.replace(/-/g, '')}-${String(idx + 1).padStart(2, '0')}`,
      time,
      agent,
      role,
      task_name: taskName,
      status,
      status_badge: statusBadge,
      progress,
      completed_work: completedWork,
      result: summary || 'Đã ghi nhận nhật ký vận hành',
      issue,
      next_step: nextStep,
      eta: dateStr,
      need_support: needSupport,
      support_details: supportDetails
    });
  });

  return entries;
}

function deduplicateLatestPerAgent(entries) {
  // Gom nhóm theo Agent để lấy công việc tiêu biểu nhất hoặc giữ nguyên
  // Nếu có nhiều ca (như Ngân 14 ca), gom lại thành 1 báo cáo tổng hợp đại diện
  const grouped = {};
  entries.forEach(e => {
    if (!grouped[e.agent]) grouped[e.agent] = [];
    grouped[e.agent].push(e);
  });

  const finalReports = [];
  Object.keys(grouped).forEach(agentName => {
    const list = grouped[agentName];
    if (list.length === 1) {
      finalReports.push(list[0]);
    } else {
      // Agent có nhiều ca trong ngày (vd Ngân có 14 ca, Phong có 2 ca)
      const latest = list[list.length - 1];
      const hasSupport = list.some(x => x.need_support === 'Có');
      const supportItem = list.find(x => x.need_support === 'Có');

      finalReports.push({
        ...latest,
        id: latest.id,
        task_name: `${latest.task_name} (Tổng hợp ${list.length} ca trực trong ngày)`,
        completed_work: `Đã thực hiện ${list.length} ca trực trong ngày; ${latest.completed_work}`,
        need_support: hasSupport ? 'Có' : 'Không',
        support_details: hasSupport ? supportItem.support_details : ''
      });
    }
  });

  return finalReports;
}

function generateReportData(dateStr) {
  const allEntries = parseLogFile(dateStr);
  const reports = deduplicateLatestPerAgent(allEntries);

  const totalTasks = reports.length;
  const completedTasks = reports.filter(r => r.status === 'Hoàn thành').length;
  const inProgressTasks = totalTasks - completedTasks;
  const needSupportCount = reports.filter(r => r.need_support === 'Có').length;

  let sumPct = 0;
  reports.forEach(r => {
    const val = parseInt(r.progress.replace('%', ''), 10) || 0;
    sumPct += val;
  });
  const avgPct = totalTasks > 0 ? `${Math.round(sumPct / totalTasks)}%` : '100%';

  const payload = {
    date: dateStr,
    generated_at: new Date().toISOString(),
    supervisor: {
      name: 'Hải',
      role: 'Kỹ Sư Giám Sát Vận Hành & Điều Độ Ca Trực',
      shift: 'Ca trực 23:00 hàng ngày'
    },
    executive_summary: {
      total_tasks: totalTasks,
      completed_tasks: completedTasks,
      in_progress_tasks: inProgressTasks,
      average_progress: avgPct,
      need_support_count: needSupportCount,
      shift_health: `${allEntries.length} phiên ca trực ghi nhận`
    },
    work_reports: reports
  };

  fs.mkdirSync(DATA_DIR, { recursive: true });
  const dayFile = path.join(DATA_DIR, `${dateStr}.json`);
  const latestFile = path.join(DATA_DIR, 'latest.json');

  fs.writeFileSync(dayFile, JSON.stringify(payload, null, 2), 'utf8');
  fs.writeFileSync(latestFile, JSON.stringify(payload, null, 2), 'utf8');

  console.log(`[BodDashboard] ✓ Đã xuất file JSON báo cáo ngày: ${path.relative(REPO_ROOT, dayFile)}`);
  console.log(`[BodDashboard] ✓ Đã cập nhật snapshot mới nhất: ${path.relative(REPO_ROOT, latestFile)}`);

  return payload;
}

function formatTelegramMessage(data) {
  let msg = `[Hải — Shift Supervisor] 📋 BÁO CÁO CÔNG VIỆC TOÀN ĐỘI AI — ${data.date}\n`;
  msg += `• Tổng công việc: ${data.executive_summary.total_tasks} | Hoàn thành: ${data.executive_summary.completed_tasks} | Đang làm: ${data.executive_summary.in_progress_tasks}\n`;
  msg += `• Tiến độ trung bình: ${data.executive_summary.average_progress}\n`;
  msg += `• Cần quản lý hỗ trợ: ${data.executive_summary.need_support_count} việc\n`;
  msg += `\n--- CHI TIẾT TỪNG NHIỆM VỤ ---\n\n`;

  data.work_reports.forEach((t, i) => {
    msg += `${i + 1}. [${t.agent}] ${t.task_name}\n`;
    msg += `   • Trạng thái: ${t.status} (${t.progress})\n`;
    msg += `   • Đã hoàn thành: ${t.completed_work}\n`;
    msg += `   • Kết quả: ${t.result}\n`;
    if (t.issue !== 'Không có') {
      msg += `   • Vấn đề: ${t.issue}\n`;
    }
    msg += `   • Việc tiếp theo: ${t.next_step}\n`;
    msg += `   • Dự kiến hoàn thành: ${t.eta}\n`;
    if (t.need_support === 'Có') {
      msg += `   • ⚠️ CẦN QUẢN LÝ HỖ TRỢ: ${t.support_details}\n`;
    } else {
      msg += `   • Cần quản lý hỗ trợ: Không\n`;
    }
    msg += `\n`;
  });

  return msg.trim();
}

// MAIN EXECUTION
const data = generateReportData(TARGET_DATE);
const telegramText = formatTelegramMessage(data);

if (PREVIEW_TELEGRAM) {
  console.log('\n--- BẢN TIN TELEGRAM XEM TRƯỚC (CHUẨN PARSE) ---\n');
  console.log(telegramText);
  console.log('\n-----------------------------------------------\n');
}

if (NOTIFY_MODE) {
  if (fs.existsSync(TELEGRAM)) {
    try {
      console.log(`[BodDashboard] 🚀 Đang gửi báo cáo công việc lên Telegram thread 2...`);
      execFileSync('python3', [TELEGRAM, '--thread', '2', '-m', '-'], {
        input: telegramText,
        stdio: ['pipe', 'inherit', 'inherit']
      });
      console.log(`[BodDashboard] ✓ Đã gửi báo cáo Telegram thành công.`);
    } catch (err) {
      console.error(`[BodDashboard] ❌ Không thể gửi Telegram: ${err.message}`);
    }
  } else {
    console.warn(`[BodDashboard] ⚠️ Không tìm thấy script gửi Telegram: ${TELEGRAM}`);
  }
}
