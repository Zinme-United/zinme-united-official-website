import { z } from "zod";

export const OurClubSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  mission: z.string().optional(),
  vision: z.string().optional(),
  foundedYear: z.string().optional(),
  stats: z.array(
    z.object({ label: z.string().min(1), value: z.string().min(1) })
  ),
  milestones: z.array(
    z.object({
      year: z.string().min(1),
      title: z.string().min(1),
      desc: z.string().min(1),
    })
  ),
  values: z.array(
    z.object({
      title: z.string().min(1),
      desc: z.string().min(1),
      icon: z.string().optional(),
    })
  ),
  heroImageUrl: z.string().optional(),
  heroPublicId: z.string().optional(),
  ctaText: z.string().optional(),
  ctaLink: z.string().url("Must be a valid URL").optional(),
});

export type OurClubInput = z.infer<typeof OurClubSchema>;
