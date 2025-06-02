import { z } from "zod";
const ActivityTypesEnum = {
  event: "event",
  training: "training",
  match: "match",
} as const;

export const activityFormSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().optional(),
  type: z.nativeEnum(ActivityTypesEnum, {
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
});

export type ActivityFormInputs = z.infer<typeof activityFormSchema>;
