/**
 * scripts/zalo-oa.js
 * 
 * Zalo Official Account (OA) OpenAPI v4 & Automated CRM Integration CLI
 * example.com / Enterprise Corp
 * 
 * Capabilities:
 * 1. OAuth 2.0 PKCE Auto-Login & Code Exchange
 * 2. Automatic Token Storage & 24h Token Rotation (wiki/crm/sync/zalo-tokens.json)
 * 3. Pull Recent Conversations & Customer Inquiries (listrecentchat)
 * 4. Pull Complete Chat History per Customer (conversation)
 * 5. Send Direct CS Text Messages (OA Chat API v3.0 /oa/message/cs)
 * 6. Automated Lead Extraction & CRM Lake Ingestion (wiki/crm/contacts/zalo-customers.json)
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const http = require('http');
const { exec } = require('child_process');

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
  const envPath = path.resolve(PROJECT_ROOT, '.agents/.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        if (!process.env[key]) process.env[key] = val;
      }
    }
  }
}
loadEnv();

const ZALO_APP_ID = process.env.ZALO_OA_ID || process.env.ZALO_APP_ID;
const ZALO_APP_SECRET = process.env.ZALO_OA_SECRET || process.env.ZALO_OA_SERCRET || process.env.ZALO_APP_SECRET;

const TOKEN_FILE_PATH = path.resolve(PROJECT_ROOT, 'wiki/crm/sync/zalo-tokens.json');
const PKCE_STATE_PATH = path.resolve(PROJECT_ROOT, 'wiki/crm/sync/zalo-pkce-state.json');

// Ensure directories exist
function ensureSyncDir() {
  const syncDir = path.dirname(TOKEN_FILE_PATH);
  if (!fs.existsSync(syncDir)) fs.mkdirSync(syncDir, { recursive: true });
}

// 2. PKCE Generator (Code Verifier & Challenge)
function generatePKCE() {
  const verifier = crypto.randomBytes(32).toString('base64url');
  const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');
  return { verifier, challenge };
}

// 3. Token Storage Manager
function loadSavedTokens() {
  if (fs.existsSync(TOKEN_FILE_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(TOKEN_FILE_PATH, 'utf8'));
    } catch (e) {
      return null;
    }
  }
  return null;
}

function saveTokens(tokenData) {
  ensureSyncDir();
  const dataToSave = {
    ...tokenData,
    updatedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + (parseInt(tokenData.expires_in || '90000', 10) * 1000)).toISOString()
  };
  fs.writeFileSync(TOKEN_FILE_PATH, JSON.stringify(dataToSave, null, 2), 'utf8');
  return dataToSave;
}

// 4. Token Resolver (Auto-Refresh when expired)
async function getValidAccessToken() {
  let tokens = loadSavedTokens();

  if (!tokens || !tokens.access_token) {
    throw new Error('Chưa có Access Token! Vui lòng cấp quyền trước.');
  }

  // Check if token is older than 23 hours (Zalo token lives for ~25h)
  const isExpiring = tokens.expiresAt && new Date() >= new Date(new Date(tokens.expiresAt).getTime() - 2 * 3600 * 1000);

  if (isExpiring && tokens.refresh_token) {
    console.log('🔄 Access Token sắp hết hạn (>23h). Đang tự động Refresh Token mới qua Zalo OAuth v4...');
    tokens = await refreshAccessToken(tokens.refresh_token);
  }

  return tokens.access_token;
}

// 5. Exchange Authorization Code for Tokens
async function exchangeAuthCode(authCodeOrUrl, codeVerifier) {
  if (!ZALO_APP_ID || !ZALO_APP_SECRET) {
    throw new Error('Thiếu ZALO_OA_ID hoặc ZALO_OA_SERCRET trong file .agents/.env!');
  }

  // Extract code if user passed full redirect URL
  let cleanCode = authCodeOrUrl.trim();
  if (cleanCode.includes('code=')) {
    const match = cleanCode.match(/[?&]code=([^&]+)/);
    if (match) cleanCode = decodeURIComponent(match[1]);
  }

  // If codeVerifier not passed, try to load from PKCE state file
  if (!codeVerifier && fs.existsSync(PKCE_STATE_PATH)) {
    try {
      const stateData = JSON.parse(fs.readFileSync(PKCE_STATE_PATH, 'utf8'));
      codeVerifier = stateData.verifier;
    } catch (e) {}
  }

  console.log(`📡 Đang gửi yêu cầu đổi code sang Zalo OAuth v4... (App ID: ${ZALO_APP_ID})`);

  const params = new URLSearchParams();
  params.append('code', cleanCode);
  params.append('app_id', ZALO_APP_ID);
  params.append('grant_type', 'authorization_code');
  if (codeVerifier) params.append('code_verifier', codeVerifier);

  const res = await fetch('https://oauth.zalo.me/v4/oa/access_token', {
    method: 'POST',
    headers: {
      'secret_key': ZALO_APP_SECRET,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  });

  const data = await res.json();
  if (data.error) {
    throw new Error(`Zalo OAuth Error [${data.error}]: ${data.message || data.error_description || JSON.stringify(data)}`);
  }

  const saved = saveTokens(data);
  console.log('🎉 ĐÃ LẤY & LƯU TOKEN THÀNH CÔNG VÀO wiki/crm/sync/zalo-tokens.json!');
  console.log(`- Access Token (hạn 25h): ${data.access_token.slice(0, 20)}...`);
  console.log(`- Refresh Token (hạn 3 tháng): ${data.refresh_token.slice(0, 20)}...`);
  return saved;
}

// 6. Refresh Access Token
async function refreshAccessToken(refreshToken) {
  if (!ZALO_APP_ID || !ZALO_APP_SECRET) {
    throw new Error('Thiếu ZALO_OA_ID hoặc ZALO_OA_SERCRET trong file .agents/.env!');
  }

  console.log('📡 Đang làm mới Access Token qua Zalo OAuth v4...');
  const params = new URLSearchParams();
  params.append('refresh_token', refreshToken);
  params.append('app_id', ZALO_APP_ID);
  params.append('grant_type', 'refresh_token');

  const res = await fetch('https://oauth.zalo.me/v4/oa/access_token', {
    method: 'POST',
    headers: {
      'secret_key': ZALO_APP_SECRET,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  });

  const data = await res.json();
  if (data.error) {
    throw new Error(`Zalo Refresh Token Error [${data.error}]: ${data.message || data.error_description}`);
  }

  return saveTokens(data);
}

// 7. REST API: Get Recent Conversations (Danh sách hội thoại gần nhất)
async function getRecentChats(offset = 0, count = 10) {
  const token = await getValidAccessToken();
  const safeCount = Math.min(count, 10);
  const dataParam = encodeURIComponent(JSON.stringify({ offset, count: safeCount }));
  const url = `https://openapi.zalo.me/v2.0/oa/listrecentchat?data=${dataParam}`;

  const res = await fetch(url, {
    headers: { 'access_token': token }
  });
  const json = await res.json();
  if (json.error !== 0) {
    throw new Error(`Zalo API Error [${json.error}]: ${json.message}`);
  }
  return json.data || [];
}

// 8. REST API: Get Message History with a User
async function getMessageHistory(userId, offset = 0, count = 10) {
  const token = await getValidAccessToken();
  const safeCount = Math.min(count, 10);
  const dataParam = encodeURIComponent(JSON.stringify({ user_id: userId, offset, count: safeCount }));
  const url = `https://openapi.zalo.me/v2.0/oa/conversation?data=${dataParam}`;

  const res = await fetch(url, {
    headers: { 'access_token': token }
  });
  const json = await res.json();
  if (json.error !== 0) {
    throw new Error(`Zalo API Error [${json.error}]: ${json.message}`);
  }
  return json.data || [];
}

// Helper: Strip Markdown symbols for Zalo (Zalo does not support markdown **bold** or *italic*)
function cleanMarkdownForZalo(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // remove **bold**
    .replace(/\*(.*?)\*/g, '$1')     // remove *italic*
    .replace(/__(.*?)__/g, '$1')     // remove __underline__
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1 ($2)') // convert markdown link
    .replace(/`([^`]+)`/g, '$1')     // remove `code`
    .replace(/^\s*[-*]\s+/gm, '• '); // convert bullet points to nice dot
}

// 9. REST API: Send Message to User (with Auto Token Retry & Markdown Cleaner)
async function sendTextMessage(userId, text) {
  let token = await getValidAccessToken();
  const cleanText = cleanMarkdownForZalo(text);
  
  const doSend = async (authToken) => {
    return await fetch('https://openapi.zalo.me/v3.0/oa/message/cs', {
      method: 'POST',
      headers: {
        'access_token': authToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        recipient: { user_id: userId },
        message: { text: cleanText }
      })
    });
  };

  let res = await doSend(token);
  let json = await res.json();

  // If token expired (-216), auto refresh and retry once
  if (json.error === -216) {
    const tokens = loadSavedTokens();
    if (tokens && tokens.refresh_token) {
      console.log('🔄 Token hết hạn (-216). Đang tự động refresh token mới...');
      try {
        const refreshed = await refreshAccessToken(tokens.refresh_token);
        res = await doSend(refreshed.access_token);
        json = await res.json();
      } catch (e) {
        throw new Error('Access token đã hết hạn và cần cấp quyền lại: ' + e.message);
      }
    }
  }

  if (json.error !== 0) {
    throw new Error(`Zalo Send Error [${json.error}]: ${json.message}`);
  }
  return json;
}

// 10. Extract Phone, Company, Signals from message text
function extractContactFromText(text) {
  if (!text) return {};
  
  // Phone regex matching: 078.58.33.555, 0903 018 135, 028-38734567, 0987654321
  const phoneMatch = text.match(/(?:(?:SĐT|Sdt|Tel|Hotline|Phone|Liên hệ|Ms|Mr)[:\s]*)?((?:\+84|84|0)(?:[\s.-]*\d){8,11})/i);
  let cleanPhone = '';
  if (phoneMatch && phoneMatch[1]) {
    const digits = phoneMatch[1].replace(/[^0-9]/g, '');
    if (digits.length >= 9 && digits.length <= 11) {
      cleanPhone = digits.startsWith('84') ? '0' + digits.slice(2) : digits;
    }
  }
  
  let company = '';
  const compMatch = text.match(/(?:Công ty|CÔNG TY|Cty|CTY|Doanh nghiệp)\s+([^\n,]+)/i);
  if (compMatch) {
    company = compMatch[0].trim();
    // Clean up if it grabbed too much
    if (company.length > 80) company = company.slice(0, 80);
  }

  let taxCode = '';
  const mstMatch = text.match(/(?:MST|Mã số thuế|Tax code)[:\s]*([0-9]{10}(?:-[0-9]{3})?)/i);
  if (mstMatch) taxCode = mstMatch[1];

  return {
    phone: cleanPhone,
    company: company,
    taxCode: taxCode
  };
}

// 11. Full Sync to Data Lake (wiki/crm/contacts/zalo-customers.json)
async function syncZaloToCrm(maxPages = 5) {
  console.log('🔄 Bắt đầu đồng bộ danh bạ khách hàng & hội thoại từ Zalo OA vào CRM Data Lake...');
  
  const customerMap = new Map();

  for (let page = 0; page < maxPages; page++) {
    const offset = page * 10;
    try {
      const chats = await getRecentChats(offset, 10);
      if (!chats || chats.length === 0) break;

      for (const item of chats) {
        const isUserSender = item.src === 1;
        const userId = isUserSender ? item.from_id : item.to_id;
        const displayName = isUserSender ? item.from_display_name : item.to_display_name;
        const avatar = isUserSender ? item.from_avatar : item.to_avatar;

        if (userId && !customerMap.has(userId) && userId !== '1914944525581707167') {
          const contactInfo = extractContactFromText(item.message || '');
          customerMap.set(userId, {
            zaloUserId: userId,
            displayName: displayName || 'Khách hàng Zalo',
            avatar: avatar || '',
            phone: contactInfo.phone || '',
            companyName: contactInfo.company || '',
            lastMessage: item.message || (item.type === 'photo' ? '[Hình ảnh]' : ''),
            lastMessageTime: item.sent_time || '',
            timestamp: item.time || 0,
            channel: 'Zalo OA Direct Chat'
          });
        }
      }
    } catch (err) {
      console.log(`⚠️ Hết phân trang hoặc lỗi: ${err.message}`);
      break;
    }
  }

  const customers = Array.from(customerMap.values());
  console.log(`📊 Đã trích xuất ${customers.length} khách hàng có tương tác thực tế trên Zalo OA.`);

  // Enrich with full conversation history
  for (const c of customers) {
    try {
      const history = await getMessageHistory(c.zaloUserId, 0, 10);
      c.conversationHistory = history.map(h => ({
        sender: h.src === 1 ? c.displayName : 'Enterprise Corp',
        time: h.sent_time,
        type: h.type,
        message: h.message || h.url || ''
      }));

      // Find any phone number in full history
      for (const h of history) {
        if (!c.phone && h.message) {
          const parsed = extractContactFromText(h.message);
          if (parsed.phone) c.phone = parsed.phone;
          if (parsed.company && !c.companyName) c.companyName = parsed.company;
        }
      }
      console.log(`  ✓ Đã đồng bộ hội thoại: [${c.displayName}] ${c.phone ? '(SĐT: ' + c.phone + ')' : ''} ${c.companyName ? '(' + c.companyName + ')' : ''}`);
    } catch (e) {
      // Ignore single user history error
    }
  }

  const outDir = path.resolve(PROJECT_ROOT, 'wiki/crm/contacts');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'zalo-customers.json');
  fs.writeFileSync(outPath, JSON.stringify(customers, null, 2), 'utf8');

  console.log(`\n💾 ĐÃ LƯU ${customers.length} HỒ SƠ KHÁCH HÀNG ZALO VÀO: ${outPath}`);
  return customers;
}

// ============================================================================
// CLI DISPATCHER
// ============================================================================

async function main() {
  const args = process.argv.slice(2);
  const getArg = (flag) => {
    const prefix = `${flag}=`;
    const arg = args.find(a => a.startsWith(prefix));
    if (arg) return arg.slice(prefix.length);
    const idx = args.indexOf(flag);
    if (idx !== -1 && args[idx + 1] && !args[idx + 1].startsWith('--')) return args[idx + 1];
    return null;
  };

  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║       ZALO OA OPENAPI v4 & CRM DIRECT INTEGRATION          ║');
  console.log('║               Công ty TNHH Enterprise Corp           ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  try {
    // 0. Manually set Token (from Zalo Tools Explorer or Developer Portal)
    const directAccessToken = getArg('--set-token') || getArg('--access-token');
    if (directAccessToken) {
      const directRefreshToken = getArg('--set-refresh-token') || getArg('--refresh-token') || '';
      const saved = saveTokens({
        access_token: directAccessToken,
        refresh_token: directRefreshToken,
        expires_in: '90000'
      });
      console.log('✅ ĐÃ LƯU TRỰC TIẾP TOKEN THÀNH CÔNG VÀO wiki/crm/sync/zalo-tokens.json!');
      console.log(`- Access Token: ${saved.access_token.slice(0, 25)}...`);
      return;
    }

    // 1. Exchange Code & Auto-Sync
    const code = getArg('--exchange-code') || getArg('--code');
    if (code) {
      const verifier = getArg('--verifier');
      await exchangeAuthCode(code, verifier);
      
      if (args.includes('--sync') || args.includes('--sync-crm')) {
        console.log('\n🚀 TỰ ĐỘNG KÉO DANH SÁCH KHÁCH HÀNG TỪ ZALO OA VỀ CRM...');
        await syncZaloToCrm();
      }
      return;
    }

    // 2. Manual Refresh Token
    if (args.includes('--refresh-token') || args.includes('--refresh')) {
      const tokens = loadSavedTokens();
      if (!tokens || !tokens.refresh_token) {
        throw new Error('Chưa tìm thấy refresh_token để làm mới!');
      }
      await refreshAccessToken(tokens.refresh_token);
      return;
    }

    // 3. Get Recent Conversations
    if (args.includes('--conversations') || args.includes('--recent') || args.includes('--chats')) {
      const offset = Number(getArg('--offset') || 0);
      const count = Number(getArg('--count') || 10);
      console.log(`💬 Đang lấy danh sách hội thoại gần nhất (offset=${offset}, count=${count})...`);
      const threads = await getRecentChats(offset, count);
      console.log(`\n✅ Tìm thấy ${threads.length} hội thoại gần nhất:`);
      console.log(JSON.stringify(threads, null, 2));
      return;
    }

    // 4. Get Message History
    const msgUserId = getArg('--messages') || getArg('--history') || getArg('--user-id');
    if (msgUserId && !args.includes('--send-text')) {
      console.log(`💬 Đang lấy lịch sử tin nhắn với khách hàng ID: [${msgUserId}]...`);
      const messages = await getMessageHistory(msgUserId, 0, 10);
      console.log('\n✅ Lịch sử tin nhắn:');
      console.log(JSON.stringify(messages, null, 2));
      return;
    }

    // 5. Send Text Message
    if (args.includes('--send-text')) {
      const targetUser = getArg('--user-id') || getArg('--to');
      const messageText = getArg('--message') || getArg('--text');
      if (!targetUser || !messageText) {
        throw new Error('Vui lòng cung cấp --user-id=<ID> và --message="<Nội dung>"');
      }
      console.log(`📤 Đang gửi tin nhắn tới User [${targetUser}]...`);
      const res = await sendTextMessage(targetUser, messageText);
      console.log('✅ Đã gửi thành công!', res);
      return;
    }

    // 6. Sync All Followers to CRM
    if (args.includes('--sync-crm') || args.includes('--sync')) {
      await syncZaloToCrm();
      return;
    }

    // Default Help
    console.log('Hướng dẫn sử dụng Zalo OA CLI:');
    console.log('  1. Xem hội thoại gần đây: node scripts/zalo-oa.js --conversations');
    console.log('  2. Xem lịch sử tin nhắn:   node scripts/zalo-oa.js --messages=<USER_ID>');
    console.log('  3. Gửi tin nhắn CSKH:     node scripts/zalo-oa.js --send-text --user-id=<ID> --message="Xin chào"');
    console.log('  4. Đồng bộ toàn bộ về CRM: node scripts/zalo-oa.js --sync-crm\n');

  } catch (err) {
    console.error(`\n❌ LỖI ZALO OA CLI: ${err.message}`);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  generatePKCE,
  exchangeAuthCode,
  refreshAccessToken,
  getValidAccessToken,
  getRecentChats,
  getMessageHistory,
  sendTextMessage,
  syncZaloToCrm
};
