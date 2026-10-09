import mongoose from "mongoose";

const onboardingTaskSchema = new mongoose.Schema(
  {
    // Setiap task "milik" satu Organization — sama seperti Project,
    // satu Organization bisa punya banyak task checklist.
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    title: { type: String, required: true, trim: true }, // contoh: "Upload logo perusahaan"
    description: { type: String, trim: true },

    isCompleted: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },

    // Urutan tampil di checklist (task 1, 2, 3, ...)
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("OnboardingTask", onboardingTaskSchema);