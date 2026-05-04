import { useState, useEffect } from "react";
import { navLinks } from "../constants";
import { Menu } from "lucide-react";
import { Link, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";
import MobileMenu from "./MobileMenu";

const useScrolled = (threshold = 50) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return scrolled;
};

const isActivePath = (linkRoute: string, pathname: string) => {
  if (linkRoute === "/") return pathname === "/";
  return pathname.startsWith(linkRoute);
};

const Navbar = () => {
  const { isLoggedIn, user } = useAuth();
  const scrolled = useScrolled();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-primary/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[var(--container-content)] mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/ZMUTD Official.png"
              alt="Zinme United"
              className="h-10 w-auto"
            />
            <span className="font-heading text-xl text-white uppercase tracking-wide">
              Zinme United
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.route}
                to={link.route}
                className={`px-3 py-2 text-sm font-medium uppercase tracking-wide transition-colors ${
                  isActivePath(link.route, location.pathname)
                    ? "text-accent border-b-2 border-accent"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {isLoggedIn && user?.role === "admin" && (
              <Link
                to="/admin"
                className={`px-3 py-2 text-sm font-medium uppercase tracking-wide transition-colors ${
                  isActivePath("/admin", location.pathname)
                    ? "text-accent border-b-2 border-accent"
                    : "text-white/80 hover:text-white"
                }`}
              >
                Admin Panel
              </Link>
            )}
          </div>

          {/* Hamburger button - right side, mobile only */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden text-white p-2"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </nav>
  );
};

export default Navbar;
