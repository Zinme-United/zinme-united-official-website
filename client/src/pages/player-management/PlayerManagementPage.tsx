import React, { useState } from "react";
import { Plus, Edit, Trash, XCircle, Loader2 } from "lucide-react";
import usePlayers from "../../hooks/usePlayers";
import type { Player } from "../../types";
import type { PlayerFormData } from "../../schemas/playerSchemas";
import PlayerFormModal from "../../components/PlayerModal"; // Adjusted import path
import { ConfirmationModal } from "../../components"; // Assuming this is correct
import { toast } from "react-toastify";

const PlayerManagementPage: React.FC = () => {
  const {
    players,
    playersLoading,
    playersError,
    createPlayerMutation,
    updatePlayerMutation,
    deletePlayerMutation,
    uploadImageMutation, // Ensure this is destructured
  } = usePlayers();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);
  const [playerToDeleteId, setPlayerToDeleteId] = useState<string | null>(null);

  const handleAddPlayer = () => {
    setEditingPlayer(null);
    setIsModalOpen(true);
  };

  const handleEditPlayer = (player: Player) => {
    setEditingPlayer(player);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPlayer(null);
  };

  const handleSubmitPlayer = async (
    data: PlayerFormData,
    imageFile: File | null
  ) => {
    let imageUrl: string = data.img || ""; // Default to existing img URL if no new file is chosen

    // --- Image Upload Logic ---
    if (imageFile) {
      // If a new file is selected, upload it first
      try {
        const formData = new FormData();
        formData.append("image", imageFile); // 'image' should match your Multer field name in backend upload.middleware

        const uploadResult = await uploadImageMutation.mutateAsync(formData);

        if (uploadResult.status) {
          imageUrl = uploadResult.data.imageUrl; // Use the newly uploaded URL
          toast.success("Image uploaded successfully!"); // Toast after successful image upload
        } else {
          // This case is unlikely due to onError in usePlayers' uploadImageMutation, but good for type safety
          toast.error(uploadResult.message || "Image upload failed.");
          return; // Stop submission if image upload fails
        }
      } catch (error) {
        console.error("Error during image upload:", error);
        // Error toast already handled by usePlayers onError
        return; // Stop submission
      }
    } else if (editingPlayer && !imageFile) {
      // If in edit mode and no new file is selected, retain the old image URL
      imageUrl = editingPlayer.img;
    } else if (!editingPlayer && !imageFile) {
      // If creating a new player and no file is selected, an image is required
      toast.error("Player image is required for new players.");
      return; // Stop submission
    }

    // --- Player Create/Update Logic ---
    const playerPayload = { ...data, img: imageUrl }; // Update the img field with the Cloudinary URL

    try {
      if (editingPlayer && editingPlayer._id) {
        // Update existing player
        await updatePlayerMutation.mutateAsync({
          id: editingPlayer._id,
          playerData: playerPayload,
        });
      } else {
        // Create new player
        await createPlayerMutation.mutateAsync(
          playerPayload as Omit<Player, "_id">
        );
      }
      handleCloseModal(); // Close modal on success
    } catch (error) {
      console.error("Error in player creation/update:", error);
      // Toast messages are already handled by the onError callbacks in the hook
    }
  };

  const handleDeleteClick = (id: string) => {
    setPlayerToDeleteId(id);
    setIsConfirmDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (playerToDeleteId) {
      try {
        await deletePlayerMutation.mutateAsync(playerToDeleteId);
        setIsConfirmDeleteModalOpen(false);
        setPlayerToDeleteId(null);
      } catch (error) {
        console.error("Failed to delete player:", error);
      }
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmDeleteModalOpen(false);
    setPlayerToDeleteId(null);
  };

  // Determine overall submission state for disabling buttons/forms
  const isSubmitting =
    createPlayerMutation.isPending ||
    updatePlayerMutation.isPending ||
    uploadImageMutation.isPending; // Include image upload pending state

  if (playersLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-white rounded-lg shadow-md">
        <Loader2 className="animate-spin h-8 w-8 text-[#003b75] mr-2" />
        <p className="text-xl font-semibold text-gray-700">
          Loading players...
        </p>
      </div>
    );
  }

  if (playersError) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-red-100 border border-red-400 text-red-700 p-6 rounded-lg shadow-md">
        <XCircle className="h-6 w-6 mr-2" />
        <p className="text-xl font-semibold">
          Error loading players: {playersError.message}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white bg-opacity-80 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#003b75]">Player Management</h1>
        <button
          onClick={handleAddPlayer}
          className="flex items-center px-4 py-2 bg-[#003b75] text-white rounded-md cursor-pointer transition-colors shadow-md"
          disabled={isSubmitting} // Disable "Add New Player" button during submission
        >
          <Plus size={20} className="mr-2" /> Add New Player
        </button>
      </div>

      {/* Player List Table */}
      {players && players.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Number
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gender
                </th>
                <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {players.map((player) => (
                <tr key={player._id} className="hover:bg-gray-50">
                  <td className="py-4 px-6 whitespace-nowrap">
                    {/* Display actual player image */}
                    <img
                      src={player.img}
                      alt={player.name || "Player Image"}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-[#003b75]">
                    {player.name}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-[#003b75]">
                    {player.number}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-[#003b75]">
                    {player.position}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-[#003b75]">
                    {player.gender}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-center items-center space-x-2">
                      <button
                        onClick={() => handleEditPlayer(player)}
                        className="text-blue-600 hover:text-blue-900 cursor-pointer bg-blue-100 p-2 rounded-full transition-colors"
                        title="Edit Player"
                        disabled={isSubmitting} // Disable edit button during submission
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(player._id!)}
                        className="text-red-600 hover:text-red-900 cursor-pointer bg-red-100 p-2 rounded-full transition-colors"
                        title="Delete Player"
                        disabled={
                          deletePlayerMutation.isPending || isSubmitting
                        } // Disable delete button during submission
                      >
                        {deletePlayerMutation.isPending &&
                        playerToDeleteId === player._id ? (
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
      ) : (
        <p className="text-center text-gray-600 py-8">
          No players found. Click "Add New Player" to get started!
        </p>
      )}

      {/* Render the PlayerFormModal */}
      <PlayerFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingPlayer={editingPlayer}
        onSubmit={handleSubmitPlayer}
        isSubmitting={isSubmitting} // Pass the combined submission state
      />

      <ConfirmationModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete ${
          players?.find((p) => p._id === playerToDeleteId)?.name ||
          "this player"
        }? This action cannot be undone.`}
        isConfirming={deletePlayerMutation.isPending}
      />
    </div>
  );
};

export default PlayerManagementPage;
