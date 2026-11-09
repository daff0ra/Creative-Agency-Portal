import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true, index: true },
  task: { type: mongoose.Schema.Types.ObjectId, ref: "ProjectTask", default: null },
  title: { type: String, required: true, trim: true },
  type: { type: String, enum: ["bug", "change_request", "question"], required: true },
  severity: { type: String, enum: ["low", "medium", "high", "critical"], default: "medium" },
  stepsToReproduce: { type: String, trim: true, default: "" },
  screenshotUrl: { type: String, trim: true, default: "" },
  status: { type: String, enum: ["open", "in_progress", "resolved", "closed"], default: "open", index: true },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

issueSchema.index({ project: 1, severity: 1, status: 1 });
export default mongoose.model("Issue", issueSchema);
