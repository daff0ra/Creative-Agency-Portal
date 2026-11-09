import Issue from "../models/Issue.model.js";
import Project from "../models/Project.model.js";
import ProjectTask from "../models/ProjectTask.model.js";
import { allActiveAgencyStaff } from "../utils/teamRules.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const MANAGERS = ["SUPER_ADMIN", "ADMIN", "ACCOUNT_MANAGER"];
const accessFor = async (projectId, user) => {
  const project = await Project.findById(projectId);
  if (!project) return { error: [404, "Project tidak ditemukan"] };
  const manager = user.userType === "agency" && MANAGERS.includes(user.role);
  const member = user.userType === "agency" && project.team.some((id) => String(id) === String(user.id));
  const client = user.userType === "client" && String(user.organization) === String(project.organization);
  return manager || member || client ? { project, manager, member, client } : { error: [403, "Akses ditolak"] };
};
const populate = (query) => query.populate({ path: "project", select: "title organization team", populate: { path: "team", select: "name email" } }).populate("assignee", "name email").populate("createdBy", "name").populate("task", "title status");

export const listIssues = asyncHandler(async (req, res) => {
  let projectIds;
  if (req.user.userType === "client") {
    const projects = await Project.find({ organization: req.user.organization }).select("_id");
    projectIds = projects.map((project) => project._id);
  } else {
    const filter = req.user.role === "STAFF" ? { team: req.user.id } : {};
    const projects = await Project.find(filter).select("_id");
    projectIds = projects.map((project) => project._id);
  }
  const filter = { project: { $in: projectIds } };
  if (req.query.status) filter.status = req.query.status;
  if (req.query.severity) filter.severity = req.query.severity;
  res.json(await populate(Issue.find(filter)).sort({ updatedAt: -1 }));
});

export const createIssue = asyncHandler(async (req, res) => {
  const access = await accessFor(req.body.project, req.user);
  if (access.error) return res.status(access.error[0]).json({ message: access.error[1] });
  const issue = await Issue.create({ ...req.body, createdBy: req.user.id });
  res.status(201).json(await populate(Issue.findById(issue._id)));
});

export const updateIssue = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id);
  if (!issue) return res.status(404).json({ message: "Issue tidak ditemukan" });
  const access = await accessFor(issue.project, req.user);
  if (access.error) return res.status(access.error[0]).json({ message: access.error[1] });
  if (access.client || (!access.manager && !access.member)) return res.status(403).json({ message: "Hanya tim project yang dapat memperbarui issue" });
  if (req.body.assignee && (!access.project.team.some((id) => String(id) === String(req.body.assignee)) || !(await allActiveAgencyStaff([req.body.assignee])))) {
    return res.status(400).json({ message: "Penanggung jawab harus staff aktif di tim project" });
  }
  Object.assign(issue, req.body);
  await issue.save();
  res.json(await populate(Issue.findById(issue._id)));
});

export const convertIssueToTask = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id);
  if (!issue) return res.status(404).json({ message: "Issue tidak ditemukan" });
  const access = await accessFor(issue.project, req.user);
  if (access.error) return res.status(access.error[0]).json({ message: access.error[1] });
  if (!access.manager) return res.status(403).json({ message: "Hanya pengelola agency yang dapat membuat task dari issue" });
  if (issue.task) return res.status(409).json({ message: "Issue ini sudah terhubung ke task" });
  const task = await ProjectTask.create({ project: issue.project, title: issue.title, description: issue.stepsToReproduce, priority: issue.severity === "critical" ? "urgent" : issue.severity === "high" ? "high" : issue.severity === "low" ? "low" : "medium", createdBy: req.user.id });
  issue.task = task._id;
  issue.status = "in_progress";
  await issue.save();
  res.status(201).json(await populate(Issue.findById(issue._id)));
});
