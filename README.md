# 🎀 Modella Platform - منصة موديلة

منصة عرض الملابس والفساتين بتقنية الذكاء الاصطناعي لتجربة افتراضية واقعية.

## ✨ المميزات

- 👗 عرض الملابس والفساتين بتقنية Virtual Try-On
- 📸 تحميل صور العارضات والملابس
- 🎨 توليد صور بصيغ مختلفة للشبكات الاجتماعية
- 💰 نظام محفظة ورصيد
- 🎯 خطط اشتراك متعددة
- 👨‍💼 لوحة تحكم Admin
- 📱 واجهة عصرية وسهلة الاستخدام
- 📞 نظام التواصل والدعم
- 🔐 نظام حسابات آمن

## 🛠️ التثبيت

### المتطلبات
- Node.js (v14+)
- MongoDB (مجاني على mongodb.com)
- npm أو yarn

### خطوات التثبيت

```bash
# 1. استنساخ المستودع
git clone https://github.com/Abdmth/modella-platform.git
cd modella-platform

# 2. تثبيت المتعلقات
npm install

# 3. إنشاء ملف .env
cp .env.example .env

# 4. تحديث بيانات الاتصال في .env
# - أضف رابط MongoDB
# - أضف مفاتيح JWT
# - أضف بيانات البريد الإلكتروني

# 5. تشغيل الخادم
npm run dev
```

الخادم سيعمل على `http://localhost:5000`

## 📚 API الرئيسية

### المصادقة
- `POST /api/auth/register` - إنشاء حساب جديد
- `POST /api/auth/login` - تسجيل الدخول
- `GET /api/auth/me` - الحصول على بيانات المستخدم الحالي

### المستخدمون
- `GET /api/users/profile` - الحصول على الملف الشخصي
- `PUT /api/users/profile` - تحديث الملف الشخصي
- `GET /api/users/wallet` - الحصول على بيانات المحفظة

### العارضات
- `GET /api/models/:storeId` - الحصول على عارضات المتجر
- `POST /api/models` - إنشاء عارضة جديدة
- `POST /api/models/:id/upload-images` - تحميل صور العارضة

### الملابس
- `GET /api/clothes` - الحصول على جميع الملابس
- `POST /api/clothes` - إنشاء ملابس جديدة
- `POST /api/clothes/:id/try-on` - إضافة صورة تجربة افتراضية

### خطط الاشتراك
- `GET /api/subscriptions` - الحصول على خطط الاشتراك
- `POST /api/subscriptions/:id/subscribe` - الاشتراك في خطة

### Admin
- `GET /api/admin/users` - الحصول على جميع المستخدمين
- `POST /api/admin/users` - إنشاء مستخدم جديد
- `PUT /api/admin/users/:id` - تحديث المستخدم
- `DELETE /api/admin/users/:id` - حذف المستخدم
- `GET /api/admin/contacts` - الحصول على رسائل التواصل

### التواصل
- `POST /api/contact` - إرسال رسالة تواصل

## 🔐 نظام الحسابات

### أنواع المستخدمين
1. **المستخدم العادي (User)** - يتصفح الملابس ويحجز الخدمات
2. **صاحب المتجر (Store)** - يرفع الملابس والعارضات
3. **المسؤول (Admin)** - إدارة كاملة للمنصة

## 💳 نظام الدفع

الدفع يتم يدويًا من قبل مالك المنصة:
- الرصيد يُضاف يدويًا من لوحة التحكم
- يمكن تتبع جميع المعاملات
- تاريخ كامل للعمليات المالية

## 📞 التواصل

- **WhatsApp**: 07711775766
- الرسائل تصل إلى لوحة التحكم
- يمكن الرد على الرسائل مباشرة من الموقع

## 🚀 النشر على الخادم

### على Heroku
```bash
heroku login
heroku create modella-platform
git push heroku main
```

### على VPS
```bash
npm install -g pm2
pm2 start server.js
pm2 save
pm2 startup
```

## 📝 الترخيص

جميع الحقوق محفوظة © 2024 Modella Platform

## 👨‍💻 المطور

[Abdmth](https://github.com/Abdmth)

---

**ملاحظة**: هذا المشروع قيد التطوير المستمر. سيتم إضافة المزيد من المميزات قريبًا! 🚀
