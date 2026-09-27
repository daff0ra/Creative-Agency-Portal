import jwt from "jsonwebtoken"

export const authenticate  = (req, res, next) =>{
    const autHeader = req.headers.authorization;
    if(!autHeader?.startsWith("Bearer ")){
        return res.status(401).json({ message: "Token tidak ditemukan"});
    }
    const token = autHeader.split(' ')[1];

    try{
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = decoded;
        next()
    }
    catch(err){
        return res.status(401).json({ message: "Token tidak valid atau kadaluarsa"});
    }
}