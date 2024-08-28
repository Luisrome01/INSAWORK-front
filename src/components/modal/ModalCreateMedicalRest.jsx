import React, { useState } from "react";
import "./css/ModalCreateMedicalRest.css";
import InputGeneral from "../inputs/InputGeneral";
import { showErrorMessage, showSuccessMessage, showWarningMessage } from "../messageBar/MessageBar";

const ModalCreateMedicalRest = ({ closeModal }) => {
    const [cedulaPaciente, setCedulaPaciente] = useState("");
    const [sintomas, setSintomas] = useState("");
    const [fecha, setFecha] = useState("");
    const [diagnostico, setDiagnostico] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFinal, setFechaFinal] = useState("");
    const [comentarios, setComentarios] = useState("");
    const [message, setMessage] = useState(null);

    const handleCreate = async () => {
        const doctorId = JSON.parse(localStorage.getItem('user'))._id;

        if (!doctorId) {
            setMessage(showErrorMessage("Doctor ID not found", "center"));
            return;
        }

        const newMedicalRest = {
            doctorId,
            cedulaPaciente,
            sintomas,
            fecha,
            diagnostico,
            fecha_inicio: fechaInicio,
            fecha_final: fechaFinal,
            comentarios
        };

        try {
            const response = await fetch("http://localhost:3000/create-medical-rest", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newMedicalRest),
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                window.open(url, "_blank");
                setMessage(showSuccessMessage("Reposo Médico creado exitosamente", "center"));
                setTimeout(() => closeModal(false), 3000);
            } else {
                const errorData = await response.json();
                if (response.status === 404 && errorData.msg === 'Patient not found') {
                    setMessage(showWarningMessage("La cédula del paciente no se encuentra registrada", "center"));
                } else {
                    setMessage(showErrorMessage(`Error: ${errorData.msg}`, "center"));
                }
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            setMessage(showErrorMessage("Error en la solicitud. Por favor, intente de nuevo.", "center"));
        }
    };

    return (
        <div className="modalCreateMedicalRestContainer">
            <div className="modalCreateMedicalRestBackgroundBlur"></div>
            <div className="modalCreateMedicalRestContent">
                <div className="modalHeader">
                    <h2>Crear Reposo Médico</h2>
                    <button className="closeButton" onClick={() => closeModal(false)}>X</button>
                </div>
                <div className="modalBody">
                    <div className="inputContainer">
                        <label>Cédula del Paciente:</label>
                        <InputGeneral
                            type="text"
                            value={cedulaPaciente}
                            onChange={(e) => setCedulaPaciente(e.target.value)}
                        />
                    </div>
                    <div className="inputContainer">
                        <label>Síntomas:</label>
                        <InputGeneral
                            type="text"
                            value={sintomas}
                            onChange={(e) => setSintomas(e.target.value)}
                        />
                    </div>
                    <div className="inputContainer">
                        <label>Fecha:</label>
                        <InputGeneral
                            type="date"
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                        />
                    </div>
                    <div className="inputContainer">
                        <label>Diagnóstico:</label>
                        <InputGeneral
                            type="text"
                            value={diagnostico}
                            onChange={(e) => setDiagnostico(e.target.value)}
                        />
                    </div>
                    <div className="inputContainer">
                        <label>Fecha Inicio:</label>
                        <InputGeneral
                            type="date"
                            value={fechaInicio}
                            onChange={(e) => setFechaInicio(e.target.value)}
                        />
                    </div>
                    <div className="inputContainer">
                        <label>Fecha Final:</label>
                        <InputGeneral
                            type="date"
                            value={fechaFinal}
                            onChange={(e) => setFechaFinal(e.target.value)}
                        />
                    </div>
                    <div className="inputContainer">
                        <label>Comentarios:</label>
                        <InputGeneral
                            type="text"
                            value={comentarios}
                            onChange={(e) => setComentarios(e.target.value)}
                        />
                    </div>
                    <div className="inputContainer">
                        <button className="createButton" onClick={handleCreate}>
                            Crear Reposo Médico
                        </button>
                    </div>
                </div>
                {message && <div className="messageContainer">{message}</div>}
            </div>
        </div>
    );
};

export default ModalCreateMedicalRest;
