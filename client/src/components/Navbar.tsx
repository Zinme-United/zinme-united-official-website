import { useState } from "react";
import { routeLinks } from "../constants";
import { Menu, X, type LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router"; // add useLocation
import useAuth from "../hooks/useAuth";

export interface RouteLink {
  id: number;
  label: string;
  route: string;
  icon: LucideIcon;
}

const Navbar = () => {
  const { isLoggedIn, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); // current route path

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-primary shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div>
            <Link
              to="/"
              className="flex items-center py-2 px-2 text-indigo-300 hover:text-white gap-2"
            >
              <img
                src="/ZMUTD Official.png"
                alt="Zinme United"
                className="h-8 w-auto"
              />
              <span className="font-bold text-xl text-white">Zinme United</span>
            </Link>
          </div>

          {/* Desktop Menu Links */}
          <div className="hidden sm:flex items-center space-x-4">
            {routeLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.id}
                  to={link.route}
                  className={`py-2 px-3 flex items-center transition-colors duration-200 ${
                    isActive(link.route)
                      ? "text-accent font-bold border-b-2 border-accent"
                      : "text-white/80 hover:text-accent"
                  }`}
                >
                  <Icon size={18} className="mr-1 text-white" />
                  <p className="text-white">{link.label}</p>
                </Link>
              );
            })}

            {isLoggedIn && user?.role === "admin" && (
              <Link
                to="/admin"
                className={`py-2 px-3 flex items-center transition-colors duration-200 ${
                  isActive("/admin")
                    ? "text-white border-b-2 border-yellow-400 pb-1"
                    : "text-white/80 hover:text-white"
                }`}
              >
                <p className="text-white">Admin Panel</p>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="mobile-menu-button p-2 text-indigo-300 hover:text-white focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`sm:hidden ${isOpen ? "block" : "hidden"}`}>
        {routeLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.id}
              to={link.route}
              onClick={() => setIsOpen(false)}
              className={`block py-3 px-4 flex items-center transition-colors duration-200 ${
                isActive(link.route)
                  ? "bg-primary-light text-white px-3 py-1 shadow-md"
                  : "text-white/80 hover:text-white"
              }`}
            >
              <Icon size={18} className="mr-1 text-white" />
              <p className="text-white">{link.label}</p>
            </Link>
          );
        })}

        {isLoggedIn && user?.role === "admin" && (
          <Link
            to="/admin"
            onClick={() => setIsOpen(false)}
            className={`block py-3 px-4 flex items-center transition-colors duration-200 ${
              isActive("/admin")
                ? "bg-indigo-600 text-white"
                : "text-indigo-300 hover:bg-indigo-800"
            }`}
          >
            Admin Panel
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
