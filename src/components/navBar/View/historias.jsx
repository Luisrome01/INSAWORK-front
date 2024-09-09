import React, { useState, useEffect } from "react";
import "./css/historias.css";
import ModalCreatePatient from "../../modal/ModalCreatePatient"; // Ajusta la ruta según la ubicación de ModalCreatePatient
import ModalPaciente from "../../modal/ModalPaciente"; // Importa el nuevo modal

const Historias = () => {
    const [isModalCreatePatientOpen, setIsModalCreatePatientOpen] = useState(false);
    const [isModalPacienteOpen, setIsModalPacienteOpen] = useState(false);
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPatient, setSelectedPatient] = useState(null);

    useEffect(() => {
        const doctorId = JSON.parse(localStorage.getItem("user"))._id;

        const fetchPatients = async () => {
            try {
                const response = await fetch(`https://insawork.onrender.com/patients/${doctorId}`);
                const data = await response.json();
                setPatients(data);
                setFilteredPatients(data);
            } catch (error) {
                console.error("Error fetching patients:", error);
            }
        };

        fetchPatients();
    }, []);

    useEffect(() => {
        setFilteredPatients(
            patients.filter(patient =>
                patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                patient.cedula.includes(searchTerm)
            )
        );
    }, [searchTerm, patients]);

    const handlePatientClick = async (patientId) => {
        try {
            const response = await fetch(`https://insawork.onrender.com/patient/${patientId}`);
            const data = await response.json();
            setSelectedPatient(data);
            setIsModalPacienteOpen(true);
        } catch (error) {
            console.error("Error fetching patient details:", error);
        }
    };

    return (
        <div className="historias-container">
            <div className="historias-content">
                <div className="search-container">
                    <input
                        type="text" 
                        placeholder="Buscar por nombre o cédula"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <button
                    className="create-patient-button"
                    onClick={() => setIsModalCreatePatientOpen(true)}
                >
                    Crear Paciente
                </button>

                {isModalCreatePatientOpen && (
                    <ModalCreatePatient closeModal={setIsModalCreatePatientOpen} />
                )}

                {isModalPacienteOpen && selectedPatient && (
                    <ModalPaciente
                        patient={selectedPatient}
                        closeModal={setIsModalPacienteOpen}
                    />
                )}

                <div className="patients-scroll-container">
                    <div className="patients-grid">
                        {filteredPatients.map(patient => (
                            <div
                                className="patient-card"
                                key={patient._id}
                                onClick={() => handlePatientClick(patient._id)}
                            >
                                <p className="patient-card-info">{patient.name}</p>
                                <p className="patient-card-info">{patient.lastname}</p>
                                <p className="patient-card-info">{patient.cedula}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Historias;
