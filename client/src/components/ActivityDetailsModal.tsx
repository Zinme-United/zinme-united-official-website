import React from "react";
import { X } from "lucide-react";
import type { Activity } from "../types";

interface ActivityDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: Activity | null;
}

const ActivityDetailsModal: React.FC<ActivityDetailsModalProps> = ({
  isOpen,
  onClose,
  activity,
}) => {
  if (!isOpen || !activity) return null;

  return (
    <div className="fixed inset-0 bg-[#003b75] bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 md:p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 cursor-pointer right-4 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-full p-2 transition-colors duration-200"
            aria-label="Close activity details"
          >
            <X size={24} />
          </button>

          <h2 className="text-3xl font-bold text-[#003b75] mb-6 text-center">
            Activity Details
          </h2>

          <div className="space-y-4 text-gray-800">
            <div>
              <p className="text-sm font-medium text-[#003b75]">Title:</p>
              <p className="text-lg font-semibold">{activity.title}</p>
            </div>

            {activity.description && (
              <div>
                <p className="text-sm font-medium text-[#003b75]">
                  Description:
                </p>
                <p className="text-base">{activity.description}</p>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-[#003b75]">Type:</p>
              <p className="text-base">
                {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-[#003b75]">Date:</p>
                <p className="text-base">
                  {new Date(activity.date).toLocaleDateString()}
                </p>
              </div>
              {activity.time && (
                <div>
                  <p className="text-sm font-medium text-[#003b75]">Time:</p>
                  <p className="text-base">{activity.time}</p>
                </div>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-[#003b75]">Location:</p>
              <p className="text-base">{activity.location}</p>
            </div>

            {activity.type === "match" && (
              <>
                {activity.opponent && (
                  <div>
                    <p className="text-sm font-medium text-[#003b75]">
                      Opponent:
                    </p>
                    <p className="text-base">{activity.opponent}</p>
                  </div>
                )}
                {activity.result && (
                  <div>
                    <p className="text-sm font-medium text-[#003b75]">
                      Result:
                    </p>
                    <p className="text-base">{activity.result}</p>
                  </div>
                )}
              </>
            )}

            <div className="flex items-center space-x-4">
              {activity.isNextMatch && (
                <span className="inline-block bg-yellow-100 text-yellow-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                  Next Match
                </span>
              )}
              {activity.isFeaturedEvent && (
                <span className="inline-block bg-purple-100 text-purple-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                  Featured Event
                </span>
              )}
              {!activity.isNextMatch && !activity.isFeaturedEvent && (
                <span className="text-sm text-gray-600">No special flags.</span>
              )}
            </div>

            <div className="pt-4 border-t border-gray-200 mt-4">
              <p className="text-sm text-[#003b75]">
                Created: {new Date(activity.createdAt).toLocaleString()}
              </p>
              <p className="text-sm text-[#003b75]">
                Last Updated: {new Date(activity.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetailsModal;
