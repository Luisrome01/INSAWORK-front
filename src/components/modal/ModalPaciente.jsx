import React, { useState, useEffect } from "react";
import { FaPencilAlt } from 'react-icons/fa'; // Importa el ícono de lápiz para editar
import "./css/modalPaciente.css";
import ModalHistoria from './ModalHistoria'; // Importa el modal Historia

const ModalPaciente = ({ patient, closeModal, onUpdateSuccess }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedPatient, setEditedPatient] = useState({ ...patient });
    const [photoFile, setPhotoFile] = useState(null);
    const [companies, setCompanies] = useState([]);
    const [isHistoriaModalOpen, setIsHistoriaModalOpen] = useState(false);
    
    useEffect(() => {
        // Fetch companies from the backend
        const fetchCompanies = async () => {
            try {
                const response = await fetch('https://insawork.onrender.com/company');
                if (response.ok) {
                    const data = await response.json();
                    setCompanies(data); // Assuming the data is an array of companies
                } else {
                    console.error('Failed to fetch companies');
                }
            } catch (error) {
                console.error('Error fetching companies:', error);
            }
        };

        fetchCompanies();
    }, []);

    const handleOpenHistoriaModal = () => {
        setIsHistoriaModalOpen(true);
    };
    
    const handleCloseHistoriaModal = () => {
        setIsHistoriaModalOpen(false);
    };

    useEffect(() => {
        if (patient && patient._id) {
            localStorage.setItem("selectedPatientId", patient._id); // Guarda el ID en localStorage
        }
        setEditedPatient({ ...patient });
        setPhotoFile(null); // Limpiar el archivo seleccionado
    }, [patient]);
    
    const handleCloseModal = () => {
        localStorage.removeItem("selectedPatientId"); // Borra el campo específico de localStorage
        closeModal(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedPatient({ ...editedPatient, [name]: value });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhotoFile(file);
        }
    };

    const handleSave = async () => {
        if (!editedPatient._id) {
            console.error('Patient ID is missing.');
            return;
        }

        // Preparar el cuerpo de la solicitud PUT con FormData
        const formData = new FormData();
        formData.append('_id', editedPatient._id);
        formData.append('email', editedPatient.email);
        formData.append('name', editedPatient.name);
        formData.append('lastname', editedPatient.lastname);
        formData.append('doctorId', editedPatient.doctorId);
        formData.append('age', editedPatient.age);
        formData.append('cedula', editedPatient.cedula);
        formData.append('gender', editedPatient.gender);
        formData.append('birthdate', editedPatient.birthdate);
        formData.append('phone', editedPatient.phone);
        formData.append('address', editedPatient.address);
        formData.append('company', editedPatient.company); // Enviar el ID de la compañía seleccionada
        formData.append('grupoSanguineo', editedPatient.grupoSanguineo);
        formData.append('positionDescription', editedPatient.position.description);

        // Agregar la foto si está disponible, sino mantener la foto actual
        if (photoFile) {
            formData.append('photo', photoFile);
        } else {
            // Si no hay foto nueva, incluir la URL de la foto actual en el cuerpo de la solicitud
            formData.append('photo', editedPatient.photo);
        }

        try {
            const response = await fetch(`https://insawork.onrender.com/patients/${editedPatient._id}`, {
                method: 'PUT',
                body: formData, // Enviar los datos como FormData
            });

            if (response.ok) {
                const updatedPatient = await response.json();
                if (typeof onUpdateSuccess === 'function') {
                    onUpdateSuccess(updatedPatient);
                } else {
                    console.error('onUpdateSuccess is not a function');
                }
                setIsEditing(false);
            } else {
                const error = await response.text();
                console.error(`Error en la respuesta del servidor: ${error}`);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    };

    return (
        <div className="paciente-modal-overlay">
            <div className="paciente-modal">
                <div className="paciente-modal-header">
                    <h2>Detalles del Paciente</h2>
                    <div>
                        {!isEditing && (
                            <button 
                                className="paciente-modal-edit-button" 
                                onClick={() => setIsEditing(true)}
                            >
                                <FaPencilAlt /> {/* Ícono de lápiz */}
                            </button>
                        )}
                        <button 
                            className="paciente-modal-close-button" 
                            onClick={handleCloseModal} // Usa la nueva función
                        >
                            &times;
                        </button>
                    </div>
                </div>
                <div className="paciente-modal-details">
                    <div className="paciente-modal-photo-container">
                        <img
                            src={editedPatient.photo || 'default-photo-url'} // Usa una URL predeterminada si no hay foto
                            alt={`${editedPatient.name} ${editedPatient.lastname}`}
                            className="paciente-modal-photo"
                        />
                    </div>
                    {isEditing && (
                        <div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                            />
                        </div>
                    )}
                    <p>
                        <strong>Nombre:</strong> 
                        {isEditing ? (
                            <input
                                type="text"
                                name="name"
                                value={editedPatient.name}
                                onChange={handleInputChange}
                            />
                        ) : (
                            editedPatient.name
                        )}
                    </p>
                    <p>
                        <strong>Apellido:</strong> 
                        {isEditing ? (
                            <input
                                type="text"
                                name="lastname"
                                value={editedPatient.lastname}
                                onChange={handleInputChange}
                            />
                        ) : (
                            editedPatient.lastname
                        )}
                    </p>
                    <p>
                        <strong>Edad:</strong> 
                        {isEditing ? (
                            <input
                                type="number"
                                name="age"
                                value={editedPatient.age}
                                onChange={handleInputChange}
                            />
                        ) : (
                            `${editedPatient.age} años`
                        )}
                    </p>
                    <p>
                        <strong>Cédula:</strong> 
                        {editedPatient.cedula}
                    </p>
                    <p>
                        <strong>Género:</strong> 
                        {isEditing ? (
                            <select
                                name="gender"
                                value={editedPatient.gender}
                                onChange={handleInputChange}
                            >
                                <option value="male">Masculino</option>
                                <option value="female">Femenino</option>
                            </select>
                        ) : (
                            editedPatient.gender === 'male' ? 'Masculino' : 'Femenino'
                        )}
                    </p>
                    <p>
                        <strong>Fecha de Nacimiento:</strong> 
                        {isEditing ? (
                            <input
                                type="date"
                                name="birthdate"
                                value={new Date(editedPatient.birthdate).toISOString().substring(0, 10)}
                                onChange={handleInputChange}
                            />
                        ) : (
                            new Date(editedPatient.birthdate).toLocaleDateString()
                        )}
                    </p>
                    <p>
                        <strong>Teléfono:</strong> 
                        {isEditing ? (
                            <input
                                type="text"
                                name="phone"
                                value={editedPatient.phone}
                                onChange={handleInputChange}
                            />
                        ) : (
                            editedPatient.phone
                        )}
                    </p>
                    <p>
                        <strong>Dirección:</strong> 
                        {isEditing ? (
                            <input
                                type="text"
                                name="address"
                                value={editedPatient.address}
                                onChange={handleInputChange}
                            />
                        ) : (
                            editedPatient.address
                        )}
                    </p>
                    <p>
                        <strong>Compañía:</strong> 
                        {isEditing ? (
                            <select
                                name="company"
                                value={editedPatient.company}
                                onChange={handleInputChange}
                            >
                                <option value="">Selecciona una compañía</option>
                                {companies.map(company => (
                                    <option key={company._id} value={company._id}>
                                        {company.name}
                                    </option>
                                ))} 
                            </select>
                        ) : (
                            companies.find(company => company._id === editedPatient.company)?.name || 'No asignada'
                        )}
                    </p>
                    <p>
                        <strong>Posición:</strong> 
                        {isEditing ? (
                            <input
                                type="text"
                                name="positionDescription"
                                value={editedPatient.position.description}
                                onChange={handleInputChange}
                            />
                        ) : (
                            editedPatient.position.description
                        )}
                    </p>
                    <p>
                        <strong>Grupo Sanguíneo:</strong> 
                        {isEditing ? (
                            <select
                                name="grupoSanguineo"
                                value={editedPatient.grupoSanguineo}
                                onChange={handleInputChange}
                            >
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                        ) : (
                            editedPatient.grupoSanguineo
                        )}
                    </p>
                    <div className="paciente-modal-actions">
                        {/* Botón para abrir el ModalHistoria */}
                        <button 
                            className="paciente-modal-open-history-button" 
                            onClick={handleOpenHistoriaModal}
                        >
                            Ver Historia Clínica
                        </button>
                        {isEditing && (
                            <button className="paciente-modal-save-button" onClick={handleSave}>
                                Guardar
                            </button>
                        )} 
                        {isEditing && (
                            <button className="paciente-modal-cancel-button" onClick={() => setIsEditing(false)}>
                                Cancelar
                            </button>
                        )}
                    </div>
                </div>
                {isHistoriaModalOpen && (
                    <ModalHistoria
                        closeModal={handleCloseHistoriaModal}
                        onUpdateSuccess={() => { /* Aquí puedes manejar la actualización exitosa del modal historia */ }}
                    />
                )}
            </div>
        </div>
    );
    
    
};

export default ModalPaciente;
