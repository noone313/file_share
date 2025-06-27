import { User } from "../models/models.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from "dotenv";
config();


export const getAllUsers = async (req,res) => {

    try {

        const { page , limit, offset } = req.pagination;

        const { count , rows} = await User.findAndCountAll({

            limit,
            offset,
            order:[['createdAt', 'DESC']],
            attributes: ['userId', 'userName', 'email','role', 'createdAt'],
        });


        res.status(200).json({
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            items: rows,
                });


    } catch (error) {
        res.status(500).json({message : error});
    }
}


export const getUserById = async (req,res)=>{


    try {

        const { userId } = req.params;

        const user = await User.findByPk(userId,{
            attributes: ['userId', 'userName', 'email','role', 'createdAt'],
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
        
    } catch (error) {
        res.status(500).json({message : error});
    }
}



export const createUser = async (req,res)=>{

    try {

        const { userName, email, password } = req.body;


        if (!userName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }


        const saltRounds = 10;

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        



        const user = await User.create({
            userName,
            email,
            password: hashedPassword,
            role:'user',
        });

        res.status(201).json(user);
        
    } catch (error) {
        res.status(500).json({message : error});
    }
}


export const updateUser = async (req,res)=> {

    try {

        const { userId } = req.params;
        const { userName, email, password } = req.body;


        if (!userName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }


        const saltRounds = 10;

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        const user = await User.findOne({ where: { userId } });
        if (!user) {
            return res.status(404).json({ message: 'user not found' });
        }


        await User.update({
            userName : userName || user.userName,
            email : email || user.email,
            password : password || user.password,
        },{
            where:{userId},
            returning:true,
        });

        res.status(200).json(user);
        
    } catch (error) {
        res.status(500).json({message : error});
        
    }
}

export const deleteUser = async (req,res)=>{

    try {

        const { userId } = req.params;

        const user = await User.findByPk(userId,{
            attributes: ['userId', 'userName', 'email','role', 'createdAt'],
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }


        await User.destroy({
            where:{userId},
        });

        res.status(200).json({message : "User deleted successfully"});
        
    } catch (error) {
        res.status(500).json({message : error});
        
    }
}


export const loginUser = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: "Request body is missing" });
        }

        const { email, password } = req.body;

        // التحقق من وجود جميع الحقول
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // البحث عن المستخدم
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // مقارنة كلمة المرور
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // إنشاء التوكن
        const token = jwt.sign(
            { userId: user.userId, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        // تخزين التوكن في الكوكيز
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 يوم
        });

        // إرسال الاستجابة الناجحة
        res.json({
            message: "Login successful",
            user: {
                userId: user.userId,
                email: user.email,
                role: user.role,
            },
            token,
        });

    } catch (error) {
        res.status(500).json({ message: error.message || "Server error" });
    }
};
