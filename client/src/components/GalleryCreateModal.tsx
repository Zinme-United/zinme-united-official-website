import React, { useState, useEffect } from "react";
import { X, Trash2 } from "lucide-react";
import ClipLoader from "react-spinners/ClipLoader";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { GalleryModalProps, IImage } from "../types";
import {
  galleryFormSchema,
  type GalleryFormInputs,
} from "../schemas/gallerySchemas";

const GalleryModal: React.FC<GalleryModalProps> = ({
  isOpen,
  onClose,
  editingGallery,
  onSubmit,
  isSubmitting,
  uploadImageProgress,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<GalleryFormInputs>({
    resolver: zodResolver(galleryFormSchema),
    defaultValues: {
      title: "",
      description: "",
      eventDate: "",
    },
  });

  const [currentImages, setCurrentImages] = useState<IImage[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [newImageCaptions, setNewImageCaptions] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (editingGallery) {
        setValue("title", editingGallery.title);
        setValue("description", editingGallery.description || "");
        setValue(
          "eventDate",
          editingGallery.eventDate
            ? new Date(editingGallery.eventDate).toISOString().split("T")[0]
            : ""
        );

        setCurrentImages(editingGallery.images || []);
      } else {
        reset();
        setCurrentImages([]);
      }
      setNewImageFiles([]);
      setNewImagePreviews([]);
      setNewImageCaptions([]);
    }
  }, [isOpen, editingGallery, reset, setValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setNewImageFiles((prev) => [...prev, ...filesArray]);

      const previews = filesArray.map((file) => URL.createObjectURL(file));
      setNewImagePreviews((prev) => [...prev, ...previews]);

      setNewImageCaptions((prev) => [
        ...prev,
        ...Array(filesArray.length).fill(""),
      ]);
    }
  };

  const handleRemoveNewImage = (indexToRemove: number) => {
    URL.revokeObjectURL(newImagePreviews[indexToRemove]);

    setNewImageFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
    setNewImagePreviews((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
    setNewImageCaptions((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleRemoveExistingImage = (indexToRemove: number) => {
    setCurrentImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleNewImageCaptionChange = (index: number, value: string) => {
    setNewImageCaptions((prev) => {
      const updatedCaptions = [...prev];
      updatedCaptions[index] = value;
      return updatedCaptions;
    });
  };

  const handleExistingImageCaptionChange = (index: number, value: string) => {
    setCurrentImages((prev) => {
      const updatedImages = [...prev];
      updatedImages[index] = { ...updatedImages[index], caption: value };
      return updatedImages;
    });
  };

  const onFormSubmit = async (data: GalleryFormInputs) => {
    await onSubmit(data, currentImages, newImageFiles, newImageCaptions);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#003b75] bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 md:p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 cursor-pointer right-4 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-full p-2 transition-colors duration-200"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>

          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            {editingGallery ? "Edit Gallery" : "Add New Gallery"}
          </h2>

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
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
                htmlFor="description"
                className="block text-sm font-medium text-[#003b75] mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                {...register("description")}
                rows={3}
                className="w-full p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003b75]"
              ></textarea>
            </div>

            <div>
              <label
                htmlFor="eventDate"
                className="block text-sm font-medium text-[#003b75] mb-1"
              >
                Event Date
              </label>
              <input
                type="date"
                id="eventDate"
                {...register("eventDate")}
                className="w-full p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003b75]"
              />
            </div>

            {/* Image Upload Section */}
            <div>
              <label
                htmlFor="imageUpload"
                className="block text-sm font-medium text-[#003b75] mb-1"
              >
                Gallery Images
              </label>
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="mt-1 block w-full text-black border border-gray-300 cursor-pointer rounded-md shadow-sm p-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#003b75] file:text-white"
              />

              {/* Existing Images */}
              {currentImages.length > 0 && (
                <div className="mt-4 border p-4 rounded-md bg-gray-50">
                  <h4 className="text-md font-semibold mb-3 text-gray-700">
                    Existing Images:
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {currentImages.map((img, index) => (
                      <div key={img.url + index} className="relative group">
                        <img
                          src={img.url}
                          alt={img.caption || "Existing image"}
                          className="w-full h-24 object-cover rounded-md shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          title="Remove existing image"
                        >
                          <Trash2 size={16} />
                        </button>
                        <input
                          type="text"
                          placeholder="Caption (optional)"
                          value={img.caption || ""}
                          onChange={(e) =>
                            handleExistingImageCaptionChange(
                              index,
                              e.target.value
                            )
                          }
                          className="w-full text-xs p-1 mt-1 border rounded-md"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Image Previews */}
              {newImagePreviews.length > 0 && (
                <div className="mt-4 border p-4 rounded-md bg-gray-50">
                  <h4 className="text-md font-semibold mb-3 text-gray-700">
                    New Images to Upload:
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {newImagePreviews.map((preview, index) => (
                      <div key={preview + index} className="relative group">
                        <img
                          src={preview}
                          alt={`New image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-md shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveNewImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          title="Remove new image"
                        >
                          <Trash2 size={16} />
                        </button>
                        <input
                          type="text"
                          placeholder="Caption (optional)"
                          value={newImageCaptions[index]}
                          onChange={(e) =>
                            handleNewImageCaptionChange(index, e.target.value)
                          }
                          className="w-full text-xs p-1 mt-1 border rounded-md"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border cursor-pointer border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                disabled={isSubmitting || uploadImageProgress}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#003b75] cursor-pointer text-white rounded-md transition-colors duration-200 flex items-center justify-center"
                disabled={isSubmitting || uploadImageProgress}
              >
                {isSubmitting || uploadImageProgress ? (
                  <>
                    <ClipLoader color="#fff" size={20} className="mr-2" />
                    {editingGallery ? "Saving..." : "Adding..."}
                  </>
                ) : editingGallery ? (
                  "Save Changes"
                ) : (
                  "Add Gallery"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GalleryModal;
