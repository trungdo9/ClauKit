// CLI & Module: SERP Robot API Client & Report Generator
// Tự động kết nối REST API v1 của serprobot.com để trích xuất dữ liệu thứ hạng SERP
// Lưu trữ báo cáo tại plans/marketing/reports/
//
// Cách dùng CLI:
//   node scripts/fetch-serprobot.js                        # Tải báo cáo các dự án khai báo ở SERPROBOT_PROJECT_IDS
//   node scripts/fetch-serprobot.js --projects             # Liệt kê tất cả dự án trong tài khoản
//   node scripts/fetch-serprobot.js --project=<project-id> # Tải báo cáo cho 1 dự án cụ thể
//   node scripts/fetch-serprobot.js --all                  # Tải và gộp tất cả dự án trong tài khoản
//   node scripts/fetch-serprobot.js --keyword-id=<kw-id>   # Xem chi tiết lịch sử thứ hạng & đối thủ của từ khóa
//   node scripts/fetch-serprobot.js --credits              # Kiểm tra số credit API còn lại
//   node scripts/fetch-serprobot.js --start=30daysAgo      # Báo cáo biến động trong 30 ngày qua
//   node scripts/fetch-serprobot.js --rank-check --kw="<từ khóa>" --url="example.com"

const fs = require('fs');
const path = require('path');
const https = require('https');

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

function getEnv(key, defaultValue = '') {
  if (process.env[key]) return process.env[key];
  const envCandidates = [
    path.join(PROJECT_ROOT, '.agents', '.env'),
    path.join(PROJECT_ROOT, '.claude', '.env'),
    path.join(PROJECT_ROOT, '.env')
  ];
  for (const envPath of envCandidates) {
    if (fs.existsSync(envPath)) {
      const lines = fs.readFileSync(envPath, 'utf8').split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const k = trimmed.slice(0, eqIdx).trim();
          let v = trimmed.slice(eqIdx + 1).trim();
          if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
            v = v.slice(1, -1);
          }
          if (k === key) return v;
        }
      }
    }
  }
  return defaultValue;
}

const API_BASE = 'https://api.serprobot.com/v1/api.php';

/**
 * Gửi HTTP GET request tới Serprobot API
 */
function requestSerprobot(params = {}, retries = 3, delayMs = 2000) {
  const apiKey = getEnv('SERPROBOT_API_KEY');
  if (!apiKey) {
    return Promise.reject(new Error('Thiếu SERPROBOT_API_KEY trong file .agents/.env hoặc process.env.SERPROBOT_API_KEY'));
  }

  const queryParams = new URLSearchParams({
    api_key: apiKey,
    ...params
  });

  const url = `${API_BASE}?${queryParams.toString()}`;

  const doRequest = (attempt) => new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          return reject(new Error(`SERP Robot API HTTP ${res.statusCode}: ${body}`));
        }
        try {
          const json = JSON.parse(body);
          if (json.error) {
            return reject(new Error(`SERP Robot API Error: ${json.error}`));
          }
          resolve(json);
        } catch (e) {
          reject(new Error(`Lỗi parse JSON từ SERP Robot API: ${body.slice(0, 200)}`));
        }
      });
    }).on('error', (err) => {
      if (attempt < retries) {
        console.warn(`⚠️ Lỗi mạng (${err.message}), thử lại lần ${attempt + 1}/${retries} sau ${delayMs}ms...`);
        setTimeout(() => {
          doRequest(attempt + 1).then(resolve, reject);
        }, delayMs);
      } else {
        reject(new Error(`Lỗi kết nối mạng tới SERP Robot: ${err.message}`));
      }
    });
  });

  return doRequest(1);
}

/**
 * Liệt kê danh sách tất cả projects
 */
async function listProjects() {
  return await requestSerprobot({ action: 'list_projects' });
}

/**
 * Lấy chi tiết project và danh sách keywords
 */
