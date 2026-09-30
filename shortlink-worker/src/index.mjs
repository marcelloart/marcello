const SITE_ORIGIN = 'https://marcelloart.site';
const DEFAULT_SHORT_BASE_URL = 'https://go.marcelloart.site';
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const RESERVED_SLUGS = new Set(['api', 'admin', 'assets', 'favicon.ico', 'robots.txt', 'sitemap.xml']);
const SLUG_PATTERN = /^[a-z0-9-]{3,24}$/;
const CODE_ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';

function makeCorsHeaders(origin, allowedOrigin) {
  const headers = {
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
  if (origin && origin === allowedOrigin) headers['Access-Control-Allow-Origin'] = allowedOrigin;
  return headers;
}

function jsonResponse(body, status, origin, env) {
  const headers = makeCorsHeaders(origin, env.SITE_ORIGIN || SITE_ORIGIN);
  headers['Content-Type'] = 'application/json; charset=utf-8';
  headers['Cache-Control'] = 'no-store';
  headers['X-Content-Type-Options'] = 'nosniff';
  return new Response(JSON.stringify(body), {status: status, headers: headers});
}

function validateDestination(value) {
  if (typeof value !== 'string' || value.length < 8 || value.length > 2048) {
    return {ok: false, message: 'URL harus berisi 8–2048 karakter.'};
  }
  let parsed;
  try {
    parsed = new URL(value);
  } catch (error) {
    return {ok: false, message: 'URL tidak valid.'};
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return {ok: false, message: 'URL harus menggunakan http:// atau https://.'};
  }
  if (parsed.username || parsed.password) {
    return {ok: false, message: 'URL yang berisi username atau password tidak diizinkan.'};
  }
  if (parsed.hostname.toLowerCase() === new URL(DEFAULT_SHORT_BASE_URL).hostname) {
    return {ok: false, message: 'URL dari domain shortlink ini tidak dapat dipendekkan kembali.'};
  }
  return {ok: true, value: parsed.href};
}

function validateAlias(value) {
  if (value === null || value === undefined || value === '') return {ok: true, value: null};
  if (typeof value !== 'string') return {ok: false, message: 'Nama pendek tidak valid.'};
  const slug = value.trim().toLowerCase();
  if (!SLUG_PATTERN.test(slug) || RESERVED_SLUGS.has(slug)) {
    return {ok: false, message: 'Nama pendek harus 3–24 karakter dan hanya memakai huruf kecil, angka, atau tanda hubung.'};
  }
  return {ok: true, value: slug};
}

function createRandomSlug(length) {
  const bytes = crypto.getRandomValues(new Uint8Array(length || 8));
  let slug = '';
  for (let index = 0; index < bytes.length; index += 1) {
    slug += CODE_ALPHABET[bytes[index] % CODE_ALPHABET.length];
  }
  return slug;
}

async function verifyTurnstile(token, env) {
  if (!token || !env.TURNSTILE_SECRET) return false;
  const body = new URLSearchParams();
  body.set('secret', env.TURNSTILE_SECRET);
  body.set('response', token);
  let response;
  try {
    response = await fetch(TURNSTILE_VERIFY_URL, {method: 'POST', body: body});
  } catch (error) {
    return false;
  }
  if (!response.ok) return false;
  let result;
  try {
    result = await response.json();
  } catch (error) {
    return false;
  }
  return result.success === true && result.hostname === (env.TURNSTILE_HOSTNAME || 'marcelloart.site');
}

async function insertLink(env, slug, targetUrl, createdAt) {
  const result = await env.DB.prepare(
    'INSERT OR IGNORE INTO links (slug, target_url, created_at) VALUES (?, ?, ?)'
  ).bind(slug, targetUrl, createdAt).run();
  return Boolean(result && result.meta && result.meta.changes === 1);
}

async function createLink(request, env) {
  const origin = request.headers.get('Origin');
  const allowedOrigin = env.SITE_ORIGIN || SITE_ORIGIN;
  if (origin !== allowedOrigin) {
    return jsonResponse({error: 'origin_not_allowed', message: 'Permintaan berasal dari halaman yang tidak diizinkan.'}, 403, origin, env);
  }
  if (!env.DB || !env.TURNSTILE_SECRET) {
    return jsonResponse({error: 'service_not_configured', message: 'Layanan shortlink belum dikonfigurasi.'}, 503, origin, env);
  }

  let payload;
  try {
    const contentLength = Number(request.headers.get('Content-Length') || 0);
    if (contentLength > 8192) {
      return jsonResponse({error: 'payload_too_large', message: 'Permintaan terlalu besar.'}, 413, origin, env);
    }
    payload = await request.json();
  } catch (error) {
    return jsonResponse({error: 'invalid_json', message: 'Permintaan tidak valid.'}, 400, origin, env);
  }

  const destination = validateDestination(payload.url);
  if (!destination.ok) {
    return jsonResponse({error: 'invalid_url', message: destination.message}, 400, origin, env);
  }
  const alias = validateAlias(payload.alias);
  if (!alias.ok) {
    return jsonResponse({error: 'invalid_alias', message: alias.message}, 400, origin, env);
  }
  const validCaptcha = await verifyTurnstile(payload.turnstileToken, env);
  if (!validCaptcha) {
    return jsonResponse({error: 'captcha_failed', message: 'Verifikasi anti-spam gagal. Silakan coba kembali.'}, 403, origin, env);
  }

  const createdAt = new Date().toISOString();
  const shortBaseUrl = (env.SHORT_BASE_URL || DEFAULT_SHORT_BASE_URL).replace(/\/+$/, '');
  if (alias.value) {
    const inserted = await insertLink(env, alias.value, destination.value, createdAt);
    if (!inserted) {
      return jsonResponse({error: 'alias_taken', message: 'Nama pendek tersebut sudah digunakan.'}, 409, origin, env);
    }
    return jsonResponse({slug: alias.value, shortUrl: shortBaseUrl + '/' + alias.value, targetUrl: destination.value}, 201, origin, env);
  }

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const slug = createRandomSlug(8);
    const inserted = await insertLink(env, slug, destination.value, createdAt);
    if (inserted) {
      return jsonResponse({slug: slug, shortUrl: shortBaseUrl + '/' + slug, targetUrl: destination.value}, 201, origin, env);
    }
  }
  return jsonResponse({error: 'could_not_create', message: 'Kode singkat belum berhasil dibuat. Coba lagi.'}, 503, origin, env);
}

