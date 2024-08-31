import React, { useState, useEffect } from "react";
import "./css/historias.css";
import ModalCreatePatient from "../../modal/ModalCreatePatient"; // Ajusta la ruta según la ubicación de ModalCreatePatient

const Historias = () => {
    const [isModalCreatePatientOpen, setIsModalCreatePatientOpen] = useState(false);
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        // Obtener el doctorId del localStorage
        const doctorId = JSON.parse(localStorage.getItem("user"))._id;

        // Función para obtener pacientes
        const fetchPatients = async () => {
            try {
                const response = await fetch(`http://localhost:3000/patients/${doctorId}`);
                const data = await response.json();
                setPatients(data);
                setFilteredPatients(data); // Inicialmente, los pacientes filtrados son todos los pacientes
            } catch (error) {
                console.error("Error fetching patients:", error);
            }
        };

        fetchPatients();
    }, []);

    useEffect(() => {
        // Filtrar pacientes según el término de búsqueda
        setFilteredPatients(
            patients.filter(patient =>
                patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                patient.cedula.includes(searchTerm)
            )
        );
    }, [searchTerm, patients]);

    return (
        <div className="historias-container">
           
        
            <div className="historias-content">
                {/* Campo de búsqueda */}
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Buscar por nombre o cédula"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                {/* Botón para abrir el modal */}
                <button
                    className="create-patient-button"
                    onClick={() => setIsModalCreatePatientOpen(true)}
                >
                    Crear Paciente
                </button>

                {/* Mostrar el modal si el estado indica que debe estar abierto */}
                {isModalCreatePatientOpen && (
                    <ModalCreatePatient closeModal={setIsModalCreatePatientOpen} />
                )}

                {/* Contenedor de cartas de pacientes */}
                <div className="patients-scroll-container">
                    <div className="patients-grid">
                        {filteredPatients.map(patient => (
                            <div className="patient-card" key={patient._id}>
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
