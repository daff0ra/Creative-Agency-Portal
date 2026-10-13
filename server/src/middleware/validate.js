
// Function factory seperti authorize(): validate(schema) mengembalikan middleware.
// source menentukan bagian request yang diperiksa: "body" (default) atau "params".

export const validate = (schema, source = "body") => (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if(!result.succes){
        return res.status(400).json({
            message: "data tidak valid",
            errors: result.error.issues.map((i) => ({ field: i.path.join("."), 
                message: i.message})),
        });
    }
 
   // Body diganti dengan data bersih: field yang tidak ada di schema dibuang otomatis.
  // Ini juga menutup celah mass assignment (mengirim field tambahan seperti isActive atau role).
    if(source === "body") req.body = result.data;
    next()
}