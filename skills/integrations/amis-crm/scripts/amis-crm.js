/**
 * scripts/amis-crm.js
 * 
 * MISA AMIS CRM Open API v2 Automation CLI & Library
 * example.com / Enterprise Corp
 * 
 * Capabilities:
 * 1. Authentication & Token Management (Account token generation, caching, and auto-refresh)
 * 2. Customer Management (Customers - CRUD, Paging, Filter by Code/ID)
 * 3. Contact Management (Contacts - CRUD, Paging, Filter by Code/ID)
 * 4. Product Catalog (Products - CRUD, Paging, Price tiers, Filter by Code/ID)
 * 5. Sale Orders (SaleOrders - CRUD, Item mappings, Invoicing, Payment status)
 * 6. Warehouse & Inventory (Stocks & Product Ledger - Inventory tracking, Update stock)
 * 7. B2B Lead Ingestion & Web Form Bridge (Turn web inquiries into CRM Customers & Contacts)
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

// 1. Configuration & Env Loader
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

const AMIS_BASE_URL = process.env.AMIS_BASE_URL || 'https://crmconnect.misa.vn';
const TOKEN_CACHE_FILE = path.resolve(PROJECT_ROOT, '.agents/.amis_token_cache.json');

/**
 * Resolve client_id and client_secret from environment variables or command-line overrides.
 * Supports:
 * - AMIS_CLIENT_ID and AMIS_API_KEY (secret)
 * - AMIS_API_KEY as "client_id:client_secret"
 * - AMIS_API_KEY as secret with default/custom client_id
 */
function getCredentials(cliClientId = null, cliSecret = null) {
  let clientId = cliClientId || process.env.AMIS_CLIENT_ID || process.env.AMIS_APP_ID || '';
  let clientSecret = cliSecret || process.env.AMIS_API_KEY || '';

  if (clientSecret.includes(':') && !clientId) {
    const parts = clientSecret.split(':');
    clientId = parts[0];
    clientSecret = parts.slice(1).join(':');
  }

  if (!clientId) {
    clientId = 'PublicAPI';
  }

  return { clientId, clientSecret };
}

// 2. Authentication & Token Management
function getCachedToken() {
  if (fs.existsSync(TOKEN_CACHE_FILE)) {
    try {
      const cache = JSON.parse(fs.readFileSync(TOKEN_CACHE_FILE, 'utf8'));
      // Buffer of 60 seconds before expiry
      if (cache.token && cache.exp && cache.exp * 1000 > Date.now() + 60000) {
        return cache;
      }
    } catch (e) {
      // Invalid cache file, ignore
    }
  }
  return null;
}

