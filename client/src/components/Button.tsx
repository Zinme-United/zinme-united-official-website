import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <button
      className={`bg-[#003b75] hover:bg-[#003b75] text-white font-bold py-3 px-6 rounded-full text-base transition duration-300 transform hover:scale-105 shadow-lg ${
        props.disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