async function getProject(projectId) {
  return await requestSerprobot({
    action: 'project',
    project_id: projectId
  });
}

/**
 * Lấy chi tiết 1 keyword (lịch sử checks & top SERPs)
 */
async function getKeyword(keywordId) {
  return await requestSerprobot({
    action: 'keyword',
    keyword_id: keywordId
  });
}

/**
 * Lấy báo cáo project trong khoảng thời gian (start, end)
 */
async function getProjectReport(projectId, start = '7daysAgo', end = 'today') {
  return await requestSerprobot({
    action: 'project_report',
    project_id: projectId,
    start: start,
    end: end
  });
}

/**
 * Kiểm tra số credit còn lại
 */
async function getCredit() {
  return await requestSerprobot({ action: 'credit' });
}

/**
 * Kiểm tra thứ hạng trực tiếp 1 từ khóa (Tốn 1 credit)
 */
async function rankCheck(keyword, targetUrl, options = {}) {
  const params = {
    action: 'rank_check',
    keyword: keyword,
    target_url: targetUrl.replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/.*$/, ''),
    region: options.region || 'www.google.com.vn',
    device: options.device || 'desktop',
    hl: options.hl || 'vi'
  };
  if (options.competitors && Array.isArray(options.competitors)) {
    options.competitors.slice(0, 3).forEach((comp, idx) => {
      params[`competitors[${idx}]`] = comp;
    });
  }
  return await requestSerprobot(params);
}

/**
 * Lấy Top 100 kết quả tìm kiếm cho 1 từ khóa (Tốn 1 credit)
 */
async function getSerps(keyword, options = {}) {
  const params = {
    action: 'get_serps',
    keyword: keyword,
    region: options.region || 'www.google.com.vn',
    device: options.device || 'desktop',
    hl: options.hl || 'vi'
  };
  return await requestSerprobot(params);
}

/**
 * Phân tích và tạo báo cáo SERP cho một hoặc nhiều Project
 */
