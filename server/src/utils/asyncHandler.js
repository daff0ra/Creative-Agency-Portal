// Terima function controller, kembalikan versi yang otomatis menangkap error.
// Kalau controller melempar error/promise reject, .catch(next) meneruskannya
// ke middleware error handler — tidak pernah lagi menggantung tanpa response.
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };