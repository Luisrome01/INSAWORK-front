import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Usar useNavigate en lugar de useHistory
import MessageBar, { showErrorMessage, showSuccessMessage } from "../messageBar/MessageBar"; // Importar MessageBar
import "./css/ModalDeleteAccount.css";

const ModalDeleteAccount = ({ closeModal }) => {
    const [email, setEmail] = useState("");
    const [messageBar, setMessageBar] = useState(null); // Estado para MessageBar
    const navigate = useNavigate(); // Cambiar a useNavigate

    const storedUser = JSON.parse(localStorage.getItem("user")); // Obtener el usuario almacenado

    const displayMessage = (messageComponent) => {
        setMessageBar(messageComponent);
        setTimeout(() => {
            setMessageBar(null);
        }, 3000);
    };

    const handleDeleteAccount = async () => {
        console.log("Botón de eliminar cuenta presionado"); // Console log para verificar

        if (storedUser.email !== email) {
            displayMessage(showErrorMessage("El email ingresado no coincide.", "center")); // Mostrar error si el email no coincide
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/delete-user", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                localStorage.clear(); // Limpiar el localStorage
                displayMessage(showSuccessMessage("Cuenta eliminada con éxito.", "center")); // Mostrar éxito
                setTimeout(() => navigate("/"), 3000); // Redirigir a la página principal después de 3 segundos
            } else {
                const errorData = await response.json(); // Obtener el mensaje de error del servidor
                displayMessage(showErrorMessage(errorData.message || "Error al eliminar la cuenta.", "center")); // Manejo de errores del servidor
                console.error("Error al eliminar la cuenta:", errorData);
            }
        } catch (error) {
            displayMessage(showErrorMessage("Error de conexión.", "center")); // Manejo de errores de conexión
            console.error("Error de conexión:", error);
        }
    };

    return (
        <div className="modalDeleteAccountContainer">
            <div className="modalDeleteAccountBackgroundBlur"></div>
            <div className="modalDeleteAccountContent">
                <div className="modalHeader">
                    <h2 className="modalTitle">Eliminar Cuenta</h2>
                    <button className="closeButton" onClick={() => closeModal(false)}>X</button>
                </div>
                <div className="modalBody">
                    <input
                        type="email"
                        placeholder="Ingrese su correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="inputField"
                    />
                    <button className="deleteAccountButton" onClick={handleDeleteAccount}>
                        Eliminar Cuenta
                    </button>
                </div>
            </div>
            {messageBar} {/* Renderizar el MessageBar aquí */}
        </div>
    );
};

export default ModalDeleteAccount;