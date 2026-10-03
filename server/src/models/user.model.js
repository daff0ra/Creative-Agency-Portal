// first entry
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },

    userType: {
      type: String,
      enum: ["agency", "client"],
      required: true,
    },
    role: {
      type: String,
      enum: ["SUPER_ADMIN", "ADMIN", "ACCOUNT_MANAGER", "CLIENT_OWNER", "CLIENT_MEMBER"],
      required: true,
    },

    // Diisi hanya jika userType === "client"
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      default: null,
    },

    avatar: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    refreshToken: { type: String, select: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return; 
  this.password = await bcrypt.hash(this.password, 10);
});

// Method ini nempel di setiap instance User (misal: user.comparePassword(...)).
// Dipakai saat login: bandingkan password yang diketik user dengan hash di DB.
userSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

export default mongoose.model("User", userSchema);