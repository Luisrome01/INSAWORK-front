import React, { useState } from "react";
import "./css/ModalChangePassword.css";
import MessageBar, { showErrorMessage, showSuccessMessage } from "../messageBar/MessageBar";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ModalChangePassword = ({ closeModal }) => {
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [messageBar, setMessageBar] = useState(null);

    const displayMessage = (messageComponent) => {
        setMessageBar(messageComponent);
        setTimeout(() => {
            setMessageBar(null);
        }, 3000);
    };

    const handlePasswordChange = async () => {
        if (!email || !currentPassword || !newPassword) {
            displayMessage(showErrorMessage("Por favor, complete todos los campos.", "center"));
            return;
        }

        try {
            const response = await fetch("https://insawork.onrender.com/change-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    currentPassword,
                    newPassword,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                displayMessage(showSuccessMessage("Contraseña cambiada exitosamente.", "center"));
                setTimeout(() => {
                    closeModal(false);
                }, 3000);
            } else {
                let errorMessage;
                switch (result.errorCode) {
                    case "USER_NOT_FOUND":
                        errorMessage = "El usuario (correo electrónico) no existe.";
                        break;
                    case "INCORRECT_PASSWORD":
                        errorMessage = "La contraseña actual es incorrecta.";
                        break;
                    case "PASSWORD_TOO_SHORT":
                        errorMessage = "La nueva contraseña es demasiado corta. Debe tener al menos 8 caracteres.";
                        break;
                    case "PASSWORD_TOO_WEAK":
                        errorMessage = "La nueva contraseña es demasiado débil. Debe contener letras y números.";
                        break;
                    default:
                        errorMessage = result.msg || "Error desconocido.";
                        break;
                }
                displayMessage(showErrorMessage(errorMessage, "center"));
            }
        } catch (error) {
            displayMessage(showErrorMessage("Error de conexión. Inténtelo de nuevo más tarde.", "center"));
        }
    };

    return (
        <div className="changePasswordModalContainer">
            <div className="changePasswordModalBackgroundBlur"></div>
            <div className="changePasswordModalContent">
                <div className="changePasswordModalHeader">
                    <h2 className="changePasswordModalTitle">Cambiar Contraseña</h2>
                    <button className="changePasswordCloseButton" onClick={() => closeModal(false)}>
                        X
                    </button>
                </div>
                <div className="changePasswordModalBody">
                    {messageBar}
                    <input 
                        type="email"
                        placeholder="Correo Electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="changePasswordInputField"
                    />
                    <div className="changePasswordField">
                        <input
                            type={showCurrentPassword ? "text" : "password"}
                            placeholder="Contraseña actual"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="changePasswordInputField"
                        />
                        <button
                            type="button"
                            className="changePasswordToggleVisibility"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                            {showCurrentPassword ? <FaEye /> : <FaEyeSlash />}
                        </button>
                    </div>
                    <div className="changePasswordField">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Nueva contraseña"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="changePasswordInputField"
                        />
                        <button
                            type="button"
                            className="changePasswordToggleVisibility"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                            {showNewPassword ? <FaEye /> : <FaEyeSlash />}
                        </button>
                    </div>
                    <button className="changePasswordSubmitButton" onClick={handlePasswordChange}>
                        Cambiar Contraseña
                    </button> 
                </div>
            </div> 
        </div>
    );
};

export default ModalChangePassword;
