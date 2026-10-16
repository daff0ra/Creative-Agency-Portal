
// Function factory seperti authorize(): validate(schema) mengembalikan middleware.
// source menentukan bagian request yang diperiksa: "body" (default) atau "params".

export const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
  
    if (!result.success) {
      return res.status(400).json({
        message: "Validasi gagal",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }
  
    req.body = result.data;
    next();
  };