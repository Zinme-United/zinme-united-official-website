import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import Home from "./pages/home/Home";
import Activities from "./pages/activities/Activities";
import Players from "./pages/players/Players";
import NotFound from "./pages/404/NotFound";
import LoginPage from "./pages/login/LoginPage";
import UnauthorizedPage from "./pages/unauthorized/UnauthorizedPage";
import RegisterPage from "./pages/register/RegisterPage";

// Components & Layouts
import { Footer, Navbar, ProtectedRoute } from "./components";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import PlayerManagementPage from "./pages/player-management/PlayerManagementPage";
import GalleryManagementPage from "./pages/gallery-management/GalleryManagementPage";
import ActivityManagementPage from "./pages/activity-management/ActivityManagementPage";
import NewsManagementPage from "./pages/news-management/NewsManagementPage";
import NewsDetails from "./pages/news-details/NewsDetails";
import PlayerDetailPage from "./pages/player-details/PlayerDetails";
import GalleryDetailPage from "./pages/gallery-details/GalleryDetailsPage";
import NewsPage from "./pages/news/NewsPage";

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
      {
        path: "player/:id",
        element: <PlayerDetailPage />,
      },
      {
        path: "gallery-details/:id",
        element: <GalleryDetailPage />,
      },
      {
        path: "news",
        element: <NewsPage />,
      },
      {
        path: "news/:id",
        element: <NewsDetails />,
      },
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
            path: "activities",
            element: <ActivityManagementPage />,
          },
          {
            children: [
              {
                path: "galleries",
                element: <GalleryManagementPage />,
              },
              {
                path: "news",
                element: <NewsManagementPage />,
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
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default App;
