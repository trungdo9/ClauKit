/**
 * scripts/brevo-email.js
 * 
 * Brevo (Sendinblue) Email Marketing Automation CLI & API Library
 * example.com / Enterprise Corp
 * 
 * Functions:
 * 1. Account & Connection Diagnostic (IP check, Credits, Senders)
 * 2. Contact & List Management (Lists, Segments, Contacts, Add/Import)
 * 3. Template Management (List templates, preview, fetch HTML)
 * 4. Campaign Management (Create, Preview, Test, Schedule, Send Now, Delete)
 * 5. Campaign Metrics & Tracking (Detailed stats, Open/Click rate, Bounces, Markdown Reports)
 * 6. Transactional Test Email Dispatch
 */

const fs = require('fs');
const path = require('path');

function findProjectRoot(startDir = __dirname) {
  let curr = startDir;
  while (curr !== path.dirname(curr)) {
    if (fs.existsSync(path.join(curr, '.git')) || fs.existsSync(path.join(curr, '.agents', '.env')) || fs.existsSync(path.join(curr, 'package.json'))) {
      return curr;
    }
    curr = path.dirname(curr);
  }
  return process.cwd();
}
const PROJECT_ROOT = findProjectRoot();

// 1. Load Environment Variables
function loadEnv() {
  const candidates = [
    path.resolve(PROJECT_ROOT, '.agents/.env'),
    path.resolve(PROJECT_ROOT, '.claude/.env'),
    path.resolve(PROJECT_ROOT, '.env')
  ];
  for (const envPath of candidates) {
    if (fs.existsSync(envPath)) {
      const lines = fs.readFileSync(envPath, 'utf8').split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const idx = trimmed.indexOf('=');
        if (idx !== -1) {
          const key = trimmed.slice(0, idx).trim();
          const val = trimmed.slice(idx + 1).trim();
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  }
}

loadEnv();

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const API_BASE = 'https://api.brevo.com/v3';

// 2. Core API Request Helper
async function brevoRequest(endpoint, options = {}) {
  if (!BREVO_API_KEY) {
    throw new Error('BREVO_API_KEY is not defined in .agents/.env');
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
  const method = options.method || 'GET';
  const headers = {
    'api-key': BREVO_API_KEY,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...options.headers
  };

  const fetchOptions = {
    method,
    headers
  };

  if (options.body) {
    fetchOptions.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
  }

  const res = await fetch(url, fetchOptions);
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    data = { rawText: text };
  }

  if (res.status === 429) {
    const retries = options._retries || 0;
    if (retries < 4) {
      const waitMs = (retries + 1) * 6000;
      console.warn(`⚠️ Brevo Rate Limit (429). Chờ ${waitMs / 1000}s trước khi thử lại (lần ${retries + 1}/4)...`);
      await new Promise(resolve => setTimeout(resolve, waitMs));
      return brevoRequest(endpoint, { ...options, _retries: retries + 1 });
    }
  }

  if (!res.ok) {
    const errorMsg = data.message || data.error || res.statusText || 'Unknown API Error';
    const err = new Error(`Brevo API Error [${res.status}]: ${errorMsg}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

// 3. API Services

// A. Account & Senders
async function getAccountInfo() {
  return await brevoRequest('/account');
}

async function getSenders() {
  return await brevoRequest('/senders');
}

// B. Lists & Contacts
async function getLists(limit = 50, offset = 0) {
  return await brevoRequest(`/contacts/lists?limit=${limit}&offset=${offset}`);
}

async function createList(name, folderId = 1) {
  return await brevoRequest('/contacts/lists', {
    method: 'POST',
    body: { name, folderId: Number(folderId) }
  });
}

async function getSegments(limit = 50, offset = 0) {
  return await brevoRequest(`/contacts/segments?limit=${limit}&offset=${offset}`);
}

async function getContacts(limit = 50, offset = 0) {
  return await brevoRequest(`/contacts?limit=${limit}&offset=${offset}`);
}

async function addContact({ email, attributes = {}, listIds = [], updateEnabled = true }) {
  return await brevoRequest('/contacts', {
    method: 'POST',
    body: {
      email,
      attributes,
      listIds: listIds.map(Number),
      updateEnabled
    }
  });
}

// C. Templates
async function getTemplates(limit = 50, offset = 0) {
  return await brevoRequest(`/smtp/templates?templateStatus=true&limit=${limit}&offset=${offset}`);
}

async function getTemplate(templateId) {
  return await brevoRequest(`/smtp/templates/${templateId}`);
}

// D. Email Campaigns
async function getCampaigns(limit = 50, offset = 0, status = '') {
  let endpoint = `/emailCampaigns?limit=${limit}&offset=${offset}`;
  if (status && status !== 'all') endpoint += `&status=${status}`;
  return await brevoRequest(endpoint);
}

async function getCampaign(campaignId) {
  return await brevoRequest(`/emailCampaigns/${campaignId}`);
}

async function createCampaign(campaignData) {
  // Required: name, subject, sender, recipients (or listIds)
  // Optional: htmlContent / templateId, scheduledAt, inlineImageActivation, etc.
  const payload = {
    name: campaignData.name,
    subject: campaignData.subject,
    sender: campaignData.sender || {
      name: 'Công ty Enterprise Corp',
      email: 'moitruongxuyenviet@gmail.com'
    },
    type: 'classic',
    recipients: campaignData.recipients || {
      listIds: campaignData.listIds ? campaignData.listIds.map(Number) : [2]
    }
  };

  if (campaignData.tag) payload.tag = campaignData.tag;
  if (campaignData.replyTo) payload.replyTo = campaignData.replyTo;
  if (campaignData.htmlContent) payload.htmlContent = campaignData.htmlContent;
  if (campaignData.templateId) payload.templateId = Number(campaignData.templateId);
  if (campaignData.scheduledAt) payload.scheduledAt = campaignData.scheduledAt;
  if (campaignData.utmCampaign) payload.utmCampaign = campaignData.utmCampaign;
  if (campaignData.previewText) payload.previewText = campaignData.previewText;

  return await brevoRequest('/emailCampaigns', {
    method: 'POST',
    body: payload
  });
}

async function updateCampaign(campaignId, campaignData) {
  return await brevoRequest(`/emailCampaigns/${campaignId}`, {
    method: 'PUT',
    body: campaignData
  });
}

async function sendTestEmail(campaignId, emailTo) {
  const emails = Array.isArray(emailTo) ? emailTo : [emailTo];
  return await brevoRequest(`/emailCampaigns/${campaignId}/sendTest`, {
    method: 'POST',
    body: { emailTo: emails }
  });
}

async function sendCampaignNow(campaignId) {
  return await brevoRequest(`/emailCampaigns/${campaignId}/sendNow`, {
    method: 'POST'
  });
}

async function deleteCampaign(campaignId) {
  return await brevoRequest(`/emailCampaigns/${campaignId}`, {
    method: 'DELETE'
  });
}

// E. Transactional Single Email (Direct Send)
async function sendTransactionalEmail({ to, subject, htmlContent, sender, templateId, params }) {
  const payload = {
    to: Array.isArray(to) ? to.map(t => typeof t === 'string' ? { email: t } : t) : [{ email: to }],
    subject,
    sender: sender || { name: 'Enterprise Corp', email: 'moitruongxuyenviet@gmail.com' }
  };
  if (htmlContent) payload.htmlContent = htmlContent;
  if (templateId) payload.templateId = Number(templateId);
  if (params) payload.params = params;

  return await brevoRequest('/smtp/email', {
    method: 'POST',
    body: payload
  });
}

// 4. Report & Markdown Exporter
function extractCampaignStats(campaign) {
  let stats = campaign.statistics && campaign.statistics.globalStats ? { ...campaign.statistics.globalStats } : {};

  // If globalStats has no delivered emails, check campaignStats array
  if ((!stats.delivered || stats.delivered === 0) && Array.isArray(campaign.statistics?.campaignStats) && campaign.statistics.campaignStats.length > 0) {
    const cs = campaign.statistics.campaignStats;
    stats.sent = cs.reduce((sum, item) => sum + (item.sent || 0), 0);
    stats.delivered = cs.reduce((sum, item) => sum + (item.delivered || 0), 0);
    stats.uniqueViews = cs.reduce((sum, item) => sum + (item.uniqueViews || 0), 0);
    stats.viewed = cs.reduce((sum, item) => sum + (item.viewed || 0), 0);
    stats.trackableViews = cs.reduce((sum, item) => sum + (item.trackableViews || 0), 0);
    stats.uniqueClicks = cs.reduce((sum, item) => sum + (item.uniqueClicks || 0), 0);
    stats.clickers = cs.reduce((sum, item) => sum + (item.clickers || 0), 0);
    stats.softBounces = cs.reduce((sum, item) => sum + (item.softBounces || 0), 0);
    stats.hardBounces = cs.reduce((sum, item) => sum + (item.hardBounces || 0), 0);
    stats.unsubscribed = cs.reduce((sum, item) => sum + (item.unsubscriptions || item.unsubscribed || 0), 0);
    stats.complaints = cs.reduce((sum, item) => sum + (item.complaints || 0), 0);
    stats.deferred = cs.reduce((sum, item) => sum + (item.deferred || 0), 0);
  }

  const sent = stats.sent || (campaign.sentDate ? (stats.delivered || 0) + (stats.hardBounces || 0) + (stats.softBounces || 0) : 0);
  const delivered = stats.delivered || 0;
  const uniqueViews = stats.uniqueViews || 0;
  const viewPercent = stats.viewPercent || (delivered > 0 ? ((uniqueViews / delivered) * 100).toFixed(2) : '0.00');
  const uniqueClicks = stats.uniqueClicks || 0;
  const clickPercent = stats.clickPercent || (delivered > 0 ? ((uniqueClicks / delivered) * 100).toFixed(2) : '0.00');
  const clickToOpenRate = uniqueViews > 0 ? ((uniqueClicks / uniqueViews) * 100).toFixed(2) : '0.00';
  const unsubscribed = stats.unsubscribed || stats.unsubscriptions || 0;
  const hardBounces = stats.hardBounces || 0;
  const softBounces = stats.softBounces || 0;
  const complaints = stats.complaints || 0;

  return {
    stats,
    sent,
    delivered,
    uniqueViews,
    viewPercent,
    uniqueClicks,
    clickPercent,
    clickToOpenRate,
    unsubscribed,
    hardBounces,
    softBounces,
    complaints
  };
}

function generateCampaignReportMarkdown(campaign) {
  const {
    sent,
    delivered,
    uniqueViews,
    viewPercent,
    uniqueClicks,
    clickPercent,
    clickToOpenRate,
    unsubscribed,
    hardBounces,
    softBounces,
    complaints
  } = extractCampaignStats(campaign);

  return `# Báo Cáo Hiệu Suất Chiến Dịch Email Brevo: ${campaign.name}

> **Mã Chiến Dịch (ID)**: \`${campaign.id}\`  
> **Trạng Thái**: \`${campaign.status}\`  
> **Tiêu Đề Email (Subject)**: *${campaign.subject || 'N/A'}*  
> **Người Gửi (Sender)**: \`${campaign.sender ? campaign.sender.name + ' <' + campaign.sender.email + '>' : 'N/A'}\`  
> **Thời Gian Gửi**: ${campaign.sentDate || campaign.scheduledAt || 'Chưa gửi'}

---

## 1. Tổng Quan Chỉ Số Hiệu Suất (Key Metrics)

| Chỉ Số Đo Lường (KPI) | Số Lượng Thực Tế | Tỷ Lệ (%) | Đánh Giá Benchmark B2B |
|---|---|---|---|
| **Tổng gửi (Sent)** | **${sent}** | 100% | Quy mô danh sách |
| **Đã phát thành công (Delivered)** | **${delivered}** | ${sent > 0 ? ((delivered / sent) * 100).toFixed(1) : 100}% | Chuẩn B2B > 97% |
| **Lượt mở độc bản (Unique Opens)** | **${uniqueViews}** | **${viewPercent}%** | Chuẩn B2B: 20% – 28% |
| **Lượt click độc bản (Unique Clicks)** | **${uniqueClicks}** | **${clickPercent}%** | Chuẩn B2B: 2.5% – 5.0% |
| **Tỷ lệ Click-to-Open (CTOR)** | — | **${clickToOpenRate}%** | Đo lường độ hấp dẫn nội dung |
| **Hủy đăng ký (Unsubscribed)** | **${unsubscribed}** | ${delivered > 0 ? ((unsubscribed / delivered) * 100).toFixed(2) : 0}% | Chuẩn an toàn < 0.5% |
| **Hard Bounce (Email hỏng/chết)** | **${hardBounces}** | ${sent > 0 ? ((hardBounces / sent) * 100).toFixed(2) : 0}% | Cần lọc dọn list |
| **Soft Bounce (Hộp thư đầy/tạm thời)**| **${softBounces}** | ${sent > 0 ? ((softBounces / sent) * 100).toFixed(2) : 0}% | Theo dõi gửi lại |
| **Báo cáo Spam (Complaints)** | **${complaints}** | ${delivered > 0 ? ((complaints / delivered) * 100).toFixed(2) : 0}% | Bắt buộc < 0.1% |

---

## 2. Thông Tin Danh Sách Nhận (Target Audience)

- **Danh sách nhận (List IDs)**: \`${JSON.stringify(campaign.recipients ? campaign.recipients.lists : [])}\`
- **Thẻ phân loại (Tag)**: \`${campaign.tag || 'None'}\`
- **UTM Campaign**: \`${campaign.utmCampaign || 'None'}\`

---

## 3. Khuyến Nghị Tối Ưu Cho Chiến Dịch Kế Tiếp (Action Items)

${Number(viewPercent) < 20 ? '- ⚠️ **Tỷ lệ Mở < 20%**: Cần A/B testing lại Tiêu đề (Subject Line), rút ngắn độ dài < 50 ký tự, bổ sung Preheader / Preview text cuốn hút hơn.' : '- ✅ **Tỷ lệ Mở Đạt Chuẩn**: Tiêu đề và thời điểm gửi email phù hợp.'}
${Number(clickToOpenRate) < 10 ? '- ⚠️ **Tỷ lệ Click-to-Open < 10%**: Cần tối ưu lại CTA Button (màu sắc nổi bật, vị trí Above-the-fold), làm rõ Unique Selling Proposition (USP) và ưu đãi chiết khấu.' : '- ✅ **Tỷ lệ Click-to-Open Tốt**: Nội dung email thu hút và đúng Search Intent / Buyer Intent.'}
${hardBounces > 0 ? `- ⚠️ **Có ${hardBounces} Hard Bounce**: Khuyến nghị chạy kịch bản lọc sạch danh sách email không tồn tại trước khi gửi đợt kế tiếp.` : '- ✅ **Danh sách sạch**: Không có email hard bounce.'}
`;
}

// 5. CLI Execution Handler
async function main() {
  const args = process.argv.slice(2);
  const getArg = (flag) => {
    const prefix = `${flag}=`;
    const arg = args.find(a => a.startsWith(prefix));
    if (arg) return arg.slice(prefix.length);
    const idx = args.indexOf(flag);
    if (idx !== -1 && args[idx + 1] && !args[idx + 1].startsWith('--')) {
      return args[idx + 1];
    }
    return null;
  };
  const hasFlag = (flag) => args.some(a => a === flag || a.startsWith(`${flag}=`));

  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║        BREVO EMAIL MARKETING CLI - example.com        ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  try {
    // 0. Help Menu
    if (hasFlag('--help') || hasFlag('-h')) {
      console.log('📖 HƯỚNG DẪN SỬ DỤNG BREVO CLI:\n');
      console.log('1. Kiểm Tra & Tài Khoản:');
      console.log('   node scripts/brevo-email.js --account');
      console.log('   node scripts/brevo-email.js --senders');
      console.log('\n2. Quản Lý Danh Sách & Khách Hàng:');
      console.log('   node scripts/brevo-email.js --lists');
      console.log('   node scripts/brevo-email.js --create-list --name="Tên List"');
      console.log('   node scripts/brevo-email.js --contacts --limit=20');
      console.log('   node scripts/brevo-email.js --add-contact --email="user@dom.com" --name="Tên" --lists=2');
      console.log('\n3. Templates & Chiến Dịch:');
      console.log('   node scripts/brevo-email.js --templates');
      console.log('   node scripts/brevo-email.js --campaigns [--status=sent|draft|queued]');
      console.log('   node scripts/brevo-email.js --create-campaign --name="..." --subject="..." --html-file="path.html" --lists=2');
      console.log('   node scripts/brevo-email.js --create-campaign --name="..." --subject="..." --template-id=5 --lists=2');
      console.log('\n4. Thử Nghiệm, Lập Lịch & Gửi:');
      console.log('   node scripts/brevo-email.js --send-test --campaign-id=12 --to="test@dom.com"');
      console.log('   node scripts/brevo-email.js --schedule="2026-08-25T08:30:00.000+07:00"');
      console.log('   node scripts/brevo-email.js --send-now --campaign-id=12');
      console.log('\n5. Đo Lường & Báo Cáo:');
      console.log('   node scripts/brevo-email.js --report=12');
      return;
    }

    // 1. Diagnostics / Account Info
    if (hasFlag('--account') || args.length === 0) {
      console.log('🔍 Đang kiểm tra thông tin tài khoản Brevo API...');
      const account = await getAccountInfo();
      console.log('✅ Kết nối thành công tới Brevo API!');
      console.log(`- Email Tài khoản: ${account.email}`);
      console.log(`- Họ và Tên: ${account.firstName} ${account.lastName}`);
      console.log(`- Công ty: ${account.companyName}`);
      if (account.plan) {
        console.log('- Gói cước (Plan):', JSON.stringify(account.plan, null, 2));
      }
      return;
    }

    // 2. Senders
    if (hasFlag('--senders')) {
      console.log('📨 Đang lấy danh sách Người Gửi (Senders / Domains)...');
      const data = await getSenders();
      console.log(JSON.stringify(data, null, 2));
      return;
    }

    // 3. Lists
    if (hasFlag('--lists')) {
      console.log('📋 Đang lấy danh sách Contact Lists...');
      const data = await getLists(getArg('--limit') || 50, getArg('--offset') || 0);
      console.log(`Tìm thấy ${data.count || (data.lists ? data.lists.length : 0)} danh sách:`);
      if (data.lists) {
        data.lists.forEach(l => {
          const count = l.uniqueSubscribers !== undefined ? l.uniqueSubscribers : l.totalSubscribers;
          console.log(`  - [ID: ${l.id}] "${l.name}" (Total: ${count} contacts)`);
        });
      }
      return;
    }

    // 4. Create List
    if (hasFlag('--create-list')) {
      const name = getArg('--name');
      if (!name) throw new Error('Vui lòng cung cấp tên danh sách qua --name="Tên List"');
      console.log(`➕ Đang tạo danh sách mới: "${name}"...`);
      const res = await createList(name, getArg('--folder') || 1);
      console.log('✅ Tạo danh sách thành công! List ID:', res.id);
      return;
    }

    // 5. Segments
    if (hasFlag('--segments')) {
      console.log('👥 Đang lấy danh sách Segments...');
      const data = await getSegments();
      console.log(JSON.stringify(data, null, 2));
      return;
    }

    // 6. Contacts
    if (hasFlag('--contacts')) {
      console.log('👤 Đang lấy danh bạ Contacts...');
      const data = await getContacts(getArg('--limit') || 20);
      console.log(`Tổng số: ${data.count}`);
      if (data.contacts) {
        data.contacts.forEach(c => {
          console.log(`  - ${c.email} | Name: ${c.attributes?.FIRSTNAME || ''} ${c.attributes?.LASTNAME || ''} | Lists: ${JSON.stringify(c.listIds)}`);
        });
      }
      return;
    }

    // 7. Add Single Contact
    if (hasFlag('--add-contact')) {
      const email = getArg('--email');
      if (!email) throw new Error('Vui lòng cung cấp email qua --email="user@domain.com"');
      const listIds = (getArg('--lists') || '2').split(',').map(s => s.trim());
      const firstName = getArg('--name') || '';
      const company = getArg('--company') || '';

      console.log(`➕ Đang thêm contact: ${email} vào List [${listIds.join(', ')}]...`);
      const res = await addContact({
        email,
        attributes: { FIRSTNAME: firstName, COMPANY: company },
        listIds
      });
      console.log('✅ Thêm / Cập nhật contact thành công!', res);
      return;
    }

    // 8. Templates
    if (hasFlag('--templates')) {
      console.log('📄 Đang lấy danh sách Templates...');
      const data = await getTemplates(getArg('--limit') || 50);
      console.log(`Tìm thấy ${data.count || 0} templates:`);
      if (data.templates) {
        data.templates.forEach(t => {
          console.log(`  - [ID: ${t.id}] "${t.name}" | Subject: "${t.subject}" | Active: ${t.isActive}`);
        });
      }
      return;
    }

    // 9. Campaigns List
    if (hasFlag('--campaigns')) {
      const status = getArg('--status') || '';
      console.log(`📬 Đang lấy danh sách Email Campaigns (Status: ${status || 'all'})...`);
      const data = await getCampaigns(getArg('--limit') || 50, getArg('--offset') || 0, status);
      console.log(`Tìm thấy ${data.count || 0} chiến dịch:`);
      if (data.campaigns) {
        data.campaigns.forEach(c => {
          console.log(`  - [ID: ${c.id}] "${c.name}" | Status: ${c.status} | Subject: "${c.subject}" | Scheduled: ${c.scheduledAt || c.sentDate || 'N/A'}`);
        });
      }
      return;
    }

    // 10. Campaign Details & Report
    if (hasFlag('--report') || hasFlag('--campaign-id')) {
      const campaignId = getArg('--report') || getArg('--campaign-id');
      if (!campaignId) throw new Error('Vui lòng cung cấp Campaign ID qua --report=123 hoặc --campaign-id=123');
      console.log(`📊 Đang trích xuất dữ liệu và báo cáo cho Campaign ID ${campaignId}...`);
      const campaign = await getCampaign(campaignId);
      
      const mdReport = generateCampaignReportMarkdown(campaign);
      console.log('\n' + mdReport);

      // Save report file
      const reportsDir = path.resolve(PROJECT_ROOT, 'plans/marketing/reports');
      if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });
      const reportPath = path.join(reportsDir, `brevo-campaign-${campaignId}-report.md`);
      fs.writeFileSync(reportPath, mdReport, 'utf8');
      console.log(`\n💾 Đã lưu báo cáo chi tiết vào: ${reportPath}`);
      return;
    }

    // 11. Create Campaign
    if (hasFlag('--create-campaign')) {
      const name = getArg('--name');
      const subject = getArg('--subject');
      const htmlFile = getArg('--html-file');
      const templateId = getArg('--template-id');
      const listIds = (getArg('--lists') || '2').split(',').map(s => s.trim());
      const scheduledAt = getArg('--schedule');
      const senderName = getArg('--sender-name') || 'Enterprise Corp';
      const senderEmail = getArg('--sender-email') || 'moitruongxuyenviet@gmail.com';
      const utmCampaign = getArg('--utm') || '';
      const previewText = getArg('--preview') || '';

      if (!name) throw new Error('Vui lòng cung cấp tên chiến dịch qua --name="..."');
      if (!subject) throw new Error('Vui lòng cung cấp tiêu đề email qua --subject="..."');

      let htmlContent = '';
      if (htmlFile) {
        const filePath = path.resolve(process.cwd(), htmlFile);
        if (!fs.existsSync(filePath)) throw new Error(`Không tìm thấy file HTML tại: ${filePath}`);
        htmlContent = fs.readFileSync(filePath, 'utf8');
      } else if (!templateId) {
        // Simple fallback HTML
        htmlContent = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #13241D;">
          <h2 style="color: #1B5E43;">${subject}</h2>
          <p>Xin chào {{ contact.FIRSTNAME }},</p>
          <p>Công ty TNHH Enterprise Corp xin gửi thông tin chi tiết về sản phẩm và dịch vụ xử lý nước / khí thải.</p>
          <p>Vui lòng liên hệ hotline <strong>0900.000.000</strong> hoặc truy cập <a href="https://example.com" style="color: #D2342A; font-weight: bold;">example.com</a> để được hỗ trợ.</p>
        </div>`;
      }

      console.log(`🚀 Đang tạo chiến dịch email mới: "${name}"...`);
      const payload = {
        name,
        subject,
        sender: { name: senderName, email: senderEmail },
        listIds,
        utmCampaign,
        previewText
      };
      if (templateId) payload.templateId = templateId;
      if (htmlContent) payload.htmlContent = htmlContent;
      if (scheduledAt) payload.scheduledAt = scheduledAt;

      const res = await createCampaign(payload);
      console.log('✅ Tạo chiến dịch email thành công! Campaign ID:', res.id);
      console.log('💡 Bạn có thể gửi test qua: node scripts/brevo-email.js --send-test --campaign-id=' + res.id + ' --to="your-email@domain.com"');
      return;
    }

    // 12. Send Test Email
    if (hasFlag('--send-test')) {
      const campaignId = getArg('--campaign-id');
      const emailTo = getArg('--to');
      if (!campaignId) throw new Error('Vui lòng cung cấp Campaign ID qua --campaign-id=123');
      if (!emailTo) throw new Error('Vui lòng cung cấp email nhận test qua --to="email@domain.com"');

      console.log(`🧪 Đang gửi email test chiến dịch #${campaignId} tới: ${emailTo}...`);
      await sendTestEmail(campaignId, emailTo);
      console.log('✅ Đã gửi email test thành công! Vui lòng kiểm tra hộp thư.');
      return;
    }

    // 13. Send Campaign Immediately (Send Now)
    if (hasFlag('--send-now')) {
      const campaignId = getArg('--campaign-id');
      if (!campaignId) throw new Error('Vui lòng cung cấp Campaign ID qua --campaign-id=123');

      console.log(`⚡ CẢNH BÁO: Bạn đang yêu cầu GỬI NGAY chiến dịch #${campaignId} tới toàn bộ danh sách!`);
      await sendCampaignNow(campaignId);
      console.log(`✅ Đã kích hoạt lệnh gửi ngay cho chiến dịch #${campaignId}!`);
      return;
    }

    // 14. Send Direct Transactional Email
    if (hasFlag('--send-direct')) {
      const to = getArg('--to');
      const subject = getArg('--subject') || 'Thông báo từ Enterprise Corp';
      const htmlFile = getArg('--html-file');
      if (!to) throw new Error('Vui lòng cung cấp email người nhận qua --to="user@domain.com"');

      let htmlContent = `<p>Xin chào quý khách, đây là email thông báo từ example.com.</p>`;
      if (htmlFile) {
        htmlContent = fs.readFileSync(path.resolve(process.cwd(), htmlFile), 'utf8');
      }

      console.log(`📨 Đang gửi email trực tiếp (Transactional) tới: ${to}...`);
      const res = await sendTransactionalEmail({ to, subject, htmlContent });
      console.log('✅ Gửi email trực tiếp thành công! Message ID:', res.messageId);
      return;
    }

    console.log('⚠️ Không có tham số hợp lệ. Dùng --help để xem hướng dẫn sử dụng.');

  } catch (err) {
    console.error('\n❌ ĐÃ XẢY RA LỖI:');
    if (err.data && err.data.message) {
      console.error(`- Thông báo lỗi Brevo API: ${err.data.message}`);
      if (err.data.code === 'unauthorized' && err.data.message.includes('authorised_ips')) {
        console.error('\n🔒 LƯU Ý BẢO MẬT BREVO:');
        console.error('IP máy của bạn chưa được cấp phép trong danh sách Authorized IPs của Brevo.');
        console.error('👉 Hãy truy cập: https://app.brevo.com/security/authorised_ips để thêm IP hiện tại hoặc mở khóa quyền truy cập API.');
      }
    } else {
      console.error(`- ${err.message}`);
    }
    process.exit(1);
  }
}

// Export module functions for reuse
module.exports = {
  brevoRequest,
  getAccountInfo,
  getSenders,
  getLists,
  createList,
  getSegments,
  getContacts,
  addContact,
  getTemplates,
  getTemplate,
  getCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  sendTestEmail,
  sendCampaignNow,
  deleteCampaign,
  sendTransactionalEmail,
  extractCampaignStats,
  generateCampaignReportMarkdown
};

if (require.main === module) {
  main();
}
