import mongoose from "mongoose";

export const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('database terhubung');
        console.log("Database:", mongoose.connection.name);
    }
    catch(err){
        console.error("Gagal konek MongoDB:", err.message);
        process.exit(1);
    }
}