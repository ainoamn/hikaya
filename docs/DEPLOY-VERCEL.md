# نشر حكاية على Vercel

## المتطلبات

- حساب GitHub يملك أو يصل إلى `ainoamn/hikaya`
- حساب Vercel مرتبط بنفس GitHub
- Node.js 18+ محليًا للتحقق قبل الرفع

## ١) تحقق محليًا أولًا

```bash
npm run verify
npm start
```

افتح http://localhost:4318 وتأكد أن الصفحة والصور والمكتبة تعمل.

## ٢) ارفع إلى GitHub

```bash
git push -u origin main
```

المستودع: https://github.com/ainoamn/hikaya

## ٣) اربط المشروع بـ Vercel

1. https://vercel.com/new
2. Import `ainoamn/hikaya`
3. الإعدادات المتوقعة من `vercel.json`:

| الحقل | القيمة |
| --- | --- |
| Framework Preset | Other |
| Install Command | `npm install --ignore-scripts` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

4. اضغط Deploy

## ٤) ماذا يفعل البناء؟

`npm run build` يشغّل `scripts/build.mjs` ويتحقق أن ملفات `dist/` الأساسية موجودة.  
لا يوجد تجميع TypeScript/React؛ الموقع ثابت جاهز من `dist/`.

## ٥) نطاق مخصص (اختياري)

من Vercel → Project → Settings → Domains أضف نطاقك، ثم حدّث DNS حسب تعليمات Vercel.

## ٦) استكشاف الأخطاء

| المشكلة | الحل |
| --- | --- |
| صفحة بيضاء | تأكد أن Output Directory = `dist` وأن `index.html` داخلها |
| صور مفقودة | تحقق أن `dist/assets/**` مرفوعة في Git وليست في `.gitignore` |
| فشل البناء | شغّل `npm run build` و`npm run verify` محليًا واقرأ الملفات الناقصة |
| خط عربي مكسور في التصدير | تأكد من وجود `dist/assets/NotoSansArabic.ttf` |

## ٧) ملاحظات مهمة

- الدفع والطباعة التجارية غير مفعّلين.
- حجم المستودع كبير نسبيًا بسبب الرسوم (~١٠٠ ميجابايت)؛ هذا متوقع.
- لا ترفع ملفات `.env` أو صور العائلة الأصلية الفوتوغرافية.