async function generateSerpReport(projectIds, options = {}) {
  if (!Array.isArray(projectIds)) {
    projectIds = [projectIds];
  }

  const timeRange = options.start || '7daysAgo';
  console.log(`📡 Đang tải dữ liệu SERP Robot cho Project IDs: [${projectIds.join(', ')}] (Khoảng thời gian: ${timeRange})...`);

  const projectResults = await Promise.all(
    projectIds.map(async (pId) => {
      const [proj, rep] = await Promise.all([
        getProject(pId).catch(err => {
          console.warn(`⚠️ Không thể lấy project ${pId}:`, err.message);
          return null;
        }),
        getProjectReport(pId, timeRange, options.end || 'today').catch(() => null)
      ]);
      return { pId, proj, rep };
    })
  );

  const validProjects = projectResults.filter(p => p.proj !== null);
  if (validProjects.length === 0) {
    throw new Error('Không thể tải dữ liệu từ bất kỳ Project nào.');
  }

  const today = new Date().toISOString().split('T')[0];
  const allKeywordsMap = new Map();

  const rankingBuckets = {
    Top3: 0,
    Top10: 0,
    Top20: 0,
    Top50: 0,
    Top100: 0,
    OutTop100: 0
  };

  const projectSummaries = [];

  for (const { pId, proj, rep } of validProjects) {
    const reportMap = {};
    if (rep && Array.isArray(rep.report_data)) {
      rep.report_data.forEach(item => {
        reportMap[item.keyword_id] = item;
      });
    }

    const kws = proj.keywords || [];
    projectSummaries.push({
      id: pId,
      name: proj.name || proj.url,
      url: proj.url,
      totalKws: kws.length,
      checkFrequency: proj.check_frequency
    });

    for (const kw of kws) {
      const r = reportMap[kw.id] || {};
      const currPos = kw.current_position !== null && kw.current_position !== undefined ? parseInt(kw.current_position) : null;
      const bestPos = kw.best_position !== null && kw.best_position !== undefined ? parseInt(kw.best_position) : (r.best_ever_position ? parseInt(r.best_ever_position) : null);
      const change = r.change !== undefined ? parseInt(r.change) : parseInt(kw.latest_change || 0);

      // Tránh trùng lặp từ khóa nếu xuất hiện ở cả 2 project
      const kwKey = kw.keyword.toLowerCase().trim();
      const existing = allKeywordsMap.get(kwKey);

      const kwObj = {
        id: kw.id,
        keyword: kw.keyword,
        projectName: proj.name || proj.url,
        projectId: pId,
        currentPosition: currPos,
        bestPosition: bestPos,
        latestChange: change,
        lastFoundSerp: kw.latest_found_serp || r.found_serp || '',
        volumeLocal: parseInt(r.volume_local || 0),
        volumeGlobal: parseInt(r.volume_global || 0),
        cpcLocal: r.cpc_local || 0,
        lastChecked: kw.last_checked || r.updated || '',
        nextCheck: kw.next_check || ''
      };

      if (!existing || (currPos && (!existing.currentPosition || currPos < existing.currentPosition))) {
        allKeywordsMap.set(kwKey, kwObj);
      }
    }
  }

  const processedKeywords = Array.from(allKeywordsMap.values());
  const totalKws = processedKeywords.length;

  processedKeywords.forEach(k => {
    const pos = k.currentPosition;
    if (!pos || isNaN(pos) || pos > 100) {
      rankingBuckets.OutTop100++;
    } else if (pos <= 3) {
      rankingBuckets.Top3++;
    } else if (pos <= 10) {
      rankingBuckets.Top10++;
    } else if (pos <= 20) {
      rankingBuckets.Top20++;
    } else if (pos <= 50) {
      rankingBuckets.Top50++;
    } else if (pos <= 100) {
      rankingBuckets.Top100++;
    }
  });

  // Đối chiếu với keyword-map.json để phát hiện từ khóa Cấp 1 / HUB bị thiếu
  const kmPath = path.join(__dirname, '../plans/marketing/seo-content/keyword-map.json');
  let missingCap1 = [];
  if (fs.existsSync(kmPath)) {
    try {
      const km = JSON.parse(fs.readFileSync(kmPath, 'utf-8'));
      const pillarKws = (km.entries || []).map(e => ({
        keyword: e.keyword.toLowerCase().trim(),
        rawKeyword: e.keyword,
        level: e.level,
        cluster: e.cluster,
        volume: e.volume,
        impressions: e.gscImpressions
      }));

      const trackedSet = new Set(processedKeywords.map(k => k.keyword.toLowerCase().trim()));
      missingCap1 = pillarKws.filter(p => (p.level === 'HUB' || p.level === 'L1') && !trackedSet.has(p.keyword));
      missingCap1.sort((a,b) => (b.impressions || 0) - (a.impressions || 0) || (b.volume || 0) - (a.volume || 0));
    } catch(e) {
      // Ignored
    }
  }

  // Sắp xếp các danh mục nổi bật
  const topPerformers = [...processedKeywords]
    .filter(k => k.currentPosition !== null && k.currentPosition <= 100)
    .sort((a, b) => a.currentPosition - b.currentPosition);

  const topGainers = [...processedKeywords]
    .filter(k => k.latestChange > 0)
    .sort((a, b) => b.latestChange - a.latestChange);

  const topLosers = [...processedKeywords]
    .filter(k => k.latestChange < 0)
    .sort((a, b) => a.latestChange - b.latestChange);

  // Console Output
  console.log(`\n======================================================`);
  console.log(`📊 BÁO CÁO TỔNG HỢP THỨ HẠNG SERP ROBOT (${today})`);
  console.log(`======================================================`);
  projectSummaries.forEach(p => {
    console.log(`📁 Dự án: ${p.name} (ID: ${p.id}) | Domain: ${p.url} | ${p.totalKws} từ khóa`);
  });
  console.log(`🎯 Tổng số từ khóa độc bản theo dõi: ${totalKws} từ`);
  console.log(`\n📈 Phân bố thứ hạng thực tế:`);
  console.log(`  🥇 Top 1 - 3:   ${rankingBuckets.Top3.toString().padStart(3)} từ (${((rankingBuckets.Top3 / (totalKws || 1)) * 100).toFixed(1)}%)`);
  console.log(`  🥈 Top 4 - 10:  ${rankingBuckets.Top10.toString().padStart(3)} từ (${((rankingBuckets.Top10 / (totalKws || 1)) * 100).toFixed(1)}%)`);
  console.log(`  🥉 Top 11 - 20: ${rankingBuckets.Top20.toString().padStart(3)} từ (${((rankingBuckets.Top20 / (totalKws || 1)) * 100).toFixed(1)}%)`);
  console.log(`  📈 Top 21 - 50: ${rankingBuckets.Top50.toString().padStart(3)} từ (${((rankingBuckets.Top50 / (totalKws || 1)) * 100).toFixed(1)}%)`);
  console.log(`  📉 Top 51 - 100:${rankingBuckets.Top100.toString().padStart(3)} từ (${((rankingBuckets.Top100 / (totalKws || 1)) * 100).toFixed(1)}%)`);
  console.log(`  ⚠️ Out Top 100: ${rankingBuckets.OutTop100.toString().padStart(3)} từ (${((rankingBuckets.OutTop100 / (totalKws || 1)) * 100).toFixed(1)}%)`);

  if (topPerformers.length > 0) {
    console.log(`\n🏆 Top 15 từ khóa thứ hạng cao nhất:`);
    topPerformers.slice(0, 15).forEach((k, idx) => {
      const changeStr = k.latestChange > 0 ? `(+${k.latestChange}) 🔺` : (k.latestChange < 0 ? `(${k.latestChange}) 🔻` : '       ');
      console.log(`  ${(idx + 1).toString().padStart(2)}. #${k.currentPosition.toString().padEnd(3)} ${changeStr} "${k.keyword}" (Best: #${k.bestPosition || 'N/A'}) [${k.projectName}]`);
    });
  }

  // Xuất file báo cáo Markdown & JSON
  const reportsDir = path.join(PROJECT_ROOT, 'plans/marketing/reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const jsonReportPath = options.saveJson || path.join(reportsDir, `serp-baseline-${today}.json`);
  const mdReportPath = options.saveMd || path.join(reportsDir, `serp-report-${today}.md`);

  const summaryJson = {
    reportDate: today,
    source: 'serprobot_api_v1',
    projects: projectSummaries,
    totalKeywords: totalKws,
    rankingDistribution: rankingBuckets,
    keywords: processedKeywords,
    suggestedNewMonitoredKeywords: missingCap1.slice(0, 30)
  };

  fs.writeFileSync(jsonReportPath, JSON.stringify(summaryJson, null, 2), 'utf-8');
  console.log(`\n💾 Đã lưu baseline JSON tại: ${path.relative(process.cwd(), jsonReportPath)}`);

  // Xây dựng nội dung Markdown
  let md = `# Báo Cáo Phân Tích Thứ Hạng SERP Robot (${today})

- **Nguồn dữ liệu**: SERP Robot REST API v1
- **Ngày trích xuất**: ${today}
- **Tổng số dự án**: ${projectSummaries.length} dự án (${projectSummaries.map(p => `\`${p.name} [ID: ${p.id}]\``).join(', ')})
- **Tổng số từ khóa theo dõi**: **${totalKws} từ độc bản**

