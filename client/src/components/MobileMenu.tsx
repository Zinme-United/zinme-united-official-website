import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { X, Facebook } from "lucide-react";
import { Link, useLocation } from "react-router";
import { navLinks } from "../constants";
import useAuth from "../hooks/useAuth";

interface MobileMenuProps {
  open: boolean;
  onClose: (value: boolean) => void;
}

const isActivePath = (linkRoute: string, pathname: string) => {
  if (linkRoute === "/") return pathname === "/";
  return pathname.startsWith(linkRoute);
};

const MobileMenu = ({ open, onClose }: MobileMenuProps) => {
  const location = useLocation();
  const { isLoggedIn, user } = useAuth();

  return (
    <Transition show={open}>
      <Dialog onClose={onClose} className="relative z-50">
        {/* Background overlay */}
        <TransitionChild
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-primary" />
        </TransitionChild>

        {/* Panel content */}
        <TransitionChild
          enter="transition-transform duration-300 ease-out"
          enterFrom="-translate-y-full"
          enterTo="translate-y-0"
          leave="transition-transform duration-200 ease-in"
          leaveFrom="translate-y-0"
          leaveTo="-translate-y-full"
        >
          <DialogPanel className="fixed inset-0 flex flex-col items-center px-6 py-8">
            {/* Close button - top right */}
            <button
              onClick={() => onClose(false)}
              className="absolute top-5 right-5 text-white p-2"
              aria-label="Close menu"
            >
              <X size={28} />
            </button>

            {/* Club crest - prominently at top */}
            <img
              src="/ZMUTD Official.png"
              alt="Zinme United"
              className="h-20 w-auto mt-8 mb-2"
            />
            <span className="font-heading text-white text-lg uppercase tracking-widest mb-10">
              Zinme United
            </span>

            {/* Nav links - center, large and tap-friendly */}
            <nav className="flex flex-col items-center gap-6 flex-grow justify-center">
              {navLinks.map((link) => (
                <Link
                  key={link.route}
                  to={link.route}
                  onClick={() => onClose(false)}
                  className={`font-heading text-2xl uppercase tracking-wide transition-colors ${
                    isActivePath(link.route, location.pathname)
                      ? "text-accent"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {isLoggedIn && user?.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={() => onClose(false)}
                  className={`font-heading text-lg uppercase tracking-wide transition-colors ${
                    isActivePath("/admin", location.pathname)
                      ? "text-accent"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  Admin Panel
                </Link>
              )}
            </nav>

            {/* Social icons - bottom */}
            <div className="flex gap-6 pb-8">
              <a
                href="https://www.facebook.com/zmutdfc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-accent transition-colors"
              >
                <Facebook size={24} />
              </a>
            </div>
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
};

export default MobileMenu;
