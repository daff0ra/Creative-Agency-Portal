import mongoose from "mongoose";

export const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('database terhubung');
    }
    catch(err){
        console.error("Gagal konek MongoDB:", err.message);
        process.exit(1);
    }
}