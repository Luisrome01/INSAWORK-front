import React, { useState } from "react";
import "./css/ModalCreateReport.css";
import InputGeneral from "../inputs/InputGeneral";
import { showErrorMessage, showSuccessMessage, showWarningMessage } from "../messageBar/MessageBar";

const ModalCreateReport = ({ closeModal }) => {
    const [cedulaPaciente, setCedulaPaciente] = useState("");
    const [sintomas, setSintomas] = useState("");
    const [fechaReporte, setFechaReporte] = useState("");
    const [hallazgos, setHallazgos] = useState("");
    const [examenes, setExamenes] = useState("");
    const [diagnostico, setDiagnostico] = useState("");
    const [message, setMessage] = useState(null);

    const handleCreate = async () => {
        const doctorId = JSON.parse(localStorage.getItem('user'))._id;

        if (!doctorId) {
            setMessage(showErrorMessage("Doctor ID not found", "center"));
            return;
        }

        const newReport = {
            doctorId,
            cedulaPaciente,
            fecha_reporte: fechaReporte,
            sintomas,
            hallazgos,
            examenes,
            diagnostico
        };

        try {
            const response = await fetch("http://localhost:3000/reports", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newReport),
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                window.open(url, "_blank");
                setMessage(showSuccessMessage("Reporte médico creado exitosamente", "center"));
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
        <div className="modalCreateReportContainer">
            <div className="modalCreateReportBackgroundBlur"></div>
            <div className="modalCreateReportContent">
                <div className="modalHeader">
                    <h2>Crear Reporte Médico</h2>
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
                        <label>Fecha del Reporte:</label>
                        <InputGeneral
                            type="date"
                            value={fechaReporte}
                            onChange={(e) => setFechaReporte(e.target.value)}
                        />
                    </div>
                    <div className="inputContainer">
                        <label>Hallazgos:</label>
                        <InputGeneral
                            type="text"
                            value={hallazgos}
                            onChange={(e) => setHallazgos(e.target.value)}
                        />
                    </div>
                    <div className="inputContainer">
                        <label>Exámenes:</label>
                        <InputGeneral
                            type="text"
                            value={examenes}
                            onChange={(e) => setExamenes(e.target.value)}
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
                        <button className="createButton" onClick={handleCreate}>
                            Crear Reporte Médico
                        </button>
                    </div>
                </div>
                {message && <div className="messageContainer">{message}</div>}
            </div>
        </div>
    );
};

export default ModalCreateReport;
