# فهرس ملفات مشروع حكاية

## ملفات الجذر

- `package.json` — أوامر التشغيل والبناء والاختبار
- `vercel.json` — إعدادات نشر Vercel
- `.gitignore` — استثناء zip والمخرجات والأسرار
- `server.mjs` — خادم معاينة محلي
- `README.md` — السجل التقني للتطوير
- `BRAND.md` — دليل الشعار والألوان
- `ابدأ-من-هنا.txt` — تشغيل سريع بالعربية
- `art-prompts.txt` — أوصاف الرسوم الأولى
- `book-art-prompts.md` — أوصاف رسوم الكتاب
- `characters-art-prompt.txt` — وصف أطلس الشخصيات
- `expansion-art-prompts.md` — رسوم المهن والعائلة
- `family-art-prompts.md` — أوصاف وجوه الأبناء
- `quality-art-prompts.md` — ملاحظات الجودة

## docs/

- `DOCUMENTATION.md` — التوثيق الشامل
- `DEPLOY-VERCEL.md` — خطوات GitHub + Vercel
- `FAMILY-FACES.md` — شرح تخصيص وجوه الأبناء
- `FILES.md` — هذا الفهرس

## scripts/

- `build.mjs` — بوابة البناء الثابتة
- `verify.mjs` — فحص الروابط + البناء + الاختبار

## tests/

- `editorial.test.cjs` — صحة القصص والجندر والقراءة الصوتية

## dist/ (ما يُنشر)

راجع `docs/DOCUMENTATION.md` القسم ٤ لقائمة كل ملف JS/CSS وأصل صورة.

## artwork-source/

أصول PNG الكبيرة لرسوم المهن والعائلة قبل تحويل WebP.  
مفيدة للتوثيق وإعادة التصدير؛ النشر العام يعتمد على ملفات `dist/`.
