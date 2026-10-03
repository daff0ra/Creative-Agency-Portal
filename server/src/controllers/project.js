import Project from "../models/Project.model.js"
import Organization from "../models/Organization.model.js";

export const createProject = async (req, res) => {
    try {
      const { title, description, organization, startDate, dueDate, team = [] } = req.body;
  
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

export const assiggnTeam = async (req,res) =>{
    const {userIds} = req.body;

    const project = await Project.findByIdAndUpdate(
        req.params.id,
        {team: userIds},
        {new: true}
    ).populate("team", "name email");
    
    if(!project) return res.status(404).json({message: "Project tidak ditemukan"});
    res.json(project);
}