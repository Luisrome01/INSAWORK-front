import React, { useState, useEffect } from "react";
import "./css/ModalCreateAppointment.css";
import MessageBar, { showErrorMessage, showSuccessMessage } from "../messageBar/MessageBar";
import { FaTimes } from 'react-icons/fa';

const ModalCreateAppointment = ({ doctorId }) => {
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [motive, setMotive] = useState("");
    const [messageBar, setMessageBar] = useState("");
    const [filter, setFilter] = useState("");
    const [isOpen, setIsOpen] = useState(true); // Controlar la apertura del modal

    const displayMessage = (messageComponent) => {
        setMessageBar(messageComponent);
        setTimeout(() => {
            setMessageBar("");
        }, 3000);
    };

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await fetch(`https://insawork.onrender.com/patients/${doctorId}`);
                const data = await response.json();
                setPatients(data);
                setFilteredPatients(data);
            } catch (error) {
                displayMessage(showErrorMessage("Error al cargar los pacientes.", "center"));
            }
        };
        fetchPatients();
    }, [doctorId]);

    useEffect(() => {
        setFilteredPatients(
            patients.filter(patient =>
                patient.name.toLowerCase().includes(filter.toLowerCase()) ||
                patient.cedula.includes(filter)
            )
        );
    }, [filter, patients]);

    const handlePatientSelect = (patient) => {
        setSelectedPatient(patient);
        setFilter(""); // Limpiar el filtro al seleccionar un paciente
    };

    const handleAppointmentCreate = async () => {
        if (!selectedPatient || !date || !time || !motive) {
            displayMessage(showErrorMessage("Por favor, complete todos los campos.", "center"));
            return;
        }

        // Verificar que el tiempo esté en formato HH:MM
        const [hour, minute] = time.split(":").map(Number);

        // Validar si la hora y los minutos son válidos
        if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
            displayMessage(showErrorMessage("Hora no válida. Debe estar en formato HH:MM.", "center"));
            return;
        }

        const formattedTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

        try {
            const response = await fetch("https://insawork.onrender.com/appointments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    patientId: selectedPatient._id,
                    doctorId,
                    date,
                    time: formattedTime, // Usar la hora formateada
                    motive,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                displayMessage(showSuccessMessage("Cita creada exitosamente.", "center"));
                setTimeout(() => {
                    setIsOpen(false); // Cerrar el modal después de crear la cita
                }, 3000);
            } else {
                displayMessage(showErrorMessage(result.msg || "Error al crear la cita.", "center"));
            }
        } catch (error) {
            displayMessage(showErrorMessage("Error de conexión. Inténtelo de nuevo más tarde.", "center"));
        }
    };

    const handleCloseModal = () => {
        setIsOpen(false); // Cambiar el estado para cerrar el modal
    };

    const handleTimeChange = (e) => {
        const { value } = e.target;
        setTime(formatTimeInput(value));
    };

    const formatTimeInput = (value) => {
        // Asegurarse de que el valor sea un número y tenga la longitud adecuada
        const regex = /^[0-9]*$/;
        if (!regex.test(value)) return time;

        // Limitamos la longitud del valor a 5 caracteres (HH:MM)
        let formattedValue = value.slice(0, 5);

        // Asegurarse de que el formato sea HH:MM
        if (formattedValue.length > 2) {
            formattedValue = formattedValue.slice(0, 2) + ":" + formattedValue.slice(2, 4);
        }

        // Agregar ceros a la izquierda si es necesario
        const parts = formattedValue.split(":");
        if (parts.length === 2) {
            const hours = parts[0].padStart(2, "0");
            const minutes = parts[1].padEnd(2, "0");
            formattedValue = `${hours}:${minutes}`;
        }

        return formattedValue;
    };

    if (!isOpen) return null; // No renderizar el modal si isOpen es false

    return (
        <div className="createAppointmentModalContainer">
            <div className="createAppointmentModalBackgroundBlur"></div>
            <div className="createAppointmentModalContent">
                <div className="createAppointmentModalHeader">
                    <h2 className="createAppointmentModalTitle">Crear Cita</h2>
                    <button className="usuarioCloseButton" onClick={handleCloseModal}>
                        <FaTimes />
                    </button>
                </div>
                <div className="createAppointmentModalBody">
                    {messageBar}
                    {!selectedPatient ? (
                        <>
                            <h3>Seleccione un Paciente:</h3>
                            <input
                                type="text"
                                placeholder="Buscar por nombre o cédula"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="createAppointmentFilterInput"
                            />
                            <ul className="patientList" style={{ maxHeight: "220px", overflowY: "scroll", marginTop: '20px' }}>
                                {filteredPatients.map(patient => (
                                    <li key={patient._id} onClick={() => handlePatientSelect(patient)}>
                                        {patient.name} {patient.lastname} - {patient.cedula}
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <>
                            <h3 className="name-details">Detalles de la Cita para {selectedPatient.name}:</h3>
                            <label className="labelSpacing">
                                Fecha:
                                <input 
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="createAppointmentInputField"
                                />
                            </label>
                            <label className="labelSpacing">
                                Hora:
                                <input 
                                    type="text"
                                    value={time}
                                    onChange={handleTimeChange}
                                    className="createAppointmentTimeInput"
                                    placeholder="HH:MM"
                                    maxLength="5" // Limitar a 5 caracteres (HH:MM)
                                />
                            </label>
                            <label className="labelSpacing">
                                Motivo:
                                <input 
                                    type="text"
                                    value={motive}
                                    onChange={(e) => setMotive(e.target.value)}
                                    className="createAppointmentInputField"
                                    placeholder="Motivo de la cita"
                                />
                            </label>
                            <button className="createAppointmentSubmitButton" onClick={handleAppointmentCreate}>
                                Crear Cita
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ModalCreateAppointment;
