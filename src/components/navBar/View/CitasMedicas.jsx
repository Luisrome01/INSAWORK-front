import React, { useEffect, useState } from "react";
import "./css/CitasMedicas.css";
import ModalCreateAppointment from "../../modal/ModalCreateAppointment";
import ModalEditAppointment from "../../modal/ModalEditAppointment";
import BtnGeneral from "../../buttons/BtnGeneral";
import AppointmentCard from "../../cards/AppointmentCard";
import add from "../../../assets/add-appointment.png";
import filter from "../../../assets/filter-appointment.png";

const CitasMedicas = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isImminentFilter, setIsImminentFilter] = useState(false);
  const [monthFilter, setMonthFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      const doctorData = JSON.parse(localStorage.getItem("user"));
      const doctorId = doctorData ? doctorData._id : null;
      if (!doctorId) {
        setError("Doctor ID not found in local storage.");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`https://insawork.onrender.com/appointments/${doctorId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch appointments");
        }
        const data = await response.json();
        const updatedData = data.map((appointment) => {
          if (appointment.status === "pending") {
            return { ...appointment, status: "Pendiente" };
          }
          return appointment;
        });
        setAppointments(updatedData);
        setFilteredAppointments(updatedData);
        console.log(updatedData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const fetchImminentAppointments = async () => {
    const doctorData = JSON.parse(localStorage.getItem("user"));
    const doctorId = doctorData ? doctorData._id : null;

    if (!doctorId) {
      setError("Doctor ID not found in local storage.");
      return;
    }

    try {
      const response = await fetch(
        `https://insawork.onrender.com/appointments/${doctorId}/imminent`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch imminent appointments");
      }
      const data = await response.json();
      const updatedData = data.map((appointment) => {
        if (appointment.status === "pending") {
          return { ...appointment, status: "Pendiente" };
        }
        return appointment;
      });
      setFilteredAppointments(updatedData);
      setIsImminentFilter(true);
    } catch (error) {
      setError(error.message);
    }
  };

  const resetFilters = () => {
    setFilteredAppointments(appointments);
    setIsImminentFilter(false);
    setMonthFilter("");
  };

  const handleMonthFilter = () => {
    if (!monthFilter) {
      return;
    }

    const month = parseInt(monthFilter);
    if (isNaN(month) || month < 1 || month > 12) {
      alert("Por favor, selecciona un mes válido.");
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
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  const handleModalOpen = () => {
    setShowModalCreate(true);
  };

  const handleModalToggle = () => {
    setShowModalCreate(false);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleEditClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModalEdit(true);
  };

  const handleModalEditClose = () => {
    setShowModalEdit(false);
    setSelectedAppointment(null);
  };

  const handleAppointmentUpdate = (updatedAppointment) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment._id === updatedAppointment._id ? updatedAppointment : appointment
      )
    );
    setFilteredAppointments((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment._id === updatedAppointment._id ? updatedAppointment : appointment
      )
    );
  };

  return (
    <div className="appointments-main-container">
      <div className="appointment-subdivider">
        <div className="appointments-count">
          {monthFilter ? (
            <p>
              Tienes un total de {filteredAppointments.length} citas para el mes de{" "}
              {new Date(0, monthFilter - 1).toLocaleString("es-ES", { month: "long" })}.
            </p>
          ) : isImminentFilter ? (
            <p>Tienes un total de {filteredAppointments.length} citas para los próximos días.</p>
          ) : (
            <p>Tienes un total de {filteredAppointments.length} citas.</p>
          )}
        </div>
        <div className="appointment-create-btn">
          <img
            src={add}
            alt="add-appointment"
            onClick={handleModalOpen}
            style={{ width: "30px", height: "30px" }}
          />
        </div>
        <div className="appointment-filter-btn">
          <img
            src={filter}
            alt="filter-appointment"
            onClick={toggleFilters}
            style={{ width: "27px", height: "27px" }}
          />
        </div>
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
                {new Date(0, i).toLocaleString("es-ES", { month: "long" })}
              </option>
            ))}
          </select>
          <button className="modal-create-medica-button" onClick={handleMonthFilter}>
            Filtrar por Mes
          </button>
          <button className="modal-create-medica-button" onClick={fetchImminentAppointments}>
            Mostrar Citas Próximas
          </button>
          <button className="modal-create-medica-button" onClick={resetFilters}>
            Resetear Filtros
          </button>
        </div>
      )}

      {loading && <p>Cargando...</p>}
      {error && <p>Error: {error}</p>}
      <div className="appointments-grid">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => {
            const patient = appointment.patientId || appointment.patient;
            return (
              <AppointmentCard
                key={appointment._id}
                nombre={`Cita de ${patient.name} ${patient.lastname}`}
                fecha={formatDateWithLeadingZero(new Date(appointment.date))}
                estado={appointment.status}
                onClick={() => handleEditClick(appointment)}
              />
            );
          })
        ) : (
          <p>No tienes citas para este día o periodo seleccionado.</p>
        )}
      </div>

      {showModalCreate === true && (
        <ModalCreateAppointment
          doctorId={JSON.parse(localStorage.getItem("user"))._id}
          onClose={handleModalToggle}
        />
      )}
      {showModalEdit && (
        <ModalEditAppointment
          appointmentId={selectedAppointment._id}
          onClose={handleModalEditClose}
          onUpdate={handleAppointmentUpdate}
        />
      )}
    </div>
  );
};

export default CitasMedicas;
