import { createHash, randomBytes } from 'node:crypto';

export const DEFAULT_IDENTITY_ISSUER = 'https://id.bhd-om.com';
export const BHD_OAUTH_STATE_COOKIE = 'bhd_oauth_state';
/** Stub product binding until Hikaya maps BHD sub → local account. */
export const BHD_WIRE_SUB_COOKIE = 'hikaya_bhd_sub';

const IDENTITY_ISSUER_ALIASES = [
  'https://id.bhd-om.com',
  'https://one-bhd.vercel.app'
];

export function identityIssuer() {
  return (process.env.BHD_IDENTITY_ISSUER?.trim() || DEFAULT_IDENTITY_ISSUER).replace(/\/$/, '');
}

export function oauthClientId() {
  return process.env.BHD_OAUTH_CLIENT_ID?.trim() || '';
}

export function oauthClientSecret() {
  return process.env.BHD_OAUTH_CLIENT_SECRET?.trim() || '';
}

export function isSsoConfigured() {
  return Boolean(oauthClientId());
}

export function requestOrigin(req) {
  const proto =
    (typeof req.headers['x-forwarded-proto'] === 'string'
      ? req.headers['x-forwarded-proto'].split(',')[0]
      : ''
    ).trim() || (process.env.NODE_ENV === 'production' ? 'https' : 'http');
  const host = (
    typeof req.headers['x-forwarded-host'] === 'string'
      ? req.headers['x-forwarded-host'].split(',')[0]
      : req.headers.host || 'localhost:4318'
  ).trim();
  return `${proto}://${host}`;
}

export function oauthRedirectUri(origin) {
  const fromRequest = `${origin.replace(/\/$/, '')}/api/auth/bhd/callback`;
  const configured = process.env.BHD_OAUTH_REDIRECT_URI?.trim();
  if (!configured) return fromRequest;
  try {
    if (new URL(configured).origin === new URL(origin).origin) return configured;
  } catch {
    /* ignore */
  }
  return fromRequest;
}

export function randomUrlToken(bytes = 32) {
  return randomBytes(bytes).toString('base64url');
}

export function sha256Base64Url(value) {
  return createHash('sha256').update(value).digest('base64url');
}

export function isSafeNextPath(value) {
  if (!value || typeof value !== 'string') return false;
  if (!value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return false;
  if (value.includes('://')) return false;
  return true;
}

export function safeReturnPath(value) {
  return isSafeNextPath(value) ? value : '/';
}

export function cookieSecureFlag() {
  return process.env.NODE_ENV === 'production' ? '; Secure' : '';
}

export function serializeCookie(name, value, { maxAge, httpOnly = true } = {}) {
  const parts = [`${name}=${value}`, 'Path=/', 'SameSite=Lax'];
  if (httpOnly) parts.push('HttpOnly');
  if (typeof maxAge === 'number') parts.push(`Max-Age=${maxAge}`);
  const secure = cookieSecureFlag();
  if (secure) parts.push('Secure');
  return parts.join('; ');
}

export function clearCookie(name) {
  return serializeCookie(name, '', { maxAge: 0 });
}

export function parseOAuthState(raw) {
  if (!raw) return null;
  try {
    const decoded = decodeURIComponent(raw);
    const parsed = JSON.parse(decoded);
    if (!parsed?.state || !parsed?.nonce || !parsed?.verifier || !parsed?.redirectUri) return null;
    return parsed;
  } catch {
    try {
      const parsed = JSON.parse(raw);
      if (!parsed?.state || !parsed?.nonce || !parsed?.verifier || !parsed?.redirectUri) return null;
      return parsed;
    } catch {
      return null;
    }
  }
}

export async function exchangeAuthorizationCode({ code, redirectUri, codeVerifier }) {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id: oauthClientId(),
    code_verifier: codeVerifier
  });
  const secret = oauthClientSecret();
  if (secret) body.set('client_secret', secret);

  const tokenRes = await fetch(`${identityIssuer()}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });
  if (!tokenRes.ok) throw new Error(`token_${tokenRes.status}`);
  const tokens = await tokenRes.json();
  if (!tokens?.id_token) throw new Error('empty_token');
  return { idToken: tokens.id_token, accessToken: tokens.access_token || '' };
}

function decodeJwtPayload(token) {
  const parts = (token || '').split('.');
  if (parts.length !== 3) return null;
  try {
    return JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}

function allowedIssuers() {
  return [...new Set([identityIssuer(), ...IDENTITY_ISSUER_ALIASES.map((v) => v.replace(/\/$/, ''))])];
}

export function readVerifiedIdentityProfile(idToken, nonce) {
  const payload = decodeJwtPayload(idToken);
  if (!payload) throw new Error('invalid_id_token');
  const iss = typeof payload.iss === 'string' ? payload.iss.replace(/\/$/, '') : '';
  if (!allowedIssuers().includes(iss)) throw new Error('invalid_issuer');
  const aud = payload.aud;
  const audiences = Array.isArray(aud) ? aud : [aud];
  if (!audiences.includes(oauthClientId())) throw new Error('invalid_audience');
  const exp = typeof payload.exp === 'number' ? payload.exp : 0;
  if (exp + 60 < Math.floor(Date.now() / 1000)) throw new Error('id_token_expired');
  if (payload.nonce !== nonce) throw new Error('invalid_nonce');
  const sub = typeof payload.sub === 'string' ? payload.sub : '';
  const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '';
  if (!sub || !email) throw new Error('invalid_claims');
  return {
    sub,
    email,
    name: typeof payload.name === 'string' && payload.name.trim() ? payload.name.trim() : email
  };
}

export function endSessionUrl(origin) {
  const url = new URL('/oauth/end-session', identityIssuer());
  url.searchParams.set('post_logout_redirect_uri', `${origin.replace(/\/$/, '')}/`);
  const clientId = oauthClientId();
  if (clientId) url.searchParams.set('client_id', clientId);
  return url.toString();
}

export const WIRE_SUB_MAX_AGE = 60 * 60 * 24 * 40;
export const OAUTH_STATE_MAX_AGE = 5 * 60;
