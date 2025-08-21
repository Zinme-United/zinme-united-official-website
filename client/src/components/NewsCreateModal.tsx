// client/src/components/NewsModal.tsx
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { News, NewsCreateUpdatePayload } from "../types";
import { newsFormSchema, type NewsFormInputs } from "../schemas/newsSchemas";
import useNews from "../hooks/useNews"; // Import useNews hook
import { toast } from "react-toastify"; // For notifications
import Loader from "./Loader";

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingNews: News | null;
  onSubmit: (data: NewsCreateUpdatePayload) => Promise<void>;
  isSubmitting: boolean;
}

const NewsModal: React.FC<NewsModalProps> = ({
  isOpen,
  onClose,
  editingNews,
  onSubmit,
  isSubmitting,
}) => {
  const { uploadNewsImageMutation } = useNews(); // Get the image upload mutation
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isImageUploading, setIsImageUploading] = useState(false); // Local loading state for image upload

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<NewsFormInputs>({
    resolver: zodResolver(newsFormSchema),
    defaultValues: {
      title: "",
      content: "",
      author: "",
      imageUrl: "",
      imagePublicId: "",
      publishedAt: "",
      tags: "", // Default for tags as a string
      isFeatured: false,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (editingNews) {
        reset({
          title: editingNews.title,
          content: editingNews.content,
          author: editingNews.author,
          imageUrl: editingNews.imageUrl || "",
          imagePublicId: editingNews.imagePublicId || "",
          publishedAt: editingNews.publishedAt
            ? new Date(editingNews.publishedAt).toISOString().split("T")[0]
            : "",
          tags: editingNews.tags?.join(", ") || "", // Join tags array to a string
          isFeatured: editingNews.isFeatured || false,
        });
        setImagePreviewUrl(editingNews.imageUrl || null);
      } else {
        reset();
        setImagePreviewUrl(null);
      }
      setImageFile(null); // Clear file input state
      const fileInput = document.getElementById(
        "imageFile"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = ""; // Clear file input visually
    }
  }, [isOpen, editingNews, reset, setValue]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreviewUrl(null); // Clear preview if file is unselected
    }
  };

  const handleClearImage = () => {
    setImageFile(null);
    setImagePreviewUrl(null);
    setValue("imageUrl", ""); // Clear URL in form data
    setValue("imagePublicId", ""); // Clear publicId in form data
    const fileInput = document.getElementById("imageFile") as HTMLInputElement;
    if (fileInput) fileInput.value = ""; // Clear file input visually
  };

  const onFormSubmit = async (data: NewsFormInputs) => {
    setIsImageUploading(true); // Start image upload indicator

    const finalData: NewsCreateUpdatePayload = { ...data };

    try {
      // Handle image upload if a new file is selected
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile); // 'image' must match backend multer field name
        const result = await uploadNewsImageMutation.mutateAsync(formData);

        if (result.status && result.data) {
          finalData.imageUrl = result.data.imageUrl;
          finalData.imagePublicId = result.data.publicId;
        } else {
          toast.error(result.message || "Failed to upload image.");
          setIsImageUploading(false);
          return; // Stop submission if upload fails
        }
      } else if (editingNews && editingNews.imageUrl && !imagePreviewUrl) {
        // If there was an existing image but it's now cleared
        finalData.imageUrl = "";
        finalData.imagePublicId = "";
      }

      // Convert tags string to array
      if (typeof finalData.tags === "string") {
        finalData.tags = finalData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0);
      }

      await onSubmit(finalData);
    } catch (error) {
      console.error("Error during image upload or news submission:", error);
      toast.error("An error occurred during news submission.");
    } finally {
      setIsImageUploading(false); // End image upload indicator
    }
  };

  if (!isOpen) return null;

  const isLoading = isSubmitting || isImageUploading;

  return (
    <div className="fixed inset-0 bg-[#003b75] bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 md:p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 cursor-pointer right-4 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-full p-2 transition-colors duration-200"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            {editingNews ? "Edit News Article" : "Add New News Article"}
          </h2>

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-[#003b75] mb-1"
              >
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                {...register("title")}
                className="w-full p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003b75]"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-[#003b75] mb-1"
              >
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                {...register("content")}
                rows={5}
                className="w-full p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003b75]"
              ></textarea>
              {errors.content && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.content.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="author"
                className="block text-sm font-medium text-[#003b75] mb-1"
              >
                Author <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="author"
                {...register("author")}
                className="w-full p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003b75]"
              />
              {errors.author && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.author.message}
                </p>
              )}
            </div>

            {/* Image Upload Field */}
            <div className="md:col-span-2">
              <label
                htmlFor="imageFile"
                className="block text-sm font-medium text-[#003b75] mb-1"
              >
                News Image
              </label>
              <input
                type="file"
                id="imageFile"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003b75] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#003b75] file:text-white"
              />
              {(imagePreviewUrl || editingNews?.imageUrl) && (
                <div className="mt-2 flex items-center space-x-2">
                  <img
                    src={imagePreviewUrl || editingNews?.imageUrl || ""}
                    alt="News Image Preview"
                    className="w-16 h-16 object-cover rounded-full"
                  />
                  <button
                    type="button"
                    onClick={handleClearImage}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Clear Image
                  </button>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="publishedAt"
                className="block text-sm font-medium text-[#003b75] mb-1"
              >
                Published Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="publishedAt"
                {...register("publishedAt")}
                className="w-full p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003b75]"
              />
              {errors.publishedAt && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.publishedAt.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-[#003b75] mb-1"
              >
                Tags (comma-separated)
              </label>
              <input
                type="text"
                id="tags"
                {...register("tags")}
                placeholder="e.g., match, team, update"
                className="w-full p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003b75]"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isFeatured"
                {...register("isFeatured")}
                className="h-4 w-4 text-[#003b75] border-gray-300 rounded focus:ring-[#003b75]"
              />
              <label
                htmlFor="isFeatured"
                className="ml-2 block text-sm text-gray-700"
              >
                Is Featured?
              </label>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border cursor-pointer border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#003b75] cursor-pointer text-white rounded-md transition-colors duration-200 flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader size={20} className="mr-2" />
                    {isImageUploading
                      ? "Adding..."
                      : editingNews
                      ? "Saving..."
                      : "Adding..."}
                  </>
                ) : editingNews ? (
                  "Save Changes"
                ) : (
                  "Add News"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewsModal;
