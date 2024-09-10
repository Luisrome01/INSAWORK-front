import React, { useEffect, useState } from 'react';
import './css/ModalUserInfo.css';
import { FaTimes } from "react-icons/fa";

const ModalUserInfo = ({ userId, closeModal }) => {
    const [userInfo, setUserInfo] = useState({
        telefono: '',
        especialidad: '',
        direccion: '',
        cedula: '',
        inscripcionCM: '',
        registro: '',
        firma: null,
    });
    const [file, setFile] = useState(null);
    const fieldLabels = {
        telefono: 'Teléfono',
        especialidad: 'Especialidad',
        direccion: 'Dirección',
        cedula: 'Cédula de Identidad',
        inscripcionCM: 'Inscripción del Colegio de Médicos',
        registro: 'Registro del Inpsasel',
    };
 
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch(`https://insawork.onrender.com/user/info/${userId}`);
                const data = await response.json();
                if (response.ok) {
                    setUserInfo(data);
                } else {
                    console.error("Error fetching user info:", data.msg);
                }
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };

        fetchUserInfo();
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo({ ...userInfo, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setUserInfo((prevState) => ({
                    ...prevState,
                    firma: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('user', userId);
        Object.entries(userInfo).forEach(([key, value]) => {
            formData.append(key, value);
        });
        if (file) {
            formData.append('firma', file);
        }

        try {
            const response = await fetch(`https://insawork.onrender.com/user/info/${userId}/edit`, {
                method: 'PUT',
                body: formData,
            });
            const data = await response.json();
            if (response.ok) {
                console.log('User info updated:', data);
                localStorage.setItem('userInfo', JSON.stringify(data));
                closeModal(false);  // Cerrar el modal
            } else {
                console.error("Error updating user info:", data.msg);
            }
        } catch (error) {
            console.error("Error updating user info:", error);
        }
    };

    const handleFirmaClick = (e) => {
        e.preventDefault();
        document.getElementById('firmaInput').click();
    };

    return (
        <div className="userInfoModalContainer">
            <div className="userInfoModalBackgroundBlur" onClick={() => closeModal(false)}></div>
            <div className="userInfoModalContent">
                <div className="userInfoModalHeader">
                    <h2 className="userInfoModalTitle">Información del Usuario</h2>
                    <button className="usuarioCloseButton" onClick={() => closeModal(false)}>
                        <FaTimes />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="userInfoModalBody">
                    {Object.entries(fieldLabels).map(([field, label]) => (
                        <div className="userInfoField" key={field}>
                            <label htmlFor={`${field}Input`}>{label}:</label>
                            <input
                                type="text"
                                name={field}
                                id={`${field}Input`}
                                value={userInfo[field]}
                                onChange={handleChange}
                                className="userInfoInputField"
                            />
                        </div>
                    ))}
                    <div className="userInfoField">
                        <input
                            type="file"
                            accept="image/*"
                            id="firmaInput"
                            onChange={handleFileChange}
                            className="userInfoFileInput"
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="firmaInput" onClick={handleFirmaClick}>
                            <img
                                src={userInfo.firma || 'placeholder-image.png'}
                                alt="Firma"
                                className="userInfoFirmaImage"
                            />
                        </label>
                    </div>
                    <button type="submit" className="userInfoSubmitButton">Guardar Información</button>
                </form>
            </div>
        </div>
    );
};

export default ModalUserInfo;
