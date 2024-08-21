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
            const response = await fetch("http://localhost:3000/change-password", {
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
        <div className="modalChangePasswordContainer">
            <div className="modalChangePasswordBackgroundBlur"></div>
            <div className="modalChangePasswordContent">
                <div className="modalHeader">
                    <h2 className="modalTitle">Cambiar Contraseña</h2>
                    <button className="closeButton" onClick={() => closeModal(false)}>
                        X
                    </button>
                </div>
                <div className="modalBody">
                    {messageBar}
                    <input
                        type="email"
                        placeholder="Correo Electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="inputField"
                    />
                    <div className="passwordField">
                        <input
                            type={showCurrentPassword ? "text" : "password"}
                            placeholder="Contraseña actual"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="inputField"
                        />
                        <button
                            type="button"
                            className="toggleVisibility"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                            {showCurrentPassword ? <FaEye /> : <FaEyeSlash />}
                        </button>
                    </div>
                    <div className="passwordField">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Nueva contraseña"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="inputField"
                        />
                        <button
                            type="button"
                            className="toggleVisibility"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                            {showNewPassword ? <FaEye /> : <FaEyeSlash />}
                        </button>
                    </div>
                    <button className="changePasswordButton" onClick={handlePasswordChange}>
                        Cambiar Contraseña
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalChangePassword;
