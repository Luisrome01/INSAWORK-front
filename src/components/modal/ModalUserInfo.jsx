import React, { useEffect, useState } from 'react';
import './css/ModalUserInfo.css';

const ModalUserInfo = ({ closeModal, userId }) => {
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
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('user', userId);
        formData.append('telefono', userInfo.telefono);
        formData.append('especialidad', userInfo.especialidad);
        formData.append('direccion', userInfo.direccion);
        formData.append('cedula', userInfo.cedula);
        formData.append('inscripcionCM', userInfo.inscripcionCM);
        formData.append('registro', userInfo.registro);
        if (file) {
            formData.append('firma', file);
        }

        try {
            const response = await fetch('http://localhost:3000/user/info', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (response.ok) {
                console.log('User info created:', data);
                closeModal(false); // Cerrar modal al completar
            } else {
                console.error("Error creating user info:", data.msg);
            }
        } catch (error) {
            console.error("Error creating user info:", error);
        }
    };

    return (
        <div className="userInfoModalContainer">
            <div className="userInfoModalBackgroundBlur"></div>
            <div className="userInfoModalContent">
                <div className="userInfoModalHeader">
                    <h2 className="userInfoModalTitle">Información del Usuario</h2>
                    <button className="userInfoCloseButton" onClick={() => closeModal(false)}>X</button>
                </div>
                <form onSubmit={handleSubmit} className="userInfoModalBody">
                    <div className="userInfoField">
                        <label htmlFor="telefonoInput">Teléfono:</label>
                        <input
                            type="text"
                            name="telefono"
                            id="telefonoInput"
                            value={userInfo.telefono}
                            onChange={handleChange}
                            className="userInfoInputField"
                        />
                    </div>
                    <div className="userInfoField">
                        <label htmlFor="especialidadInput">Especialidad:</label>
                        <input
                            type="text"
                            name="especialidad"
                            id="especialidadInput"
                            value={userInfo.especialidad}
                            onChange={handleChange}
                            className="userInfoInputField"
                        />
                    </div>
                    <div className="userInfoField">
                        <label htmlFor="direccionInput">Dirección:</label>
                        <input
                            type="text"
                            name="direccion"
                            id="direccionInput"
                            value={userInfo.direccion}
                            onChange={handleChange}
                            className="userInfoInputField"
                        />
                    </div>
                    <div className="userInfoField">
                        <label htmlFor="cedulaInput">Cédula:</label>
                        <input
                            type="text"
                            name="cedula"
                            id="cedulaInput"
                            value={userInfo.cedula}
                            onChange={handleChange}
                            className="userInfoInputField"
                        />
                    </div>
                    <div className="userInfoField">
                        <label htmlFor="inscripcionCMInput">Inscripción CM:</label>
                        <input
                            type="text"
                            name="inscripcionCM"
                            id="inscripcionCMInput"
                            value={userInfo.inscripcionCM}
                            onChange={handleChange}
                            className="userInfoInputField"
                        />
                    </div>
                    <div className="userInfoField">
                        <label htmlFor="registroInput">Registro:</label>
                        <input
                            type="text"
                            name="registro"
                            id="registroInput"
                            value={userInfo.registro}
                            onChange={handleChange}
                            className="userInfoInputField"
                        />
                    </div>
                    <div className="userInfoField">
                        <label htmlFor="firmaInput">Firma:</label>
                        <input
                            type="file"
                            accept="image/*"
                            id="firmaInput"
                            onChange={handleFileChange}
                            className="userInfoFileInput"
                        />
                    </div>
                    <button type="submit" className="userInfoSubmitButton">Guardar Información</button>
                </form>
            </div>
        </div>
    );
};

export default ModalUserInfo;