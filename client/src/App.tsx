import "./App.css";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import Home from "./pages/home/Home";
import Activities from "./pages/activities/Activities";
import Players from "./pages/players/Players";
import NotFound from "./pages/404/NotFound";
import { Footer, Navbar } from "./components";
import ProtectedRoute from "./components/ProtectedRoutes";
import LoginPage from "./pages/login/LoginPage";
import UnauthorizedPage from "./pages/unauthorized/UnauthorizedPage";
import RegisterPage from "./pages/register/RegisterPage";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import PlayerManagementPage from "./pages/player-management/PlayerManagementPage";

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "activities",
        element: <Activities />,
      },
      {
        path: "players",
        element: <Players />,
      },
      // Add other public routes here
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },
  {
    element: <ProtectedRoute allowedRoles={["admin"]} />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          {
            index: true, // Matches /admin
            element: <AdminDashboard />,
          },
          {
            path: "players",
            element: <PlayerManagementPage />,
          },
          {
            // User management is typically only for 'admin' role, even if 'editor' can access other admin pages
            // This nested ProtectedRoute ensures only 'admin' can see the users page
            // element: <ProtectedRoute allowedRoles={["admin"]} />,
            children: [
              {
                path: "users", // Matches /admin/users
                // element: <UserManagementPage />,
              },
            ],
          },
          // Add more admin sub-routes here
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
