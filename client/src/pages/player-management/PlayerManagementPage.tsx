import React, { useMemo, useState } from "react";
import {
  Plus,
  Edit,
  Trash,
  XCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import usePlayers from "../../hooks/usePlayers";
import type { Player } from "../../types";
import type { PlayerFormData } from "../../schemas/playerSchemas";
import PlayerFormModal from "../../components/PlayerModal"; // Adjusted import path
import { ConfirmationModal } from "../../components"; // Assuming this is correct
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import PlayerQRModal from "../../components/PlayerQrcodeModal";

const PLAYERS_PER_PAGE = 10;

const PlayerManagementPage: React.FC = () => {
  const {
    players,
    playersLoading,
    playersError,
    createPlayerMutation,
    updatePlayerMutation,
    deletePlayerMutation,
    uploadImageMutation,
  } = usePlayers();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);
  const [playerToDeleteId, setPlayerToDeleteId] = useState<string | null>(null);

  const [genderFilter, setGenderFilter] = useState<"Male" | "Female">("Male");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

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
    let imageUrl: string = data.img || "";

    if (imageFile) {
      try {
        const formData = new FormData();
        formData.append("image", imageFile);

        const uploadResult = await uploadImageMutation.mutateAsync(formData);

        if (uploadResult.status) {
          imageUrl = uploadResult.data.imageUrl;
        } else {
          toast.error(uploadResult.message || "Image upload failed.");
          return;
        }
      } catch (error) {
        console.error("Error during image upload:", error);
        return;
      }
    } else if (editingPlayer && !imageFile) {
      imageUrl = editingPlayer.img;
    } else if (!editingPlayer && !imageFile) {
      toast.error("Player image is required for new players.");
      return;
    }

    const playerPayload = { ...data, img: imageUrl };

    try {
      if (editingPlayer && editingPlayer._id) {
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
      handleCloseModal();
    } catch (error) {
      console.error("Error in player creation/update:", error);
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

  const isSubmitting =
    createPlayerMutation.isPending ||
    updatePlayerMutation.isPending ||
    uploadImageMutation.isPending;

  const filteredPlayers = useMemo(() => {
    if (!players) return [];

    return players
      .filter((player) => player.gender === genderFilter)
      .filter((player) => {
        if (searchTerm.trim() === "") return true;
        const term = searchTerm.toLowerCase();
        return (
          player.name.toLowerCase().includes(term) ||
          player.number.toString().includes(term) ||
          player.position.toLowerCase().includes(term)
        );
      })
      .sort((a, b) => a.number - b.number);
  }, [players, genderFilter, searchTerm]);

  const totalPages = Math.ceil(filteredPlayers.length / PLAYERS_PER_PAGE);

  const paginatedPlayers = useMemo(() => {
    return filteredPlayers.slice(
      (currentPage - 1) * PLAYERS_PER_PAGE,
      currentPage * PLAYERS_PER_PAGE
    );
  }, [filteredPlayers, currentPage]);

  if (playersLoading) {
    return (
      <div className="flex items-center flex-column justify-center min-h-[400px] bg-white rounded-lg shadow-md">
        <Loader size={100} />
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
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-primary">Player Management</h1>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search name, number, position"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border text-primary border-gray-300 rounded-md"
          />

          {/* <input
            type="text"
            placeholder="Filter by number"
            value={numberFilter}
            onChange={(e) => {
              setNumberFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-primary border border-gray-300 rounded-md"
          />
          <select
            value={positionFilter}
            onChange={(e) => {
              setPositionFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-primary border border-gray-300 rounded-md"
          >
            <option value="All">All Positions</option>
            <option value="GK">Goalkeeper</option>
            <option value="CB">Defender</option>
            <option value="CM">Midfielder</option>
            <option value="CF">Forward</option>
          </select> */}
          <select
            value={genderFilter}
            onChange={(e) => {
              setGenderFilter(e.target.value as "Male" | "Female");
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-primary border border-gray-300 rounded-md"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <button
            onClick={handleAddPlayer}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-md cursor-pointer transition-colors shadow-md"
            disabled={isSubmitting}
          >
            <Plus size={20} className="mr-2" /> Add New Player
          </button>
        </div>
      </div>

      {paginatedPlayers.length > 0 ? (
        <>
          <div className="flex flex-col justify-between min-h-[600px]">
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
                  {paginatedPlayers.map((player) => (
                    <tr key={player._id} className="hover:bg-gray-50">
                      <td className="py-4 px-6 whitespace-nowrap">
                        <img
                          src={player.img}
                          alt={player.name}
                          loading="lazy"
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-primary">
                        {player.name}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-primary">
                        {player.number}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-primary">
                        {player.position}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-primary">
                        {player.gender}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-center items-center space-x-2">
                          <button
                            onClick={() => handleEditPlayer(player)}
                            className="text-blue-600 hover:text-blue-900 cursor-pointer bg-blue-100 p-2 rounded-full"
                            title="Edit Player"
                            disabled={isSubmitting}
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(player._id!)}
                            className="text-red-600 hover:text-red-900 cursor-pointer bg-red-100 p-2 rounded-full"
                            title="Delete Player"
                            disabled={
                              deletePlayerMutation.isPending || isSubmitting
                            }
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
          </div>

          <div className="flex justify-center items-center mt-4 space-x-2">
            <button
              onClick={() => setQrModalOpen(true)}
              className="flex items-center px-4 py-2 bg-green-600 text-black rounded-md shadow-md"
            >
              Generate QR Codes
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 cursor-pointer rounded-full text-primary disabled:opacity-30"
              title="Previous Page"
            >
              <ChevronLeft className="text-primary" size={24} />
            </button>

            <span className="text-primary font-medium">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 cursor-pointer rounded-full text-primary disabled:opacity-30"
              title="Next Page"
            >
              <ChevronRight className="text-primary" size={24} />
            </button>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-600 py-8">
          No players found. Click "Add New Player" to get started!
        </p>
      )}

      <PlayerFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingPlayer={editingPlayer}
        onSubmit={handleSubmitPlayer}
        isSubmitting={isSubmitting}
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

      <PlayerQRModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        players={players || []}
      />
    </div>
  );
};

export default PlayerManagementPage;
