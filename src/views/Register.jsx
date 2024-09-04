import React, { useState } from "react";
import InputGeneral from "../components/inputs/InputGeneral";
import page from "../assets/logomedico.png";
import { FaCamera } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  showSuccessMessage,
  showErrorMessage,
} from "../components/messageBar/MessageBar";
import "./css/Register.css";

const Register = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [profileImg, setProfileImg] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Correo electrónico es requerido";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Formato de correo electrónico inválido";
    if (!username) newErrors.username = "Nombre de usuario es requerido";
    if (!password) newErrors.password = "Contraseña es requerida";
    if (step === 2) {
      if (!name) newErrors.name = "El nombre es requerido";
      if (!lastname) newErrors.lastname = "El apellido es requerido";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateForm()) {
      setStep(2);
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("lastname", lastname);
    formData.append("email", email);
    formData.append("username", username);
    formData.append("password", password);
    if (profileImg) {
      formData.append("profileImg", profileImg);
    }
    console.log("Form data:", formData);
    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        setMessage(showSuccessMessage("Registro exitoso", "center")); // Mostrar mensaje de éxito
        setTimeout(() => {
          navigate("/"); // Redirige al usuario a la ruta '/'
        }, 3000); // Espera 3 segundos antes de redirigir
      } else {
        const data = await response.json();
        setErrors({ general: data.msg || "Error al registrar el usuario" });
        setMessage(
          showErrorMessage(
            data.msg || "Error al registrar el usuario",
            "center"
          )
        ); // Mostrar mensaje de error
      }
    } catch (error) {
      console.error("Error:", error);
      setErrors({ general: "Error al conectar con el servidor" });
      setMessage(
        showErrorMessage("Error al conectar con el servidor", "center")
      ); // Mostrar mensaje de error
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImg(file);
  };

  return (
    <div className="RegContainerGeneral">
      <div className="RegContainer">
        <div className="RegSubContainer">
          <div className="RegContainerTitle">
            <img src={page} alt="imagen" className="RegImage" />
            <h1 className="RegSubTitle">Crea tu cuenta</h1>
            <p className="RegBelowTitle">
              Accede a datos clave para tu salud ocupacional
            </p>
          </div>
          <div className="RegisterContent">
            {step === 1 && (
              <>
                <InputGeneral
                  name={"Correo Electrónico"}
                  type="email"
                  placeholder="ej. jubert.perez@example.com"
                  width="100%"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={errors.email ? "InputError" : ""}
                />
                {errors.email && <p className="RegErrorText">{errors.email}</p>}
                <InputGeneral
                  name={"Nombre de Usuario"}
                  type="text"
                  placeholder="ej. jubertperez123"
                  width="100%"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={errors.username ? "InputError" : ""}
                />
                {errors.username && (
                  <p className="RegErrorText">{errors.username}</p>
                )}
                <InputGeneral
                  name={"Contraseña"}
                  type={"text"}
                  isPassword={true}
                  placeholder="Contraseña"
                  width="100%"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`LastInput ${errors.password ? "InputError" : ""}`}
                />
                {errors.password && (
                  <p className="RegErrorText">{errors.password}</p>
                )}
                {errors.general && (
                  <p className="RegErrorText">{errors.general}</p>
                )}
                <div className="RegisterButton" onClick={handleNextStep}>
                  Siguiente
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <div className="ImageUploadContainer">
                  <label htmlFor="profileImg" className="ImageUploadLabel">
                    {!profileImg && (
                      <>
                        <FaCamera className="CameraIcon" />
                      </>
                    )}
                    <input
                      type="file"
                      id="profileImg"
                      name="profileImg"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: "none" }}
                    />
                    {profileImg && (
                      <img
                        src={URL.createObjectURL(profileImg)}
                        alt="Vista previa"
                        className="ImagePreview"
                      />
                    )}
                  </label>
                </div>
                <InputGeneral
                  name={"Nombres"}
                  type="text"
                  placeholder="ej. Jubert"
                  width="100%"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={errors.name ? "InputError" : ""}
                />
                {errors.name && <p className="RegErrorText">{errors.name}</p>}
                <InputGeneral
                  name={"Apellidos"}
                  type="text"
                  placeholder="ej. Perez"
                  width="100%"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  className={errors.lastname ? "InputError" : ""}
                />
                {errors.lastname && (
                  <p className="RegErrorText">{errors.lastname}</p>
                )}
                <div className="RegisterButton" onClick={handleRegister}>
                  Registrar
                </div>
              </>
            )}
          </div>
          <a href="/" className="RegRegisterLink">
            ¿Ya tienes una cuenta?{" "}
            <span className="RegRegisterSpan">Inicia sesión aquí</span>
          </a>
        </div>
      </div>
      {message}
    </div>
  );
};

export default Register;
