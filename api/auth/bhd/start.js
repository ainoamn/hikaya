import {
  BHD_OAUTH_STATE_COOKIE,
  BHD_WIRE_SUB_COOKIE,
  OAUTH_STATE_MAX_AGE,
  clearCookie,
  identityIssuer,
  isSsoConfigured,
  oauthClientId,
  oauthRedirectUri,
  randomUrlToken,
  requestOrigin,
  safeReturnPath,
  serializeCookie,
  sha256Base64Url
} from '../../lib/bhd-identity.js';

export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const origin = requestOrigin(req);
  const returnTo = safeReturnPath(
    typeof req.query?.returnTo === 'string'
      ? req.query.returnTo
      : typeof req.query?.next === 'string'
        ? req.query.next
        : '/'
  );

  if (!isSsoConfigured()) {
    res.status(503).json({
      message:
        'BHD SSO غير مُعدّ. عيّن BHD_OAUTH_CLIENT_ID (و BHD_OAUTH_CLIENT_SECRET إن لزم) من id.bhd-om.com/admin#connect',
      env: ['BHD_IDENTITY_ISSUER', 'BHD_OAUTH_CLIENT_ID', 'BHD_OAUTH_CLIENT_SECRET', 'BHD_OAUTH_REDIRECT_URI'],
      fallbackLogin: `${identityIssuer()}/login`
    });
    return;
  }

  const state = randomUrlToken();
  const nonce = randomUrlToken();
  const verifier = randomUrlToken(48);
  const redirectUri = oauthRedirectUri(origin);

  const authorize = new URL('/oauth/authorize', identityIssuer());
  authorize.searchParams.set('client_id', oauthClientId());
  authorize.searchParams.set('redirect_uri', redirectUri);
  authorize.searchParams.set('response_type', 'code');
  authorize.searchParams.set('scope', 'openid profile email');
  authorize.searchParams.set('state', state);
  authorize.searchParams.set('nonce', nonce);
  authorize.searchParams.set('code_challenge', sha256Base64Url(verifier));
  authorize.searchParams.set('code_challenge_method', 'S256');

  const oauthPayload = encodeURIComponent(
    JSON.stringify({ state, nonce, verifier, returnTo, redirectUri })
  );

  res.setHeader('Set-Cookie', [
    serializeCookie(BHD_OAUTH_STATE_COOKIE, oauthPayload, { maxAge: OAUTH_STATE_MAX_AGE }),
    clearCookie(BHD_WIRE_SUB_COOKIE)
  ]);
  res.writeHead(302, { Location: authorize.toString() });
  res.end();
}
