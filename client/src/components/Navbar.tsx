import { useState } from "react";
import { routeLinks } from "../constants";
import { Menu, X, type LucideIcon } from "lucide-react";
import { Link } from "react-router";

export interface RouteLink {
  id: number;
  label: string;
  route: string;
  icon: LucideIcon;
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prevState) => !prevState);
  };
  return (
    <nav className="bg-[#003b75] shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div>
            <Link
              to="/"
              className="flex items-center py-2 px-2 text-indigo-300 hover:text-white" // Adjusted padding slightly
            >
              <span className="font-bold text-xl">Zinme United</span>
            </Link>
          </div>
          <div className="hidden sm:flex items-center space-x-4">
            {routeLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.id}
                  to={link.route}
                  className="py-2 px-3 text-indigo-300 hover:text-white flex items-center transition-colors duration-200" // Adjusted padding and added transition
                >
                  <Icon size={18} className="mr-1" />
                  {link.label}
                </Link>
              );
            })}
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

      {/* Mobile menu */}
      <div className={`sm:hidden ${isOpen ? "block" : "hidden"}`}>
        {routeLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.id}
              to={link.route}
              className="block py-3 px-4 text-indigo-300 hover:bg-indigo-800 transition-colors duration-200 flex items-center" // Added 'block' for full width links
              onClick={() => setIsOpen(false)}
            >
              <Icon size={18} className="mr-2" />
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
