import React, { useState } from "react";
import "./css/reportes.css";
import ModalMedicalRest from "../../modal/ModalMedicalRest"; // Asegúrate de ajustar la ruta
import BtnGeneral from "../../buttons/BtnGeneral"; // Ajustar la ruta según la ubicación de BtnGeneral
import BuscarMedicalRestTable from "../../tables/BuscarMedicalRestTable";

import "../../tables/css/BuscarMedicalRestTable.css";



const Reportes = ({ totalCosto, listaCitas, cliente, setClienteExterno, setListaCitasExterna, continuarVista }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAgregarMedicalRest = (medicalRest) => {
        console.log("Medical Rest seleccionado:", medicalRest);
        setListaCitasExterna([...listaCitas, medicalRest]);
    };

    return (
        <div className="ReportesContainer">
        

            <BtnGeneral
                text="Buscar Medical Rest"
                color="#FFFFFF"
                bgColor="#1E90FF"
                handleClick={() => setIsModalOpen(true)}
            />

            {isModalOpen && (
                <ModalMedicalRest
                    closeModal={setIsModalOpen}
                    agregarMedicalRest={handleAgregarMedicalRest}
                />
            )}
        </div>
    );
};

export default Reportes;
