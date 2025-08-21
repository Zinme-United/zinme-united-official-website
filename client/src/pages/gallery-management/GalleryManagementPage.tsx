import React, { useState, useMemo } from "react";
import {
  Plus,
  Edit,
  Trash,
  XCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
} from "lucide-react";
import useGalleries from "../../hooks/useGalleries";
import type { Gallery, GalleryFormData, IImage } from "../../types";
import { ConfirmationModal, GalleryCreateModal } from "../../components";
import { toast } from "react-toastify";
import type { GalleryFormInputs } from "../../schemas/gallerySchemas";
import Loader from "../../components/Loader";

const GALLERIES_PER_PAGE = 10;

const GalleryManagementPage: React.FC = () => {
  const {
    galleries,
    galleriesLoading,
    galleriesError,
    uploadGalleryImage,
    createGalleryMutation,
    updateGalleryMutation,
    deleteGalleryMutation,
  } = useGalleries();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<Gallery | null>(null);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);
  const [galleryToDeleteId, setGalleryToDeleteId] = useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isImageUploading, setIsImageUploading] = useState(false);

  const handleAddGallery = () => {
    setEditingGallery(null);
    setIsModalOpen(true);
  };

  const handleEditGallery = (gallery: Gallery) => {
    setEditingGallery(gallery);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingGallery(null);
  };

  const handleSubmitGallery = async (
    formData: GalleryFormInputs,
    currentImages: IImage[],
    newImageFiles: File[],
    newImageCaptions: string[]
  ) => {
    setIsImageUploading(true);

    const uploadedImages: IImage[] = [];

    for (let i = 0; i < newImageFiles.length; i++) {
      const file = newImageFiles[i];
      try {
        const imageFormData = new FormData();
        imageFormData.append("image", file);
        const uploadResult = await uploadGalleryImage(imageFormData);
        if (uploadResult.status && uploadResult.data) {
          uploadedImages.push({
            url: uploadResult.data.imageUrl,
            publicId: uploadResult.data.publicId,
            caption: newImageCaptions[i] || "",
          });
        } else {
          toast.error(
            uploadResult.message || `Failed to upload image: ${file.name}`
          );
          setIsImageUploading(false);
          return;
        }
      } catch (error) {
        console.error(`Error uploading image ${file.name}:`, error);
        toast.error(`Error uploading image: ${file.name}`);
        setIsImageUploading(false);
        return;
      }
    }

    setIsImageUploading(false);

    const sanitizedCurrentImages: IImage[] = currentImages.map((img) => ({
      url: img.url,
      caption: img.caption,
      publicId: img.publicId || "",
    }));

    const finalImages = [...sanitizedCurrentImages, ...uploadedImages];

    const galleryPayload: GalleryFormData = {
      title: formData.title,
      description: formData.description || undefined,
      eventDate: formData.eventDate || undefined,
      images: finalImages,
      thumbnailUrl:
        editingGallery?.thumbnailUrl ||
        (finalImages.length > 0 ? finalImages[0].url : undefined),
      category: formData.category,
    };
    console.log(
      "Gallery Payload being sent:",
      JSON.stringify(galleryPayload, null, 2)
    );

    try {
      if (editingGallery && editingGallery._id) {
        await updateGalleryMutation.mutateAsync({
          id: editingGallery._id,
          galleryData: galleryPayload,
        });
      } else {
        await createGalleryMutation.mutateAsync(galleryPayload);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error in gallery creation/update:", error);
      const errorMessage =
        (error as any).response?.data?.message ||
        (error as any).message ||
        "Failed to save gallery.";
      toast.error(errorMessage);
    }
  };

  const handleDeleteClick = (id: string) => {
    setGalleryToDeleteId(id);
    setIsConfirmDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (galleryToDeleteId) {
      try {
        await deleteGalleryMutation.mutateAsync(galleryToDeleteId);
        setIsConfirmDeleteModalOpen(false);
        setGalleryToDeleteId(null);
      } catch (error) {
        console.error("Failed to delete gallery:", error);
        toast.error("Failed to delete gallery.");
      }
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmDeleteModalOpen(false);
    setGalleryToDeleteId(null);
  };

  const isSubmitting =
    createGalleryMutation.isPending ||
    updateGalleryMutation.isPending ||
    deleteGalleryMutation.isPending;

  const filteredGalleries = useMemo(() => {
    if (!galleries) return [];

    return galleries
      .filter((gallery) => {
        if (searchTerm.trim() === "") return true;
        const term = searchTerm.toLowerCase();
        return (
          gallery.title.toLowerCase().includes(term) ||
          (gallery.description &&
            gallery.description.toLowerCase().includes(term))
        );
      })
      .sort((a, b) => {
        const dateA = a.eventDate
          ? new Date(a.eventDate).getTime()
          : new Date(a.createdAt).getTime();
        const dateB = b.eventDate
          ? new Date(b.eventDate).getTime()
          : new Date(b.createdAt).getTime();
        return dateB - dateA;
      });
  }, [galleries, searchTerm]);

  const totalPages = Math.ceil(filteredGalleries.length / GALLERIES_PER_PAGE);

  const paginatedGalleries = useMemo(() => {
    return filteredGalleries.slice(
      (currentPage - 1) * GALLERIES_PER_PAGE,
      currentPage * GALLERIES_PER_PAGE
    );
  }, [filteredGalleries, currentPage]);

  if (galleriesLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-lg shadow-md">
        <Loader size={100} />
      </div>
    );
  }

  if (galleriesError) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-red-100 border border-red-400 text-red-700 p-6 rounded-lg shadow-md">
        <XCircle className="h-6 w-6 mr-2" />
        <p className="text-xl font-semibold">
          Error loading galleries: {galleriesError.message}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white bg-opacity-80 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-[#003b75]">
          Gallery Management
        </h1>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search by title or description"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border text-[#003b75] border-gray-300 rounded-md"
          />
          <button
            onClick={handleAddGallery}
            className="flex items-center px-4 py-2 bg-[#003b75] text-white rounded-md cursor-pointer transition-colors shadow-md"
            disabled={isSubmitting || isImageUploading}
          >
            <Plus size={20} className="mr-2" /> Add New Gallery
          </button>
        </div>
      </div>

      {paginatedGalleries.length > 0 ? (
        <>
          <div className="flex flex-col justify-between min-h-[600px]">
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thumbnail
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event Date
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Images
                    </th>
                    <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedGalleries.map((gallery) => (
                    <tr key={gallery._id} className="hover:bg-gray-50">
                      <td className="py-4 px-6 whitespace-nowrap">
                        {gallery.thumbnailUrl ? (
                          <img
                            src={gallery.thumbnailUrl}
                            alt={gallery.title}
                            loading="lazy"
                            className="h-12 w-12 rounded-md object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                            <ImageIcon size={20} />
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-[#003b75]">
                        {gallery.title}
                      </td>
                      <td className="py-4 px-6 text-sm text-[#003b75] max-w-xs truncate">
                        {gallery.description || "N/A"}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-[#003b75]">
                        {gallery.eventDate
                          ? new Date(gallery.eventDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-[#003b75]">
                        {gallery.category === "match"
                          ? "Match"
                          : gallery.category === "activity"
                          ? "Activity"
                          : "N/A"}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-[#003b75] text-center">
                        {gallery.images.length}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-center items-center space-x-2">
                          <button
                            onClick={() => handleEditGallery(gallery)}
                            className="text-[#003b75] hover:text-[#003b75] cursor-pointer bg-blue-100 p-2 rounded-full"
                            title="Edit Gallery"
                            disabled={isSubmitting || isImageUploading}
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(gallery._id)}
                            className="text-red-600 hover:text-red-900 cursor-pointer bg-red-100 p-2 rounded-full"
                            title="Delete Gallery"
                            disabled={
                              deleteGalleryMutation.isPending ||
                              isSubmitting ||
                              isImageUploading
                            }
                          >
                            {deleteGalleryMutation.isPending &&
                            galleryToDeleteId === gallery._id ? (
                              <Loader2 size={18} className="animate-spin" />
                            ) : (
                              <Trash size={18} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-center items-center mt-4 space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 cursor-pointer rounded-full text-[#003b75] disabled:opacity-30"
              title="Previous Page"
            >
              <ChevronLeft color="#003b75" size={24} />
            </button>

            <span className="text-[#003b75] font-medium">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 cursor-pointer rounded-full text-[#003b75] disabled:opacity-30"
              title="Next Page"
            >
              <ChevronRight color="#003b75" size={24} />
            </button>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-600 py-8">
          No galleries found. Click "Add New Gallery" to get started!
        </p>
      )}

      <GalleryCreateModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingGallery={editingGallery}
        onSubmit={handleSubmitGallery}
        isSubmitting={isSubmitting}
        uploadImageProgress={isImageUploading}
      />

      <ConfirmationModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${
          galleries?.find((g) => g._id === galleryToDeleteId)?.title ||
          "this gallery"
        }"? All associated images will also be deleted. This action cannot be undone.`}
        isConfirming={deleteGalleryMutation.isPending}
      />
    </div>
  );
};

export default GalleryManagementPage;
