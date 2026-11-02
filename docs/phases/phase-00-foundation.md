# المرحلة 0 — تثبيت الأساس

## الهدف
مستودع نظيف، نشر مستقر، وثائق، مراقبة، ونطاق.

## منجز
- [x] GitHub: https://github.com/ainoamn/hikaya
- [x] Vercel: https://hikaya-nine.vercel.app
- [x] `package.json` / `vercel.json` / `scripts/build|verify`
- [x] وثائق الرؤية والخطة والهندسة
- [x] صفحات Privacy / Terms / Status
- [x] `api/health` للتحقق من المنصة
- [x] `.vercelignore` لتقليل رفع الملفات الثقيلة غير اللازمة

## متبقي للتفعيل التشغيلي
- [ ] نطاق مخصص DNS
- [ ] Sentry أو مراقبة أخطاء
- [ ] تنبيهات نشر فاشل على Vercel

## معايير القبول
`npm run verify` ينجح، والموقع الحي يعيد 200 للصفحة والأصول الأساسية.
