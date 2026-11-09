
export const authorize = (...allowedRoles) =>{
    return (req,res,next) =>{
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "akses ditolak untuk akun ini"});
        }
        next();
    }
}