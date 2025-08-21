// client/src/pages/admin/ActivityManagementPage.tsx
import React, { useState, useMemo } from "react";
import {
  Plus,
  Edit,
  Trash,
  XCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye, // Import Eye icon for view details
} from "lucide-react";
import useActivities from "../../hooks/useActivities";
import type { Activity } from "../../types";
import { ActivityFormModal, ConfirmationModal } from "../../components";
import ActivityDetailsModal from "../../components/ActivityDetailsModal";
import { toast } from "react-toastify";
import type { ActivityFormInputs } from "../../schemas/activitySchemas";
import Loader from "../../components/Loader";

const ACTIVITIES_PER_PAGE = 10;

const ActivityManagementPage: React.FC = () => {
  const {
    activities,
    activitiesLoading,
    activitiesError,
    createActivity,
    updateActivity,
    deleteActivity,
    isCreatingActivity,
    isUpdatingActivity,
    isDeletingActivity,
  } = useActivities();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);
  const [activityToDeleteId, setActivityToDeleteId] = useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);

  // State for details modal
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedActivityForDetails, setSelectedActivityForDetails] =
    useState<Activity | null>(null);

  const handleAddActivity = () => {
    setEditingActivity(null); // This correctly sets editingActivity to null for a new entry
    setIsModalOpen(true);
  };

  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingActivity(null); // This ensures editingActivity is cleared when the modal closes
  };

  // Handle opening details modal
  const handleViewDetails = (activity: Activity) => {
    setSelectedActivityForDetails(activity);
    setIsDetailsModalOpen(true);
  };

  // Handle closing details modal
  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedActivityForDetails(null);
  };

  const handleSubmitActivity = async (
    data: ActivityFormInputs,
    homeLogoFile?: File | null,
    opponentLogoFile?: File | null
  ): Promise<void> => {
    try {
      if (editingActivity && editingActivity._id) {
        await updateActivity({
          id: editingActivity._id,
          activityData: data as Partial<ActivityFormInputs>,
          homeLogoFile,
          opponentLogoFile,
        });
      } else {
        await createActivity({ data, homeLogoFile, opponentLogoFile });
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error in activity creation/update:", error);
      const errorMessage =
        (error as any).response?.data?.message ||
        (error as any).message ||
        "Failed to save activity.";
      toast.error(errorMessage);
    }
  };

  const handleDeleteClick = (id: string) => {
    setActivityToDeleteId(id);
    setIsConfirmDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (activityToDeleteId) {
      try {
        await deleteActivity(activityToDeleteId);
        setIsConfirmDeleteModalOpen(false);
        setActivityToDeleteId(null);
      } catch (error) {
        console.error("Failed to delete activity:", error);
        toast.error("Failed to delete activity.");
      }
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmDeleteModalOpen(false);
    setActivityToDeleteId(null);
  };

  const isSubmitting =
    isCreatingActivity || isUpdatingActivity || isDeletingActivity;

  const filteredActivities = useMemo(() => {
    if (!activities) return [];

    return activities
      .filter((activity) => {
        if (typeFilter !== "All" && activity.type !== typeFilter) {
          return false;
        }
        if (searchTerm.trim() === "") return true;
        const term = searchTerm.toLowerCase();
        return (
          activity.title.toLowerCase().includes(term) ||
          (activity.description &&
            activity.description.toLowerCase().includes(term)) ||
          activity.location.toLowerCase().includes(term) ||
          (activity.opponent && activity.opponent.toLowerCase().includes(term))
        );
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        if (dateA !== dateB) {
          return dateB - dateA;
        }
        const timeA = a.time || "";
        const timeB = b.time || "";
        if (timeA && timeB) {
          return timeA.localeCompare(timeB);
        }
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
  }, [activities, searchTerm, typeFilter]);

  const totalPages = Math.ceil(filteredActivities.length / ACTIVITIES_PER_PAGE);

  const paginatedActivities = useMemo(() => {
    return filteredActivities.slice(
      (currentPage - 1) * ACTIVITIES_PER_PAGE,
      currentPage * ACTIVITIES_PER_PAGE
    );
  }, [filteredActivities, currentPage]);

  if (activitiesLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-lg shadow-md">
        <Loader size={100} />
      </div>
    );
  }

  if (activitiesError) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-red-100 border border-red-400 text-red-700 p-6 rounded-lg shadow-md">
        <XCircle className="h-6 w-6 mr-2" />
        <p className="text-xl font-semibold">
          Error loading activities: {activitiesError.message}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white bg-opacity-80 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-[#003b75]">
          Activity Management
        </h1>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search title, location, opponent"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border text-[#003b75] border-gray-300 rounded-md"
          />
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-[#003b75] border border-gray-300 rounded-md"
          >
            <option value="All">All Types</option>
            <option value="event">Event</option>
            <option value="training">Training</option>
            <option value="match">Match</option>
          </select>
          <button
            onClick={handleAddActivity}
            className="flex items-center px-4 py-2 bg-[#003b75] text-white rounded-md cursor-pointer transition-colors shadow-md"
            disabled={isSubmitting}
          >
            <Plus size={20} className="mr-2" /> Add New Activity
          </button>
        </div>
      </div>

      {paginatedActivities.length > 0 ? (
        <>
          <div className="flex flex-col justify-between min-h-[600px]">
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Opponent / Result
                    </th>
                    <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Flags
                    </th>
                    <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedActivities.map((activity) => (
                    <tr key={activity._id} className="hover:bg-gray-50">
                      <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-[#003b75]">
                        {activity.title}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-[#003b75]">
                        {activity.type.charAt(0).toUpperCase() +
                          activity.type.slice(1)}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-[#003b75]">
                        {new Date(activity.date).toLocaleDateString()}{" "}
                        {activity.time && `at ${activity.time}`}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-[#003b75]">
                        {activity.location}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-[#003b75]">
                        {activity.opponent && `vs. ${activity.opponent}`}
                        {activity.opponent && activity.result && <br />}
                        {activity.result && `Result: ${activity.result}`}
                        {!activity.opponent && !activity.result && "N/A"}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-[#003b75] text-center">
                        {activity.isNextMatch && (
                          <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full mr-1">
                            Next Match
                          </span>
                        )}
                        {activity.isFeaturedEvent && (
                          <span className="inline-block bg-purple-100 text-purple-800 text-xs font-medium px-2 py-0.5 rounded-full">
                            Featured
                          </span>
                        )}
                        {!activity.isNextMatch &&
                          !activity.isFeaturedEvent &&
                          "None"}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-center items-center space-x-2">
                          <button
                            onClick={() => handleViewDetails(activity)}
                            className="text-gray-600 hover:text-gray-900 cursor-pointer bg-gray-100 p-2 rounded-full"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleEditActivity(activity)}
                            className="text-[#003b75] hover:text-[#003b75] cursor-pointer bg-blue-100 p-2 rounded-full"
                            title="Edit Activity"
                            disabled={isSubmitting}
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(activity._id)}
                            className="text-red-600 hover:text-red-900 cursor-pointer bg-red-100 p-2 rounded-full"
                            title="Delete Activity"
                            disabled={isDeletingActivity || isSubmitting}
                          >
                            {isDeletingActivity &&
                            activityToDeleteId === activity._id ? (
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
          No activities found. Click "Add New Activity" to get started!
        </p>
      )}

      <ActivityFormModal
        key={editingActivity ? editingActivity._id : "new-activity"} // Added key prop to force re-mount
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingActivity={editingActivity}
        onSubmit={handleSubmitActivity}
        isSubmitting={isSubmitting}
      />

      <ActivityDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        activity={selectedActivityForDetails}
      />

      <ConfirmationModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${
          activities?.find((a) => a._id === activityToDeleteId)?.title ||
          "this activity"
        }"? This action cannot be undone.`}
        isConfirming={isDeletingActivity}
      />
    </div>
  );
};

export default ActivityManagementPage;
