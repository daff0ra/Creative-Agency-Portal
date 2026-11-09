import mongoose from "mongoose";

const projectTaskSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["backlog", "in_progress", "in_review", "done", "blocked"],
      default: "backlog",
    },
    priority: { type: String, enum: ["low", "medium", "high", "urgent"], default: "medium" },
    assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dueDate: { type: Date, default: null },
    acceptanceCriteria: [{ type: String, trim: true }],
    clientVisible: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

projectTaskSchema.index({ project: 1, status: 1, dueDate: 1 });

export default mongoose.model("ProjectTask", projectTaskSchema);
