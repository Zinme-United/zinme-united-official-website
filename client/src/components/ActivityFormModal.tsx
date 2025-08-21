import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Activity } from "../types";
import {
  activityFormSchema,
  type ActivityFormInputs,
} from "../schemas/activitySchemas";
import useActivities from "../hooks/useActivities";
import { toast } from "react-toastify";
import Loader from "./Loader";

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
  const { uploadLogosMutation } = useActivities();
  const [homeLogoFile, setHomeLogoFile] = useState<File | null>(null);
  const [homeLogoPreviewUrl, setHomeLogoPreviewUrl] = useState<string | null>(
    null
  );
  const [opponentLogoFile, setOpponentLogoFile] = useState<File | null>(null);
  const [opponentLogoPreviewUrl, setOpponentLogoPreviewUrl] = useState<
    string | null
  >(null);

  const [isLogoUploading, setIsLogoUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ActivityFormInputs>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "event",
      date: "",
      time: "",
      location: "",
      opponent: "",
      result: "",
      isNextMatch: false,
      isFeaturedEvent: false,
      homeTeamLogoUrl: "",
      homeTeamLogoPublicId: "",
      opponentTeamLogoUrl: "",
      opponentTeamLogoPublicId: "",
    } as ActivityFormInputs,
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
          homeTeamLogoUrl: editingActivity.homeTeamLogoUrl || "",
          homeTeamLogoPublicId: editingActivity.homeTeamLogoPublicId || "",
          opponentTeamLogoUrl: editingActivity.opponentTeamLogoUrl || "",
          opponentTeamLogoPublicId:
            editingActivity.opponentTeamLogoPublicId || "",
        });
        setHomeLogoPreviewUrl(editingActivity.homeTeamLogoUrl || null);
        setOpponentLogoPreviewUrl(editingActivity.opponentTeamLogoUrl || null);
      } else {
        reset();
        setHomeLogoPreviewUrl(null);
        setOpponentLogoPreviewUrl(null);
      }
      setHomeLogoFile(null);
      setOpponentLogoFile(null);
      // Clear file inputs visually
      const homeFileInput = document.getElementById(
        "homeTeamLogoFile"
      ) as HTMLInputElement;
      if (homeFileInput) homeFileInput.value = "";
      const opponentFileInput = document.getElementById(
        "opponentTeamLogoFile"
      ) as HTMLInputElement;
      if (opponentFileInput) opponentFileInput.value = "";
    }
  }, [isOpen, editingActivity, reset, setValue]);

  const activityType = watch("type");

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    setPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFile(null);
      setPreviewUrl(null);
    }
  };

  const handleClearLogo = (
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    setPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>,
    urlFieldName: "homeTeamLogoUrl" | "opponentTeamLogoUrl",
    publicIdFieldName: "homeTeamLogoPublicId" | "opponentTeamLogoPublicId",
    fileInputId: string
  ) => {
    setFile(null);
    setPreviewUrl(null);
    setValue(urlFieldName, "");
    setValue(publicIdFieldName, "");
    const fileInput = document.getElementById(fileInputId) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const onFormSubmit = async (data: ActivityFormInputs) => {
    setIsLogoUploading(true);

    const finalData: ActivityFormInputs = { ...data };

    try {
      if (homeLogoFile) {
        const formData = new FormData();
        formData.append("image", homeLogoFile);
        const result = await uploadLogosMutation.mutateAsync(formData);
        if (result.status && result.data) {
          finalData.homeTeamLogoUrl = result.data.imageUrl;
          finalData.homeTeamLogoPublicId = result.data.publicId;
        } else {
          toast.error(result.message || "Failed to upload home logo.");
          setIsLogoUploading(false);
          return;
        }
      } else if (
        editingActivity &&
        editingActivity.homeTeamLogoUrl &&
        !homeLogoPreviewUrl
      ) {
        finalData.homeTeamLogoUrl = "";
        finalData.homeTeamLogoPublicId = "";
      }

      if (opponentLogoFile) {
        const formData = new FormData();
        formData.append("image", opponentLogoFile);
        const result = await uploadLogosMutation.mutateAsync(formData);
        if (result.status && result.data) {
          finalData.opponentTeamLogoUrl = result.data.imageUrl;
          finalData.opponentTeamLogoPublicId = result.data.publicId;
        } else {
          toast.error(result.message || "Failed to upload opponent logo.");
          setIsLogoUploading(false);
          return;
        }
      } else if (
        editingActivity &&
        editingActivity.opponentTeamLogoUrl &&
        !opponentLogoPreviewUrl
      ) {
        finalData.opponentTeamLogoUrl = "";
        finalData.opponentTeamLogoPublicId = "";
      }

      await onSubmit(finalData);
    } catch (error) {
      console.error("Error during logo upload or form submission:", error);
      toast.error("An error occurred during activity submission.");
    } finally {
      setIsLogoUploading(false);
    }
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
            {activityType === "match" && (
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

                {/* Home Team Logo Upload */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="homeTeamLogoFile"
                    className="block text-sm font-medium text-[#003b75] mb-1"
                  >
                    Home Team Logo
                  </label>
                  <input
                    type="file"
                    id="homeTeamLogoFile"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileChange(
                        e,
                        setHomeLogoFile,
                        setHomeLogoPreviewUrl
                      )
                    }
                    className="w-full p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003b75] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#003b75] file:text-white"
                  />
                  {(homeLogoPreviewUrl || editingActivity?.homeTeamLogoUrl) && (
                    <div className="mt-2 flex items-center space-x-2">
                      <img
                        src={
                          homeLogoPreviewUrl ||
                          editingActivity?.homeTeamLogoUrl ||
                          ""
                        }
                        alt="Home Logo Preview"
                        className="w-16 h-16 object-cover rounded-full"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          handleClearLogo(
                            setHomeLogoFile,
                            setHomeLogoPreviewUrl,
                            "homeTeamLogoUrl",
                            "homeTeamLogoPublicId",
                            "homeTeamLogoFile"
                          )
                        }
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Clear Logo
                      </button>
                    </div>
                  )}
                </div>

                {/* Opponent Team Logo Upload */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="opponentTeamLogoFile"
                    className="block text-sm font-medium text-[#003b75] mb-1"
                  >
                    Opponent Team Logo
                  </label>
                  <input
                    type="file"
                    id="opponentTeamLogoFile"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileChange(
                        e,
                        setOpponentLogoFile,
                        setOpponentLogoPreviewUrl
                      )
                    }
                    className="w-full p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003b75] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#003b75] file:text-white"
                  />
                  {(opponentLogoPreviewUrl ||
                    editingActivity?.opponentTeamLogoUrl) && (
                    <div className="mt-2 flex items-center space-x-2">
                      <img
                        src={
                          opponentLogoPreviewUrl ||
                          editingActivity?.opponentTeamLogoUrl ||
                          ""
                        }
                        alt="Opponent Logo Preview"
                        className="w-16 h-16 object-cover rounded-full"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          handleClearLogo(
                            setOpponentLogoFile,
                            setOpponentLogoPreviewUrl,
                            "opponentTeamLogoUrl",
                            "opponentTeamLogoPublicId",
                            "opponentTeamLogoFile"
                          )
                        }
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Clear Logo
                      </button>
                    </div>
                  )}
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
                disabled={isSubmitting || isLogoUploading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#003b75] cursor-pointer text-white rounded-md transition-colors duration-200 flex items-center justify-center"
                disabled={isSubmitting || isLogoUploading}
              >
                {isSubmitting || isLogoUploading ? (
                  <>
                    <Loader size={20} className="mr-2" />
                    {isLogoUploading
                      ? "Adding..."
                      : editingActivity
                      ? "Saving..."
                      : "Adding..."}
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
