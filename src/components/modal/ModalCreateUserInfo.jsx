import React, { useState, useEffect } from "react";
import './css/modalCreateUserInfo.css';
import { showErrorMessage, showSuccessMessage, showWarningMessage, showInfoMessage } from "../messageBar/MessageBar";

const ModalCreateUserInfo = ({ showModal, onClose, handleLogout }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    telefono: '',
    especialidad: '',
    direccion: '',
    cedula: '',
    inscripcionCM: '',
    registro: '',
    firma: null,
  }); 
  const [message, setMessage] = useState(null);

  useEffect(() => {
    document.body.style.overflow = showModal ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showModal]);

  if (!showModal) return null;

  const handleLogoutAndClose = () => {
    handleLogout();
    onClose(); 
  };

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"))._id;
    const data = new FormData();
    data.append('user', user);
    Object.keys(formData).forEach(key => {
      if (formData[key]) {
        data.append(key, formData[key]);
      }
    });

    try {
      const response = await fetch('https://insawork.onrender.com/user/info', {
        method: 'POST',
        body: data,
      });
      const result = await response.json();
      if (response.ok) {
        setMessage(
          <div className="userInfoMessage">
            {showSuccessMessage('Información enviada correctamente', 'center')}
          </div>
        );
        setTimeout(() => {
          handleLogoutAndClose(); // Llama a logout y cierra el modal
        }, 3000); // Cierra el modal después de mostrar el mensaje
      } else {
        setMessage(
          <div className="userInfoMessage">
            {showErrorMessage(result.msg || 'Error al enviar la información', 'center')}
          </div>
        );
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage(
        <div className="userInfoMessage">
          {showErrorMessage('Error al enviar la información', 'center')}
        </div>
      );
    }
  };

  return (
    <div className="modal-userinfo-overlay">
      <div className="modal-userinfo">
        <div className="modal-userinfo-header">
          <h2>{isFormVisible ? 'Formulario de Información' : 'Información del Usuario'}</h2>
        </div>
        <div className="modal-userinfo-body">
          {!isFormVisible ? (
            <>
              <p>Doctor, es necesaria su información personal para seguir con su acción. ¿Desea proveerla inmediatamente?</p>
              <div className="modal-userinfo-footer">
                <button className="modal-userinfo-btn modal-userinfo-btn-logout" onClick={handleLogoutAndClose}>
                  Cerrar y Logout
                </button>
                <button className="modal-userinfo-btn modal-userinfo-btn-primary" onClick={() => setIsFormVisible(true)}>
                  Proveer Información
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="telefono">Teléfono</label>
                <input type="text" name="telefono" value={formData.telefono} onChange={handleFormChange} className="form-input" />
              </div>
              <div className="form-group">
                <label htmlFor="especialidad">Especialidad</label>
                <input type="text" name="especialidad" value={formData.especialidad} onChange={handleFormChange} className="form-input" />
              </div>
              <div className="form-group">
                <label htmlFor="direccion">Dirección</label>
                <input type="text" name="direccion" value={formData.direccion} onChange={handleFormChange} className="form-input" />
              </div>
              <div className="form-group">
                <label htmlFor="cedula">Cédula</label>
                <input type="text" name="cedula" value={formData.cedula} onChange={handleFormChange} className="form-input" />
              </div>
              <div className="form-group">
                <label htmlFor="inscripcionCM">Inscripción CM</label>
                <input type="text" name="inscripcionCM" value={formData.inscripcionCM} onChange={handleFormChange} className="form-input" />
              </div>
              <div className="form-group">
                <label htmlFor="registro">Registro</label>
                <input type="text" name="registro" value={formData.registro} onChange={handleFormChange} className="form-input" />
              </div>
              <div className="form-group">
                <label htmlFor="firma">
                  {formData.firma ? (
                    <img
                      src={URL.createObjectURL(formData.firma)}
                      alt="Firma"
                      className="userInfoFirmaImage"
                    />
                  ) : (
                    <div className="userInfoFirmaImage placeholder">
                      Seleccione una imagen
                    </div>
                  )}
                </label>
                <input
                  type="file"
                  name="firma"
                  id="firma"
                  onChange={handleFormChange}
                  style={{ display: 'none' }}
                />
              </div>
              <div className="userInfoMessage">
                Si envía la información, se redirigirá a la pantalla de login y se le pedirá que inicie sesión de nuevo.
              </div>
              <div className="modal-userinfo-footer">
                <button type="button" className="modal-userinfo-btn modal-userinfo-btn-back" onClick={() => setIsFormVisible(false)}>
                  Volver
                </button>
                <button type="submit" className="modal-userinfo-btn-submit">
                     Enviar
                </button>

              </div>
            </form>
          )}
        </div>
        {message}
      </div>
    </div>
  );
};

export default ModalCreateUserInfo;
