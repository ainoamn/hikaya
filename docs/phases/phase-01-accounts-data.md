# المرحلة 1 — الحسابات والبيانات

## الهدف
حسابات حقيقية، ملفات أطفال، موافقة أهلية، ومكتبة سحابية.

## النواقص الحالية
- المكتبة في `localStorage` فقط
- لا Auth
- لا تخزين صور على خادم

## المطلوب بناؤه
1. جداول: users, child_profiles, consents, stories, pages, assets (انظر `platform/schema.sql`)
2. Auth (بريد سحري أو OAuth)
3. CRUD لملفات الأطفال والقصص
4. رفع أصول بـ signed URL إلى تخزين مشفّر
5. تصدير/حذف بيانات المستخدم (Right to erasure)

## عقود API الأولية
- `POST /api/auth/session`
- `GET/POST /api/children`
- `POST /api/consent`
- `GET/POST /api/stories`
- `POST /api/assets/sign-upload`
- `DELETE /api/account`

## معايير القبول
قصة تُحفظ على حساب وتعود بعد تسجيل الدخول من جهاز آخر؛ حذف الحساب يزيل الصور المرتبطة.
