import React, { useState, useEffect } from "react";
import "./css/modalHistoria.css";
import { FaTrash } from 'react-icons/fa';
import ModalCreateTreatment from './ModalCreateTreatment';

const ModalHistoria = ({ closeModal }) => {
    const [medicalRecord, setMedicalRecord] = useState(null);
    const [newRecord, setNewRecord] = useState({
        observaciones: '',
        ant_medicos: '',
        ant_familiares: '',
        ant_laborales: '',
        alergias: '',
        vacunas: '',
        enf_cronicas: '',
        habits: '',
        treatment: '',
        externalExams: []
    });
    const [treatments, setTreatments] = useState([]);
    const [externalExams, setExternalExams] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [showTreatments, setShowTreatments] = useState(false);
    const [showExternalExamModal, setShowExternalExamModal] = useState(false);
    const [showCreateTreatmentModal, setShowCreateTreatmentModal] = useState(false);
    const selectedPatientId = localStorage.getItem("selectedPatientId");
    const doctorId = JSON.parse(localStorage.getItem("user"))._id;

    useEffect(() => {
        const fetchMedicalRecord = async () => {
            try {
                const response = await fetch(`http://localhost:3000/medicalRecord/${selectedPatientId}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.length > 0) {
                        setMedicalRecord(data[0]);
                        localStorage.setItem("SelectedMedicalrecord", data[0]._id); // Save ID to localStorage
                    } else {
                        setIsEditing(true);
                    }
                } else {
                    console.error('Failed to fetch medical record');
                }
            } catch (error) {
                console.error('Error fetching medical record:', error);
            }
        };

        if (selectedPatientId) {
            fetchMedicalRecord();
        }
    }, [selectedPatientId]);

    useEffect(() => {
        const fetchTreatments = async () => {
            const medicalRecordId = localStorage.getItem("SelectedMedicalrecord");
    
            if (!medicalRecordId) {
                console.error('No medicalRecordId found in localStorage');
                return;
            }
    
            try {
                const response = await fetch(`http://localhost:3000/treatments/${medicalRecordId}`);
                if (response.ok) {
                    const data = await response.json();
                    console.log('Fetched treatments:', data);
                    setTreatments(data);
                } else {
                    console.error('Failed to fetch treatments');
                }
            } catch (error) {
                console.error('Error fetching treatments:', error);
            }
        };
    
        if (showTreatments) {
            fetchTreatments();
        }
    }, [showTreatments]);

    const handleToggleTreatments = () => {
        setShowTreatments(prevState => !prevState);
    };

    const handleDeleteTreatment = async (treatmentId) => {
        try {
            await fetch(`http://localhost:3000/treatments/${treatmentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            // Actualiza el estado para eliminar el tratamiento de la lista
            setTreatments(prevTreatments => prevTreatments.filter(treatment => treatment._id !== treatmentId));
        } catch (error) {
            console.error('Error al eliminar el tratamiento:', error);
        }
    };

    const handleCreateTreatment = () => {
        setShowCreateTreatmentModal(true);
    };

    const handleCloseCreateTreatmentModal = () => {
        setShowCreateTreatmentModal(false);
    };

    useEffect(() => {
        const fetchExternalExams = async () => {
            try {
                const response = await fetch('http://localhost:3000/externalExams');
                if (response.ok) {
                    const data = await response.json();
                    setExternalExams(data);
                } else {
                    console.error('Failed to fetch external exams');
                }
            } catch (error) {
                console.error('Error fetching external exams:', error);
            }
        };

        fetchExternalExams();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (isEditing) {
            setNewRecord({ ...newRecord, [name]: value });
        }
    };

    const handleTreatmentChange = (e) => {
        setNewRecord({ ...newRecord, treatment: e.target.value });
    };

    const handleExternalExamsChange = (e) => {
        const options = e.target.options;
        const selectedValues = Array.from(options).filter(option => option.selected).map(option => option.value);
        setNewRecord({ ...newRecord, externalExams: selectedValues });
    };

    const handleSave = async () => {
        try {
            const response = medicalRecord
                ? await fetch(`http://localhost:3000/medicalRecord/${medicalRecord._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...newRecord,
                        ...(newRecord.treatment && { treatment: newRecord.treatment }),
                        ...(newRecord.externalExams.length > 0 && { externalExams: newRecord.externalExams })
                    })
                })
                : await fetch('http://localhost:3000/medicalRecord', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...newRecord, patientId: selectedPatientId, doctorId })
                });

            if (response.ok) {
                closeModal(true);
            } else {
                console.error('Failed to save medical record');
            }
        } catch (error) {
            console.error('Error saving medical record:', error);
        }
    };

    const handleCancel = () => {
        localStorage.removeItem("SelectedMedicalrecord");
        closeModal(false);
    };

    const handleAddExternalExam = () => {
        setShowExternalExamModal(true);
    };

    const handleExternalExamModalClose = async (createdExam) => {
        setShowExternalExamModal(false);
        if (createdExam) {
            setNewRecord(prevRecord => ({
                ...prevRecord,
                externalExams: [...prevRecord.externalExams, createdExam._id]
            }));
            setExternalExams(prevExams => [...prevExams, createdExam]);
        }
    };

    return (
        <div className="historia-modal-overlay">
          <div className="historia-modal">
            <div className="historia-modal-header">
              <h2>Historia Médica</h2>
              <button className="historia-modal-close-button" onClick={handleCancel}>&times;</button>
            </div>
            <div className="historia-modal-content">
              {medicalRecord || isEditing ? (
                <div>
                  <div className="historia-modal-input-group">
                    <label>Observaciones:</label>
                    <input
                      type="text"
                      name="observaciones"
                      value={isEditing ? newRecord.observaciones : (medicalRecord ? medicalRecord.observaciones : '')}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="historia-modal-input-group">
                    <label>Vacunas:</label>
                    <input
                      type="text"
                      name="vacunas"
                      value={isEditing ? newRecord.vacunas : (medicalRecord ? medicalRecord.vacunas : '')}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="historia-modal-input-group">
                    <label>Hábitos:</label>
                    <input
                      type="text"
                      name="habits"
                      value={isEditing ? newRecord.habits : (medicalRecord ? medicalRecord.habits : '')}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div><div className="treatment-section">
    <label>Tratamientos:</label>
    <button
        className="expand-toggle"
        onClick={handleToggleTreatments}
    >
        {showTreatments ? '▲' : '▼'} {showTreatments ? 'Ocultar Tratamientos' : 'Mostrar Tratamientos'}
    </button>
    <button
        className="expand-toggle"
        onClick={handleCreateTreatment}
    >
        Crear Tratamiento
    </button>

    {showTreatments && (
        <div className="treatments-list">
            {treatments.map(treatment => (
                <div
                    key={treatment._id}
                    className={`treatment-item ${newRecord.treatment === treatment._id ? 'selected' : ''}`}
                >
                    <div className="treatment-header">
                        <div><strong>Descripción:</strong> {treatment.description || 'No disponible'}</div>
                        <button
                            className="delete-treatment-btn"
                            onClick={() => handleDeleteTreatment(treatment._id)}
                        >
                            <FaTrash />
                        </button>
                    </div>
                    <div><strong>Dosis:</strong> {treatment.dose || 'No disponible'}</div>
                    <div><strong>Duración:</strong> {treatment.duration || 'No disponible'}</div>
                    <div className="medicines-section">
                        <strong>Medicinas:</strong>
                        {treatment.medicines && treatment.medicines.length > 0 ? (
                            <div className="medicines-list">
                                {treatment.medicines.map(medicine => (
                                    <div key={medicine._id} className="medicine-item">
                                        <div><strong>Nombre:</strong> {medicine.name || 'No disponible'}</div>
                                        <div><strong>Tipo:</strong> {medicine.type || 'No disponible'}</div>
                                        <div><strong>Uso:</strong> {medicine.use || 'No disponible'}</div>
                                    </div>
                                ))}
                            </div>
                        ) : 'No hay medicinas asociadas'}
                    </div>
                </div>
            ))}
        </div>
    )}

    {/* Renderiza el modal */}
    {showCreateTreatmentModal && (
        <ModalCreateTreatment
            showModal={showCreateTreatmentModal}
            handleClose={handleCloseCreateTreatmentModal}
        />
    )}
</div>

                  <div className="historia-modal-input-group">
                    <label>Exámenes Externos:</label>
                    <select
                      multiple
                      name="externalExams"
                      value={isEditing ? newRecord.externalExams : (medicalRecord ? medicalRecord.externalExams : [])}
                      onChange={handleExternalExamsChange}
                      disabled={!isEditing}
                    >
                      {externalExams.map(exam => (
                        <option key={exam._id} value={exam._id}>{exam.name}</option>
                      ))}
                    </select>
                    {isEditing && (
                      <button onClick={handleAddExternalExam}>Añadir Examen Externo</button>
                    )}
                  </div>
                  <div className="historia-modal-input-group">
                    <label>Lista de Exámenes Externos:</label>
                    <ul>
                      {externalExams
                        .filter(exam => (medicalRecord && medicalRecord.externalExams || []).includes(exam._id))
                        .map(exam => (
                          <li key={exam._id}>{exam.name}</li>
                        ))}
                    </ul>
                  </div>
                  {isEditing && (
                    <div className="historia-modal-actions">
                      <button className="historia-modal-save-button" onClick={handleSave}>Guardar</button>
                      <button className="historia-modal-cancel-button" onClick={handleCancel}>Cancelar</button>
                    </div>
                  )}
                </div>
              ) : (
                <p>No hay historial médico disponible.</p>
              )}
            </div>
            {showExternalExamModal && (
              <ExternalExamModal onClose={() => setShowExternalExamModal(false)} />
            )}
          </div>
        </div>
      );
    };
    
    export default ModalHistoria;