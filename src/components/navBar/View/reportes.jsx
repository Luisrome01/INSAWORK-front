import React, { useState } from "react";
import "./css/reportes.css";
import ModalMedicalRest from "../../modal/ModalMedicalRest"; // Asegúrate de ajustar la ruta
import ModalDefault from "../../modal/ModalDefault"; // Ajustar la ruta según la ubicación de ModalDefault
import BtnGeneral from "../../buttons/BtnGeneral"; // Ajustar la ruta según la ubicación de BtnGeneral
import BuscarMedicalRestTable from "../../tables/BuscarMedicalRestTable";

import "../../tables/css/BuscarMedicalRestTable.css";

const Reportes = ({ totalCosto, listaCitas, cliente, setClienteExterno, setListaCitasExterna, continuarVista }) => {
    const [isModalMedicalRestOpen, setIsModalMedicalRestOpen] = useState(false);
    const [isModalDefaultOpen, setIsModalDefaultOpen] = useState(false);

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
            </div>

            {isModalMedicalRestOpen && (
                <ModalMedicalRest
                    closeModal={setIsModalMedicalRestOpen}
                    agregarMedicalRest={handleAgregarMedicalRest}
                />
            )}

            {isModalDefaultOpen && (
                <ModalDefault closeModal={setIsModalDefaultOpen}>
                    {/* Aquí puedes agregar el contenido que desees dentro del modal */}
                    <h2>Este es un modal vacío</h2>
                    <p>Usa este modal como plantilla para crear otros modales.</p>
                </ModalDefault>
            )}
        </div>
    );
};

export default Reportes;
