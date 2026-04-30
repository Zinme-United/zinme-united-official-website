import React from "react";
import usePlayers from "../../hooks/usePlayers";
import useAuth from "../../hooks/useAuth";
import useActivities from "../../hooks/useActivities";
import Loader from "../../components/Loader";

const AdminDashboard: React.FC = () => {
  const { players, playersError, playersLoading } = usePlayers();
  const { allUsersError, allUsersLoading, totalUsersCount } = useAuth();
  const { activities, activitiesLoading, activitiesError } = useActivities();

  if (playersLoading || allUsersLoading || activitiesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader size={100} />
      </div>
    );
  }

  if (playersError || allUsersError || activitiesError) {
    return (
      <div className="p-4 text-center text-red-600">
        <p className="text-xl font-semibold mb-2">Error Loading Dashboard</p>
        {playersError && (
          <p className="text-sm">Players Data Error: {playersError.message}</p>
        )}
        {allUsersError && (
          <p className="text-sm">Users Data Error: {allUsersError.message}</p>
        )}
        <p className="text-sm mt-2">Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Dashboard Overview
      </h2>
      <p className="text-gray-600">
        Welcome to the Admin Dashboard. Here you can see a summary of key
        metrics and recent activities.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
          <h3 className="font-bold text-lg text-primary">Total Players</h3>
          <p className="text-3xl text-primary">{players?.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow-sm">
          <h3 className="font-bold text-lg text-green-800">Total Users</h3>
          <p className="text-3xl text-green-600">{totalUsersCount}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg shadow-sm">
          <h3 className="font-bold text-lg text-yellow-800">
            Total Activities
          </h3>
          <p className="text-3xl text-yellow-600">{activities?.length}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
