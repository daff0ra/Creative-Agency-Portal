import User from "../models/user.model.js"
import {generateAccessToken, generateRefreshToken} from "../utils/generateTokens.js"

export const registerUser = async (req, res) =>{
    try{
        const {name, email, password, userType, role} = req.body;

        const existingUser = await User.findOne({email});
        if(existingUser) return res.status(400).json({message: "Email sudah terdaftar"});

        const user = await User.create({ name, email, password, userType, role});
        
        res.status(201).json({message: "registrasi berhasil", userId: user._id});
    }
    catch(err){
        res.status(500).json({message:"terjadi kesalahan", error: err.message})
    }
}

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

        res.cookie("refreshhToken", refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000});

        res.status(200).json({
            accessToken,
            user: {id: user._id, name: user.name, email: user.email, role: user.role, userType: user.userType}
        });
    }
    catch(err){
        res.status(500).json({ message: "Terjadi kesalahan", error: err.message});
    }
}