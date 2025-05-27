import React, { useState } from "react";
import { Plus, Edit, Trash, XCircle, Loader2 } from "lucide-react";
import usePlayers from "../../hooks/usePlayers";
import type { Player } from "../../types";
import type { PlayerFormData } from "../../schemas/playerSchemas";
import PlayerFormModal from "../../components/PlayerModal";
import { ConfirmationModal } from "../../components";

const PlayerManagementPage: React.FC = () => {
  const {
    players,
    playersLoading,
    playersError,
    createPlayerMutation,
    updatePlayerMutation,
    deletePlayerMutation,
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

  const handleFormSubmit = async (data: PlayerFormData) => {
    try {
      if (editingPlayer?._id) {
        await updatePlayerMutation.mutateAsync({
          id: editingPlayer._id,
          playerData: data,
        });
      } else {
        const { ...newData } = data;
        await createPlayerMutation.mutateAsync(newData);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save player:", error);
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
                    <img
                      src="/zinme.jpg"
                      alt={player.name}
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
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(player._id)}
                        className="text-red-600 hover:text-red-900 cursor-pointer bg-red-100 p-2 rounded-full transition-colors"
                        title="Delete Player"
                        disabled={deletePlayerMutation.isPending}
                      >
                        {deletePlayerMutation.isPending ? (
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
        onSubmit={handleFormSubmit}
        isSubmitting={
          createPlayerMutation.isPending || updatePlayerMutation.isPending
        }
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
