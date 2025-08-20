import mongoose, { Document, Schema } from "mongoose";

export interface IOurClubStat {
  label: string;
  value: string;
}

export interface IOurClubMilestone {
  year: string; // keep string so you can do "2024–2025"
  title: string;
  desc: string;
}

export interface IOurClubValue {
  title: string;
  desc: string;
  icon?: string; // lucide-react icon name (optional)
}

export interface IOurClub extends Document {
  title: string; // "About Zinme United"
  subtitle?: string; // short tagline
  description?: string; // intro paragraph
  mission?: string;
  vision?: string;
  foundedYear?: string;
  stats: IOurClubStat[];
  milestones: IOurClubMilestone[];
  values: IOurClubValue[];
  heroImageUrl?: string;
  heroPublicId?: string; // Cloudinary public id
  ctaText?: string;
  ctaLink?: string;
}

const StatSchema = new Schema<IOurClubStat>(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const MilestoneSchema = new Schema<IOurClubMilestone>(
  {
    year: { type: String, required: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
  },
  { _id: false }
);

const ValueSchema = new Schema<IOurClubValue>(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    icon: { type: String },
  },
  { _id: false }
);

const OurClubSchema = new Schema<IOurClub>(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    description: { type: String },
    mission: { type: String },
    vision: { type: String },
    foundedYear: { type: String },
    stats: { type: [StatSchema], default: [] },
    milestones: { type: [MilestoneSchema], default: [] },
    values: { type: [ValueSchema], default: [] },
    heroImageUrl: { type: String },
    heroPublicId: { type: String },
    ctaText: { type: String },
    ctaLink: { type: String },
  },
  { timestamps: true }
);

OurClubSchema.index({ _id: 1 });

const OurClub = mongoose.model<IOurClub>("OurClub", OurClubSchema);
export default OurClub;
