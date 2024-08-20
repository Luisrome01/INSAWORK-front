import React, { useEffect, useState } from "react";
import "./css/ModalUsuario.css";
import ModalChangePassword from "./ModalChangePassword";

const ModalUsuario = ({ closeModal }) => {
    const [user, setUser] = useState({});
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    return (
        <div className="modalUsuarioContainer">
            <div className="modalUsuarioBackgroundBlur"></div>
            <div className="modalUsuarioContent">
                <div className="modalHeader">
                    <h2 className="modalTitle">Perfil de Usuario</h2>
                    <button
                        className="closeButton"
                        onClick={() => closeModal(false)}
                    >
                        X
                    </button>
                </div>
                <div className="modalBody">
                    <div className="userInfo">
                        <p><strong>Username:</strong> {user.username || user.email}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        {/* Agrega más campos aquí si es necesario */}
                    </div>
                    <button 
                        onClick={() => setShowChangePasswordModal(true)} 
                        className="changePasswordOpenButton"
                    >
                        Change Password
                    </button>
                </div>
            </div>
            {showChangePasswordModal && <ModalChangePassword closeModal={setShowChangePasswordModal} />}
        </div>
    );
};

export default ModalUsuario;
