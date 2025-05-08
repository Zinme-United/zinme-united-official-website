import "./App.css";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import Home from "./pages/home/Home";
import Activities from "./pages/activities/Activities";
import Players from "./pages/players/Players";
import NotFound from "./pages/404/NotFound";
import Navbar from "./components/Navbar";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Outlet />
      </div>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
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
