import React, { useEffect, useState } from 'react';
import './css/citasMedicas.css';
import ModalCreateAppointment from '../../modal/ModalCreateAppointment';
import BtnGeneral from '../../buttons/BtnGeneral';

const CitasMedicas = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isImminentFilter, setIsImminentFilter] = useState(false);
  const [monthFilter, setMonthFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      const doctorData = JSON.parse(localStorage.getItem('user'));
      const doctorId = doctorData ? doctorData._id : null;

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
        setFilteredAppointments(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const fetchImminentAppointments = async () => {
    const doctorData = JSON.parse(localStorage.getItem('user'));
    const doctorId = doctorData ? doctorData._id : null;

    if (!doctorId) {
      setError('Doctor ID not found in local storage.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/appointments/${doctorId}/imminent`);
      if (!response.ok) {
        throw new Error('Failed to fetch imminent appointments');
      }
      const data = await response.json();
      setFilteredAppointments(data);
      setIsImminentFilter(true);
    } catch (error) {
      setError(error.message);
    }
  };

  const resetFilters = () => {
    setFilteredAppointments(appointments);
    setIsImminentFilter(false);
    setMonthFilter('');
  };

  const handleMonthFilter = () => {
    if (!monthFilter) {
      return;
    }

    const month = parseInt(monthFilter);
    if (isNaN(month) || month < 1 || month > 12) {
      alert('Por favor, selecciona un mes válido.');
      return;
    }

    const filtered = appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate.getMonth() === month - 1;
    });

    setFilteredAppointments(filtered);
    setIsImminentFilter(false);
  };

  const formatDateWithLeadingZero = (date) => {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  const handleModalToggle = () => {
    setShowModal(!showModal);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="appointments-main-container">
      <h1>Citas Médicas</h1>
      

      <BtnGeneral
            text=" Crear Cita"
            color="#FFFFFF"
            bgColor="#1E90FF"
            handleClick={handleModalToggle}
            className="open-modal-button"
          />
      
      <div className="filter-toggle-container">
        <BtnGeneral
          text={showFilters ? 'Cerrar Filtros' : 'Desplegar Filtros'}
          color="#FFFFFF"
          bgColor="#1E90FF"
          handleClick={toggleFilters}
          className="filter-toggle-button"
        />
      </div>

      {showFilters && (
        <div className="filter-container">
          <select 
            value={monthFilter} 
            onChange={(e) => setMonthFilter(e.target.value)} 
            className="month-select"
          >
            <option value="">Selecciona un mes</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i + 1}>
                {new Date(0, i).toLocaleString('es-ES', { month: 'long' })}
              </option>
            ))}
          </select>
          <BtnGeneral
            text="Filtrar por Mes"
            color="#FFFFFF"
            bgColor="#1E90FF"
            handleClick={handleMonthFilter}
            className="filter-button month"
          />
          <BtnGeneral
            text="Mostrar Citas Próximas"
            color="#FFFFFF"
            bgColor="#1E90FF"
            handleClick={fetchImminentAppointments}
            className="filter-button imminent"
          />
          <BtnGeneral
            text="Resetear Filtros"
            color="#FFFFFF"
            bgColor="#dc3545"
            handleClick={resetFilters}
            className="filter-button reset"
          />
        </div>
      )}

      {loading && <p>Cargando...</p>}
      {error && <p>Error: {error}</p>}

      <div className="appointments-count">
        {monthFilter ? (
          <p>Tienes un total de {filteredAppointments.length} citas para el mes de {new Date(0, monthFilter - 1).toLocaleString('es-ES', { month: 'long' })}.</p>
        ) : isImminentFilter ? (
          <p>Tienes un total de {filteredAppointments.length} citas para los próximos días.</p>
        ) : (
          <p>Tienes un total de {filteredAppointments.length} citas.</p>
        )}
      </div>

      <div className="appointments-scroll-container">
        <div className="appointments-container">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => {
              const patient = appointment.patientId || appointment.patient;
              return (
                <div key={appointment._id} className="appointment-card">
                  <h2>Cita de {patient.name} {patient.lastname}</h2>
                  <p>Fecha: {formatDateWithLeadingZero(new Date(appointment.date))}</p>
                  <p>Estado: {appointment.status}</p>
                </div>
              );
            })
          ) : (
            <p>No tienes citas para este día o periodo seleccionado.</p>
          )}
        </div>
      </div>

      {showModal && <ModalCreateAppointment doctorId={JSON.parse(localStorage.getItem('user'))._id} />}
    </div>
  );
};

export default CitasMedicas;
