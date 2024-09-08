import React, { useEffect, useState } from "react";
import "./css/ModalUsuario.css";
import ModalChangePassword from "./ModalChangePassword";
import ModalDeleteAccount from "./ModalDeleteAccount"; 
import ModalUserInfo from "./ModalUserInfo"; // Importar el nuevo modal
import { FaCamera, FaEdit } from 'react-icons/fa';

const ModalUsuario = ({ closeModal }) => {
    const [user, setUser] = useState({});
    const [profileImg, setProfileImg] = useState(null);
    const [profileImgFile, setProfileImgFile] = useState(null); // Estado para el archivo
    const [username, setUsername] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
    const [showUserInfoModal, setShowUserInfoModal] = useState(false); // Estado para el nuevo modal

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
            setUsername(storedUser.username || ""); // Establecer username
            fetchProfileImage(storedUser._id); // Usar _id del usuario
        }
    }, []);

    const fetchProfileImage = async (userId) => {
        try {
            const response = await fetch(`https://insawork.onrender.com/user/${userId}/profile-image`);
            const data = await response.json();
            if (response.ok) {
                setProfileImg(data.profileImg);
            } else {
                console.error("Failed to fetch profile image:", data.msg);
            }
        } catch (error) {
            console.error("Error fetching profile image:", error);
        }
    };

    const handleProfileImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImg(reader.result); // Guardar la URL de la imagen
            };
            reader.readAsDataURL(file);
            setProfileImgFile(file); // Guardar el archivo para el envío
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
        const userId = user._id;

        const formData = new FormData();
        formData.append("profileImg", profileImgFile); // Cambiar a profileImgFile
        formData.append("username", username); // Agregar el nuevo username

        try {
            const response = await fetch(`https://insawork.onrender.com/user/${userId}/edit`, {
                method: "PUT",
                body: formData,
            });
            const updatedUser = await response.json();
            if (response.ok) {
                setUser(updatedUser);
                setProfileImg(updatedUser.profileImg); // Actualizar la imagen de perfil
                setIsEditing(false); // Desactivar el modo de edición

                // Actualizar localStorage
                localStorage.setItem("user", JSON.stringify(updatedUser));
            } else {
                console.error("Error updating user:", updatedUser.msg);
            }
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    return (
        <div className="usuarioModalContainer">
            <div className="usuarioModalBackgroundBlur"></div>
            <div className="usuarioModalContent">
                <div className="usuarioModalHeader">
                    <h2 className="usuarioModalTitle">Perfil de Usuario</h2>
                    <button className="usuarioCloseButton" onClick={() => closeModal(false)}>X</button>
                </div>
                <form onSubmit={handleSubmit} className="usuarioModalBody">
                    <div className="usuarioInfoContainer">
                        <div className="usuarioInfo">
                            <div>
                                <strong>Username:</strong>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="usuarioUsernameInput"
                                    />
                                ) : (
                                    <span>{user.username || user.email}</span>
                                )}
                                <FaEdit 
                                    className="usuarioEditIcon"
                                    onClick={() => setIsEditing(!isEditing)}
                                />
                            </div>
                            <p><strong>Email:</strong> {user.email}</p>
                        </div>
                        <div className="usuarioProfilePictureContainer">
                            <label htmlFor="profileImageInput" className="usuarioProfilePictureWrapper">
                                {profileImg ? (
                                    <img src={profileImg} alt="Profile" className="usuarioProfilePicture" />
                                ) : (
                                    <div className="usuarioImagePlaceholder">
                                        <FaCamera className="usuarioCameraIcon" />
                                        <span className="usuarioPlaceholderText">Ingresa una foto de perfil</span>
                                    </div>
                                )}
                            </label>
                            {isEditing && ( // Mostrar el input de archivo solo si se está editando
                                <>
                                    <input
                                        id="profileImageInput"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleProfileImageChange}
                                        className="usuarioProfileImageInput"
                                    />
                                    <button type="submit" className="usuarioConfirmButton">
                                        Confirmar Cambios
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="usuarioModalActions">
                        <button onClick={() => setShowChangePasswordModal(true)} className="usuarioChangePasswordOpenButton">
                            Cambiar Contraseña
                        </button>
                        <button onClick={() => setShowDeleteAccountModal(true)} className="usuarioDeleteAccountOpenButton">
                            Eliminar Cuenta
                        </button>
                        <button onClick={() => setShowUserInfoModal(true)} className="usuarioUserInfoOpenButton">
                            Información del Usuario
                        </button>
                    </div>
                </form>
            </div>
            {showChangePasswordModal && <ModalChangePassword closeModal={setShowChangePasswordModal} />}
            {showDeleteAccountModal && <ModalDeleteAccount closeModal={setShowDeleteAccountModal} />}
            {showUserInfoModal && <ModalUserInfo closeModal={setShowUserInfoModal} userId={user._id} />} {/* Agregar el nuevo modal */}
        </div>
    );
};

export default ModalUsuario;
