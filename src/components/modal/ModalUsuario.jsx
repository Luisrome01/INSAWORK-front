import React, { useEffect, useState } from "react";
import "./css/ModalUsuario.css";
import ModalChangePassword from "./ModalChangePassword";
import ModalDeleteAccount from "./ModalDeleteAccount"; // Importa el nuevo modal

const ModalUsuario = ({ closeModal }) => {
    const [user, setUser] = useState({});
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    return (
        <div className="usuarioModalContainer">
            <div className="usuarioModalBackgroundBlur"></div>
            <div className="usuarioModalContent">
                <div className="usuarioModalHeader">
                    <h2 className="usuarioModalTitle">Perfil de Usuario</h2>
                    <button className="usuarioCloseButton" onClick={() => closeModal(false)}>X</button>
                </div>
                <div className="usuarioModalBody">
                    <div className="usuarioInfo">
                        <p><strong>Username:</strong> {user.username || user.email}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                    </div>
                    {/* Sección de la foto de perfil */}
                    <div className="usuarioProfilePictureContainer">
                        <div className="usuarioProfilePictureWrapper">
                            <img
                                src={user.profilePicture || "default-profile.png"} // Ruta de la imagen por defecto
                                alt="Profile"
                                className="usuarioProfilePicture"
                            />
                        </div>
                        <button className="usuarioEditProfileButton">Change Profile Picture</button>
                    </div>
                    <div className="usuarioModalActions">
                        <button onClick={() => setShowChangePasswordModal(true)} className="usuarioChangePasswordOpenButton">
                            Change Password
                        </button>
                        <button onClick={() => setShowDeleteAccountModal(true)} className="usuarioDeleteAccountOpenButton">
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
            {showChangePasswordModal && <ModalChangePassword closeModal={setShowChangePasswordModal} />}
            {showDeleteAccountModal && <ModalDeleteAccount closeModal={setShowDeleteAccountModal} />}
        </div>
    );
};

export default ModalUsuario;
