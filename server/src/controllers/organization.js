import Organization from "../models/Organization.model.js";
import User from "../models/user.model.js";

// export const createOrganization = async (req,res) => {
//     try {
//         const { name, industry, website, owner } = req.body; // owner: { name, email, password }
    
//         if (await User.findOne({ email: owner.email })) {
//           return res.status(400).json({ message: "Email owner sudah terdaftar" });
//         }
    
//         // userType & role ditaruh setelah ...owner supaya nilainya tidak bisa ditimpa dari request
//         const ownerUser = await User.create({ ...owner, userType: "client", role: "CLIENT_OWNER" });

//         try{
//             const organization = await organization.create({
//                 name, industry,website,
//                 owner: ownerUser._id,
//                 accountManager: req.user.role === "ACCOUNT_MANAGER" ? req.user.id : null,
//             });

//             ownerUser.organization = organization._id;
//             await ownerUser.save();

//             res.status(201).json(organization);
//         }
//         catch(err){
//             await User.findByIdAndDelete(ownerUser._id);
//             throw err;
//         }
//     }
    
//     catch (err) {
//     res.status(500).json({ message: "Terjadi kesalahan", error: err.message });
//   }
// }

export const createOrganization = async (req, res) => {
    try {
      const { name, industry, website, owner } = req.body;
  
      if (await User.findOne({ email: owner.email })) {
        return res.status(400).json({ message: "Email owner sudah terdaftar" });
      }
  
      const organization = await Organization.create({
        name, industry, website,
        accountManager: req.user.role === "ACCOUNT_MANAGER" ? req.user.id : null,
      });
  
      try {
        await User.create({
          ...owner, userType: "client", role: "CLIENT_OWNER", organization: organization._id,
        });
      } catch (err) {
        await Organization.findByIdAndDelete(organization._id); // batalkan organization kalau owner gagal dibuat
        throw err;
      }
  
      res.status(201).json(organization);
    } catch (err) {
      res.status(500).json({ message: "Terjadi kesalahan", error: err.message });
    }
  };

export const getOrganizations = async (req, res) => {
    // populate(field, "kolom yang diambil"): ganti ObjectId dengan data user, hanya name & email
    const organizations = await Organization.find()
      .populate("owner", "name email")
      .populate("accountManager", "name email");
    res.json(organizations);
  };
  
  export const getOrganizationById = async (req, res) => {
    const organization = await Organization.findById(req.params.id).populate("owner", "name email");
    if (!organization) return res.status(404).json({ message: "Organization tidak ditemukan" });
  
    // Staff agency boleh lihat semua; client hanya boleh lihat organization miliknya.
    // String() dipakai karena ObjectId dibandingkan sebagai objek, bukan nilai.
    const isAgency = req.user.userType === "agency";
    if (!isAgency && String(req.user.organization) !== String(organization._id)) {
      return res.status(403).json({ message: "Akses ditolak" });
    }
  
    res.json(organization);
  };