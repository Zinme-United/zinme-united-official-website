import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/home/Home";
import Activities from "./pages/activities/Activities";
import Players from "./pages/players/Players";
import NotFound from "./pages/404/NotFound";

const router = createBrowserRouter([
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/activities",
    element: <Activities />,
  },
  {
    path: "/players",
    element: <Players />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
