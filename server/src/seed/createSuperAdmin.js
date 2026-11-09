import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/user.model.js"; // sesuaikan dengan nama file model kamu

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const { SEED_ADMIN_EMAIL: email, SEED_ADMIN_PASSWORD: password } = process.env;
  if (!email || !password) throw new Error("Isi SEED_ADMIN_EMAIL dan SEED_ADMIN_PASSWORD di .env");

  if (await User.findOne({ email })) {
    console.log("Super admin sudah ada, tidak ada yang diubah");
  } else {
    await User.create({ name: "Super Admin", email, password, userType: "agency", role: "SUPER_ADMIN" });
    console.log("Super admin dibuat:", email);
  }

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err.message);
  process.exit(1);
});