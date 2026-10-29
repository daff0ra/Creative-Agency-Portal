import Project from "../models/Project.model.js";
import ProjectTask from "../models/ProjectTask.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { allActiveAgencyStaff } from "../utils/teamRules.js";

const MANAGER_ROLES = ["SUPER_ADMIN", "ADMIN", "ACCOUNT_MANAGER"];

const getAccessibleProject = async (projectId, user) => {
  const project = await Project.findById(projectId);
  if (!project) return { error: { status: 404, message: "Project tidak ditemukan" } };

  const isManager = user.userType === "agency" && MANAGER_ROLES.includes(user.role);
  const isTeamMember = user.userType === "agency" && project.team.some((id) => String(id) === String(user.id));
  const isClient = user.userType === "client" && String(user.organization) === String(project.organization);

  if (!isManager && !isTeamMember && !isClient) {
    return { error: { status: 403, message: "Akses ditolak" } };
  }

  return { project, isManager, isTeamMember, isClient };
};

export const listProjectTasks = asyncHandler(async (req, res) => {
  const access = await getAccessibleProject(req.params.projectId, req.user);
  if (access.error) return res.status(access.error.status).json({ message: access.error.message });

  const filter = { project: access.project._id };
  if (access.isClient) filter.clientVisible = true;
  const tasks = await ProjectTask.find(filter)
    .populate("assignees", "name email")
    .sort({ dueDate: 1, createdAt: 1 });
  res.json(tasks);
});

export const createProjectTask = asyncHandler(async (req, res) => {
  const access = await getAccessibleProject(req.params.projectId, req.user);
  if (access.error) return res.status(access.error.status).json({ message: access.error.message });
  if (!access.isManager) return res.status(403).json({ message: "Hanya pengelola agency yang dapat membuat task" });

  const { assignees = [] } = req.body;
  const uniqueAssignees = [...new Set(assignees)];
  const projectTeamIds = new Set(access.project.team.map(String));
  if (uniqueAssignees.some((id) => !projectTeamIds.has(id))) {
    return res.status(400).json({ message: "Assignee harus menjadi anggota tim project" });
  }
  if (!(await allActiveAgencyStaff(uniqueAssignees))) {
    return res.status(400).json({ message: "Assignee harus staff agency yang aktif" });
  }

  const task = await ProjectTask.create({
    ...req.body,
    project: access.project._id,
    assignees: uniqueAssignees,
    dueDate: req.body.dueDate || null,
    createdBy: req.user.id,
  });
  await task.populate("assignees", "name email");
  res.status(201).json(task);
});

export const updateProjectTaskStatus = asyncHandler(async (req, res) => {
  const task = await ProjectTask.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task tidak ditemukan" });

  const access = await getAccessibleProject(task.project, req.user);
  if (access.error) return res.status(access.error.status).json({ message: access.error.message });
  const isAssignee = task.assignees.some((id) => String(id) === String(req.user.id));
  if (access.isClient || (!access.isManager && !isAssignee)) {
    return res.status(403).json({ message: "Hanya pengelola atau assignee task yang dapat mengubah status" });
  }

  task.status = req.body.status;
  task.updatedBy = req.user.id;
  await task.save();
  await task.populate("assignees", "name email");
  res.json(task);
});
