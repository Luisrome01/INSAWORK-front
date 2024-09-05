import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import './css/modalCreateExternalExam.css';

const ModalCreateExternalExam = ({ showModal, handleClose }) => {
    const [type, setType] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [path, setPath] = useState(null);
    const [examTypes, setExamTypes] = useState([]);

    useEffect(() => {
        // Aquí podrías cargar los tipos de exámenes de manera dinámica si se requiere
        const types = ['Radiografia', 'Pruebas de sangre', 'Ultrasonido', 'Tomografía', 'Resonancia magnética'];
        setExamTypes(types);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const medicalRecordId = localStorage.getItem('SelectedMedicalrecord');

        if (!type || !date || !medicalRecordId) {
            alert('Por favor, complete todos los campos obligatorios.');
            return;
        }

        const formData = new FormData();
        formData.append('type', type);
        formData.append('description', description);
        formData.append('date', date);
        formData.append('medicalRecord', medicalRecordId);

        if (path) {
            formData.append('path', path);
        }

        try {
            const response = await fetch('http://localhost:3000/externalExams', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Examen creado:', data);
                handleClose(); // Cerrar el modal después de la creación exitosa
            } else {
                console.error('Error al crear el examen');
                alert('Error al crear el examen externo.');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    };

    return (
        showModal && (
            <div className="modal-create-external-exam-overlay">
                <div className="modal-create-external-exam">
                    <div className="modal-create-external-exam-header">
                        <h2>Crear Examen Externo</h2>
                        <button className="modal-create-external-exam-close-button" onClick={handleClose}>
                            <FaTimes />
                        </button>
                    </div>
                    <div className="modal-create-external-exam-body">
                        <form onSubmit={handleSubmit}>
                            <label>
                                Tipo de Examen:
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="modal-create-external-exam-select"
                                >
                                    <option value="">Seleccionar tipo</option>
                                    {examTypes.map((examType, index) => (
                                        <option key={index} value={examType}>
                                            {examType}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                Descripción:
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="modal-create-external-exam-input"
                                />
                            </label>
                            <label>
                                Fecha:
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="modal-create-external-exam-input"
                                />
                            </label>
                            <label>
                                Archivo del Examen:
                                <input
                                    type="file"
                                    onChange={(e) => setPath(e.target.files[0])}
                                    className="modal-create-external-exam-input"
                                />
                            </label>
                            <button type="submit" className="modal-create-external-exam-submit-btn">
                                Guardar Examen
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    );
};

export default ModalCreateExternalExam;