function saveCachedToken(token, payload) {
  try {
    const data = {
      token,
      exp: payload.exp || Math.floor(Date.now() / 1000) + 86400,
      client_id: payload.client_id || '',
      updated_at: new Date().toISOString()
    };
    fs.writeFileSync(TOKEN_CACHE_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    // Non-fatal if cache cannot be written
  }
}

function parseJwtPayload(token) {
  try {
    const parts = token.split('.');
    if (parts.length >= 2) {
      const payloadBuf = Buffer.from(parts[1], 'base64');
      return JSON.parse(payloadBuf.toString('utf8'));
    }
  } catch (e) {
    // Fallback if parsing fails
  }
  return {};
}

/**
 * Generate or retrieve a valid AMIS CRM Bearer Token
 */
async function getAuthToken(options = {}) {
  const { clientId, clientSecret } = getCredentials(options.clientId, options.clientSecret);

  if (!clientSecret) {
    throw new Error('AMIS_API_KEY (client_secret) is missing in .agents/.env');
  }

  // Check cache first
  if (!options.forceRefresh) {
    const cached = getCachedToken();
    if (cached && cached.client_id === clientId) {
      return { token: cached.token, clientId, cached: true };
    }
  }

  const authUrl = `${AMIS_BASE_URL}/api/v2/Account`;
  const body = {
    client_id: clientId,
    client_secret: clientSecret
  };

  const res = await fetch(authUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const json = await res.json().catch(() => null);

  if (!res.ok || !json || !json.success || !json.data) {
    const errMsg = json?.user_msg || json?.dev_msg || json?.error_message || `HTTP ${res.status} ${res.statusText}`;
    throw new Error(`AMIS Token Generation Failed (code: ${json?.code || res.status}): ${errMsg}`);
  }

  const token = json.data;
  const payload = parseJwtPayload(token);
  payload.client_id = clientId;

  saveCachedToken(token, payload);

  return { token, clientId, cached: false, exp: payload.exp };
}

// 3. General AMIS Request Dispatcher
async function amisRequest(endpoint, options = {}) {
  const auth = await getAuthToken(options);
  const url = endpoint.startsWith('http') ? endpoint : `${AMIS_BASE_URL}${endpoint}`;
  const method = options.method || 'GET';

  const headers = {
    'Authorization': `Bearer ${auth.token}`,
    'Clientid': auth.clientId,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...options.headers
  };

  const fetchOptions = {
    method,
    headers
  };

  if (options.body && method !== 'GET' && method !== 'HEAD') {
    fetchOptions.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
  }

  const res = await fetch(url, fetchOptions);
  let data = null;
  const text = await res.text();
  try {
    data = JSON.parse(text);
  } catch (e) {
    data = { raw: text };
  }

  // If token expired (HTTP 401 or AMIS code 401), retry once with fresh token
  if ((res.status === 401 || data?.code === 401) && !options._retried) {
    console.log('[AMIS] Token expired or unauthorized. Refreshing token...');
    options.forceRefresh = true;
    options._retried = true;
    return amisRequest(endpoint, options);
  }

  if (!res.ok) {
    const errDetail = data?.user_msg || data?.dev_msg || data?.error_message || JSON.stringify(data);
    throw new Error(`AMIS API HTTP ${res.status} Error: ${errDetail}`);
  }

  return data;
}

// 4. Helper API Methods for Each Entity

const AmisAPI = {
  // Account / Diagnostic
  async testAuth() {
    const auth = await getAuthToken({ forceRefresh: true });
    return {
      success: true,
      message: 'Kết nối AMIS CRM thành công!',
      clientId: auth.clientId,
      expiresAt: auth.exp ? new Date(auth.exp * 1000).toLocaleString('vi-VN') : 'Unknown'
    };
  },

  // --------------------------------------------------------------------------
  // CUSTOMERS (Khách Hàng - /api/v2/Customers)
  // --------------------------------------------------------------------------
  async getCustomers({ page = 0, pageSize = 10, orderBy = 'modified_date', isDescending = true } = {}) {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      orderBy,
      isDescending: String(isDescending)
    });
    return amisRequest(`/api/v2/Customers?${params.toString()}`);
  },

  async getCustomerByIds(ids) {
    const idList = Array.isArray(ids) ? ids : [ids];
    const params = new URLSearchParams();
    for (const id of idList) params.append('ids', id);
    return amisRequest(`/api/v2/Customers/id?${params.toString()}`);
  },

  async getCustomerByCode(codes) {
    const codeList = Array.isArray(codes) ? codes : [codes];
    const params = new URLSearchParams();
    for (const code of codeList) params.append('code', code);
    return amisRequest(`/api/v2/Customers/code?${params.toString()}`);
  },

  async createCustomers(customerList) {
    const list = Array.isArray(customerList) ? customerList : [customerList];
    return amisRequest('/api/v2/Customers', {
      method: 'POST',
      body: list
    });
  },

  async updateCustomers(customerList) {
    const list = Array.isArray(customerList) ? customerList : [customerList];
    return amisRequest('/api/v2/Customers', {
      method: 'PUT',
      body: list
    });
  },

  async deleteCustomers(ids) {
    const list = Array.isArray(ids) ? ids.map(Number) : [Number(ids)];
    return amisRequest('/api/v2/Customers', {
      method: 'DELETE',
      body: list
    });
  },

  // --------------------------------------------------------------------------
  // CONTACTS (Liên Hệ - /api/v2/Contacts)
  // --------------------------------------------------------------------------
  async getContacts({ page = 0, pageSize = 10, orderBy = 'modified_date', isDescending = true } = {}) {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      orderBy,
      isDescending: String(isDescending)
    });
    return amisRequest(`/api/v2/Contacts?${params.toString()}`);
  },

  async getContactByIds(ids) {
    const idList = Array.isArray(ids) ? ids : [ids];
    const params = new URLSearchParams();
    for (const id of idList) params.append('ids', id);
    return amisRequest(`/api/v2/Contacts/id?${params.toString()}`);
  },

  async getContactByCode(codes) {
    const codeList = Array.isArray(codes) ? codes : [codes];
    const params = new URLSearchParams();
    for (const code of codeList) params.append('code', code);
    return amisRequest(`/api/v2/Contacts/code?${params.toString()}`);
  },

  async createContacts(contactList) {
    const list = Array.isArray(contactList) ? contactList : [contactList];
    return amisRequest('/api/v2/Contacts', {
      method: 'POST',
      body: list
    });
  },

  async updateContacts(contactList) {
    const list = Array.isArray(contactList) ? contactList : [contactList];
    return amisRequest('/api/v2/Contacts', {
      method: 'PUT',
      body: list
    });
  },

  async deleteContacts(ids) {
    const list = Array.isArray(ids) ? ids.map(Number) : [Number(ids)];
    return amisRequest('/api/v2/Contacts', {
      method: 'DELETE',
      body: list
    });
  },

  // --------------------------------------------------------------------------
  // PRODUCTS (Hàng Hóa - /api/v2/Products)
  // --------------------------------------------------------------------------
  async getProducts({ page = 0, pageSize = 10, orderBy = 'modified_date', isDescending = true } = {}) {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      orderBy,
      isDescending: String(isDescending)
    });
    return amisRequest(`/api/v2/Products?${params.toString()}`);
  },

  async getProductByIds(ids) {
    const idList = Array.isArray(ids) ? ids : [ids];
    const params = new URLSearchParams();
    for (const id of idList) params.append('ids', id);
    return amisRequest(`/api/v2/Products/id?${params.toString()}`);
  },

  async getProductByCode(codes) {
    const codeList = Array.isArray(codes) ? codes : [codes];
    const params = new URLSearchParams();
    for (const code of codeList) params.append('code', code);
    return amisRequest(`/api/v2/Products/code?${params.toString()}`);
  },

  async createProducts(productList) {
    const list = Array.isArray(productList) ? productList : [productList];
    return amisRequest('/api/v2/Products', {
      method: 'POST',
      body: list
    });
  },

  async updateProducts(productList) {
    const list = Array.isArray(productList) ? productList : [productList];
    return amisRequest('/api/v2/Products', {
      method: 'PUT',
      body: list
    });
  },

  async deleteProducts(ids) {
    const list = Array.isArray(ids) ? ids.map(Number) : [Number(ids)];
    return amisRequest('/api/v2/Products', {
      method: 'DELETE',
      body: list
    });
  },

  // --------------------------------------------------------------------------
  // SALE ORDERS (Đơn Hàng - /api/v2/SaleOrders)
  // --------------------------------------------------------------------------
  async getOrders({ page = 0, pageSize = 10, orderBy = 'modified_date', isDescending = true } = {}) {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      orderBy,
      isDescending: String(isDescending)
    });
    return amisRequest(`/api/v2/SaleOrders?${params.toString()}`);
  },

  async getOrderByIds(ids) {
    const idList = Array.isArray(ids) ? ids : [ids];
    const params = new URLSearchParams();
    for (const id of idList) params.append('ids', id);
    return amisRequest(`/api/v2/SaleOrders/id?${params.toString()}`);
  },

  async getOrderByCode(codes) {
    const codeList = Array.isArray(codes) ? codes : [codes];
    const params = new URLSearchParams();
    for (const code of codeList) params.append('code', code);
    return amisRequest(`/api/v2/SaleOrders/code?${params.toString()}`);
  },

  async createOrders(orderList) {
    const list = Array.isArray(orderList) ? orderList : [orderList];
    return amisRequest('/api/v2/SaleOrders', {
      method: 'POST',
      body: list
    });
  },

  async updateOrders(orderList) {
    const list = Array.isArray(orderList) ? orderList : [orderList];
    return amisRequest('/api/v2/SaleOrders', {
      method: 'PUT',
      body: list
    });
  },

  async deleteOrders(ids) {
    const list = Array.isArray(ids) ? ids.map(Number) : [Number(ids)];
    return amisRequest('/api/v2/SaleOrders', {
      method: 'DELETE',
      body: list
    });
  },

  // --------------------------------------------------------------------------
  // STOCKS & PRODUCT LEDGER (Kho & Tồn Kho - /api/v2/Stocks)
  // --------------------------------------------------------------------------
  async getStocks() {
    return amisRequest('/api/v2/Stocks');
  },

  async getStockByCode(stockCodes) {
    const codeList = Array.isArray(stockCodes) ? stockCodes : [stockCodes];
    const params = new URLSearchParams();
    for (const code of codeList) params.append('stockCode', code);
    return amisRequest(`/api/v2/Stocks/code?${params.toString()}`);
  },

  async getStockByAsyncId(asyncIds) {
    const idList = Array.isArray(asyncIds) ? asyncIds : [asyncIds];
    const params = new URLSearchParams();
    for (const id of idList) params.append('async_ids', id);
    return amisRequest(`/api/v2/Stocks/asyncid?${params.toString()}`);
  },

  async createStocks(stockList) {
    const list = Array.isArray(stockList) ? stockList : [stockList];
    return amisRequest('/api/v2/Stocks', {
      method: 'POST',
      body: list
    });
  },

  async updateStocks(stockList) {
    const list = Array.isArray(stockList) ? stockList : [stockList];
    return amisRequest('/api/v2/Stocks', {
      method: 'PUT',
      body: list
    });
  },

  async deleteStocks(asyncIds) {
    const list = Array.isArray(asyncIds) ? asyncIds : [asyncIds];
    return amisRequest('/api/v2/Stocks', {
      method: 'DELETE',
      body: list
    });
  },

  async getProductLedger({ page = 0, pageSize = 10, stockID = '' } = {}) {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      stockID
    });
    return amisRequest(`/api/v2/Stocks/product_ledger?${params.toString()}`);
  },

  async updateProductLedger(ledgerList) {
    const list = Array.isArray(ledgerList) ? ledgerList : [ledgerList];
    return amisRequest('/api/v2/Stocks/product_ledger', {
      method: 'POST',
      body: list
    });
  }
};

