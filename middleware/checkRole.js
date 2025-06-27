const checkRole = (requiredRole) => {
    return (req, res, next) => {
        const user = req.user; // يفترض أن `req.user` يحتوي على بيانات المستخدم بعد المصادقة

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (user.role !== requiredRole) {
            return res.status(403).json({ message: "Forbidden: You don't have permission" });
        }

        next(); 
    };
};

export default checkRole;
