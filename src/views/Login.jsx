import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BtnGeneral from "../components/buttons/BtnGeneral";
import InputGeneral from "../components/inputs/InputGeneral";
import image from "../assets/tabler_login.svg";
import page from "../assets/logomedico.svg";
import "./css/Login.css";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import ModalResetPassword from "../components/modal/ModalResetPassword";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    console.log("Handling login...");
    
    if (!email || !password) {
      setError("Por favor ingresa correo electrónico y contraseña.");
      console.log("Missing email or password.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Response from server:", data);

      if (response.ok) {
        console.log("Login successful:", data);

        // Fetch additional user details
        const userResponse = await fetch(`http://localhost:3000/user/${data.userID}`, {
          headers: {
            "Authorization": `Bearer ${data.token}`,
          },
        });
 
        const userData = await userResponse.json();

        if (userResponse.ok) {
          // Store the complete user information in localStorage
          localStorage.setItem("user", JSON.stringify({
            _id: data.userID,
            email: email,
            username: userData.username || "", // Use an empty string if username is not returned
            password: password,
            name: userData.name || "", // Use an empty string if name is not returned
            lastname: userData.lastname || "" // Use an empty string if lastname is not returned
          }));

          setUser({ token: data.token, userID: data.userID });
          navigate("/main");
        } else {
          setError("No se pudo obtener información del usuario.");
        }
      } else {
        console.log("Error response from server:", data.msg);
        setError(data.msg || "Ocurrió un error al iniciar sesión.");
      }
    } catch (error) {
      console.error("Network error:", error);
      setError("Error de red. Por favor, inténtalo de nuevo.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    console.log("Password visibility toggled:", !showPassword);
  };

  const handleOpenResetPasswordModal = () => {
    setIsResetPasswordModalOpen(true);
  };

  const handleCloseResetPasswordModal = () => {
    setIsResetPasswordModalOpen(false);
  };

  return (
    <div className="LogContainerGeneral">
      <div className="LogContainer">
        <div className="LogSubContainer">
          <div className="LogContainerTitle">
            <h3 className="LogTitle">INSAWORK</h3>
          </div>

          <div className="LogContainerSubTitle">
            <h1 className="LogSubTitle">Iniciar Sesión</h1>
          </div>

          <InputGeneral
            name={"Correo Electrónico"}
            type="text"
            placeholder=" ej. nombre@gmail.com"
            width="80%"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="InputWrapper">
            <InputGeneral
              name={"Contraseña"}
              type={showPassword ? "text" : "password"}
              placeholder=" Contraseña"
              width="80%"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onEnter={handleLogin}
              className="PasswordInput"
            />
            <button 
              type="button" 
              className="PasswordToggle" 
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {error && <p className="ErrorText">{error}</p>}
          <BtnGeneral text="Ingresar" handleClick={handleLogin} img={image} />

          <a href="/register" className="LogRegisterLink">
            ¿Aún no tienes una cuenta? Regístrate aquí
          </a>

          <p className="ForgotPasswordLink" onClick={handleOpenResetPasswordModal}>
            ¿Olvidaste tu contraseña?
          </p>
        <p>luisrome3005@gmail.com</p>
        </div>
      </div>
      <img src={page} alt="imagen" className="LogImage" />

      {isResetPasswordModalOpen && (
        <ModalResetPassword onClose={handleCloseResetPasswordModal} />
      )}
    </div>
  );
};

export default Login;
