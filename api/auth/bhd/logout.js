import {
  BHD_OAUTH_STATE_COOKIE,
  BHD_WIRE_SUB_COOKIE,
  clearCookie,
  endSessionUrl,
  identityIssuer,
  isSafeNextPath,
  isSsoConfigured,
  requestOrigin
} from '../../lib/bhd-identity.js';

export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const origin = requestOrigin(req);
  const cont = typeof req.query?.continue === 'string' ? req.query.continue : '';
  const localOnly = req.query?.local === '1';

  let target;
  if (localOnly) {
    target = new URL('/', origin).toString();
  } else if (cont.startsWith('https://') || cont.startsWith('http://')) {
    try {
      const next = new URL(cont);
      const issuerHost = new URL(identityIssuer()).host;
      const allowed =
        next.origin === origin ||
        next.host === issuerHost ||
        next.pathname.startsWith('/api/auth/bhd/');
      target = allowed
        ? cont
        : isSsoConfigured()
          ? endSessionUrl(origin)
          : new URL('/', origin).toString();
    } catch {
      target = isSsoConfigured() ? endSessionUrl(origin) : new URL('/', origin).toString();
    }
  } else if (isSafeNextPath(cont)) {
    target = new URL(cont, origin).toString();
  } else if (isSsoConfigured()) {
    target = endSessionUrl(origin);
  } else {
    target = new URL('/', origin).toString();
  }

  res.setHeader('Set-Cookie', [clearCookie(BHD_WIRE_SUB_COOKIE), clearCookie(BHD_OAUTH_STATE_COOKIE)]);
  res.writeHead(303, { Location: target });
  res.end();
}
