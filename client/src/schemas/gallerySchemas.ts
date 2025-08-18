import { z } from "zod";

export const galleryFormSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().optional(),
  eventDate: z.string().optional(),
  category: z.enum(["match", "activity"], {
    required_error: "Category is required",
    invalid_type_error: "Category must be 'match' or 'activity'",
  }),
});

export type GalleryFormInputs = z.infer<typeof galleryFormSchema>;
