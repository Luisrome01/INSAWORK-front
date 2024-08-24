import React, { useEffect, useState } from 'react';
import './css/citasMedicas.css';
import ModalCreateAppointment from '../../modal/ModalCreateAppointment';



const CitasMedicas = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDate, setFilterDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showModal, setShowModal] = useState(false); // Estado para controlar el modal

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
        setFilteredAppointments(data); // Inicialmente, mostrar todas las citas
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return new Date(`${year}-${month}-${day}`);
  };

  const formatDateWithLeadingZero = (date) => {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0'); // Los meses comienzan desde 0
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setFilterDate(selectedDate);

    const formattedDate = formatDate(selectedDate).toLocaleDateString('es-ES');

    const filtered = appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date).toLocaleDateString('es-ES');
      return appointmentDate === formattedDate;
    });

    setFilteredAppointments(filtered.length > 0 ? filtered : []);
  };

  const handleRangeChange = () => {
    const start = formatDate(startDate);
    const end = formatDate(endDate);

    const filtered = appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate >= start && appointmentDate <= end;
    });

    setFilteredAppointments(filtered.length > 0 ? filtered : []);
  };

  const resetFilters = () => {
    setFilterDate('');
    setStartDate('');
    setEndDate('');
    setFilteredAppointments(appointments);
  };

  const handleDateInput = (e) => {
    const value = e.target.value;
    const formattedValue = value.replace(/\D/g, '');

    let output = '';
    for (let i = 0; i < formattedValue.length; i++) {
      output += formattedValue[i];
      if (i === 1 || i === 3) {
        output += '/';
      }
    }

    setFilterDate(output);
  };

  const handleModalToggle = () => {
    setShowModal(!showModal);
  };

  return (
    <div className="appointments-main-container">
      <h1>Citas Médicas</h1>
      
      <button className="open-modal-button" onClick={handleModalToggle}>
        Crear Cita
      </button>
      
      <div className="filter-container">
        <label htmlFor="dateFilter">Filtrar por fecha:</label>
        <input
          type="text"
          id="dateFilter"
          value={filterDate}
          placeholder="dd/mm/yyyy"
          onChange={handleDateInput}
          onBlur={handleDateChange}
        />

        <input
          type="date"
          onChange={(e) => {
            const selectedDate = new Date(e.target.value).toLocaleDateString('es-ES');
            setFilterDate(selectedDate.split('/').reverse().join('/'));
            handleDateChange({ target: { value: selectedDate.split('/').reverse().join('/') } });
          }}
        />

        <button className="toggle-advanced-filters" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
          {showAdvancedFilters ? '-' : '+'}
        </button>

        {showAdvancedFilters && (
          <div className="advanced-filters">
            <label htmlFor="startDate">Desde:</label>
            <input
              type="text"
              id="startDate"
              value={startDate}
              placeholder="dd/mm/yyyy"
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              onChange={(e) => {
                const selectedStartDate = new Date(e.target.value).toLocaleDateString('es-ES');
                setStartDate(selectedStartDate.split('/').reverse().join('/'));
              }}
            />

            <label htmlFor="endDate">Hasta:</label>
            <input
              type="text"
              id="endDate"
              value={endDate}
              placeholder="dd/mm/yyyy"
              onChange={(e) => setEndDate(e.target.value)}
            />
            <input
              type="date"
              onChange={(e) => {
                const selectedEndDate = new Date(e.target.value).toLocaleDateString('es-ES');
                setEndDate(selectedEndDate.split('/').reverse().join('/'));
              }}
            />

            <button onClick={handleRangeChange}>Aplicar rango</button>
          </div>
        )}

        <button className="reset-filters" onClick={resetFilters}>Resetear filtros</button>
      </div>

      {loading && <p>Cargando...</p>}
      {error && <p>Error: {error}</p>}

      <div className="appointments-scroll-container">
        <div className="appointments-container">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => {
              const { patientId, date, time, motive } = appointment;
              return (
                <div key={appointment._id} className="appointment-card">
                  <h2>Cita de {patientId.name} {patientId.lastname}</h2>
                  <p>Fecha: {formatDateWithLeadingZero(new Date(date))}</p>
                  <p>Hora: {time}</p>
                  <p>Motivo: {motive}</p>
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
