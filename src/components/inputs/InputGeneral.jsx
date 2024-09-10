import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./css/InputGeneral.css";

const InputGeneral = ({
  type,
  placeholder,
  width,
  value,
  onChange,
  height,
  color,
  borderRadius,
  shadow,
  name,
  onEnter,
  isPassword,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const style = {
    width: width,
    height: height,
    backgroundColor: color,
    borderRadius: borderRadius,
    boxShadow: shadow,
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="containerName">
        <span>{name}</span>
      </div>
      <div className="input-container">
        <input
          type={isPassword && !showPassword ? "password" : type}
          placeholder={placeholder}
          style={style}
          value={value}
          onChange={onChange}
          className="InputGeneral"
          
          onKeyDown={(event) => {
            if (event.key === "Enter" && typeof onEnter === "function") {
              onEnter();
            }
          }}
        />
        {isPassword && (
          <div className="icon-container" onClick={togglePasswordVisibility}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        )}
      </div>
    </>
  );
};

export default InputGeneral;
