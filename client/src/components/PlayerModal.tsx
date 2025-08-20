import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { XCircle, Loader2 } from "lucide-react";
import type { PlayerFormModalProps } from "../types";
import {
  playerFormSchema,
  type PlayerFormData,
} from "../schemas/playerSchemas";

const PlayerFormModal: React.FC<PlayerFormModalProps> = ({
  isOpen,
  onClose,
  editingPlayer,
  onSubmit,
  isSubmitting,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PlayerFormData>({
    resolver: zodResolver(playerFormSchema),
    defaultValues: {
      name: "",
      number: 0,
      position: "",
      img: "",
      bio: "",
      age: 0,
      dateOfBirth: "",
      gender: "Male",
      stats: { appearances: 0, goals: 0, assists: 0, cleanSheets: 0 },
      social: { facebook: "", twitter: "", instagram: "" },
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (editingPlayer) {
        reset({
          _id: editingPlayer._id,
          name: editingPlayer.name,
          number: editingPlayer.number,
          position: editingPlayer.position,
          img: editingPlayer.img, // Set existing image URL for internal form state (optional for display)
          bio: editingPlayer.bio,
          age: editingPlayer.age,
          dateOfBirth: editingPlayer.dateOfBirth,
          gender: editingPlayer.gender,
          stats: {
            appearances: editingPlayer.stats.appearances,
            goals: editingPlayer.stats.goals ?? 0,
            assists: editingPlayer.stats.assists ?? 0,
            cleanSheets: editingPlayer.stats.cleanSheets ?? 0,
          },
          social: editingPlayer.social
            ? {
                facebook: editingPlayer.social.facebook ?? "",
                twitter: editingPlayer.social.twitter ?? "",
                instagram: editingPlayer.social.instagram ?? "",
              }
            : { facebook: "", twitter: "", instagram: "" },
        });
        setImagePreviewUrl(editingPlayer.img || null);
      } else {
        // When adding new, reset to default values
        reset({
          name: "",
          number: 0,
          position: "",
          img: "",
          bio: "",
          age: 0,
          dateOfBirth: "",
          gender: "Male",
          stats: { appearances: 0, goals: 0, assists: 0, cleanSheets: 0 },
          social: { facebook: "", twitter: "", instagram: "" },
        });
        setImagePreviewUrl(null);
      }
      setSelectedFile(null);
      const fileInput = document.getElementById(
        "imageUpload"
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
    }
  }, [editingPlayer, reset, isOpen]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);

      // Create a URL for image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setImagePreviewUrl(editingPlayer?.img || null);
    }
  };

  const handleFormSubmit = async (data: PlayerFormData) => {
    await onSubmit(data, selectedFile);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-200 bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {editingPlayer ? "Edit Player" : "Add New Player"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full cursor-pointer bg-gray-100"
            disabled={isSubmitting}
          >
            <XCircle size={24} />
          </button>
        </div>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Basic Info Fields */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              {...register("name")}
              className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="number"
              className="block text-sm font-medium text-gray-700"
            >
              Number
            </label>
            <input
              type="number"
              id="number"
              {...register("number", { valueAsNumber: true })}
              className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.number && (
              <p className="text-red-500 text-xs mt-1">
                {errors.number.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="position"
              className="block text-sm font-medium text-gray-700"
            >
              Position
            </label>
            <input
              type="text"
              id="position"
              {...register("position")}
              className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.position && (
              <p className="text-red-500 text-xs mt-1">
                {errors.position.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700"
            >
              Gender
            </label>
            <select
              id="gender"
              {...register("gender")}
              className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-xs mt-1">
                {errors.gender.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="age"
              className="block text-sm font-medium text-gray-700"
            >
              Age
            </label>
            <input
              type="number"
              id="age"
              {...register("age", { valueAsNumber: true })}
              className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.age && (
              <p className="text-red-500 text-xs mt-1">{errors.age.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="dateOfBirth"
              className="block text-sm font-medium text-gray-700"
            >
              Date of Birth
            </label>
            <input
              type="date"
              id="dateOfBirth"
              {...register("dateOfBirth")}
              className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.dateOfBirth && (
              <p className="text-red-500 text-xs mt-1">
                {errors.dateOfBirth.message}
              </p>
            )}
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="imageUpload"
              className="block text-sm font-medium text-gray-700"
            >
              Player Image
            </label>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-black border border-gray-300 cursor-pointer rounded-md shadow-sm p-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#003b75] file:text-white"
            />
            {imagePreviewUrl && (
              <div className="mt-4">
                <img
                  src={imagePreviewUrl}
                  alt="Image Preview"
                  className="w-32 h-32 object-cover rounded-md shadow-sm"
                />
              </div>
            )}
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700"
            >
              Biography
            </label>
            <textarea
              id="bio"
              {...register("bio")}
              rows={3}
              className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
            {errors.bio && (
              <p className="text-red-500 text-xs mt-1">{errors.bio.message}</p>
            )}
          </div>

          {/* Stats Section */}
          <div className="md:col-span-2 border-t pt-4 mt-4">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="stats.appearances"
                  className="block text-sm font-medium text-gray-700"
                >
                  Appearances
                </label>
                <input
                  type="number"
                  id="stats.appearances"
                  {...register("stats.appearances", { valueAsNumber: true })}
                  className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.stats?.appearances && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.stats.appearances.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="stats.goals"
                  className="block text-sm font-medium text-gray-700"
                >
                  Goals
                </label>
                <input
                  type="number"
                  id="stats.goals"
                  {...register("stats.goals", { valueAsNumber: true })}
                  className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.stats?.goals && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.stats.goals.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="stats.assists"
                  className="block text-sm font-medium text-gray-700"
                >
                  Assists
                </label>
                <input
                  type="number"
                  id="stats.assists"
                  {...register("stats.assists", { valueAsNumber: true })}
                  className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.stats?.assists && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.stats.assists.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="stats.cleanSheets"
                  className="block text-sm font-medium text-gray-700"
                >
                  Clean Sheets
                </label>
                <input
                  type="number"
                  id="stats.cleanSheets"
                  {...register("stats.cleanSheets", { valueAsNumber: true })}
                  className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.stats?.cleanSheets && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.stats.cleanSheets.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="md:col-span-2 border-t pt-4 mt-4">
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              Social Media (Optional)
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="social.facebook"
                  className="block text-sm font-medium text-gray-700"
                >
                  Facebook URL
                </label>
                <input
                  type="url"
                  id="social.facebook"
                  {...register("social.facebook")}
                  className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.social?.facebook && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.social.facebook.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="social.twitter"
                  className="block text-sm font-medium text-gray-700"
                >
                  Twitter URL
                </label>
                <input
                  type="url"
                  id="social.twitter"
                  {...register("social.twitter")}
                  className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.social?.twitter && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.social.twitter.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="social.instagram"
                  className="block text-sm font-medium text-gray-700"
                >
                  Instagram URL
                </label>
                <input
                  type="url"
                  id="social.instagram"
                  {...register("social.instagram")}
                  className="mt-1 block w-full text-black border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.social?.instagram && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.social.instagram.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="md:col-span-2 flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isSubmitting} // Disable cancel button while submitting
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#003b75] text-white rounded-md shadow-sm cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="inline mr-2 animate-spin" />{" "}
                  {editingPlayer ? "Saving..." : "Adding..."}
                </>
              ) : editingPlayer ? (
                "Save Changes"
              ) : (
                "Add Player"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlayerFormModal;
