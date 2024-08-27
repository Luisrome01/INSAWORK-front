import React, { useEffect, useState } from 'react';
import './css/ModalUserInfo.css';

const ModalUserInfo = ({ userId }) => {
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
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch(`http://localhost:3000/user/info/${userId}`);
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
            const response = await fetch(`http://localhost:3000/user/info/${userId}/edit`, {
                method: 'PUT',
                body: formData,
            });
            const data = await response.json();
            if (response.ok) {
                console.log('User info updated:', data);
                // Actualiza localStorage con los nuevos datos
                localStorage.setItem('userInfo', JSON.stringify(data));
                setIsOpen(false);
            } else {
                console.error("Error updating user info:", data.msg);
            }
        } catch (error) {
            console.error("Error updating user info:", error);
        }
    };

    const handleCloseModal = () => {
        setIsOpen(false);
    };

    const handleFirmaClick = (e) => {
        e.preventDefault(); // Previene el comportamiento predeterminado
        document.getElementById('firmaInput').click();
    };

    if (!isOpen) return null;

    return (
        <div className="userInfoModalContainer">
            <div className="userInfoModalBackgroundBlur" onClick={handleCloseModal}></div>
            <div className="userInfoModalContent">
                <div className="userInfoModalHeader">
                    <h2 className="userInfoModalTitle">Información del Usuario</h2>
                    <button className="userInfoCloseButton" onClick={handleCloseModal}>X</button>
                </div>
                <form onSubmit={handleSubmit} className="userInfoModalBody">
                    {['telefono', 'especialidad', 'direccion', 'cedula', 'inscripcionCM', 'registro'].map(field => (
                        <div className="userInfoField" key={field}>
                            <label htmlFor={`${field}Input`}>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
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
                            style={{ display: 'none' }} // Ocultamos el input de archivo
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
