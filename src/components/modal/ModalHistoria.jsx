import React, { useState, useEffect } from "react";
import "./css/modalHistoria.css";
import { FaTrash } from 'react-icons/fa';
import ModalCreateTreatment from './ModalCreateTreatment';
import ModalExternalExam from './ModalExternalExam';

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
    const [showExternalExams, setShowExternalExams] = useState(false);
    const [showExternalExamModal, setShowExternalExamModal] = useState(false);
    const [selectedExternalExam, setSelectedExternalExam] = useState(null);
    const [showCreateTreatmentModal, setShowCreateTreatmentModal] = useState(false);
    const [showModal, setShowModal] = useState(true);
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
                        localStorage.setItem("SelectedMedicalrecord", data[0]._id);
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
                const medicalRecordId = localStorage.getItem('SelectedMedicalrecord');
                if (!medicalRecordId) {
                    console.error('Medical record ID not found in localStorage');
                    return;
                }
                const response = await fetch(`http://localhost:3000/externalExams/${medicalRecordId}`);
                if (response.ok) {
                    const data = await response.json();
                    console.log('Exámenes externos obtenidos:', data);
                    setExternalExams(data);
                } else {
                    console.error('Failed to fetch external exams');
                }
            } catch (error) {
                console.error('Error fetching external exams:', error);
            }
        };
    
        if (showExternalExams) {
            fetchExternalExams();
        }
    }, [showExternalExams]);




    const handleDeleteExternalExam = async (examId) => {
        try {
            const response = await fetch(`http://localhost:3000/externalExams/${examId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.ok) {
                // Filtrar el examen eliminado del estado
                setExternalExams(prevExams => prevExams.filter(exam => exam._id !== examId));
            } else {
                console.error('Error al eliminar el examen externo');
            }
        } catch (error) {
            console.error('Error al eliminar el examen externo:', error);
        }
    };
    

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
        setShowModal(false);
        closeModal(false);
    };

    const handleAddExternalExam = () => {
        setShowExternalExamModal(true);
    };

    const handleToggleExternalExams = () => {
        setShowExternalExams(prevState => !prevState);
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
    const handleOpenExternalExamModal = async (exam) => {
        setSelectedExternalExam(exam);
        setShowExternalExamModal(true);
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
                  </div>
                  <div className="treatment-section">
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
    



                  <div className="external-exams-section">
      <label>Exámenes Externos:</label>
      <button
        className="expand-toggle"
        onClick={handleToggleExternalExams}
      >
        {showExternalExams ? '▲' : '▼'} {showExternalExams ? 'Ocultar Exámenes Externos' : 'Mostrar Exámenes Externos'}
      </button>

      {showExternalExams && (
        <div className="external-exams-list-container">
          <label className="external-exams-label">Lista de Exámenes Externos:</label>
          {externalExams.length > 0 ? (
            <ul className="external-exams-list">
              {externalExams.map(exam => (
                <li 
                  key={exam._id} 
                  className="external-exam-item" 
                  onClick={() => handleOpenExternalExamModal(exam)} // Agrega el evento onClick aquí
                >
                  <strong>Tipo:</strong> {exam.type || 'No disponible'} <br />
                  <strong>Descripción:</strong> {exam.description || 'No disponible'} <br />
                  <strong>Fecha:</strong> {new Date(exam.date).toLocaleDateString() || 'No disponible'} <br />

                  <button
  className="delete-treatment-btn"
  onClick={(event) => {
    event.stopPropagation(); // Evita que el evento se propague
    handleDeleteExternalExam(exam._id);
  }}
>
  <FaTrash />
</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay exámenes externos disponibles.</p>
          )}
        </div>
      )}

      {showExternalExamModal && (
        <ModalExternalExam 
          closeModal={() => setShowExternalExamModal(false)} 
          examId={selectedExternalExam?._id} 
        />
      )}
    </div>

    
                 
                    <div className="external-exams-actions">
                      <button className="save-button" onClick={handleSave}>Guardar</button>
                    </div>
                 
                </div>
              ) : (
                <p>No hay historial médico disponible.</p>
              )}
            </div>
          </div>
        </div>
      );
    };
    
    export default ModalHistoria;