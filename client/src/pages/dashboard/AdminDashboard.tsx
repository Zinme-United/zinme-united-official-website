import React from "react";
import usePlayers from "../../hooks/usePlayers";
import useAuth from "../../hooks/useAuth";
import ClipLoader from "react-spinners/ClipLoader";

const AdminDashboard: React.FC = () => {
  const { players, playersError, playersLoading } = usePlayers();
  const { allUsersError, allUsersLoading, totalUsersCount } = useAuth();

  if (playersLoading || allUsersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <ClipLoader
          color="#003b75"
          loading={playersLoading}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }

  if (playersError || allUsersError) {
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
          <h3 className="font-bold text-lg text-blue-800">Total Players</h3>
          <p className="text-3xl text-blue-600">{players?.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow-sm">
          <h3 className="font-bold text-lg text-green-800">Total Users</h3>
          <p className="text-3xl text-green-600">{totalUsersCount}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg shadow-sm">
          <h3 className="font-bold text-lg text-yellow-800">New Activities</h3>
          <p className="text-3xl text-yellow-600">15</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