async function redirectToLink(slug, env) {
  if (!SLUG_PATTERN.test(slug) || RESERVED_SLUGS.has(slug)) {
    return new Response('Link tidak ditemukan.', {status: 404, headers: {'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff', 'X-Robots-Tag': 'noindex, nofollow'}});
  }
  if (!env.DB) {
    return new Response('Layanan shortlink belum dikonfigurasi.', {status: 503, headers: {'Content-Type': 'text/plain; charset=utf-8', 'Retry-After': '60'}});
  }
  const record = await env.DB.prepare('SELECT target_url FROM links WHERE slug = ? LIMIT 1').bind(slug).first();
  if (!record || !record.target_url) {
    return new Response('Link tidak ditemukan.', {status: 404, headers: {'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff', 'X-Robots-Tag': 'noindex, nofollow'}});
  }
  return new Response(null, {
    status: 302,
    headers: {
      'Location': record.target_url,
      'Cache-Control': 'no-store',
      'Referrer-Policy': 'no-referrer',
      'X-Content-Type-Options': 'nosniff',
      'X-Robots-Tag': 'noindex, nofollow, noarchive'
    }
  });
}

async function handleRequest(request, env) {
  const url = new URL(request.url);
  const origin = request.headers.get('Origin');
  const allowedOrigin = env.SITE_ORIGIN || SITE_ORIGIN;

  if (url.pathname.startsWith('/api/')) {
    if (request.method === 'OPTIONS') {
      if (origin !== allowedOrigin) {
        return new Response(null, {status: 403, headers: makeCorsHeaders(origin, allowedOrigin)});
      }
      return new Response(null, {status: 204, headers: makeCorsHeaders(origin, allowedOrigin)});
    }
    if (url.pathname === '/api/config' && request.method === 'GET') {
      const ready = Boolean(env.DB && env.TURNSTILE_SECRET && env.TURNSTILE_SITE_KEY && env.TURNSTILE_SITE_KEY !== 'REPLACE_WITH_TURNSTILE_SITE_KEY');
      if (!ready) return jsonResponse({ready: false}, 503, origin, env);
      return jsonResponse({
        ready: true,
        turnstileSiteKey: env.TURNSTILE_SITE_KEY
      }, 200, origin, env);
    }
    if (url.pathname === '/api/links' && request.method === 'POST') {
      return createLink(request, env);
    }
    return jsonResponse({error: 'not_found', message: 'Endpoint tidak ditemukan.'}, 404, origin, env);
  }

  if (request.method === 'GET') {
    const slug = url.pathname.replace(/^\/+|\/+$/g, '');
    if (slug && !slug.includes('/')) return redirectToLink(slug, env);
  }
  return new Response('Tidak ditemukan.', {status: 404, headers: {'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff'}});
}

export {
  createRandomSlug,
  handleRequest,
  validateAlias,
  validateDestination
};

export default {
  fetch(request, env) {
    return handleRequest(request, env);
  }
};
