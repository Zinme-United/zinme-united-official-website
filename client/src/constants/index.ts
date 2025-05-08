import { Users, Activity, Home } from "lucide-react";
import type { RouteLink } from "../components/Navbar";

export const routeLinks: RouteLink[] = [
  {
    id: 1,
    label: "Home",
    route: "/",
    icon: Home,
  },
  {
    id: 2,
    label: "Activities",
    route: "/activities",
    icon: Activity,
  },
  {
    id: 3,
    label: "Players",
    route: "/players",
    icon: Users,
  },
];
