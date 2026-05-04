import React from "react";
// import { useSelector } from "react-redux";
// import type { RootState } from "../store";
import useAuth from "../hooks/useAuth";
import { Link, Outlet } from "react-router";
import { Button } from "../components";
import { LogOut } from "lucide-react";

const AdminLayout: React.FC = () => {
  // const { user } = useSelector((state: RootState) => state.auth);
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-primary text-white p-6 flex flex-col shadow-lg">
        <h2 className="text-3xl font-bold mb-8 text-center border-b border-gray-700 pb-4">
          Admin Panel
        </h2>
        <nav className="flex-grow">
          <ul className="space-y-4">
            <li>
              <Link
                to="/admin"
                className="block text-xl font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                <p className="text-white">Dashboard</p>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/players"
                className="block text-xl font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                <p className="text-white">Player Management</p>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/activities"
                className="block text-xl font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                <p className="text-white">Activities Management</p>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/galleries"
                className="block text-xl font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                <p className="text-white">Gallery Management</p>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/news"
                className="block text-xl font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                <p className="text-white">News Management</p>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/club"
                className="block text-xl font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                <p className="text-white">Our Club Management</p>
              </Link>
            </li>
          </ul>
        </nav>
        <Button
          onClick={logout}
          className="mt-6 flex items-center gap-2 px-4 py-2 rounded-md bg-primary hover:bg-primary text-white text-base font-medium transition-colors duration-200"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </aside>

      <main className="flex-grow p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
