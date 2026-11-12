import {
  BHD_WIRE_SUB_COOKIE,
  WIRE_SUB_MAX_AGE,
  clearCookie,
  identityIssuer,
  isSsoConfigured,
  requestOrigin,
  safeReturnPath,
  serializeCookie
} from '../../lib/bhd-identity.js';

async function profileFromWindowToken(token) {
  const response = await fetch(`${identityIssuer()}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    cache: 'no-store',
    signal: AbortSignal.timeout(8000)
  });
  if (!response.ok) throw new Error(`me_${response.status}`);
  const body = await response.json();
  const user = body?.user;
  const email = typeof user?.email === 'string' ? user.email.trim().toLowerCase() : '';
  if (!user?.id || !email) throw new Error('claims');
  return { sub: user.id, email, name: user.name || email };
}

function bindReturnPath(returnTo, sub, origin) {
  const safe = safeReturnPath(returnTo);
  try {
    const url = new URL(safe, origin);
    url.searchParams.set('au', sub);
    url.searchParams.set('_bhd', String(Date.now()));
    return url.toString();
  } catch {
    return new URL(safe, origin).toString();
  }
}

function wantsJson(req) {
  return (req.headers.accept || '').includes('application/json');
}

function readBodyFields(req) {
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  return {
    token: typeof body.token === 'string' ? body.token.trim() : String(body.token || '').trim(),
    returnTo: safeReturnPath(typeof body.returnTo === 'string' ? body.returnTo : '/')
  };
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');

  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const json = wantsJson(req);
  const origin = requestOrigin(req);
  let token = '';
  let returnTo = '/';

  if (req.method === 'POST') {
    const fields = readBodyFields(req);
    token = fields.token;
    returnTo = fields.returnTo;
  } else {
    returnTo = safeReturnPath(typeof req.query?.returnTo === 'string' ? req.query.returnTo : '/');
  }

  const auth = req.headers.authorization;
  if (!token && typeof auth === 'string' && auth.toLowerCase().startsWith('bearer ')) {
    token = auth.slice(7).trim();
  }

  if (!isSsoConfigured()) {
    if (json) {
      res.status(503).json({ ok: false, error: 'sso' });
      return;
    }
    res.status(503).json({
      message: 'BHD rebind يتطلب BHD_OAUTH_CLIENT_ID — راجع docs/BHD-PRODUCT-WIRE.md'
    });
    return;
  }

  if (!token || token.length < 20) {
    if (json) {
      res.status(401).json({ ok: false, error: 'token' });
      return;
    }
    const start = new URL('/api/auth/bhd/start', origin);
    start.searchParams.set('returnTo', returnTo);
    res.writeHead(303, { Location: start.toString() });
    res.end();
    return;
  }

  try {
    const profile = await profileFromWindowToken(token);
    const current = req.cookies?.[BHD_WIRE_SUB_COOKIE]
      ? decodeURIComponent(req.cookies[BHD_WIRE_SUB_COOKIE])
      : '';

    if (current === profile.sub) {
      if (json) {
        res.status(200).json({
          ok: true,
          unchanged: true,
          user: { id: profile.sub, email: profile.email, name: profile.name }
        });
        return;
      }
      res.writeHead(303, { Location: new URL(returnTo, origin).toString() });
      res.end();
      return;
    }

    res.setHeader(
      'Set-Cookie',
      serializeCookie(BHD_WIRE_SUB_COOKIE, encodeURIComponent(profile.sub), { maxAge: WIRE_SUB_MAX_AGE })
    );

    if (json) {
      res.status(200).json({
        ok: true,
        user: { id: profile.sub, email: profile.email, name: profile.name }
      });
      return;
    }

    res.writeHead(303, { Location: bindReturnPath(returnTo, profile.sub, origin) });
    res.end();
  } catch {
    res.setHeader('Set-Cookie', clearCookie(BHD_WIRE_SUB_COOKIE));
    if (json) {
      res.status(401).json({ ok: false, error: 'rebind' });
      return;
    }
    const logout = new URL('/api/auth/bhd/logout', origin);
    logout.searchParams.set(
      'continue',
      `/api/auth/bhd/start?returnTo=${encodeURIComponent(returnTo)}`
    );
    res.writeHead(303, { Location: logout.toString() });
    res.end();
  }
}
