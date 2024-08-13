import React from "react";
import "./css/reportes.css";

const Reportes = ({ totalCosto, listaCitas, cliente, setClienteExterno, setListaCitasExterna, continuarVista }) => {
    return (
        <div className="ReportesContainer">
            <h1 className="ReportesHeader">Reportes</h1>
            {/* Añade aquí la estructura básica que necesites */}
            <p>Total Costo: {totalCosto}</p>
            {/* Agrega aquí otros elementos relevantes para el componente Reportes */}
        </div>
    );
};

export default Reportes;
