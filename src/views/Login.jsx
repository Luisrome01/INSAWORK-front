import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputGeneral from "../components/inputs/InputGeneral";
import page from "../assets/logomedico.png";
import "./css/Login.css";
import ModalResetPassword from "../components/modal/ModalResetPassword";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);
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
      const response = await fetch("https://insawork.onrender.com/signin", {
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
        const userResponse = await fetch(`https://insawork.onrender.com/user/${data.userID}`, {
          headers: {
            "Authorization": `Bearer ${data.token}`,
          },
        });

        const userData = await userResponse.json();

        if (userResponse.ok) {
          localStorage.setItem(
            "user",
            JSON.stringify({
              _id: data.userID,
              email: email,
              username: userData.username || "",
              password: password,
              name: userData.name || "",
              lastname: userData.lastname || "",
            })
          );

          // Fetch userInfo and store it in localStorage
          const userInfoResponse = await fetch(`https://insawork.onrender.com/user/info/${data.userID}`, {
            headers: {
              "Authorization": `Bearer ${data.token}`,
            },
          });

          const userInfoData = await userInfoResponse.json();

          if (userInfoResponse.ok) {
            localStorage.setItem("userInfo", JSON.stringify(userInfoData));
          } else {
            console.error("Error fetching userInfo:", userInfoData);
          }

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
            <img src={page} alt="imagen" className="LogImage" />
            <h1 className="LogSubTitle">Bienvenido de nuevo</h1>
            <p className="LogBelowTitle">
              Accede a datos clave para tu salud ocupacional
            </p>
          </div>
          <InputGeneral
            name={"Correo Electrónico"}
            placeholder=" ej. nombre@gmail.com"
            width="100%"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputGeneral
            name={"Contraseña"}
            isPassword={true}
            placeholder=" Contraseña"
            width="100%"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onEnter={handleLogin}
            className="PasswordInput"
          />
          {error && <p className="ErrorText">{error}</p>}
          <p
            className="ForgotPasswordLink"
            onClick={handleOpenResetPasswordModal}
          >
            ¿Olvidaste tu contraseña?
          </p>
          <div className="LogButton" onClick={handleLogin}>
            Ingresar
          </div>
          <a href="/register" className="LogRegisterLink">
            ¿Aún no tienes una cuenta?{" "}
            <span className="LogRegisterSpan">Regístrate aquí</span>
          </a>
        </div>
      </div>

      {isResetPasswordModalOpen && (
        <ModalResetPassword onClose={handleCloseResetPasswordModal} />
      )}
    </div>
  );
};

export default Login;
