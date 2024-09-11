import React, { useEffect, useState } from 'react';
import './css/ModalEditAppointment.css';
import BtnGeneral from '/src/components/buttons/BtnGeneral';
import MessageBar, { showErrorMessage, showSuccessMessage } from '../messageBar/MessageBar';
import { FaTimes } from 'react-icons/fa';

const ModalEditAppointment = ({ appointmentId, onClose, onUpdate }) => {
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formValues, setFormValues] = useState({
    status: '',
    date: '',
    time: '',
    motive: ''
  });
  const [messageBar, setMessageBar] = useState("");

  const displayMessage = (messageComponent) => {
    setMessageBar(messageComponent);
    setTimeout(() => {
      setMessageBar("");
    }, 3000);
  };

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await fetch(`https://insawork.onrender.com/appointment/${appointmentId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch appointment');
        }
        const data = await response.json();
        setAppointment(data);
        setFormValues({
          status: data.status,
          date: data.date.split('T')[0],
          time: data.time,
          motive: data.motive
        });
      } catch (error) {
        setError(error.message);
        displayMessage(showErrorMessage(error.message, "center"));
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://insawork.onrender.com/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) {
        throw new Error('Failed to update appointment');
      }

      const updatedAppointment = await response.json();
      onUpdate(updatedAppointment);
      displayMessage(showSuccessMessage("Cita actualizada exitosamente.", "center"));
      
      // Recargar la página para actualizar los datos
      window.location.reload(); // Agrega esta línea

      onClose();
    } catch (error) {
      setError(error.message);
      displayMessage(showErrorMessage(error.message, "center"));
    }
  };

  return (
    <div className="modal-edit-appointment-container">
      <div className="modal-edit-appointment-background-blur"></div>
      <div className="modal-edit-appointment-content">
        <div className="createAppointmentModalHeader">
          <h2 className="createAppointmentModalTitle">Editar Cita</h2>
          <button className="usuarioCloseButton" onClick={onClose}>
              <FaTimes />
          </button>
        </div>
        <div className="modal-edit-appointment-body">
          {messageBar}
          {loading ? (
            <p className="loading-text">Cargando...</p>
          ) : error ? (
            <p className="error-text">Error: {error}</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="status">Estado:</label>
                <select 
                  id="status" 
                  name="status" 
                  value={formValues.status} 
                  onChange={handleChange} 
                  className="form-input"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Completada">Completada</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="date">Fecha:</label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  value={formValues.date}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="time">Hora:</label>
                <input
                  id="time"
                  name="time"
                  type="time"
                  value={formValues.time}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="motive">Motivo:</label>
                <textarea
                  id="motive"
                  name="motive"
                  value={formValues.motive}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              <button className="createAppointmentSubmitButton" type='submit'>
              Guardar Cambios
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalEditAppointment;