---

## 1. Phân Bố Thứ Hạng Thực Tế (Live SERP Distribution)

| Nhóm Thứ Hạng | Số Lượng Từ Khóa | Tỷ Lệ (%) | Đánh Giá Sức Khỏe SEO & Hành Động Tiếp Theo |
|---|:---:|:---:|---|
| 🥇 **Top 1 – 3** | **${rankingBuckets.Top3}** | **${((rankingBuckets.Top3 / (totalKws || 1)) * 100).toFixed(1)}%** | Vị trí chiếm lĩnh CTR cao nhất, giữ vững vị thế và tối ưu Schema |
| 🥈 **Top 4 – 10** | **${rankingBuckets.Top10}** | **${((rankingBuckets.Top10 / (totalKws || 1)) * 100).toFixed(1)}%** | Trang 1 Google, bổ sung Internal Links từ Silo để bứt phá Top 3 |
| 🥉 **Top 11 – 20** | **${rankingBuckets.Top20}** | **${((rankingBuckets.Top20 / (totalKws || 1)) * 100).toFixed(1)}%** | Trang 2 Google, tối ưu thêm Heading H2/H3, FAQPage và Rich Media |
| 📈 **Top 21 – 50** | **${rankingBuckets.Top50}** | **${((rankingBuckets.Top50 / (totalKws || 1)) * 100).toFixed(1)}%** | Đang được Google đánh giá nội dung, cần củng cố thẩm quyền chủ đề |
| 📉 **Top 51 – 100** | **${rankingBuckets.Top100}** | **${((rankingBuckets.Top100 / (totalKws || 1)) * 100).toFixed(1)}%** | Cần audit lại Search Intent, chống trùng lặp (cannibalization) |
| ⚠️ **Out Top 100 / Chưa xếp hạng** | **${rankingBuckets.OutTop100}** | **${((rankingBuckets.OutTop100 / (totalKws || 1)) * 100).toFixed(1)}%** | Từ khóa mới hoặc trang đích chưa tối ưu đúng trọng tâm |

