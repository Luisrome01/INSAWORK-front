import React, { useState } from "react";
import "./css/reportes.css";
import ModalMedicalRest from "../../modal/ModalMedicalRest";
import ModalReports from "../../modal/ModalReports";
import ModalAptitude from "../../modal/ModalAptitude";

const Reportes = ({ listaCitas, setListaCitasExterna }) => {
    const [isModalMedicalRestOpen, setIsModalMedicalRestOpen] = useState(false);
    const [isModalReportsOpen, setIsModalReportsOpen] = useState(false);
    const [isModalAptitudeOpen, setIsModalAptitudeOpen] = useState(false);

    const handleAgregarMedicalRest = (medicalRest) => {
        console.log("Medical Rest seleccionado:", medicalRest);
        setListaCitasExterna([...listaCitas, medicalRest]);
    };

    return (
        <div className="reportes-container">
            <div className="button-container">
                <div 
                    className="card-reportes"
                    onClick={() => setIsModalMedicalRestOpen(true)}
                >
                    Reposos Medicos
                </div>

                <div 
                    className="card-reportes"
                    onClick={() => setIsModalReportsOpen(true)}
                >
                    Abrir Modal Reportes
                </div>

                <div 
                    className="card-reportes"
                    onClick={() => setIsModalAptitudeOpen(true)}
                >
                    Abrir Modal Aptitude
                </div>
            </div>

            {isModalMedicalRestOpen && (
                <ModalMedicalRest
                    closeModal={setIsModalMedicalRestOpen}
                    agregarMedicalRest={handleAgregarMedicalRest}
                />
            )}

            {isModalReportsOpen && (
                <ModalReports closeModal={setIsModalReportsOpen} />
            )}

            {isModalAptitudeOpen && (
                <ModalAptitude closeModal={setIsModalAptitudeOpen} />
            )}
        </div>
    );
};

export default Reportes;
