import { z } from "zod";

// Zod schema for PlayerStats
const playerStatsSchema = z.object({
  appearances: z
    .number()
    .int()
    .min(0, "Appearances must be a non-negative integer"),
  goals: z.number().int().min(0, "Goals must be a non-negative integer"),
  assists: z.number().int().min(0, "Assists must be a non-negative integer"),
  cleanSheets: z
    .number()
    .int()
    .min(0, "Clean Sheets must be a non-negative integer"),
});

// Zod schema for PlayerSocial (optional fields with optional URLs)
const playerSocialSchema = z.object({
  facebook: z
    .string()
    .url("Must be a valid Facebook URL")
    .or(z.literal(""))
    .optional(),
  twitter: z
    .string()
    .url("Must be a valid Twitter URL")
    .or(z.literal(""))
    .optional(),
  instagram: z
    .string()
    .url("Must be a valid Instagram URL")
    .or(z.literal(""))
    .optional(),
});

// Main Zod schema for Player form data
export const playerFormSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  number: z
    .number()
    .int()
    .positive("Number must be a positive integer")
    .min(1, "Number must be at least 1")
    .max(99, "Number cannot exceed 99"),
  position: z.string().min(1, "Position is required"),
  img: z
    .string()
    .url("Must be a valid image URL")
    .min(1, "Image URL is required"),
  bio: z.string().min(10, "Biography must be at least 10 characters"),
  gender: z.enum(["Male", "Female"], {
    message: "Gender must be Male or Female",
  }),
  stats: playerStatsSchema,
  social: playerSocialSchema.optional(),
});

export type PlayerFormData = z.infer<typeof playerFormSchema>;
