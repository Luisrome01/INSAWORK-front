import React, { useState } from "react";
import "./css/ModalCreateMedicalRest.css";
import InputGeneral from "../inputs/InputGeneral";

const ModalCreateMedicalRest = ({ closeModal }) => {
    const [cedulaPaciente, setCedulaPaciente] = useState("");  // Cambiado de patientId a cedulaPaciente
    const [sintomas, setSintomas] = useState("");
    const [fecha, setFecha] = useState("");
    const [diagnostico, setDiagnostico] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFinal, setFechaFinal] = useState("");
    const [comentarios, setComentarios] = useState("");

    const handleCreate = async () => {
        const newMedicalRest = {
            cedulaPaciente,  // Cambiado de patientId a cedulaPaciente
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
                closeModal(false);
            } else {
                console.error("Error al crear Medical Rest:", response.statusText);
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    };

    return (
        <div className="modalCreateMedicalRestContainer">
            <div className="modalCreateMedicalRestBackgroundBlur"></div>
            <div className="modalCreateMedicalRestContent">
                <div className="modalHeader">
                    <h2>Crear Reposo Médico</h2>
                    <button
                        className="closeButton"
                        onClick={() => closeModal(false)}
                    >
                        X
                    </button>
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
                        <button
                            className="createButton"
                            onClick={handleCreate}
                        >
                            Crear Reposo Médico
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalCreateMedicalRest;
