import React, { useState } from "react";
import "./css/reportes.css";
import ModalMedicalRest from "../../modal/ModalMedicalRest"; // Asegúrate de ajustar la ruta
import ModalDefault from "../../modal/ModalDefault"; // Ajustar la ruta según la ubicación de ModalDefault
import ModalReports from "../../modal/ModalReports"; // Ajusta la ruta según la ubicación de ModalReports
import BtnGeneral from "../../buttons/BtnGeneral"; // Ajustar la ruta según la ubicación de BtnGeneral

const Reportes = ({ totalCosto, listaCitas, cliente, setClienteExterno, setListaCitasExterna, continuarVista }) => {
    const [isModalMedicalRestOpen, setIsModalMedicalRestOpen] = useState(false);
    const [isModalDefaultOpen, setIsModalDefaultOpen] = useState(false);
    const [isModalReportsOpen, setIsModalReportsOpen] = useState(false); // Estado para ModalReports

    const handleAgregarMedicalRest = (medicalRest) => {
        console.log("Medical Rest seleccionado:", medicalRest);
        setListaCitasExterna([...listaCitas, medicalRest]);
    };

    return (
        <div className="ReportesContainer">
            <div className="buttonContainer">
                <BtnGeneral
                    text="Reposos Medicos"
                    color="#FFFFFF"
                    bgColor="#1E90FF"
                    handleClick={() => setIsModalMedicalRestOpen(true)}
                />

                <BtnGeneral
                    text="Abrir Modal Default"
                    color="#FFFFFF"
                    bgColor="#32CD32"
                    handleClick={() => setIsModalDefaultOpen(true)}
                />

                <BtnGeneral
                    text="Abrir Modal Reportes" // Texto del botón para el nuevo modal
                    color="#FFFFFF"
                    bgColor="#FF4500" // Color de fondo del botón
                    handleClick={() => setIsModalReportsOpen(true)} // Función para abrir el modal
                />
            </div>

            {isModalMedicalRestOpen && (
                <ModalMedicalRest
                    closeModal={setIsModalMedicalRestOpen}
                    agregarMedicalRest={handleAgregarMedicalRest}
                />
            )}

            {isModalDefaultOpen && (
                <ModalDefault closeModal={setIsModalDefaultOpen}>
                    <h2>Este es un modal vacío</h2>
                    <p>Usa este modal como plantilla para crear otros modales.</p>
                </ModalDefault>
            )}

            {isModalReportsOpen && (
                <ModalReports closeModal={setIsModalReportsOpen} />
            )}
        </div>
    );
};

export default Reportes;
