import React from 'react';
import "../tables/css/BuscarMedicalRestTable.css"; // Asegúrate de que la ruta sea correcta

const BuscarMedicalRestTable = ({ rows }) => {
    return (
        <div className="buscarMedicalRestTableContainer">
            <table className="medicalRestTable">
                <thead>
                    <tr>
                        <th>Header 1</th>
                        <th>Header 2</th>
                        <th>Header 3</th>
                        {/* Agrega más encabezados según sea necesario */}
                    </tr>
                </thead>
                <tbody>
                    {rows.length > 0 ? (
                        rows.map((row, index) => (
                            <tr key={index}>
                                <td>{row.column1}</td>
                                <td>{row.column2}</td>
                                <td>{row.column3}</td>
                                {/* Agrega más celdas según sea necesario */}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No hay datos disponibles</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default BuscarMedicalRestTable;
