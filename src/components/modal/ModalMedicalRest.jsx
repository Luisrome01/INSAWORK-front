import React, { useState, useEffect } from "react";
import InputBusqueda from "../inputs/InputBusqueda";
import "./css/ModalMedicalRest.css";

const ModalMedicalRest = ({ closeModal }) => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Fetch data from the backend
        fetch("http://localhost:3000/getall-medical-rest")
            .then(response => response.json())
            .then(data => {
                setData(data);
                setFilteredData(data);
            })
            .catch(error => console.error("Error fetching medical rests:", error));
    }, []);

    useEffect(() => {
        // Filter data based on search term
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
                    // If the response is a PDF, handle it accordingly
                    return response.blob();
                } else if (contentType && contentType.includes("application/json")) {
                    // If the response is JSON, parse it
                    return response.json();
                } else {
                    throw new Error("Received unexpected content type: " + contentType);
                }
            })
            .then(blob => {
                if (blob instanceof Blob) {
                    // Create a URL for the PDF and open it in a new tab
                    const url = URL.createObjectURL(blob);
                    window.open(url, '_blank');
                } else {
                    // Handle JSON data
                    console.log("Fetched medical rest details:", blob);
                    // Optionally close the modal or update the state here
                    closeModal(false);
                }
            })
            .catch(error => console.error("Error fetching medical rest details:", error));
    };

    return (
        <div className="modalMedicalRestContainer">
            <div className="modalMedicalRestBackgroundBlur"></div>
            <div className="modalMedicalRestContent">
                <div className="modalHeader">
                    <div className="spacer"></div>
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
                            <p className="searchTitle">Buscar Medical Rest:</p>
                            <InputBusqueda
                                width="250px"
                                height="40px"
                                color="#D9D9D9"
                                placeholder="Buscar Medical Rest"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
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
        </div>
    );
};

export default ModalMedicalRest;
