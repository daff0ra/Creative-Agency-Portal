export const checkEnv = () =>{
    for(const key of ["MONGO_URI", "JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"]){
        if(!process.env[key]) throw new Error(`envirovement variabel ${key} belum di isi`);
    
    }

    if(process.env.JWT_ACCESS_SECRET.length < 32 || process.env.JWT_REFRESH_SECRET.length < 32) {
        throw new Error("JWT secret minimal 32 karakter");
    }
};