import multer from 'multer';
import multerS3 from 'multer-s3';
import AWS from 'aws-sdk';
import shortid from 'shortid';
import { config } from 'dotenv';

config(); // تحميل متغيرات البيئة

// إعداد S3
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

// إعداد `multer` مع `multer-s3`
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        acl: 'public-read',
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            const uniqueFileName = shortid.generate() + '-' + file.originalname;
            cb(null, uniqueFileName);
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // تحديد الحجم الأقصى للملف (5MB كمثال)
});

// Middleware لتحميل ملف واحد
const uploadMiddleware = (req, res, next) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        next();
    });
};

export default uploadMiddleware;
