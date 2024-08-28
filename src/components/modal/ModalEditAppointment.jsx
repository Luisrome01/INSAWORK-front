import React, { useEffect, useState } from 'react';
import './css/ModalEditAppointment.css';
import BtnGeneral from '/src/components/buttons/BtnGeneral';

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

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await fetch(`http://localhost:3000/appointment/${appointmentId}`);
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
      const response = await fetch(`http://localhost:3000/appointments/${appointmentId}`, {
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
      onClose();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="modal-edit-appointment">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        {loading ? (
          <p>Cargando...</p>
        ) : error ? (
          <p>Error: {error}</p>
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

            <BtnGeneral
              text="Guardar Cambios"
              color="#FFFFFF"
              bgColor="#1E90FF"
              className="submit-button"
              type="submit"
            />
          </form>
        )}
      </div>
    </div>
  );
};

export default ModalEditAppointment;
