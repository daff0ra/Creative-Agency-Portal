import Organization from "../models/Organization.model.js";
import Project from "../models/Project.model.js";
import OnboardingTask from "../models/OnboardingTask.model.js";
import {asyncHandler} from "../utils/asyncHandler.js";

export const getSummary = asyncHandler(async (req,res) =>{
    const [orgByStatus, projectByStatus, pendingTasks] = await Promise.all([
        Organization.aggregate([{ $group: { _id: "$onboardingStatus", count: { $sum: 1 } } }]),
        Project.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
        OnboardingTask.countDocuments({ isCompleted: false }),
      ]);

    // Ubah [{ _id: "invited", count: 2 }] menjadi { invited: 2 } supaya mudah dibaca frontend
    const toMap = (rows) => Object.fromEntries(rows.map((r) => [r._id, r.count]));

    res.json({ organization: toMap(orgByStatus), projects: toMap(projectByStatus), pendingTasks});
})
