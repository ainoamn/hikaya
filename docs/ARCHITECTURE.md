# هندسة منصة حكاية المستهدفة

تاريخ: ٢ نوفمبر ٢٠٢٦  
الحالة اليوم: واجهة ثابتة في `dist/` + هيكل خلفي جاهز للتفعيل في `api/` و`platform/`

---

## ١) الوضع الحالي

```text
المتصفح → dist/* (HTML/CSS/JS/Assets) → Vercel Static CDN
المكتبة واللغة → localStorage فقط
لا أسرار خادم · لا دفع · لا توليد AI حي
```

## ٢) الهدف المعماري

```text
[Web UI]
   │
   ▼
[Vercel Edge/CDN + Static]
   │
   ├── /api/*  (Serverless functions)
   │      ├── auth
   │      ├── children & consent
   │      ├── stories
   │      ├── assets/upload
   │      ├── ai/jobs
   │      ├── checkout & webhooks
   │      └── print/shipping
   │
   ├── Postgres (Users, Stories, Orders, Consent)
   ├── Object Storage مشفّر (صور الأطفال)
   ├── Queue (تولد صور/قصص/فيديو)
   └── Providers: Payments · AI · Print · TTS
```

## ٣) مبادئ التصميم

1. صور الأطفال لا تُمرَّر إلى الواجهة العامة بعد الرفع؛ تُستبدل بمعرّفات أصول.
2. التسعير والدفع والوفاء تُحسَب على الخادم فقط.
3. مهام AI غير متزامنة مع حالات واضحة.
4. فصل الخيال عن الحقائق التاريخية في نموذج المحتوى.
5. كل موافقة أهلية تُسجَّل مع زمن ونسخة سياسة.

## ٤) مجلدات الهيكل

| المسار | الدور |
| --- | --- |
| `dist/` | الواجهة المنشورة الآن |
| `api/` | دوال Vercel Serverless (هيكل + health) |
| `platform/` | مخططات، عقود API، أمثلة بيئة، طوابير |
| `docs/phases/` | مواصفات كل مرحلة تطوير |
| `scripts/` | بناء وتحقق |

## ٥) تفعيل الخدمات لاحقًا

ضع الأسرار في Vercel Environment Variables فقط (انظر `platform/env.example`).  
لا ترفع مفاتيح إلى Git.
