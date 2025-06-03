// client/src/schemas/activitySchemas.ts
import { z } from "zod";

export const activityFormSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().optional(),
  type: z.enum(["event", "training", "match"], {
    errorMap: (issue, ctx) => {
      if (issue.code === z.ZodIssueCode.invalid_enum_value) {
        return { message: "Invalid activity type." };
      }
      return { message: ctx.defaultError };
    },
  }),
  date: z.string().min(1, "Date is required."), // YYYY-MM-DD format
  time: z.string().optional(),
  location: z.string().min(1, "Location is required."),
  opponent: z.string().optional(),
  result: z.string().optional(),
  isNextMatch: z.boolean().default(false).optional(),
  isFeaturedEvent: z.boolean().default(false).optional(),
  // These fields now expect URLs and public IDs, not File objects
  homeTeamLogoUrl: z.string().optional(),
  homeTeamLogoPublicId: z.string().optional(), // Added for cloudinary public_id
  opponentTeamLogoUrl: z.string().optional(),
  opponentTeamLogoPublicId: z.string().optional(), // Added for cloudinary public_id
});

export type ActivityFormInputs = z.infer<typeof activityFormSchema>;
