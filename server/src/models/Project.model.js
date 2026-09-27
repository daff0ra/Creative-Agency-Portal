// server/src/models/Project.model.js
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },

    // Relasi 1-ke-banyak: SATU Organization bisa punya BANYAK Project.
    // Makanya di sini simpan referensi ke Organization (bukan sebaliknya) —
    // kalau dibalik (Organization.projects = [array]), array itu bisa
    // membengkak tak terbatas dan sulit di-update secara atomic.
    // Pola "simpan referensi di sisi 'banyak'" ini standar di MongoDB,
    // mirip foreign key di tabel anak pada relasi one-to-many SQL.
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    // Relasi banyak-ke-banyak: SATU Project bisa dikerjakan BANYAK staff
    // agency, dan SATU staff bisa mengerjakan BANYAK project.
    // Makanya field ini array of ObjectId, bukan satu ObjectId.
    team: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Siapa agency staff yang membuat project ini —
    // dipakai untuk audit trail / "created by" di UI, bukan untuk akses kontrol.
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["planning", "in_progress", "in_review", "completed", "on_hold"],
      default: "planning",
    },

    startDate: { type: Date, default: null },
    dueDate: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);