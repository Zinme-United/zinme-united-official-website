import { z } from "zod";

export const newsFormSchema = z.object({
  title: z.string().min(1, "Title is required."),
  content: z.string().min(1, "Content is required."),
  author: z.string().min(1, "Author is required."),
  imageUrl: z.string().optional(),
  imagePublicId: z.string().optional(),
  publishedAt: z.string().min(1, "Published Date is required."),
  tags: z.union([z.string(), z.array(z.string())]).optional(), // Allow flexibility
  isFeatured: z.boolean().default(false).optional(),
});

export type NewsFormInputs = z.infer<typeof newsFormSchema>;
