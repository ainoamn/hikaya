# ربط حكاية بهوية BHD الحية

> **تاريخ:** 12 نوفمبر 2026  
> **المستودع:** https://github.com/ainoamn/hikaya  
> **الأصل المقصود:** https://hikaya.bhd-om.com  
> **client_id:** `bhd-hikaya`  
> **الهوية:** https://id.bhd-om.com — **الأيقونات:** `/admin#apps` — **الربط:** `/admin#connect`

## ما أُضيف (سلك أدنى — موقع ثابت + Vercel `/api`)

| البند | الموقع |
|---|---|
| سكربت الهوية | `dist/*.html` → `https://id.bhd-om.com/bhd-identity.js` |
| شريط البرامج | `dist/bhd-programs.js` يقرأ `GET https://id.bhd-om.com/api/bhd/catalog` ويعرض الأسماء العربية |
| دخول CTA | رأس `index.html` → `/api/auth/bhd/start?returnTo=/` |
| OAuth / عزل | `api/auth/bhd/{start,callback,logout,rebind}.js` |
| مساعد OIDC | `api/lib/bhd-identity.js` |

## متغيرات البيئة (لا تُرفع أسراراً)

سجّل redirect في لوحة الهوية (`/admin#connect`) للعميل `bhd-hikaya` ثم عيّن على Vercel:

```env
BHD_IDENTITY_ISSUER=https://id.bhd-om.com
BHD_OAUTH_CLIENT_ID=bhd-hikaya
BHD_OAUTH_CLIENT_SECRET=
# BHD_OAUTH_REDIRECT_URI=https://hikaya.bhd-om.com/api/auth/bhd/callback
HIKAYA_PUBLIC_URL=https://hikaya.bhd-om.com
```

Redirect URI المتوقع:

- `https://hikaya.bhd-om.com/api/auth/bhd/callback`
- (اختياري أثناء التجربة) `https://hikaya-nine.vercel.app/api/auth/bhd/callback`

بدون `BHD_OAUTH_CLIENT_ID` يعيد `/api/auth/bhd/start` **503** مع قائمة المتغيرات ورابط احتياطي إلى `/login` على الهوية.

## سلوك الجلسة الحالي

- بعد callback ناجح يُكتب كوكي stub `hikaya_bhd_sub` (HttpOnly) بقيمة `profile.sub`.
- لا توجد بعد مكتبة سحابية/حسابات أطفال مربوطة بهذا الـ sub — ذلك مرحلة 1.
- `rebind` يحدّث الكوكي عند تبديل الحساب من نافذة الهوية.
- `logout` يمسح الكوكي ويستدعي end-session على الهوية عند التكوين.

## تحقق

1. `/admin#apps` → بلاطات تظهر في شريط «برامج BHD» فوق فوتر حكاية.
2. زر «دخول BHD» → `/api/auth/bhd/start` (بعد ضبط env) يحوّل إلى `/oauth/authorize`.
3. تبديل حساب من الهوية → `POST /api/auth/bhd/rebind` يحدّث `hikaya_bhd_sub`.
4. `GET /api/health` يبقى نبض المنصة كما هو.

## TODO بعد السلك

1. ربط `profile.sub` بحساب ولي أمر محلي (Prisma / Neon) عند تفعيل المرحلة 1.
2. إضافة حكاية إلى كتالوج `/admin#apps` إن لم تكن ظاهرة بعد (`origin: https://hikaya.bhd-om.com`).
3. ضبط نطاق `hikaya.bhd-om.com` على مشروع Vercel وenv الإنتاج.
