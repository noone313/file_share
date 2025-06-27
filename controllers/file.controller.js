import { File, User } from '../models/models.js'; 
import { Op } from 'sequelize';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';



export const getAllFiles = async (req, res) => {
    try {
        const { page , limit, offset} = req.pagination;

        const {count , rows} = await File.findAndCountAll({
            limit,
            offset,
            order:[['createdAt', 'DESC']],
            include: {
                model: User,
                attributes: ['userName', 'email'],
            },
        });
        res.status(200).json({
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            items: rows,});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getFileByAccessToken = async (req, res) => {
    try {
        const { accessToken } = req.params;
        const file = await File.findOne({
            where: { accessToken },
            include: {
                model: User,
                attributes: ['userName', 'email'],
            },
        });
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }
        res.status(200).json(file);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



export const createFile = async (req, res) => {
    try {

            // التحقق من وجود ملف مرفوع
            if (!req.file) {
                return res.status(400).json({ message: "File upload is required" });
            }

            const { userId } = req.user;

            const { originalname } = req.file;

            const fileUrl = req.file.location; // المسار على S3

            const fileType = req.file.mimetype; // نوع الملف

            const {title, message , expiresAt, password, recoverable} = req.body; // استخرج الحقول من الطلب

            const accessToken = crypto.randomBytes(32).toString('hex');



            // إنشاء سجل في قاعدة البيانات
            const file = await File.create({
                fileName: originalname,
                accessToken,
                fileType,
                title: title || null,
                message: message || null,
                expiresAt: expiresAt || null,
                password : password|| null,
                recoverable : recoverable || null,
                fileLink: fileUrl,
                userId,
              
                
                
            });

            res.status(201).json(file);
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const deleteFile = async (req, res) => {
    try {
        const { accessToken } = req.params;
        const file = await File.findOne({ where: { accessToken } });
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }
        await file.destroy();
        res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const updateFile = async (req, res) => {
    try {
        const { accessToken } = req.params;
        const { title, message, expiresAt, password, locked, recoverable } = req.body; 

        const file = await File.findOne({ where: { accessToken } });
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        await file.update({
            title: title || file.title,
            message: message || file.message,
            expiresAt: expiresAt || file.expiresAt,
            password: password || file.password,
            locked: locked || file.locked,
            recoverable: recoverable || file.recoverable,
        });

        res.status(200).json(file);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const downloadFile = async (req, res) => {
    try {
        const { accessToken } = req.params;
        const file = await File.findOne({ where: { accessToken } });

        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }

        return res.redirect(file.fileLink); // توجيه المستخدم مباشرةً إلى رابط S3
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};





export const lockFile = async (req, res) => {
    try {
        const { accessToken,password } = req.params;
        const file = await File.findOne({ where: { accessToken } });
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await file.update({ locked: true, password: hashedPassword || file.password });
        res.status(200).json({ message: 'File locked successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const unlockFile = async (req, res) => {
    try {
        const { accessToken } = req.params;
        const file = await File.findOne({ where: { accessToken } });
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }
        await file.update({ locked: false, password: null }); // إزالة كلمة المرور عند فك القفل
        res.status(200).json({ message: 'File unlocked successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const searchFiles = async (req, res) => {
    try {
        const { query } = req.query;
        const files = await File.findAll({
            where: {
                [Op.or]: [
                    { title: { [Op.like]: `%${query}%` } },
                    { message: { [Op.like]: `%${query}%` } },
                ],
            },
            include: {
                model: User,
                attributes: ['userName', 'email'],
            },
        });
        res.status(200).json(files);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserFiles = async (req, res) => {
    try {
        // استخرج معرف المستخدم من التوكن
        const { userId } = req.user;

        const files = await File.findAll({
            where: { userId },
            include: {
                model: User,
                attributes: ['userName', 'email'],
            },
        });
        res.status(200).json(files);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getFilesByUserId = async (req, res) => {
    try {
        const { accessToken } = req.params;
        const files = await File.findAll({
            where: { accessToken },
            include: {
                model: User,
                attributes: ['userName', 'email'],
            },
        });
        if (!files) {
            return res.status(404).json({ message: 'Files not found' });
        }
        res.status(200).json(files);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

