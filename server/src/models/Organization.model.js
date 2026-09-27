// server/src/models/Organization.model.js
import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    industry: { type: String, trim: true },
    website: { type: String, trim: true },
    logo: { type: String, default: null },

    // Relasi 1-ke-1 ke User (role: CLIENT_OWNER).
    // `unique: true` memastikan satu User cuma bisa jadi owner
    // dari SATU Organization — mencegah 1 owner dobel pegang 2 perusahaan.
    // Karena field ini cuma menyimpan 1 ObjectId (bukan array),
    // secara struktur data pun Organization otomatis cuma punya 1 owner.
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

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
  { timestamps: true }
);

export default mongoose.model("Organization", organizationSchema);