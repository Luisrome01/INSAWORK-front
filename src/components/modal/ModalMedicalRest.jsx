// ModalMedicalRest.jsx
import React, { useState, useEffect } from "react";
import InputBusqueda from "../inputs/InputBusqueda";
import "./css/ModalMedicalRest.css";
import ModalCreateMedicalRest from "./ModalCreateMedicalRest";

const ModalMedicalRest = ({ closeModal }) => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        fetch("http://localhost:3000/getall-medical-rest")
            .then(response => response.json())
            .then(data => {
                setData(data);
                setFilteredData(data);
            })
            .catch(error => console.error("Error fetching medical rests:", error));
    }, []);

    useEffect(() => {
        const results = data.filter(medicalRest =>
            (medicalRest.nombrePaciente && medicalRest.nombrePaciente.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (medicalRest.cedulaPaciente && medicalRest.cedulaPaciente.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredData(results);
    }, [searchTerm, data]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleMedicalRestClick = (id) => {
        fetch(`http://localhost:3000/get-medical-rest/${id}`)
            .then(response => {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/pdf")) {
                    return response.blob();
                } else if (contentType && contentType.includes("application/json")) {
                    return response.json();
                } else {
                    throw new Error("Received unexpected content type: " + contentType);
                }
            })
            .then(blob => {
                if (blob instanceof Blob) {
                    const url = URL.createObjectURL(blob);
                    window.open(url, '_blank');
                } else {
                    console.log("Fetched medical rest details:", blob);
                    closeModal(false);
                }
            })
            .catch(error => console.error("Error fetching medical rest details:", error));
    };

    return (<div className="modalMedicalRestContainer">
        <div className="modalMedicalRestBackgroundBlur"></div>
        <div className="modalMedicalRestContent">
            <div className="modalHeader">
            <p className="searchTitle">Cerrar Reposos Medicos:</p>
                <button
                    className="closeButton"
                    onClick={() => closeModal(false)}
                >
                    X
                </button>
            </div>
            <div className="modalBody">
                <div className="modalBodyContainer">
                    <div className="modalSearchContainer">
                        <p className="searchTitle">Buscar Reposo Medico:</p>
                        <InputBusqueda
                            width="250px"
                            height="40px"
                            color="#D9D9D9"
                            placeholder="Busca por nombre o cedula..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <button
                        className="createButton"
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        +
                    </button>
                    <div className="medicalRestList">
                        {filteredData.length > 0 ? (
                            filteredData.map((medicalRest) => (
                                <div
                                    key={medicalRest._id}
                                    className="medicalRestItem"
                                    onClick={() => handleMedicalRestClick(medicalRest._id)}
                                >
                                    <p><strong>ID:</strong> {medicalRest._id}</p>
                                    <p><strong>Nombre Paciente:</strong> {medicalRest.nombrePaciente}</p>
                                    <p><strong>Cédula Paciente:</strong> {medicalRest.cedulaPaciente}</p>
                                    <p><strong>Fecha:</strong> {new Date(medicalRest.fecha).toLocaleDateString()}</p>
                                    <hr className="itemSeparator" />
                                </div>
                            ))
                        ) : (
                            <p>No se encontraron datos.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    
        {isCreateModalOpen && (
            <ModalCreateMedicalRest
                closeModal={setIsCreateModalOpen}
            />
        )}
    </div>
    
    );
};

export default ModalMedicalRest;
