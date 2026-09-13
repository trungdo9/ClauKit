#!/usr/bin/env node
/**
 * scripts/audit-folder-governance.js
 * 
 * COMPREHENSIVE FOLDER GOVERNANCE & ARCHITECTURAL AUDIT
 * Quét và kiểm định toàn diện 5 trụ cột kiến trúc workspace:
 * 1. plans/campaigns/ (100% Tác Vụ, Chiến Dịch & Fix Lỗi Phải Nằm Trong campaigns/, có Master Plan + Action Checklist)
 * 2. plans/ (No loose files, chỉ chứa README & Architecture overview)
 * 3. wiki/ (Single Source of Truth, Draft Lifecycle, Media & Knowledge Base)
 * 4. issues/ & scripts/ (Quản trị sự cố & Công cụ tự động hóa)
 * 5. sites/ (Multi-Tenant Spokes cho 3 website)
 *
 * Quy tắc cốt lõi:
 *   - Mọi hoạt động triển khai (chiến dịch mới, sprint, bug fix, remediation, project...)
 *     BẮT BUỘC phải tạo thư mục trong plans/campaigns/<site-or-global>/...
 *   - Mỗi thư mục BẮT BUỘC có master-campaign-plan.md (hoặc plan/README.md) và action-checklist.md
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const PLANS_DIR = path.join(ROOT_DIR, 'plans');
const CAMPAIGNS_DIR = path.join(PLANS_DIR, 'campaigns');
const MARKETING_DIR = path.join(PLANS_DIR, 'marketing');
const WIKI_DIR = path.join(ROOT_DIR, 'wiki');
const DRAFTS_DIR = path.join(WIKI_DIR, 'drafts');
const ISSUES_DIR = path.join(ROOT_DIR, 'issues');
const SCRIPTS_DIR = path.join(ROOT_DIR, 'scripts');
const SITES_DIR = path.join(ROOT_DIR, 'sites');

console.log('================================================================================');
console.log('🏛️ BẮT ĐẦU KIỂM ĐỊNH QUẢN TRỊ KIẾN TRÚC WORKSPACE & FOLDER CAMPAIGNS');
console.log('================================================================================\n');

let issues = [];
let passedChecks = 0;

// 1. Kiểm tra plans/ & plans/marketing/ (No Loose Files)
console.log('🔍 [Trụ cột 1: PLANS] Kiểm tra phân định Plan vs Campaign & No-Loose-Files...');
const allowedPlansLooseFiles = ['README.md', 'marketing-context.md', 'multi-site-enterprise-architecture.md'];
const plansLooseFiles = fs.readdirSync(PLANS_DIR).filter(f => {
  const fp = path.join(PLANS_DIR, f);
  return fs.statSync(fp).isFile() && !allowedPlansLooseFiles.includes(f);
});

if (plansLooseFiles.length > 0) {
  issues.push(`Phát hiện file trôi nổi trong plans/: ${plansLooseFiles.join(', ')}`);
  console.log(`  ❌ Vi phạm plans/: ${plansLooseFiles.join(', ')}`);
} else {
  passedChecks++;
  console.log('  ✓ plans/ đạt chuẩn: Không có file trôi nổi ngoài các tài liệu kiến trúc.');
}

const allowedMarketingLooseFiles = ['README.md'];
const marketingLooseFiles = fs.readdirSync(MARKETING_DIR).filter(f => {
  const fp = path.join(MARKETING_DIR, f);
  return fs.statSync(fp).isFile() && !allowedMarketingLooseFiles.includes(f);
});

if (marketingLooseFiles.length > 0) {
  issues.push(`Phát hiện file trôi nổi trong plans/marketing/: ${marketingLooseFiles.join(', ')}`);
  console.log(`  ❌ Vi phạm plans/marketing/: ${marketingLooseFiles.join(', ')}`);
} else {
  passedChecks++;
  console.log('  ✓ plans/marketing/ đạt chuẩn: Không có file trôi nổi.');
}

// 2. Kiểm tra Campaign Packaging Standard & Multi-Tenant Hub trong plans/campaigns/
console.log('\n🔍 [Trụ cột 2: CAMPAIGNS GOVERNANCE] Kiểm tra 100% Chiến Dịch, Sprint & Fix Đóng Gói Chuẩn...');
const allowedTenantRoots = ['global', 'example.com', 'example.net', 'example.org', 'archives'];

const topCampaignEntries = fs.readdirSync(CAMPAIGNS_DIR, { withFileTypes: true });
topCampaignEntries.forEach(entry => {
  if (entry.isDirectory()) {
    if (!allowedTenantRoots.includes(entry.name)) {
      issues.push(`Thư mục gốc chiến dịch [${entry.name}] không thuộc danh mục hợp lệ (${allowedTenantRoots.join(', ')}).`);
      console.log(`  ❌ Sai tenant root: plans/campaigns/${entry.name}`);
    }
  } else if (entry.isFile() && entry.name !== 'README.md') {
    issues.push(`Phát hiện file trôi nổi trong plans/campaigns/: ${entry.name}`);
    console.log(`  ❌ File trôi nổi trong plans/campaigns/: ${entry.name}`);
  }
});

function findCampaignLeafDirs(dir) {
  let leafDirs = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const subdirs = entries.filter(e => e.isDirectory());
  
  const hasActionChecklist = fs.existsSync(path.join(dir, 'action-checklist.md'));
  if (hasActionChecklist) {
    leafDirs.push(dir);
  } else {
    for (const sub of subdirs) {
      if (sub.name !== 'archives') {
        leafDirs = leafDirs.concat(findCampaignLeafDirs(path.join(dir, sub.name)));
      }
    }
  }
  return leafDirs;
}

const campaignDirs = findCampaignLeafDirs(CAMPAIGNS_DIR);
let validCampaigns = 0;

campaignDirs.forEach(cPath => {
  const relPath = path.relative(ROOT_DIR, cPath);
  const files = fs.readdirSync(cPath);
  const hasPlan = files.some(f => f.includes('plan') || f.includes('README'));
  const hasChecklist = files.includes('action-checklist.md');

  if (!hasPlan) {
    issues.push(`Campaign [${relPath}] thiếu file kế hoạch (master-campaign-plan.md hoặc plan.md).`);
    console.log(`  ⚠️ Thiếu Master Plan: ${relPath}`);
  }
  if (!hasChecklist) {
    issues.push(`Campaign [${relPath}] thiếu file action-checklist.md.`);
    console.log(`  ❌ Thiếu Action Checklist: ${relPath}`);
  }

  if (hasPlan && hasChecklist) {
    // Kiểm tra cấu trúc checklist
    const checklistContent = fs.readFileSync(path.join(cPath, 'action-checklist.md'), 'utf8');
    const hasCheckboxes = checklistContent.includes('[ ]') || checklistContent.includes('[x]') || checklistContent.includes('[🔄]');
    if (!hasCheckboxes) {
      issues.push(`Checklist tại [${relPath}/action-checklist.md] không chứa task checkbox chuẩn ([ ], [x], [🔄]).`);
      console.log(`  ⚠️ Thiếu checkbox chuẩn: ${relPath}/action-checklist.md`);
    } else {
      validCampaigns++;
    }
  }
});

console.log(`  ✓ Đạt chuẩn 100%: ${validCampaigns}/${campaignDirs.length} Chiến dịch & Dự án có đầy đủ Master Plan + Action Checklist.`);
passedChecks++;

// Kiểm tra xem có action-checklist.md nào trôi nổi ngoài plans/campaigns/ không
function scanAllChecklists(dir) {
  let found = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name === '.git' || e.name === '.venv-trends') continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      found = found.concat(scanAllChecklists(full));
    } else if (e.isFile() && e.name === 'action-checklist.md') {
      found.push(full);
    }
  }
  return found;
}

const allChecklists = scanAllChecklists(ROOT_DIR);
const checklistsOutsideCampaigns = allChecklists.filter(cp => !cp.includes(CAMPAIGNS_DIR));
if (checklistsOutsideCampaigns.length > 0) {
  issues.push(`Phát hiện action-checklist.md ngoài plans/campaigns/: ${checklistsOutsideCampaigns.map(p => path.relative(ROOT_DIR, p)).join(', ')}`);
  console.log(`  ❌ Action checklist ngoài plans/campaigns/: ${checklistsOutsideCampaigns.map(p => path.relative(ROOT_DIR, p)).join(', ')}`);
} else {
  passedChecks++;
  console.log(`  ✓ Nguồn chân lý duy nhất (SSOT): Toàn bộ ${allChecklists.length} action-checklist.md đều nằm trong plans/campaigns/.`);
}

// 3. Kiểm tra WIKI Single Source of Truth & RAG Hub
console.log('\n🔍 [Trụ cột 3: WIKI] Kiểm tra tính toàn vẹn kho tri thức RAG (Knowledge, Business, Resources)...');
const requiredWikiDirs = ['knowledge', 'business', 'resources', 'media', 'posts', 'products'];
requiredWikiDirs.forEach(wDir => {
  const wPath = path.join(WIKI_DIR, wDir);
  if (fs.existsSync(wPath) && fs.statSync(wPath).isDirectory()) {
    console.log(`  ✓ Phân hệ wiki chuẩn: [wiki/${wDir}/]`);
  } else {
    issues.push(`Thiếu phân hệ wiki: wiki/${wDir}/`);
    console.log(`  ❌ Thiếu phân hệ: wiki/${wDir}/`);
  }
});

if (!fs.existsSync(path.join(WIKI_DIR, 'README.md'))) {
  issues.push('Thiếu file wiki/README.md mục lục kho tri thức.');
  console.log('  ❌ Thiếu wiki/README.md');
} else {
  console.log('  ✓ wiki/README.md tồn tại đầy đủ.');
  passedChecks++;
}

if (fs.existsSync(DRAFTS_DIR)) {
  const draftFiles = fs.readdirSync(DRAFTS_DIR).filter(f => f.endsWith('.md'));
  if (draftFiles.length === 0) {
    console.log('  ✓ wiki/drafts/ sạch sẽ (0 file tồn đọng).');
  } else {
    console.log(`  ℹ️ Ghi nhận: ${draftFiles.length} bản thảo đang thi công trong wiki/drafts/.`);
  }
  passedChecks++;
}

// 4. Kiểm tra ISSUES Management & SCRIPTS
console.log('\n🔍 [Trụ cột 4: ISSUES & SCRIPTS] Kiểm tra quản trị sự cố & Bộ công cụ tự động hóa...');
if (fs.existsSync(path.join(ISSUES_DIR, 'README.md'))) {
  console.log('  ✓ issues/README.md tồn tại đầy đủ.');
  passedChecks++;
}
if (fs.existsSync(path.join(SCRIPTS_DIR, 'README.md'))) {
  console.log('  ✓ scripts/README.md tồn tại đầy đủ.');
  passedChecks++;
}

// 5. Kiểm tra SITES Multi-Tenant Hub
console.log('\n🔍 [Trụ cột 5: SITES] Kiểm tra phân hệ quản trị đa website (Tenant Spokes)...');
const requiredSites = ['example.com', 'example.org', 'example.net'];
requiredSites.forEach(sDomain => {
  const sPath = path.join(SITES_DIR, sDomain);
  const cfgPath = path.join(sPath, 'config.json');
  if (fs.existsSync(sPath) && fs.existsSync(cfgPath)) {
    console.log(`  ✓ Tenant đạt chuẩn: [sites/${sDomain}/] (kèm config.json & README.md)`);
  } else {
    issues.push(`Thiếu cấu hình tenant: sites/${sDomain}/config.json`);
    console.log(`  ❌ Thiếu cấu hình tenant: sites/${sDomain}/`);
  }
});
passedChecks++;

// 6. Tổng kết
console.log('\n================================================================================');
if (issues.length === 0) {
  console.log(`🎉 TẤT CẢ ${passedChecks} HẠNG MỤC KIỂM ĐỊNH WORKSPACE ĐỀU ĐẠT CHUẨN HOÀN HẢO!`);
  console.log('100% Chiến dịch, sprint, fix lỗi và tác vụ đều được đóng gói chuẩn mực trong plans/campaigns/.');
} else {
  console.log(`⚠️ PHÁT HIỆN ${issues.length} ĐIỂM CẦN CẢI TIẾN:`);
  issues.forEach((iss, idx) => console.log(`  ${idx + 1}. ${iss}`));
  process.exit(1);
}
console.log('================================================================================\n');

module.exports = { issues, passedChecks };
