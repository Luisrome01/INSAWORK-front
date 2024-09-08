import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import "./css/ModalResetPassword.css";
import MessageBar, {
  showErrorMessage,
  showSuccessMessage,
} from "../messageBar/MessageBar";
import InputGeneral from "../inputs/InputGeneral";

const ModalResetPassword = () => {
  const [email, setEmail] = useState("");
  const [messageBar, setMessageBar] = useState(null);

  const displayMessage = (messageComponent) => {
    setMessageBar(messageComponent);
    setTimeout(() => {
      setMessageBar(null);
    }, 3000);
  };

  const handlePasswordReset = async () => {
    if (!email) {
      displayMessage(
        showErrorMessage("Por favor, ingrese su correo electrónico.", "center")
      );
      return;
    }

    try {
      const response = await fetch("https://insawork.onrender.com/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        displayMessage(
          showSuccessMessage("Correo enviado exitosamente.", "center")
        );
        setTimeout(() => {
          handleCloseModal();
        }, 3000);
      } else {
        displayMessage(
          showErrorMessage(result.msg || "Error al enviar el correo.", "center")
        );
      }
    } catch (error) {
      displayMessage(
        showErrorMessage(
          "Error de conexión. Inténtelo de nuevo más tarde.",
          "center"
        )
      );
    }
  };

  const handleCloseModal = () => {
    window.location.reload();
  };

  return (
    <div className="resetPasswordModalContainer">
      <div className="resetPasswordModalBackgroundBlur"></div>
      <div className="resetPasswordModalContent">
        <div className="resetPasswordModalHeader">
          <h2 className="resetPasswordModalTitle">Recuperar Contraseña</h2>
          <button
            className="resetPasswordCloseButton"
            onClick={handleCloseModal}
          >
            <FaTimes />
          </button>
        </div>
        <div className="resetPasswordModalBody">
          {messageBar}
          <InputGeneral
            name={"Correo electrónico"}
            type="text"
            placeholder=" ej. nombre@gmail.com"
            width="100%"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="resetPasswordInputField"
          />
          <div
            className="resetPasswordSubmitButton"
            onClick={handlePasswordReset}
          >
            Enviar Correo
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalResetPassword;
