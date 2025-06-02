import React, { useEffect } from "react";
import { X } from "lucide-react";
import ClipLoader from "react-spinners/ClipLoader";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Activity } from "../types";
import {
  activityFormSchema,
  type ActivityFormInputs,
} from "../schemas/activitySchemas";

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingActivity: Activity | null;
  onSubmit: (data: ActivityFormInputs) => Promise<void>;
  isSubmitting: boolean;
}

const ActivityModal: React.FC<ActivityModalProps> = ({
  isOpen,
  onClose,
  editingActivity,
  onSubmit,
  isSubmitting,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ActivityFormInputs>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "event", // Default type
      date: "",
      time: "",
      location: "",
      opponent: "",
      result: "",
      isNextMatch: false,
      isFeaturedEvent: false,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (editingActivity) {
        reset({
          title: editingActivity.title,
          description: editingActivity.description || "",
          type: editingActivity.type,
          date: new Date(editingActivity.date).toISOString().split("T")[0],
          time: editingActivity.time || "",
          location: editingActivity.location,
          opponent: editingActivity.opponent || "",
          result: editingActivity.result || "",
          isNextMatch: editingActivity.isNextMatch || false,
          isFeaturedEvent: editingActivity.isFeaturedEvent || false,
        });
      } else {
        reset();
      }
    }
  }, [isOpen, editingActivity, reset]);
  const activityType = watch("type");

  const onFormSubmit = async (data: ActivityFormInputs) => {
    await onSubmit(data);
  };

  if (!isOpen) return null;

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
            {editingActivity ? "Edit Activity" : "Add New Activity"}
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
                htmlFor="type"
                className="block text-sm font-medium text-[#003b75] mb-1"
              >
                Type <span className="text-red-500">*</span>
              </label>
              <select
                id="type"
                {...register("type")}
                className="w-full p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003b75]"
              >
                <option value="event">Event</option>
                <option value="training">Training</option>
                <option value="match">Match</option>
              </select>
              {errors.type && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.type.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-[#003b75] mb-1"
                >
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  {...register("date")}
                  className="w-full p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003b75]"
                />
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.date.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="time"
                  className="block text-sm font-medium text-[#003b75] mb-1"
                >
                  Time
                </label>
                <input
                  type="time"
                  id="time"
                  {...register("time")}
                  className="w-full p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003b75]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-[#003b75] mb-1"
              >
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="location"
                {...register("location")}
                className="w-full p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003b75]"
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.location.message}
                </p>
              )}
            </div>

            {/* Conditional fields for 'match' type */}
            {activityType === "match" && ( // Use the watched value
              <>
                <div>
                  <label
                    htmlFor="opponent"
                    className="block text-sm font-medium text-[#003b75] mb-1"
                  >
                    Opponent
                  </label>
                  <input
                    type="text"
                    id="opponent"
                    {...register("opponent")}
                    className="w-full p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003b75]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="result"
                    className="block text-sm font-medium text-[#003b75] mb-1"
                  >
                    Result (e.g., "3-1 Win", "0-0 Draw")
                  </label>
                  <input
                    type="text"
                    id="result"
                    {...register("result")}
                    className="w-full p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003b75]"
                  />
                </div>
              </>
            )}

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isNextMatch"
                  {...register("isNextMatch")}
                  className="h-4 w-4 text-[#003b75] border-gray-300 rounded focus:ring-[#003b75]"
                />
                <label
                  htmlFor="isNextMatch"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Is Next Match?
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isFeaturedEvent"
                  {...register("isFeaturedEvent")}
                  className="h-4 w-4 text-[#003b75] border-gray-300 rounded focus:ring-[#003b75]"
                />
                <label
                  htmlFor="isFeaturedEvent"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Is Featured Event?
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border cursor-pointer border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#003b75] cursor-pointer text-white rounded-md transition-colors duration-200 flex items-center justify-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <ClipLoader color="#fff" size={20} className="mr-2" />
                    {editingActivity ? "Saving..." : "Adding..."}
                  </>
                ) : editingActivity ? (
                  "Save Changes"
                ) : (
                  "Add Activity"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ActivityModal;
