import { Facebook, Mail, Phone, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#003b75] text-gray-300 p-6 text-center text-sm shadow-inner rounded-t-xl mt-auto">
      <div className="container mx-auto">
        <p>&copy; 2025 Zinme United FC. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-4">
          <a
            href="#"
            className="hover:text-white transition-colors duration-200"
          >
            <Mail color="#FFFFFF" size={20} />
          </a>
          <a
            href="#"
            className="hover:text-white transition-colors duration-200"
          >
            <Phone color="#FFFFFF" size={20} />
          </a>
          <a
            href="https://www.facebook.com/zmutdfc"
            target="_blank"
            className="hover:text-white transition-colors duration-200"
          >
            <Facebook color="#FFFFFF" size={20} />
          </a>
          <a
            href="#"
            className="hover:text-white transition-colors duration-200"
          >
            <Twitter color="#FFFFFF" size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