---

## 2. Top 35 Từ Khóa Đang Xếp Hạng Cao Nhất (Top Performers)

| STT | Từ Khóa | Thứ Hạng Hiện Tại | Thứ Hạng Tốt Nhất | Biến Động | Volume/tháng | Dự Án / URL Đang Xếp Hạng |
|:---:|---|:---:|:---:|:---:|:---:|---|
`;

  topPerformers.slice(0, 35).forEach((k, idx) => {
    const changeStr = k.latestChange > 0 ? `+${k.latestChange} 🔺` : (k.latestChange < 0 ? `${k.latestChange} 🔻` : `—`);
    const serpUrl = k.lastFoundSerp ? `[Link](${k.lastFoundSerp})` : `*${k.projectName}*`;
    md += `| ${idx + 1} | **${k.keyword}** | **#${k.currentPosition}** | #${k.bestPosition || k.currentPosition} | ${changeStr} | ${k.volumeLocal || '—'} | ${serpUrl} |\n`;
  });

  if (topGainers.length > 0) {
    md += `\n---\n\n## 3. Top Từ Khóa Tăng Trưởng Mạnh Nhất (Top Gainers)\n\n`;
    md += `| STT | Từ Khóa | Vị Trí Mới | Mức Tăng | Volume | Dự Án |\n|:---:|---|:---:|:---:|:---:|:---:|\n`;
    topGainers.slice(0, 15).forEach((k, idx) => {
      md += `| ${idx + 1} | **${k.keyword}** | #${k.currentPosition || 'N/A'} | **+${k.latestChange}** 🔺 | ${k.volumeLocal || '—'} | ${k.projectName} |\n`;
    });
  }

  if (topLosers.length > 0) {
    md += `\n---\n\n## 4. Top Từ Khóa Sụt Giảm Cần Tối Ưu Lại (Attention Needed)\n\n`;
    md += `| STT | Từ Khóa | Vị Trí Mới | Mức Giảm | Volume | Dự Án |\n|:---:|---|:---:|:---:|:---:|:---:|\n`;
    topLosers.slice(0, 15).forEach((k, idx) => {
      md += `| ${idx + 1} | **${k.keyword}** | #${k.currentPosition || 'N/A'} | **${k.latestChange}** 🔻 | ${k.volumeLocal || '—'} | ${k.projectName} |\n`;
    });
  }

  if (missingCap1.length > 0) {
    md += `\n---\n\n## 5. Đề Xuất Từ Khóa Cấp 1 & HUB Bổ Sung Vào SERP Robot (${missingCap1.length} từ tiềm năng)\n\n`;
    md += `*Đối chiếu với cấu trúc Silo Pillar \`keyword-map.json\`:*\n\n`;
    md += `| STT | Từ Khóa Đề Xuất | Cụm Chủ Đề / Cấp | Search Volume | GSC Impressions |\n|:---:|---|:---:|:---:|:---:|\n`;
    missingCap1.slice(0, 20).forEach((p, idx) => {
      md += `| ${idx + 1} | **${p.rawKeyword}** | \`${p.cluster}\` / ${p.level} | ${p.volume || 0} | ${p.impressions || 0} |\n`;
    });
  }

  fs.writeFileSync(mdReportPath, md, 'utf-8');
  console.log(`📝 Đã lưu báo cáo Markdown tại: ${path.relative(process.cwd(), mdReportPath)}\n`);

  return { summaryJson, mdReportPath, jsonReportPath };
}

