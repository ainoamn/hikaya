import {
  BHD_OAUTH_STATE_COOKIE,
  BHD_WIRE_SUB_COOKIE,
  WIRE_SUB_MAX_AGE,
  clearCookie,
  exchangeAuthorizationCode,
  isSafeNextPath,
  isSsoConfigured,
  parseOAuthState,
  readVerifiedIdentityProfile,
  requestOrigin,
  safeReturnPath,
  serializeCookie
} from '../../lib/bhd-identity.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const origin = requestOrigin(req);
  const fail = (reason) => {
    const login = new URL('/', origin);
    login.searchParams.set('bhd_error', reason);
    res.setHeader('Set-Cookie', clearCookie(BHD_OAUTH_STATE_COOKIE));
    res.writeHead(302, { Location: login.toString() });
    res.end();
  };

  if (!isSsoConfigured()) {
    res.status(503).json({ message: 'BHD SSO غير مُعدّ — راجع BHD_OAUTH_* في env' });
    return;
  }

  const error = typeof req.query?.error === 'string' ? req.query.error : '';
  const code = typeof req.query?.code === 'string' ? req.query.code : '';
  const state = typeof req.query?.state === 'string' ? req.query.state : '';
  const saved = parseOAuthState(req.cookies?.[BHD_OAUTH_STATE_COOKIE]);

  if (error) {
    fail(error.slice(0, 40));
    return;
  }
  if (!saved || saved.state !== state || !code) {
    fail('state');
    return;
  }

  let profile;
  try {
    const tokens = await exchangeAuthorizationCode({
      code,
      redirectUri: saved.redirectUri,
      codeVerifier: saved.verifier
    });
    profile = readVerifiedIdentityProfile(tokens.idToken, saved.nonce);
  } catch {
    fail('token');
    return;
  }

  // Stub wire only — map profile.sub → Hikaya account in Phase 1.
  const dest = isSafeNextPath(saved.returnTo) ? saved.returnTo : safeReturnPath('/');
  const target = new URL(dest, origin);

  res.setHeader('Set-Cookie', [
    clearCookie(BHD_OAUTH_STATE_COOKIE),
    serializeCookie(BHD_WIRE_SUB_COOKIE, encodeURIComponent(profile.sub), { maxAge: WIRE_SUB_MAX_AGE })
  ]);
  res.writeHead(302, { Location: target.toString() });
  res.end();
}
