import React, { useState } from "react";
import "./css/ModalResetPassword.css";
import MessageBar, { showErrorMessage, showSuccessMessage } from "../messageBar/MessageBar";

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
            displayMessage(showErrorMessage("Por favor, ingrese su correo electrónico.", "center"));
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const result = await response.json();

            if (response.ok) {
                displayMessage(showSuccessMessage("Correo enviado exitosamente.", "center"));
                setTimeout(() => {
                    handleCloseModal();
                }, 3000);
            } else {
                displayMessage(showErrorMessage(result.msg || "Error al enviar el correo.", "center"));
            }
        } catch (error) {
            displayMessage(showErrorMessage("Error de conexión. Inténtelo de nuevo más tarde.", "center"));
        }
    };

    const handleCloseModal = () => {
        // Recargar la página al cerrar el modal
        window.location.reload();
    };

    return (
        <div className="resetPasswordModalContainer">
            <div className="resetPasswordModalBackgroundBlur"></div>
            <div className="resetPasswordModalContent">
                <div className="resetPasswordModalHeader">
                    <h2 className="resetPasswordModalTitle">Recuperar Contraseña</h2>
                    <button className="resetPasswordCloseButton" onClick={handleCloseModal}>
                        X
                    </button>
                </div>
                <div className="resetPasswordModalBody">
                    {messageBar}
                    <input 
                        type="email"
                        placeholder="Correo Electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="resetPasswordInputField"
                    />
                    <button className="resetPasswordSubmitButton" onClick={handlePasswordReset}>
                        Enviar Correo
                    </button> 
                </div>
            </div> 
        </div>
    );
};

export default ModalResetPassword;
