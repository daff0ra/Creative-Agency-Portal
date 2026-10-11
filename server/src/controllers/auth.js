import User from "../models/user.model.js"
import {generateAccessToken, generateRefreshToken} from "../utils/generateTokens.js"
import jwt from "jsonwebtoken"

import {asyncHandler} from "../utils/asyncHandler.js"
import { AGENCY_ROLES, ROLE_RANK } from "../constants/roles.js"

export const registerUser = asyncHandler( async (req, res) =>{
        const {name, email, password, role} = req.body;

        if(!AGENCY_ROLES.includes(role)){
            return res.status(400).json({message: "Role tidak valid untuk akun staff"})
        }

        const myRank = ROLE_RANK[req.user.role];
        if (!myRank || ROLE_RANK[role] <= myRank) {
            return res.status(403).json({ message: "Tidak boleh membuat akun dengan role setara atau di atas role Anda" });
          }
        
          if (await User.findOne({ email })) {
            return res.status(400).json({ message: "Email sudah terdaftar" });
          }
        
          const user = await User.create({ name, email, password, userType: "agency", role });
          res.status(201).json({ message: "Registrasi berhasil", userId: user._id });
    }
)

export const loginUser = async (req,res) =>{
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email}).select("+password");
        if(!user) return res.status(401).json({message: "email atau password yang di isikan salah"});

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({message: "email atau password yang di isikan salah"});

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);


        // refresh disimpan di db agar tidak dapat revoke token lama
        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000});

        res.status(200).json({
            accessToken,
            user: {id: user._id, name: user.name, email: user.email, role: user.role, userType: user.userType, organization: user.organization}
        });
    }
    catch(err){
        res.status(500).json({ message: "Terjadi kesalahan", error: err.message});
    }
}

export const refreshAccessToken = async (req,res) =>{
    const token = req.cookies.refreshToken;
    if(!token) return res.status(401).json({message: "Refresh token tidak ditemukan"});

    let decoded;
    try{
        decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    }catch{
        return res.status(401).json({message: "refresh token tidak valid atau kadaluarsa"})
    }
    const user = await User.findById(decoded.id).select("+refreshToken");
    if(!user || user.refreshToken !== token){
        return res.status(401).json({message: "refresh token tidak valid"});
    }
    res.json({ accessToken: generateAccessToken(user),
    user: { id: user._id, name: user.name, email: user.email, role: user.role, userType: user.userType, organization: user.organization }
    });
}

export const logoutUser = async (req,res) =>{
    const token = req.cookies.refreshToken;

    if(token) {
        await User.findOneAndUpdate({refreshToken: token}, {refreshToken: null});
    }
    res.clearCookie("refreshToken");
    res.json({message: "logout berhasil"});
}