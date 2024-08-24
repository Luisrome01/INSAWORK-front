import React, { useState, useEffect } from "react";
import "./css/ModalCreateAppointment.css";
import MessageBar, { showErrorMessage, showSuccessMessage } from "../messageBar/MessageBar";

const ModalCreateAppointment = ({ doctorId, closeModal }) => {
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [motive, setMotive] = useState("");
    const [messageBar, setMessageBar] = useState("");
    const [filter, setFilter] = useState("");
    const [selectedTimePeriod, setSelectedTimePeriod] = useState("AM");

    const displayMessage = (messageComponent) => {
        setMessageBar(messageComponent);
        setTimeout(() => {
            setMessageBar("");
        }, 3000);
    };

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await fetch(`http://localhost:3000/patients/${doctorId}`);
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
        setPatients([]);
    };

    const handleAppointmentCreate = async () => {
        if (!selectedPatient || !date || !time || !motive) {
            displayMessage(showErrorMessage("Por favor, complete todos los campos.", "center"));
            return;
        }

        // Convertir la hora a formato de 24 horas según AM/PM
        const [hour, minute] = time.split(":");
        let formattedHour = parseInt(hour, 10);
        
        if (selectedTimePeriod === "PM" && formattedHour < 12) {
            formattedHour += 12; // Convertir a formato 24 horas
        } else if (selectedTimePeriod === "AM" && formattedHour === 12) {
            formattedHour = 0; // Ajustar la medianoche a 0
        }

        const formattedTime = `${String(formattedHour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

        try {
            const response = await fetch("http://localhost:3000/appointments", {
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
                    window.location.reload(); // Recargar la página si la cita fue creada
                }, 3000);
            } else {
                displayMessage(showErrorMessage(result.msg || "Error al crear la cita.", "center"));
            }
        } catch (error) {
            displayMessage(showErrorMessage("Error de conexión. Inténtelo de nuevo más tarde.", "center"));
        }
    };

    const handleCloseModal = () => {
        closeModal(); // Llama a la función para cerrar el modal
    };

    const handleTimePeriodChange = (period) => {
        setSelectedTimePeriod(period);
    };

    const handleTimeChange = (e) => {
        const { value } = e.target;
        const regex = /^[0-9]*$/; // Permitir solo números
        if (regex.test(value)) {
            let formattedValue = value;

            // Formatear el input para incluir ":" automáticamente
            if (value.length === 2) {
                formattedValue += ":"; // Agregar ":" después de los dos dígitos
            }
            setTime(formattedValue);
        }
    };

    return (
        <div className="createAppointmentModalContainer">
            <div className="createAppointmentModalBackgroundBlur"></div>
            <div className="createAppointmentModalContent">
                <div className="createAppointmentModalHeader">
                    <h2 className="createAppointmentModalTitle">Crear Cita</h2>
                    <button className="createAppointmentCloseButton" onClick={handleCloseModal}>
                        X
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
                            <ul className="patientList" style={{ maxHeight: "200px", overflowY: "scroll" }}>
                                {filteredPatients.map(patient => (
                                    <li key={patient._id} onClick={() => handlePatientSelect(patient)}>
                                        {patient.name} {patient.lastname} - {patient.cedula}
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <>
                            <h3>Detalles de la Cita para {selectedPatient.name}:</h3>
                            <label>
                                Fecha:
                                <input 
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="createAppointmentInputField"
                                />
                            </label>
                            <label>
                                Hora:
                                <div className="timeSelector">
                                    <input 
                                        type="text"
                                        value={time}
                                        onChange={handleTimeChange}
                                        className="createAppointmentTimeInput"
                                        placeholder="HH:MM"
                                        maxLength="5" // Limitar a 5 caracteres (HH:MM)
                                    />
                                    <div className="timePeriodSelector">
                                        <button 
                                            className={`timePeriodButton ${selectedTimePeriod === "AM" ? "selected" : ""}`}
                                            onClick={() => handleTimePeriodChange("AM")}
                                        >
                                            AM
                                        </button>
                                        <button 
                                            className={`timePeriodButton ${selectedTimePeriod === "PM" ? "selected" : ""}`}
                                            onClick={() => handleTimePeriodChange("PM")}
                                        >
                                            PM
                                        </button>
                                    </div>
                                </div>
                            </label>
                            <label>
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
