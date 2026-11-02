# عقود API لمنصة حكاية

الحالة: مسودات للتنفيذ. الدالة الحيّة حاليًا: `GET /api/health`.

## عام
- الترميز: JSON UTF-8
- الأخطاء: `{ "error": { "code": string, "message": string } }`
- المصادقة: Bearer session token بعد تفعيل المرحلة 1

## Health
`GET /api/health` → `{ ok, service, version, time, phases }`

## Auth / Account
- `POST /api/auth/request-link` `{ email }`
- `POST /api/auth/verify` `{ token }`
- `GET /api/me`
- `DELETE /api/account` — يحذف المستخدم والأصول القابلة للحذف

## Children & consent
- `GET /api/children`
- `POST /api/children` `{ displayName, gender, ageYears, interests[] }`
- `POST /api/consent` `{ childId?, kind, policyVersion }`

## Stories
- `GET /api/stories`
- `POST /api/stories` `{ childId, catalogId?, language, title?, pages? }`
- `PATCH /api/stories/:id`
- `GET /api/stories/:id`

## Assets
- `POST /api/assets/sign-upload` `{ childId, kind, mimeType }`
- `POST /api/assets/:id/complete`

## AI jobs
- `POST /api/ai/jobs` `{ type, childId, storyId?, pageIndexes? }`
- `GET /api/ai/jobs/:id`

## Commerce
- `GET /api/products`
- `POST /api/checkout/session` `{ storyId, productId, shipping? }`
- `POST /api/webhooks/payments` (توقيع المزود)
- `GET /api/orders/:id`