// 5. CLI Execution & Parameter Parser
function parseCliArgs(args) {
  const parsed = { _: [] };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const idx = arg.indexOf('=');
      if (idx !== -1) {
        const key = arg.slice(2, idx);
        const val = arg.slice(idx + 1);
        parsed[key] = val;
      } else {
        const key = arg.slice(2);
        // Check next arg for value
        if (i + 1 < args.length && !args[i + 1].startsWith('--')) {
          parsed[key] = args[i + 1];
          i++;
        } else {
          parsed[key] = true;
        }
      }
    } else {
      parsed._.push(arg);
    }
  }
  return parsed;
}

function printJson(data, exportPath = null) {
  const formatted = JSON.stringify(data, null, 2);
  console.log(formatted);
  if (exportPath) {
    const outPath = path.resolve(process.cwd(), exportPath);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, formatted, 'utf8');
    console.log(`\n[AMIS] Đã lưu dữ liệu vào: ${outPath}`);
  }
}

async function main() {
  const args = parseCliArgs(process.argv.slice(2));

  try {
    // 1. Account / Connection Diagnostics
    if (args['auth'] || args['test-auth'] || args['account']) {
      console.log('[AMIS] Đang kiểm tra kết nối với MISA AMIS CRM...');
      const res = await AmisAPI.testAuth();
      printJson(res, args['export']);
      return;
    }

    // 2. Customers
    if (args['get-customers'] || args['customers']) {
      const page = parseInt(args['page'] || 0, 10);
      const pageSize = parseInt(args['pageSize'] || args['limit'] || 10, 10);
      const orderBy = args['orderBy'] || 'modified_date';
      const isDescending = args['desc'] !== 'false';
      const res = await AmisAPI.getCustomers({ page, pageSize, orderBy, isDescending });
      printJson(res, args['export']);
      return;
    }

    if (args['get-customer-id'] || args['customer-id']) {
      const ids = (args['get-customer-id'] || args['customer-id']).split(',').map(s => s.trim());
      const res = await AmisAPI.getCustomerByIds(ids);
      printJson(res, args['export']);
      return;
    }

    if (args['get-customer-code'] || args['customer-code']) {
      const codes = (args['get-customer-code'] || args['customer-code']).split(',').map(s => s.trim());
      const res = await AmisAPI.getCustomerByCode(codes);
      printJson(res, args['export']);
      return;
    }

    if (args['create-customers']) {
      const filePath = args['create-customers'];
      const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const res = await AmisAPI.createCustomers(fileData);
      printJson(res, args['export']);
      return;
    }

    if (args['add-customer']) {
      const customer = {
        account_name: args['name'] || args['account_name'] || 'Khách hàng mới',
        account_short_name: args['short-name'] || '',
        office_tel: args['phone'] || args['tel'] || '',
        office_email: args['email'] || '',
        tax_code: args['tax-code'] || '',
        account_type: args['type'] || 'Khách hàng dự án',
        lead_source: args['source'] || 'Website example.com',
        billing_address: args['address'] || '',
        description: args['description'] || 'Đăng ký nhận báo giá từ website'
      };
      const res = await AmisAPI.createCustomers([customer]);
      printJson(res, args['export']);
      return;
    }

    if (args['update-customers']) {
      const filePath = args['update-customers'];
      const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const res = await AmisAPI.updateCustomers(fileData);
      printJson(res, args['export']);
      return;
    }

    if (args['delete-customers']) {
      const ids = args['delete-customers'].split(',').map(s => s.trim());
      const res = await AmisAPI.deleteCustomers(ids);
      printJson(res, args['export']);
      return;
    }

    // 3. Contacts
    if (args['get-contacts'] || args['contacts']) {
      const page = parseInt(args['page'] || 0, 10);
      const pageSize = parseInt(args['pageSize'] || args['limit'] || 10, 10);
      const res = await AmisAPI.getContacts({ page, pageSize });
      printJson(res, args['export']);
      return;
    }

    if (args['get-contact-id'] || args['contact-id']) {
      const ids = (args['get-contact-id'] || args['contact-id']).split(',').map(s => s.trim());
      const res = await AmisAPI.getContactByIds(ids);
      printJson(res, args['export']);
      return;
    }

    if (args['get-contact-code'] || args['contact-code']) {
      const codes = (args['get-contact-code'] || args['contact-code']).split(',').map(s => s.trim());
      const res = await AmisAPI.getContactByCode(codes);
      printJson(res, args['export']);
      return;
    }

    if (args['create-contacts']) {
      const filePath = args['create-contacts'];
      const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const res = await AmisAPI.createContacts(fileData);
      printJson(res, args['export']);
      return;
    }

    if (args['add-contact']) {
      const contact = {
        contact_name: args['name'] || 'Người liên hệ',
        salutation: args['salutation'] || 'Anh/Chị',
        mobile: args['phone'] || '',
        email: args['email'] || '',
        account_name: args['account'] || args['company'] || '',
        title: args['title'] || 'Kỹ sư / Phụ trách mua hàng',
        lead_source: args['source'] || 'Website example.com',
        description: args['description'] || ''
      };
      const res = await AmisAPI.createContacts([contact]);
      printJson(res, args['export']);
      return;
    }

    if (args['update-contacts']) {
      const filePath = args['update-contacts'];
      const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const res = await AmisAPI.updateContacts(fileData);
      printJson(res, args['export']);
      return;
    }

    if (args['delete-contacts']) {
      const ids = args['delete-contacts'].split(',').map(s => s.trim());
      const res = await AmisAPI.deleteContacts(ids);
      printJson(res, args['export']);
      return;
    }

    // 4. Products
    if (args['get-products'] || args['products']) {
      const page = parseInt(args['page'] || 0, 10);
      const pageSize = parseInt(args['pageSize'] || args['limit'] || 10, 10);
      const res = await AmisAPI.getProducts({ page, pageSize });
      printJson(res, args['export']);
      return;
    }

    if (args['get-product-id'] || args['product-id']) {
      const ids = (args['get-product-id'] || args['product-id']).split(',').map(s => s.trim());
      const res = await AmisAPI.getProductByIds(ids);
      printJson(res, args['export']);
      return;
    }

    if (args['get-product-code'] || args['product-code']) {
      const codes = (args['get-product-code'] || args['product-code']).split(',').map(s => s.trim());
      const res = await AmisAPI.getProductByCode(codes);
      printJson(res, args['export']);
      return;
    }

    if (args['create-products']) {
      const filePath = args['create-products'];
      const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const res = await AmisAPI.createProducts(fileData);
      printJson(res, args['export']);
      return;
    }

    if (args['update-products']) {
      const filePath = args['update-products'];
      const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const res = await AmisAPI.updateProducts(fileData);
      printJson(res, args['export']);
      return;
    }

    if (args['delete-products']) {
      const ids = args['delete-products'].split(',').map(s => s.trim());
      const res = await AmisAPI.deleteProducts(ids);
      printJson(res, args['export']);
      return;
    }

    if (args['sync-products'] || args['sync-catalog']) {
      const { syncAmisProducts } = require('./sync-amis-products');
      await syncAmisProducts(AmisAPI);
      return;
    }

    // 5. Sale Orders
    if (args['get-orders'] || args['orders']) {
      const page = parseInt(args['page'] || 0, 10);
      const pageSize = parseInt(args['pageSize'] || args['limit'] || 10, 10);
      const res = await AmisAPI.getOrders({ page, pageSize });
      printJson(res, args['export']);
      return;
    }

    if (args['get-order-id'] || args['order-id']) {
      const ids = (args['get-order-id'] || args['order-id']).split(',').map(s => s.trim());
      const res = await AmisAPI.getOrderByIds(ids);
      printJson(res, args['export']);
      return;
    }

    if (args['get-order-code'] || args['order-code']) {
      const codes = (args['get-order-code'] || args['order-code']).split(',').map(s => s.trim());
      const res = await AmisAPI.getOrderByCode(codes);
      printJson(res, args['export']);
      return;
    }

    if (args['create-orders']) {
      const filePath = args['create-orders'];
      const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const res = await AmisAPI.createOrders(fileData);
      printJson(res, args['export']);
      return;
    }

    if (args['update-orders']) {
      const filePath = args['update-orders'];
      const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const res = await AmisAPI.updateOrders(fileData);
      printJson(res, args['export']);
      return;
    }

    if (args['delete-orders']) {
      const ids = args['delete-orders'].split(',').map(s => s.trim());
      const res = await AmisAPI.deleteOrders(ids);
      printJson(res, args['export']);
      return;
    }

    // 6. Stocks & Inventory
    if (args['get-stocks'] || args['stocks']) {
      const res = await AmisAPI.getStocks();
      printJson(res, args['export']);
      return;
    }

    if (args['get-stock-code']) {
      const codes = args['get-stock-code'].split(',').map(s => s.trim());
      const res = await AmisAPI.getStockByCode(codes);
      printJson(res, args['export']);
      return;
    }

    if (args['get-stock-asyncid']) {
      const ids = args['get-stock-asyncid'].split(',').map(s => s.trim());
      const res = await AmisAPI.getStockByAsyncId(ids);
      printJson(res, args['export']);
      return;
    }

    if (args['get-stock-ledger'] || args['stock-ledger']) {
      const page = parseInt(args['page'] || 0, 10);
      const pageSize = parseInt(args['pageSize'] || args['limit'] || 10, 10);
      const stockID = args['stock-id'] || args['stockID'] || '';
      const res = await AmisAPI.getProductLedger({ page, pageSize, stockID });
      printJson(res, args['export']);
      return;
    }

    if (args['update-stock-ledger']) {
      const filePath = args['update-stock-ledger'];
      const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const res = await AmisAPI.updateProductLedger(fileData);
      printJson(res, args['export']);
      return;
    }

    if (args['set-inventory']) {
      const item = {
        product_code: args['product-code'] || args['code'],
        stock_code: args['stock-code'] || args['stock'],
        quantity: parseFloat(args['quantity'] || args['qty'] || 0)
      };
      const res = await AmisAPI.updateProductLedger([item]);
      printJson(res, args['export']);
      return;
    }

    // Default: Help Menu
    console.log(`
MISA AMIS CRM Open API v2 CLI Tool (scripts/amis-crm.js)
example.com / Enterprise Corp

SỬ DỤNG:
  node scripts/amis-crm.js <lệnh> [tùy_chọn]

1. XÁC THỰC & CHẨN ĐOÁN (Authentication):
  node scripts/amis-crm.js --auth                   Kiểm tra kết nối và token AMIS CRM

2. KHÁCH HÀNG (Customers):
  node scripts/amis-crm.js --customers [--page=0] [--pageSize=10] [--orderBy=modified_date]
  node scripts/amis-crm.js --customer-id=1,2,3      Lấy khách hàng theo danh sách ID
  node scripts/amis-crm.js --customer-code=KH00001  Lấy khách hàng theo Mã khách hàng
  node scripts/amis-crm.js --add-customer --name="..." --phone="..." --email="..."
  node scripts/amis-crm.js --create-customers=file.json
  node scripts/amis-crm.js --update-customers=file.json
  node scripts/amis-crm.js --delete-customers=1,2

3. LIÊN HỆ (Contacts):
  node scripts/amis-crm.js --contacts [--page=0] [--pageSize=10]
  node scripts/amis-crm.js --contact-id=1,2
  node scripts/amis-crm.js --contact-code=LH00001
  node scripts/amis-crm.js --add-contact --name="..." --phone="..." --email="..." --account="KH00001"
  node scripts/amis-crm.js --create-contacts=file.json
  node scripts/amis-crm.js --update-contacts=file.json
  node scripts/amis-crm.js --delete-contacts=1,2

4. HÀNG HÓA & VẬT LIỆU LỌC (Products):
  node scripts/amis-crm.js --products [--page=0] [--pageSize=10]
  node scripts/amis-crm.js --product-id=1,2
  node scripts/amis-crm.js --product-code=HH00001
  node scripts/amis-crm.js --create-products=file.json
  node scripts/amis-crm.js --update-products=file.json
  node scripts/amis-crm.js --delete-products=1,2

5. ĐƠN HÀNG (Sale Orders):
  node scripts/amis-crm.js --orders [--page=0] [--pageSize=10]
  node scripts/amis-crm.js --order-id=1,2
  node scripts/amis-crm.js --order-code=DH000001
  node scripts/amis-crm.js --create-orders=file.json
  node scripts/amis-crm.js --update-orders=file.json
  node scripts/amis-crm.js --delete-orders=1,2

6. KHO & TỒN KHO (Stocks & Product Ledger):
  node scripts/amis-crm.js --stocks                 Lấy danh sách tất cả kho
  node scripts/amis-crm.js --stock-ledger [--stock-id=...] [--page=0]
  node scripts/amis-crm.js --set-inventory --product-code=HH00001 --stock-code=K1 --qty=500
  node scripts/amis-crm.js --update-stock-ledger=file.json

TÙY CHỌN CHUNG:
  --export=path/to/file.json  Xuất kết quả trả về ra file JSON
`);
  } catch (err) {
    console.error(`\n[AMIS CRM ERROR] ${err.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  AmisAPI,
  amisRequest,
  getAuthToken,
  getCredentials
};
