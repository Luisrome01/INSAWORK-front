import React, { useState, useEffect } from "react";
import "./css/historias.css";
import ModalCreatePatient from "../../modal/ModalCreatePatient";
import ModalPaciente from "../../modal/ModalPaciente";
import PatientCard from "../../cards/PatientCard"; // Asegúrate de ajustar la ruta de importación de PatientCard

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
      patients.filter(
        (patient) =>
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
          <button
            className="create-patient-button"
            onClick={() => setIsModalCreatePatientOpen(true)}
          >
            Crear Paciente
          </button>
        </div>

        {isModalCreatePatientOpen && (
          <ModalCreatePatient closeModal={setIsModalCreatePatientOpen} />
        )}

        {isModalPacienteOpen && selectedPatient && (
          <ModalPaciente patient={selectedPatient} closeModal={setIsModalPacienteOpen} />
        )}

        <div className="patients-grid">
          {filteredPatients.map((patient) => (
            <PatientCard
              key={patient._id}
              nombre={`${patient.name} ${patient.lastname}`}
              cedula={`C.I. ${patient.cedula}`}
              photo={patient.photo}
              companyName={patient.email}
              onClick={() => handlePatientClick(patient._id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Historias;
