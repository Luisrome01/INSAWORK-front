import React, { useState, useEffect } from "react";
import "./css/ModalCreateInvoice.css";
import { FaArrowLeft } from 'react-icons/fa';

// Función para buscar pacientes
const searchPatients = async (query, doctorId) => {
  try {
    const response = await fetch(`https://insawork.onrender.com/patients/${doctorId}?query=${query}`);
    if (!response.ok) throw new Error('Error fetching patients');
    return response.json();
  } catch (error) {
    console.error(error);
    return [];
  } 
};

// Función para enviar la factura al backend
const createInvoice = async (invoiceData) => {
  try {
    const response = await fetch('https://insawork.onrender.com/invoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invoiceData),
    });
    if (!response.ok) throw new Error('Error creating invoice');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `factura_${invoiceData.nombre_razon}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.location.reload(); // Refresh the page after successful creation
  } catch (error) {
    console.error(error);
  }
};

const ModalCreateInvoice = ({ closeModal }) => {
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    fecha: "",
    nombre_razon: "",
    dir_fiscal: "",
    rif: "",
    forma_pago: "",
    contacto: "",
    descripcion_servicio: "",
    total: "",
  });

  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const doctorId = JSON.parse(localStorage.getItem('user'))._id;
    if (searchQuery.length > 1) {
      // Solo buscar si la consulta tiene más de un carácter
      searchPatients(searchQuery, doctorId).then(setPatients);
    } else {
      setPatients([]);
    }
  }, [searchQuery]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setFormData((prevData) => ({
      ...prevData,
      patientId: patient._id,
    }));
    setSearchQuery(""); // Clear search query
    setPatients([]);
  };

  const handlePatientDeselect = () => {
    setSelectedPatient(null);
    setSearchQuery(""); // Clear search query
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const doctorId = JSON.parse(localStorage.getItem('user'))._id;
    const invoiceData = { ...formData, doctorId };
    createInvoice(invoiceData);
  };

  return (
    <div className="modalCreateInvoiceContainer">
      <div className="modalCreateInvoiceBackgroundBlur" onClick={() => closeModal()}></div>
      <div className="modalCreateInvoiceContent">
        <div className="modalCreateInvoiceHeader">
          <h2>Crear Factura</h2>
          <button className="closeButton" onClick={() => closeModal()}>
            X
          </button>
        </div>
        <div className="modalCreateInvoiceBody">
          <form onSubmit={handleSubmit}>
            <div className="formGroup">
              <label>Paciente:</label>
              {selectedPatient ? (
                <div className="selectedPatient">
                  <button type="button" className="backButton" onClick={handlePatientDeselect}>
                    <FaArrowLeft />
                  </button>
                  <p><strong>Paciente Seleccionado:</strong></p>
                  <p>{selectedPatient.name} {selectedPatient.lastname}</p>
                </div>
              ) : (
                <div className="searchContainer">
                  <input
                    type="text"
                    placeholder="Buscar paciente por nombre o cédula"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  {patients.length > 0 && (
                    <div className="patientDropdown">
                      <ul className="patientList">
                        {patients.map(patient => (
                          <li key={patient._id} onClick={() => handlePatientSelect(patient)}>
                            {patient.name} {patient.lastname} - {patient.cedula}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* El resto de los campos del formulario */}
            <div className="formGroup">
              <label>Fecha:</label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="formGroup">
              <label>Nombre/Razón Social:</label>
              <input
                type="text"
                name="nombre_razon"
                value={formData.nombre_razon}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="formGroup">
              <label>Dirección Fiscal:</label>
              <input
                type="text"
                name="dir_fiscal"
                value={formData.dir_fiscal}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="formGroup">
              <label>RIF:</label>
              <input
                type="text"
                name="rif"
                value={formData.rif}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="formGroup">
              <label>Forma de Pago:</label>
              <input
                type="text"
                name="forma_pago"
                value={formData.forma_pago}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="formGroup">
              <label>Contacto:</label>
              <input
                type="text"
                name="contacto"
                value={formData.contacto}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="formGroup">
              <label>Descripción del Servicio:</label>
              <input
                type="text"
                name="descripcion_servicio"
                value={formData.descripcion_servicio}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="formGroup">
              <label>Total:</label>
              <input
                type="number"
                name="total"
                value={formData.total}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit" className="submitButton">Crear Factura</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalCreateInvoice;
