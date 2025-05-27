import { useState } from "react";
import { routeLinks } from "../constants";
import { LogIn, LogOut, Menu, X, type LucideIcon } from "lucide-react";
import { Link } from "react-router";
import useAuth from "../hooks/useAuth";

export interface RouteLink {
  id: number;
  label: string;
  route: string;
  icon: LucideIcon;
}

const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prevState) => !prevState);
  };
  return (
    <nav className="bg-[#003b75] shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand Name */}
          <div>
            <Link
              to="/"
              className="flex items-center py-2 px-2 text-indigo-300 hover:text-white"
            >
              <span className="font-bold text-xl text-white">Zinme United</span>
            </Link>
          </div>

          {/* Desktop Menu Links */}
          <div className="hidden sm:flex items-center space-x-4">
            {/* Public Route Links */}
            {routeLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.id}
                  to={link.route}
                  className="py-2 px-3 hover:text-white flex items-center transition-colors duration-200"
                >
                  <Icon size={18} className="mr-1 text-white" />
                  <p className="text-white">{link.label}</p>
                </Link>
              );
            })}

            {/* Conditional Admin Panel Link (Desktop) */}
            {isLoggedIn && user?.role === "admin" && (
              <Link
                to="/admin"
                className="py-2 px-3 cursor-pointer hover:text-white flex items-center transition-colors duration-200"
              >
                <p className="text-white">Admin Panel</p>
              </Link>
            )}

            {/* Login/Logout Button (Desktop) */}
            {isLoggedIn ? (
              <button
                onClick={logout}
                className="py-2 px-3 bg-red-600 text-white cursor-pointer rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center"
              >
                <LogOut size={18} className="mr-1" />
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="py-2 px-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center"
              >
                <LogIn size={18} className="mr-1" />
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
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

      {/* Mobile menu content */}
      <div className={`sm:hidden ${isOpen ? "block" : "hidden"}`}>
        {/* Public Route Links (Mobile) */}
        {routeLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.id}
              to={link.route}
              className="block py-3 px-4 text-indigo-300 hover:bg-indigo-800 transition-colors duration-200 flex items-center"
              onClick={() => setIsOpen(false)}
            >
              <Icon size={18} className="mr-1 text-white" />
              <p className="text-white">{link.label}</p>
            </Link>
          );
        })}

        {/* Conditional Admin Panel Link (Mobile) */}
        {isLoggedIn && user?.role === "admin" && (
          <Link
            to="/admin"
            className="block py-3 px-4 text-indigo-300 hover:bg-indigo-800 transition-colors duration-200 flex items-center"
            onClick={() => setIsOpen(false)}
          >
            Admin Panel
          </Link>
        )}

        {/* Login/Logout Button (Mobile) */}
        {isLoggedIn ? (
          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="block w-full text-left py-3 px-4 cursor-pointer bg-red-600 text-white hover:bg-red-700 transition-colors duration-200 flex items-center"
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="block w-full text-left py-3 px-4 bg-green-600 text-white hover:bg-green-700 transition-colors duration-200 flex items-center"
            onClick={() => setIsOpen(false)}
          >
            <LogIn size={18} className="mr-2" />
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
