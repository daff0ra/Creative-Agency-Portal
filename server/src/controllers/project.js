import Project from "../models/Project.model.js"
import Organization from "../models/Organization.model.js";
import ProjectTask from "../models/ProjectTask.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import { allActiveAgencyStaff } from "../utils/teamRules.js";

export const createProject = async (req, res) => {
    try {
      const { title, description, organization, startDate, dueDate, team = [] } = req.body;
  
      if (!(await allActiveAgencyStaff(team))) { // di assignTeam: userIds
        return res.status(400).json({ message: "Semua anggota tim harus staff agency yang aktif" });
      }

      const orgExists = await Organization.findById(organization);
      if (!orgExists) return res.status(404).json({ message: "Organization tidak ditemukan" });
  
      const project = await Project.create({
        title, description, organization, startDate, dueDate,
        createdBy: req.user.id,
        team: [...new Set([req.user.id, ...team])],
      });
  
      res.status(201).json(project);
    } catch (err) {
      res.status(500).json({ message: "Terjadi kesalahan", error: err.message });
    }
};

export const getProjectByOrganization = async (req,res) =>{
    const {organizationId} = req.params;

    // cek agency dan id usernya yang harus sesusai
    const isAgency = req.user.userType === "agency";
    if(!isAgency && String(req.user.organization) !== organizationId){
        return res.status(403).json({message : "akses ditolak"})
    }

    const projects = await Project.find({ organization: organizationId }).populate("team", "name email");
    res.json(projects);
}

export const listAgencyProjects = asyncHandler(async (req, res) => {
    const filter = req.user.role === "STAFF" ? { team: req.user.id } : {};
    const projects = await Project.find(filter)
        .populate("organization", "name")
        .populate("team", "name email")
        .sort({ updatedAt: -1 });

    const taskCounts = await ProjectTask.aggregate([
        { $match: { project: { $in: projects.map((project) => project._id) } } },
        { $group: {
            _id: "$project",
            taskCount: { $sum: 1 },
            completedTaskCount: { $sum: { $cond: [{ $eq: ["$status", "done"] }, 1, 0] } },
        } },
    ]);
    const countsByProject = new Map(taskCounts.map((item) => [String(item._id), item]));

    res.json(projects.map((project) => ({
        ...project.toObject(),
        taskCount: countsByProject.get(String(project._id))?.taskCount || 0,
        completedTaskCount: countsByProject.get(String(project._id))?.completedTaskCount || 0,
    })));
});

export const updateProjectStatus = async (req,res) =>{
    const {status} = req.body;

    const project = await Project.findById(req.params.id);
    if(!project) return res.status(404).json({message:"Project tidak ditemukan"});

    const isMember = project.team.some((userId) => String(userId) === req.user.id);
    if(!isMember) return res.status(403).json({ message: "Kamu bukan anggota projek"});

    project.status = status;
    await project.save();
    res.json(project);
}

export const assignTeam = async (req,res) =>{
    const {userIds} = req.body;
    
    if (!(await allActiveAgencyStaff(userIds))) {
      return res.status(400).json({ message: "Semua anggota tim harus staff agency yang aktif" });
    }
    const project = await Project.findByIdAndUpdate(
        req.params.id,
        {team: userIds},
        {new: true}
    ).populate("team", "name email");
    
    if(!project) return res.status(404).json({message: "Project tidak ditemukan"});
    res.json(project);
}
