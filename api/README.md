# Hikaya API (Vercel Serverless)

## Live now
- `GET /api/health` — platform heartbeat and phase map
- `GET /api/auth/bhd/start` — start BHD OIDC (PKCE); requires `BHD_OAUTH_CLIENT_ID`
- `GET /api/auth/bhd/callback` — OAuth callback → stub cookie `hikaya_bhd_sub`
- `GET|POST /api/auth/bhd/logout` — clear wire cookie (+ identity end-session when configured)
- `GET|POST /api/auth/bhd/rebind` — rebind after identity account switch

See `docs/BHD-PRODUCT-WIRE.md` and `platform/env.example`.

## Planned (see `platform/api-contracts.md`)
Children, consent, stories, assets, AI jobs, checkout, webhooks, orders.

Most product functions stay disabled until environment variables in `platform/env.example` are configured on Vercel.
