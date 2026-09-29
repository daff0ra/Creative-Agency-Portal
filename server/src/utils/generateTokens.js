import jwt from "jsonwebtoken";

export const generateAccessToken = (user) =>{
    return jwt.sign(
        {
            id: user._id,
            userType: user.userType,
            role: user.role,
            organization: user.organization
        }, process.env.JWT_ACCESS_SECRET,
        {expiresIn: "15m"}
    )
}
export const generateRefreshToken = (user) =>{
    return jwt.sign({id: user._id}, process.env.JWT_REFRESH_SECRET, {expiresIn: "7d"})
};
