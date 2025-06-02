import { z } from "zod";

export const galleryFormSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().optional(),
  eventDate: z.string().optional(),
});

export type GalleryFormInputs = z.infer<typeof galleryFormSchema>;
