import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AGENCY_ROLES } from "../constants/roles.js";

export const listStaff = asyncHandler(async (req, res) => {
  const filter = { userType: "agency", isActive: true };

  if (req.query.role) {
    // includes() sekaligus memastikan nilainya string yang dikenal, bukan objek aneh dari query string
    if (!AGENCY_ROLES.includes(req.query.role)) {
      return res.status(400).json({ message: "Role tidak valid" });
    }
    filter.role = req.query.role;
  }

  const staff = await User.find(filter).select("name email role").sort("name");
  res.json(staff);
});