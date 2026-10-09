export const errorHandler = (err, req, res, next) =>{
    console.error(err.stack);
    res.status(err.statusCode || 500).json({message: "terjadi kesalahan", error: err.message});
}