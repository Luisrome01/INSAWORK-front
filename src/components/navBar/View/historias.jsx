import React from "react";
import "./css/historias.css";

const Historias = ({ responsable }) => {
    return (
        <div className="HistoriasContainer">
            <h1 className="HistoriasHeader">Historias</h1>
            <p>Responsable: {responsable}</p>
            {/* Añade aquí la estructura básica que necesites para el componente Historias */}
            {/* Ejemplo: */}
            <div className="HistoriasContent">
                {/* Aquí puedes agregar componentes o lógica específica para mostrar las historias */}
                <p>Contenido de las historias estará aquí.</p>
            </div>
        </div>
    );
};

export default Historias;
