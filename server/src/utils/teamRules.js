import User from "../models/user.model.js"; // sesuaikan dengan nama file model kamu

// Benar hanya jika SEMUA id adalah staff agency aktif. Set menghapus id kembar sebelum dihitung.
export const allActiveAgencyStaff = async (ids) => {
  const unique = [...new Set(ids)];
  const count = await User.countDocuments({ _id: { $in: unique }, userType: "agency", isActive: true });
  return count === unique.length;
};