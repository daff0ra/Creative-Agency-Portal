// server/src/models/Organization.model.js
import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema(
  {
    industry: { type: String, trim: true },
    website: { type: String, trim: true },
    logo: { type: String, default: null },

    // sudah dibuat dengan mengecek organisasi yang langsung masuk ke salah satu akun user
    // owner: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User"
    //   required: true,
    //   unique: true,
    // },

    // Status onboarding client — akan kita pakai nanti untuk
    // menentukan tampilan progress bar & task checklist di frontend
    onboardingStatus: {
      type: String,
      enum: ["invited", "in_progress", "completed"],
      default: "invited",
    },

    // Relasi ke User (role: ACCOUNT_MANAGER) di pihak agency.
    // Ini yang menjawab pertanyaan "siapa staff agency yang
    // bertanggung jawab menangani client ini?"
    accountManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true, toJSON: { virtuals: true} }

);

organizationSchema.virtual("owner", {
  ref: "User",
  localField: "_id",
  foreignField: "organization",
  justOne: true,
  match: {role: "CLIENT_OWNER"}
});
export default mongoose.model("Organization", organizationSchema);