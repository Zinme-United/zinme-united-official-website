import React, { useState } from "react";
import {
  Plus,
  Edit,
  Trash,
  XCircle,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import { ConfirmationModal } from "../../components";
import {
  useDeleteAbout,
  useGetAbout,
  useUpdateAbout,
} from "../../hooks/useOurClub";
import type { OurClubInput } from "../../schemas/ourClubSchemas";
import AboutFormModal from "../../components/OurClubCreateModal";

const ClubManagementPage: React.FC = () => {
  const { data: about, isLoading, isError, error } = useGetAbout();
  const { mutateAsync: updateAbout, isPending: isSaving } = useUpdateAbout();
  const { mutateAsync: deleteAbout, isPending: isDeleting } = useDeleteAbout();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const hasAbout = !!about;

  const openCreateOrEdit = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const onSubmit = async (data: OurClubInput) => {
    try {
      await updateAbout(data);
      toast.success("About saved successfully.");
      closeModal();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to save About.");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAbout();
      toast.success("About removed.");
      setIsConfirmOpen(false);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to delete About.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-lg shadow-md">
        <ClipLoader color="#003b75" size={50} />
        <p className="mt-3 text-xl font-semibold text-gray-700">
          Loading About…
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-red-100 border border-red-400 text-red-700 p-6 rounded-lg shadow-md">
        <XCircle className="h-6 w-6 mr-2" />
        <p className="text-xl font-semibold">
          Error loading About: {error?.message}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white bg-opacity-80 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-[#003b75]">
          About Us Management
        </h1>

        <div className="flex items-center gap-3">
          <button
            onClick={openCreateOrEdit}
            className="flex items-center px-4 py-2 bg-[#003b75] text-white rounded-md cursor-pointer transition-colors shadow-md"
            disabled={isSaving || isDeleting}
          >
            {hasAbout ? (
              <>
                <Edit size={18} className="mr-2" /> Edit About
              </>
            ) : (
              <>
                <Plus size={18} className="mr-2" /> Create About
              </>
            )}
          </button>

          {hasAbout && (
            <button
              onClick={() => setIsConfirmOpen(true)}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md cursor-pointer transition-colors shadow-md disabled:opacity-60"
              disabled={isSaving || isDeleting}
              title="Delete About"
            >
              {isDeleting ? (
                <>
                  <Loader2 size={18} className="animate-spin mr-2" />
                  Deleting…
                </>
              ) : (
                <>
                  <Trash size={18} className="mr-2" />
                  Delete
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Preview Card */}
      {hasAbout ? (
        <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 border-b md:border-b-0 md:border-r border-gray-100">
              {about?.heroImageUrl ? (
                <img
                  src={about.heroImageUrl}
                  alt="Hero"
                  className="w-full h-56 md:h-full object-cover"
                />
              ) : (
                <div className="h-56 w-full bg-gray-100 flex items-center justify-center text-gray-500">
                  <ImageIcon className="mr-2" /> No hero image
                </div>
              )}
            </div>

            <div className="flex-1 p-6">
              <h2 className="text-2xl font-bold text-[#003b75]">
                {about?.title || "Untitled"}
              </h2>
              {about?.subtitle && (
                <p className="mt-1 text-[#003b75]/80">{about.subtitle}</p>
              )}
              {about?.description && (
                <p className="mt-3 text-gray-700">{about.description}</p>
              )}

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="text-sm text-gray-500">Stats</div>
                  <div className="text-xl font-bold text-[#003b75]">
                    {about?.stats?.length || 0}
                  </div>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="text-sm text-gray-500">Milestones</div>
                  <div className="text-xl font-bold text-[#003b75]">
                    {about?.milestones?.length || 0}
                  </div>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="text-sm text-gray-500">Values</div>
                  <div className="text-xl font-bold text-[#003b75]">
                    {about?.values?.length || 0}
                  </div>
                </div>
              </div>

              {(about?.mission || about?.vision) && (
                <div className="mt-6 grid md:grid-cols-2 gap-4">
                  {about?.mission && (
                    <div className="rounded-lg border border-gray-200 p-4">
                      <div className="text-sm font-semibold text-[#003b75]">
                        Mission
                      </div>
                      <p className="text-gray-700 mt-1">{about.mission}</p>
                    </div>
                  )}
                  {about?.vision && (
                    <div className="rounded-lg border border-gray-200 p-4">
                      <div className="text-sm font-semibold text-[#003b75]">
                        Vision
                      </div>
                      <p className="text-gray-700 mt-1">{about.vision}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600 py-8">
          No About content yet. Click &quot;Create About&quot; to get started!
        </p>
      )}

      {/* Modal */}
      <AboutFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        defaultValues={about}
        onSubmit={onSubmit}
        isSubmitting={isSaving}
      />

      {/* Confirm Delete */}
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete About"
        message="This will remove the About content and the hero image (if configured for deletion). This action cannot be undone."
        isConfirming={isDeleting}
      />
    </div>
  );
};

export default ClubManagementPage;