/**
 * Main CLI Handler
 */
async function main() {
  const args = process.argv.slice(2);

  // 1. Kiểm tra credits
  if (args.includes('--credit') || args.includes('--credits')) {
    const cred = await getCredit();
    console.log(`💳 Số dư API Credits hiện tại: ${cred.credit} checks`);
    return;
  }

  // 2. Liệt kê danh sách dự án
  if (args.includes('--projects') || args.includes('-p') || args.includes('--list')) {
    console.log('📡 Đang truy vấn danh sách Projects trên SERP Robot...');
    const projects = await listProjects();
    console.log(`\n📋 Danh sách ${projects.length} dự án được tìm thấy:\n`);
    console.log('| ID | Tên Dự Án | Domain | Số Từ Khóa | Tần Suất Quét |');
    console.log('|:---:|---|---|:---:|:---:|');
    projects.forEach(p => {
      console.log(`| \`${p.id}\` | **${p.name}** | \`${p.url}\` | ${p.number_of_keywords} kws | Mỗi ${p.check_frequency}h |`);
    });
    console.log('\n💡 Dùng lệnh: node scripts/fetch-serprobot.js --project=<ID> để xem chi tiết từng dự án.');
    return;
  }

  // 3. Xem chi tiết 1 từ khóa
  const kwIdArg = args.find(a => a.startsWith('--keyword-id=') || a.startsWith('--keyword='));
  if (kwIdArg) {
    const kwId = kwIdArg.split('=')[1];
    console.log(`📡 Đang tải lịch sử chi tiết cho Keyword ID: ${kwId}...`);
    const kwData = await getKeyword(kwId);
    console.log(`\n======================================================`);
    console.log(`🔍 CHI TIẾT TỪ KHÓA: "${kwData.keyword}" (ID: ${kwData.id})`);
    console.log(`======================================================`);
    console.log(`🎯 Best Position: #${kwData.best_position || 'N/A'} | Current: #${kwData.current_position || 'Out'}`);
    console.log(`📊 Volume: ${kwData.search_volume || 'N/A'} | Cập nhật lúc: ${kwData.last_checked}`);
    console.log(`🔗 SERP URL: ${kwData.last_found_serp || 'Chưa có dữ liệu'}`);

    if (kwData.check_data && Array.isArray(kwData.check_data)) {
      console.log(`\n📜 Lịch sử các lần kiểm tra gần nhất (${kwData.check_data.length} lần):`);
      kwData.check_data.slice(0, 10).forEach((c, idx) => {
        console.log(`  [${idx + 1}] ${c.created} -> Position: #${c.position || 'Out Top 100'}`);
        if (c.top_serps && c.top_serps.length > 0) {
          console.log(`      Top 1 đối thủ: ${c.top_serps[0]}`);
        }
      });
    }
    return;
  }

  // 4. Live Rank Check (Tốn 1 credit)
  if (args.includes('--rank-check')) {
    const kwArg = args.find(a => a.startsWith('--kw=') || a.startsWith('--query=') || a.startsWith('--keyword='));
    const urlArg = args.find(a => a.startsWith('--url=') || a.startsWith('--domain='));
    const keyword = kwArg ? kwArg.split('=')[1] : null;
    const targetUrl = urlArg ? urlArg.split('=')[1] : 'example.com';

    if (!keyword) {
      console.error('❌ Cần truyền từ khóa kiểm tra: --rank-check --kw="<từ khóa>" [--url="<domain>"]');
      process.exit(1);
    }

    console.log(`⚡ Đang thực hiện Live Rank Check cho "${keyword}" trên domain "${targetUrl}" (Chi phí: 1 Credit)...`);
    const result = await rankCheck(keyword, targetUrl);
    console.log('\n✅ Kết quả kiểm tra trực tiếp:', JSON.stringify(result, null, 2));
    return;
  }

  // 5. Get Top 100 SERPs (Tốn 1 credit)
  if (args.includes('--get-serps')) {
    const kwArg = args.find(a => a.startsWith('--kw=') || a.startsWith('--query=') || a.startsWith('--keyword='));
    const keyword = kwArg ? kwArg.split('=')[1] : null;

    if (!keyword) {
      console.error('❌ Cần truyền từ khóa: --get-serps --kw="<từ khóa>"');
      process.exit(1);
    }

    console.log(`⚡ Đang lấy Top 100 SERPs cho "${keyword}" (Chi phí: 1 Credit)...`);
    const result = await getSerps(keyword);
    console.log('\n✅ Kết quả Top SERPs:', JSON.stringify(result, null, 2));
    return;
  }

  // 6. Default Mode: Lấy Báo Cáo Dự Án
  const startArg = args.find(a => a.startsWith('--start='));
  const endArg = args.find(a => a.startsWith('--end='));
  const saveMdArg = args.find(a => a.startsWith('--save=') || a.startsWith('--save-md='));
  const saveJsonArg = args.find(a => a.startsWith('--save-json='));

  let targetProjectIds = [];

  if (args.includes('--all')) {
    const allProjs = await listProjects();
    targetProjectIds = allProjs.map(p => p.id);
  } else {
    const projArg = args.find(a => a.startsWith('--project=') || a.startsWith('--project-id='));
    if (projArg) {
      targetProjectIds = [projArg.split('=')[1]];
    } else {
      // Mặc định: lấy danh sách project từ env `SERPROBOT_PROJECT_IDS` ("id1,id2,id3").
      // Không khai báo thì quét toàn bộ project có trong tài khoản.
      const envIds = (process.env.SERPROBOT_PROJECT_IDS || '')
        .split(',').map(s => s.trim()).filter(Boolean);
      targetProjectIds = envIds.length
        ? envIds
        : (await listProjects()).map(p => p.id);
    }
  }

  await generateSerpReport(targetProjectIds, {
    start: startArg ? startArg.split('=')[1] : '7daysAgo',
    end: endArg ? endArg.split('=')[1] : 'today',
    saveMd: saveMdArg ? saveMdArg.split('=')[1] : null,
    saveJson: saveJsonArg ? saveJsonArg.split('=')[1] : null
  });
}

if (require.main === module) {
  main().catch((err) => {
    console.error(`\n❌ Lỗi thực thi SERP Robot Script:`, err.message);
    process.exit(1);
  });
}

module.exports = {
  requestSerprobot,
  listProjects,
  getProject,
  getKeyword,
  getProjectReport,
  getCredit,
  rankCheck,
  getSerps,
  generateSerpReport
};
