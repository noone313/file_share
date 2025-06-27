import pkg from 'jsonwebtoken';
const { verify } = pkg;
import dotenv from 'dotenv';
dotenv.config();

// Middleware للتحقق من التوكن
const authenticate = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Authentication required" });
    }

    verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }
        req.user = decoded; 
        next();
    });
};

export default authenticate;
