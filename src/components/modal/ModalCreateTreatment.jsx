import React, { useState, useEffect } from 'react';
import { FaTimes, FaTrash } from 'react-icons/fa';
import './css/ModalCreateTreatment.css';

const ModalCreateTreatment = ({ showModal, handleClose }) => {
    const [description, setDescription] = useState('');
    const [dose, setDose] = useState('');
    const [duration, setDuration] = useState('');
    const [medicines, setMedicines] = useState([]);
    const [selectedMedicine, setSelectedMedicine] = useState('');
    const [selectedMedicines, setSelectedMedicines] = useState([]);

    useEffect(() => {
        const fetchMedicines = async () => {
            try {
                const response = await fetch('https://insawork.onrender.com/medicines');
                if (response.ok) {
                    const data = await response.json();
                    setMedicines(data);
                } else {
                    console.error('Failed to fetch medicines');
                }
            } catch (error) {
                console.error('Error fetching medicines:', error);
            }
        };

        fetchMedicines();
    }, []);

    const handleAddMedicine = () => {
        if (selectedMedicine && !selectedMedicines.includes(selectedMedicine)) {
            setSelectedMedicines([...selectedMedicines, selectedMedicine]);
        }
    };

    const handleRemoveMedicine = (medicineId) => {
        setSelectedMedicines(selectedMedicines.filter(id => id !== medicineId));
    };

    const handleSubmit = async () => {
        const medicalRecordId = localStorage.getItem("SelectedMedicalrecord");

        if (!description || !medicalRecordId) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        try {
            const response = await fetch('https://insawork.onrender.com/treatments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    description,
                    dose,
                    duration,
                    medicalRecord: medicalRecordId,
                    medicines: selectedMedicines,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Treatment created:', data);
                handleClose(); // Close the modal after successful submission
            } else {
                console.error('Failed to create treatment');
                alert('Error al crear el tratamiento');
            }
        } catch (error) {
            console.error('Error creating treatment:', error);
        }
    };

    return (
        showModal && (
            <div className="modal-create-treatment-overlay">
                <div className="modal-create-treatment">
                    <div className="modal-create-treatment-header">
                        <h2>Crear Tratamiento</h2>
                        <button className="modal-create-treatment-close-button" onClick={handleClose}>
                            <FaTimes />
                        </button>
                    </div>
                    <div className="modal-create-treatment-body">
                        <label>
                            Medicina:
                            <select 
                                value={selectedMedicine} 
                                onChange={(e) => setSelectedMedicine(e.target.value)}
                                className="modal-create-treatment-select"
                            >
                                <option value="">Seleccionar medicina</option>
                                {medicines.map((medicine) => (
                                    <option key={medicine._id} value={medicine._id}>
                                        {medicine.name}
                                    </option>
                                ))}
                            </select>
                            <button onClick={handleAddMedicine} className="modal-create-treatment-add-btn">Agregar</button>
                        </label>
                        <div className="selected-medicines-list">
                            {selectedMedicines.map((medicineId, index) => (
                                <div key={index} className="selected-medicine-item">
                                    {medicines.find(medicine => medicine._id === medicineId)?.name || 'Medicina desconocida'}
                                    <button 
                                        className="remove-medicine-btn" 
                                        onClick={() => handleRemoveMedicine(medicineId)}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <label>
                            Descripción:
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="modal-create-treatment-input"
                            />
                        </label>
                        <label>
                            Dosis:
                            <input
                                type="text"
                                value={dose}
                                onChange={(e) => setDose(e.target.value)}
                                className="modal-create-treatment-input"
                            />
                        </label>
                        <label>
                            Duración:
                            <input
                                type="text"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className="modal-create-treatment-input"
                            />
                        </label>
                    </div>
                    <div className="modal-create-treatment-footer">
                        <button onClick={handleSubmit} className="modal-create-treatment-submit-btn">
                            Guardar Tratamiento
                        </button>
                    </div>
                </div>
            </div>
        )
    );
};

export default ModalCreateTreatment;
