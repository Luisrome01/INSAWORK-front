import React, { useEffect, useState } from 'react';
import './css/citasMedicas.css';

const CitasMedicas = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientsData, setPatientsData] = useState({});

  useEffect(() => {
    const fetchAppointments = async () => {
      const doctorData = JSON.parse(localStorage.getItem('user')); // Cambiado a 'user'
      const doctorId = doctorData ? doctorData._id : null; // Usando _id del doctor

      if (!doctorId) {
        setError('Doctor ID not found in local storage.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/appointments/${doctorId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false); 
      }
    };

    fetchAppointments();
  }, []);

  const getPatientData = async (patientId) => {
    try {
      const response = await fetch(`http://localhost:3000/patient/${patientId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch patient data');
      }
      return await response.json();
    } catch (error) {
      setError(error.message);
      return null;
    }
  };

  const fetchPatients = async () => {
    const patients = await Promise.all(
      appointments.map(appointment => getPatientData(appointment.patientId))
    );

    const patientsMap = {};
    patients.forEach(patient => {
      if (patient) {
        patientsMap[patient._id] = patient;
      }
    });

    setPatientsData(patientsMap);
  };

  useEffect(() => {
    if (appointments.length > 0) {
      fetchPatients();
    }
  }, [appointments]);

  return (
    <div>
      <h1>Citas Médicas</h1>
      
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <div className="appointments-container">
        {appointments.map((appointment) => {
          const { patientId, date, time, motive } = appointment;
          const patient = patientsData[patientId];

          return (
            <div key={appointment._id} className="appointment-card">
              <h2>Cita de {patient ? `${patient.name} ${patient.lastname}` : 'Cargando...'}</h2>
              <p>Fecha: {date}</p>
              <p>Hora: {time}</p>
              <p>Motivo: {motive}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CitasMedicas;
