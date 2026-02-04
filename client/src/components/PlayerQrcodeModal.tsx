import React, { useState, useMemo } from "react";
import { QRCodeCanvas } from "qrcode.react";
import type { Player } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
}

const PlayerQRModal: React.FC<Props> = ({ isOpen, onClose, players }) => {
  const [genderFilter, setGenderFilter] = useState<"Male" | "Female">("Male");

  // ✅ Hooks must always be called at the top
  const filteredPlayers = useMemo(
    () => players.filter((p) => p.gender === genderFilter),
    [players, genderFilter]
  );

  if (!isOpen) return null;

  const handleDownload = (player: Player) => {
    const canvas = document.getElementById(
      `qr-${player._id}`
    ) as HTMLCanvasElement;
    const pngUrl = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = `${player.name}-qr.png`;
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-[700px]">
        <h2 className="text-2xl font-bold mb-4">Player QR Codes</h2>

        {/* Gender Filter */}
        <div className="mb-4">
          <label className="mr-2 font-semibold text-black">Gender:</label>
          <select
            value={genderFilter}
            onChange={(e) =>
              setGenderFilter(e.target.value as "Male" | "Female")
            }
            className="px-3 py-1 border rounded-md text-black"
          >
            <option value="Male" className="text-black">
              Male
            </option>
            <option value="Female" className="text-black">
              Female
            </option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
          {filteredPlayers.map((p) => (
            <div
              key={p._id}
              className="border rounded-lg p-4 flex flex-col items-center"
            >
              <QRCodeCanvas
                id={`qr-${p._id}`}
                value={`https://zmutd.vercel.app/player/${p._id}`}
                size={150}
                imageSettings={{
                  src: "../../public/zinme.jpg",
                  width: 50,
                  height: 50,
                  excavate: false,
                  crossOrigin: "anonymous",
                }}
              />

              <p className="mt-3 font-semibold text-center text-black">
                {p.name} {p.number ? `(#${p.number})` : ""}
              </p>

              <button
                onClick={() => handleDownload(p)}
                className="mt-3 px-3 py-1 bg-blue-600 text-white rounded-lg"
              >
                Download PNG
              </button>
            </div>
          ))}

          {filteredPlayers.length === 0 && (
            <p className="col-span-2 text-center text-gray-500 mt-4">
              No players found for selected gender.
            </p>
          )}
        </div>

        <div className="flex justify-end mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerQRModal;
