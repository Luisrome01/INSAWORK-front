import React, { useState, useEffect } from "react";
import InputBusqueda from "../inputs/InputBusqueda";
import "./css/ModalAptitude.css";
import ModalCreateAptitude from "./ModalCreateAptitude";
import ModalConfirmDelete from "./ModalConfirmDelete";
import { FaTrashAlt } from "react-icons/fa";

const ModalAptitude = ({ closeModal }) => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedAptitudeId, setSelectedAptitudeId] = useState(null);

    // Fetch aptitude proofs when the component mounts
    useEffect(() => {
        const doctorId = JSON.parse(localStorage.getItem('user'))._id;

        fetch(`https://insawork.onrender.com/aptitudeproofs/${doctorId}`)
            .then(response => response.json())
            .then(data => {
                // Convert dates to a more readable format
                const updatedData = data.map(aptitude => ({
                    ...aptitude,
                    createdAt: new Date(aptitude.createdAt).toLocaleDateString(),
                    updatedAt: new Date(aptitude.updatedAt).toLocaleDateString()
                }));
                setData(updatedData);
                setFilteredData(updatedData);
            })
            .catch(error => console.error("Error fetching aptitude proofs:", error));
    }, []);

    // Filter aptitude proofs based on search term
    useEffect(() => {
        const results = data.filter(aptitude =>
            (aptitude.nombrePaciente && aptitude.nombrePaciente.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (aptitude.cedulaPaciente && aptitude.cedulaPaciente.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredData(results);
    }, [searchTerm, data]);

    // Handle search term change
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Fetch and display the aptitude proof
    const handleAptitudeClick = (id) => {
        fetch(`https://insawork.onrender.com/aptitudeproof/${id}`, {
            method: 'GET',
        })
            .then(response => {
                const contentType = response.headers.get("Content-Type");
                if (contentType && contentType.includes("application/pdf")) {
                    return response.blob();
                } else {
                    return response.text(); // If not PDF, handle as text or JSON
                }
            })
            .then(blob => {
                if (blob instanceof Blob) {
                    const url = URL.createObjectURL(blob);
                    window.open(url, '_blank');
                    URL.revokeObjectURL(url); // Clean up the URL object
                } else {
                    console.log("Fetched data:", blob);
                    closeModal(false);
                }
            })
            .catch(error => console.error("Error fetching aptitude proof:", error));
    };

    // Handle click on delete button
    const handleDeleteClick = (id) => {
        setSelectedAptitudeId(id);
        setIsDeleteModalOpen(true);
    };

    // Confirm and delete the aptitude proof
    const confirmDelete = () => {
        fetch(`https://insawork.onrender.com/aptitudeproofs/${selectedAptitudeId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    setData(data.filter(aptitude => aptitude._id !== selectedAptitudeId));
                    setFilteredData(filteredData.filter(aptitude => aptitude._id !== selectedAptitudeId));
                    setIsDeleteModalOpen(false);
                } else {
                    alert("Error al eliminar la prueba de aptitud.");
                }
            })
            .catch(error => console.error("Error deleting aptitude proof:", error));
    };

    return (
        <div className="modalAptitudeContainer">
            <div className="modalAptitudeBackgroundBlur"></div>
            <div className="modalAptitudeContent">
                <div className="modalHeader">
                    <p className="searchTitle">Pruebas de Aptitud:</p>
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
                            <p className="searchTitle">Buscar Prueba de Aptitud:</p>
                            <InputBusqueda
                                width="250px"
                                height="40px"
                                color="#D9D9D9"
                                placeholder="Busca por nombre o cédula..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            <button
                                className="createButton"
                                onClick={() => setIsCreateModalOpen(true)}
                            >
                                +
                            </button>
                        </div>
                        
                        <div className="aptitudeList">
                            {filteredData.length > 0 ? (
                                filteredData.map((aptitude) => (
                                    <div
                                        key={aptitude._id}
                                        className="aptitudeItem"
                                    >
                                        <div className="aptitudeInfo" onClick={() => handleAptitudeClick(aptitude._id)}>
                                    
                                            <p><strong>Nombre Paciente:</strong> {aptitude.nombrePaciente}</p>
                                            <p><strong>Cédula Paciente:</strong> {aptitude.cedulaPaciente}</p>
                                            <p><strong>Fecha de Creación:</strong> {aptitude.createdAt}</p>
                                        </div>
                                        <FaTrashAlt
                                            className="deleteIcon"
                                            onClick={() => handleDeleteClick(aptitude._id)}
                                        />
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
                <ModalCreateAptitude
                    closeModal={setIsCreateModalOpen}
                />
            )}

            {isDeleteModalOpen && (
                <ModalConfirmDelete
                    onConfirm={confirmDelete}
                    onCancel={() => setIsDeleteModalOpen(false)}
                />
            )}
        </div>
    );
};

export default ModalAptitude;
