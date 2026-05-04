import { Facebook, Instagram, Mail, Phone } from "lucide-react";
import { Link } from "react-router";
import { navLinks } from "../constants";

const Footer = () => {
  return (
    <footer className="bg-primary text-white mt-auto">
      {/* Club crest centered above columns */}
      <div className="flex justify-center pt-10 pb-6">
        <img
          src="/ZMUTD Official.png"
          alt="Zinme United"
          className="h-16 w-auto"
        />
      </div>

      {/* 3-column grid */}
      <div className="max-w-[var(--container-content)] mx-auto px-6 pb-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Column 1: Quick Links */}
        <div>
          <h3 className="font-heading text-lg uppercase tracking-wide mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2 text-white/70">
            {navLinks.map((link) => (
              <li key={link.route}>
                <Link
                  to={link.route}
                  className="hover:text-accent transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: Contact Info */}
        <div>
          <h3 className="font-heading text-lg uppercase tracking-wide mb-4">
            Contact
          </h3>
          <div className="space-y-3 text-white/70">
            <p className="flex items-center gap-2 justify-center md:justify-start">
              <Mail size={16} /> email@zinmeunited.com
            </p>
            <p className="flex items-center gap-2 justify-center md:justify-start">
              <Phone size={16} /> Contact via social media
            </p>
            <p>Zinme United Football Club</p>
          </div>
        </div>

        {/* Column 3: Social / Follow Us */}
        <div>
          <h3 className="font-heading text-lg uppercase tracking-wide mb-4">
            Follow Us
          </h3>
          <div className="flex gap-4 justify-center md:justify-start">
            <a
              href="https://www.facebook.com/zmutdfc"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-accent transition-colors"
            >
              <Facebook size={22} />
            </a>
            <a
              href="https://www.instagram.com/zinmeunited/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-accent transition-colors"
            >
              <Instagram size={22} />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10 py-4 text-center text-white/50 text-sm">
        &copy; {new Date().getFullYear()} Zinme United FC. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
