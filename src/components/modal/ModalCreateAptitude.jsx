import React, { useState } from "react";
import "./css/ModalCreateAptitude.css";
import { showErrorMessage, showSuccessMessage, showWarningMessage } from "../messageBar/MessageBar";

const ModalCreateAptitude = ({ closeModal }) => {
    const [cedulaPaciente, setCedulaPaciente] = useState("");
    const [concepto, setConcepto] = useState("");
    const [clasificacion, setClasificacion] = useState("");
    const [observaciones, setObservaciones] = useState("");
    const [conclusiones, setConclusiones] = useState("");
    const [message, setMessage] = useState(null);

    const handleCreate = async () => {
        const doctorId = JSON.parse(localStorage.getItem('user'))._id;

        if (!doctorId) {
            setMessage(showErrorMessage("Doctor ID not found", "center"));
            return;
        }

        const newAptitude = {
            doctorId,
            cedulaPaciente,
            concepto,
            clasificacion,
            observaciones,
            conclusiones
        };

        try {
            const response = await fetch("https://insawork.onrender.com/aptitudeProofs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newAptitude),
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                window.open(url, "_blank");
                setMessage(showSuccessMessage("Prueba de aptitud creada exitosamente", "center"));
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
        <div className="modalCreateAptitudeWrapper">
            <div className="modalCreateAptitudeBackdrop"></div>
            <div className="modalCreateAptitudeBox">
                <div className="modalHeader">
                    <h2>Crear Prueba de Aptitud</h2>
                    <button className="modalCloseButton" onClick={() => closeModal(false)}>X</button>
                </div>
                <div className="modalBody">
                    <div className="formGroup">
                        <label>Cédula del Paciente:</label>
                        <input
                            type="text"
                            value={cedulaPaciente}
                            onChange={(e) => setCedulaPaciente(e.target.value)}
                        />
                    </div>
                    <div className="formGroup">
                        <label>Concepto:</label>
                        <select
                            value={concepto}
                            onChange={(e) => setConcepto(e.target.value)}
                        >
                            <option value="">Seleccione un concepto</option>
                            <option value="Preempleo">Preempleo</option>
                            <option value="Prevacacional">Prevacacional</option>
                            <option value="Postvacacional">Postvacacional</option>
                            <option value="Retiro">Retiro</option>
                        </select>
                    </div>
                    <div className="formGroup">
                        <label>Clasificación:</label>
                        <select
                            value={clasificacion}
                            onChange={(e) => setClasificacion(e.target.value)}
                        >
                            <option value="">Seleccione una clasificación</option>
                            <option value="Apto">Apto</option>
                            <option value="No apto">No apto</option>
                        </select>
                    </div>
                    <div className="formGroup">
                        <label>Observaciones:</label>
                        <input
                            type="text"
                            value={observaciones}
                            onChange={(e) => setObservaciones(e.target.value)}
                        />
                    </div>
                    <div className="formGroup">
                        <label>Conclusiones:</label>
                        <input
                            type="text"
                            value={conclusiones}
                            onChange={(e) => setConclusiones(e.target.value)}
                        />
                    </div>
                    <div className="formGroup">
                        <button className="modalSubmitButton" onClick={handleCreate}>
                            Crear Prueba de Aptitud
                        </button>
                    </div>
                </div>
                {message && <div className="messageContainer">{message}</div>}
            </div>
        </div>
    );
};

export default ModalCreateAptitude;
