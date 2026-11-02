# Platform scaffold

This folder prepares Hikaya for commercial phases without activating paid providers yet.

| File | Purpose |
| --- | --- |
| `schema.sql` | Postgres schema for users, children, stories, assets, jobs, orders |
| `api-contracts.md` | HTTP contract drafts |
| `env.example` | Required secrets checklist for Vercel |

Apply schema only after provisioning a database. Never commit real secrets.
