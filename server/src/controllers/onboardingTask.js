import OnboardingTask from "../models/OnboardingTask.model.js"
import Organization from "../models/Organization.model.js"

export const createTask = async (req,res) =>{
    const { organization, title, description, order = 0} = req.body;

    const orgExist = await Organization.findById(organization);
    if(!orgExist) return res.status(404).json({message : "Organisasi tidak ditemukan"});

    const task = await OnboardingTask.create({organization, title, description,order});
    res.status(201).json(task);
}

export const getTasksByOrganization = async (req, res) => {
    try {
      const { organizationId } = req.params;
  
      const isAgency = req.user.userType === "agency";
      if (!isAgency && String(req.user.organization) !== organizationId) {
        return res.status(403).json({ message: "Akses ditolak" });
      }
  
      const tasks = await OnboardingTask.find({ organization: organizationId }).sort("order");
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ message: "Terjadi kesalahan", error: err.message });
    }
  };
export const completeTask = async (req,res) =>{
    const task = await OnboardingTask.findById(req.params.id);
    if(!task) return res.status(404).json({message: "task tidak ditemukan"});

    // Client cuma boleh centang task milik organization-nya sendiri
    const isAgency = req.user.userType === "agency";
    if(!isAgency && String(req.user.organization) !== String(task.organization))
    {
        return res.status(403).json({message: "akses ditolak"});
    }

    task.isCompleted = true;
    task.completedAt = new Date();
    await task.save();

    const remaining = await OnboardingTask.countDocuments({ organization: task.organization, isCompleted: false });
    await Organization.findByIdAndUpdate(task.organization, {
    onboardingStatus: remaining === 0 ? "completed" : "in_progress",
    });
    res.json(task);
}
