
# 📦 FileShare

**FileShare** هو تطبيق لمشاركة الملفات يتيح للمستخدمين رفع ملفاتهم واستلام رابط فريد وآمن للوصول إليها. يدعم حماية الملفات بكلمة مرور، وتحديد مدة صلاحية للرابط، وإمكانية استعادة الملفات لاحقًا.

## ✨ الميزات

- رفع ملفات إلى AWS S3
- إنشاء روابط مخصصة للملف
- حماية الملفات بكلمة مرور
- تحديد تاريخ انتهاء صلاحية الوصول
- توليد access token فريد لكل ملف
- إمكانية استرجاع الملفات إذا كانت recoverable

## 🧰 التقنيات المستخدمة

- Node.js + Express
- PostgreSQL + Sequelize ORM
- AWS S3 (لتخزين الملفات)
- JWT للتوثيق
- PERN Stack بشكل عام

## 🚀 تشغيل المشروع محليًا

```bash
git clone https://github.com/username/fileshare.git
cd fileshare
npm install
npm run dev
```

### 🧪 متطلبات:

- قاعدة بيانات PostgreSQL تعمل مسبقًا
- ملف `.env` يحتوي على المتغيرات التالية:

```env
PORT=3000
DB_URI=postgres://username:password@localhost:5432/fileshare_db
AWS_BUCKET_NAME=your_bucket
AWS_ACCESS_KEY=your_key
AWS_SECRET_KEY=your_secret
JWT_SECRET=your_jwt_secret
```

## 📬 مثال على استخدام API

### رفع ملف:

`POST /api/v1/files`

- Headers:
  - Content-Type: multipart/form-data
- Body (form-data):
  - file: [الملف المراد رفعه]
  - title: "My File"
  - message: "This is private"
  - password: "123456"
  - expiresAt: "2025-12-31T23:59:59Z"

### الاستجابة:

```json
{
  "fileName": "resume.pdf",
  "fileLink": "https://s3.amazonaws.com/bucket/unique-file.pdf",
  "accessToken": "1a2b3c4d...",
  "expiresAt": "2025-12-31T23:59:59Z"
}
```

## 📄 الرخصة

MIT License
