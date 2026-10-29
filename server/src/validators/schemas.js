import { z } from "zod";
import { AGENCY_ROLES } from "../constants/roles.js";

// Potongan yang dipakai ulang
const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Format ID tidak valid");
const email = z.string().trim().toLowerCase().email("Format email tidak valid");
const password = z.string().min(8, "Password minimal 8 karakter");
const optionalText = z.string().trim().optional();
// Form HTML mengirim "" untuk kolom yang dikosongkan, jadi string kosong ikut diterima
const optionalDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD")
  .or(z.literal(""))
  .optional();

// Parameter URL
export const idParam = z.object({ id: objectId });
export const organizationIdParam = z.object({ organizationId: objectId });
export const projectIdParam = z.object({ projectId: objectId });

// Body request
// Login hanya mewajibkan password terisi, karena akun lama bisa saja berpassword pendek
export const loginSchema = z.object({ email, password: z.string().min(1, "Password wajib diisi") });

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter"),
  email,
  password,
  role: z.enum(AGENCY_ROLES, { message: "Role tidak valid" }),
});

export const createOrganizationSchema = z.object({
  name: z.string().trim().min(2, "Nama perusahaan minimal 2 karakter"),
  industry: optionalText,
  website: z.string().trim().url("Website harus URL lengkap, contoh https://contoh.com").or(z.literal("")).optional(),
  owner: z.object({
    name: z.string().trim().min(2, "Nama owner minimal 2 karakter"),
    email,
    password,
  }),
});

export const assignAccountManagerSchema = z.object({ accountManagerId: objectId.nullable() }); // null = copot

export const createProjectSchema = z
  .object({
    title: z.string().trim().min(2, "Judul minimal 2 karakter"),
    description: optionalText,
    organization: objectId,
    startDate: optionalDate,
    dueDate: optionalDate,
    team: z.array(objectId).optional(),
  })
  // refine = aturan yang melibatkan beberapa field sekaligus. Tanggal format YYYY-MM-DD
  // bisa dibandingkan sebagai teks karena urutan alfabetnya sama dengan urutan waktunya.
  .refine((d) => !d.startDate || !d.dueDate || d.dueDate >= d.startDate, {
    message: "Tenggat tidak boleh sebelum tanggal mulai",
    path: ["dueDate"],
  });

export const updateProjectStatusSchema = z.object({
  status: z.enum(["planning", "in_progress", "in_review", "completed", "on_hold"], { message: "Status tidak valid" }),
});

export const assignTeamSchema = z.object({ userIds: z.array(objectId) });

const taskStatuses = ["backlog", "in_progress", "in_review", "done", "blocked"];
const taskPriorities = ["low", "medium", "high", "urgent"];

export const createProjectTaskSchema = z.object({
  title: z.string().trim().min(2, "Judul task minimal 2 karakter"),
  description: optionalText,
  status: z.enum(taskStatuses).optional(),
  priority: z.enum(taskPriorities).optional(),
  assignees: z.array(objectId).optional(),
  dueDate: optionalDate,
  acceptanceCriteria: z.array(z.string().trim().min(1)).optional(),
  clientVisible: z.boolean().optional(),
});

export const updateProjectTaskStatusSchema = z.object({
  status: z.enum(taskStatuses, { message: "Status task tidak valid" }),
});

export const createTaskSchema = z.object({
  organization: objectId,
  title: z.string().trim().min(2, "Judul minimal 2 karakter"),
  description: optionalText,
  order: z.number().int().min(0).optional(),
});
