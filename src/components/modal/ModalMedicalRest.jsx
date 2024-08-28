import React, { useState, useEffect } from "react";
import InputBusqueda from "../inputs/InputBusqueda";
import "./css/ModalMedicalRest.css";
import ModalCreateMedicalRest from "./ModalCreateMedicalRest";
import ModalConfirmDelete from "./ModalConfirmDelete"; // Importar el nuevo modal
import { FaTrashAlt } from "react-icons/fa";

const ModalMedicalRest = ({ closeModal }) => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedMedicalRestId, setSelectedMedicalRestId] = useState(null);

    useEffect(() => {
        const doctorId = JSON.parse(localStorage.getItem('user'))._id;

        fetch(`http://localhost:3000/getall-medical-rest/${doctorId}`)
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

    const handleDeleteClick = (id) => {
        setSelectedMedicalRestId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        fetch(`http://localhost:3000/delete-medical-rest/${selectedMedicalRestId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    setData(data.filter(medicalRest => medicalRest._id !== selectedMedicalRestId));
                    setFilteredData(filteredData.filter(medicalRest => medicalRest._id !== selectedMedicalRestId));
                    setIsDeleteModalOpen(false);
                } else {
                    alert("Error al eliminar el reposo médico.");
                }
            })
            .catch(error => console.error("Error deleting medical rest:", error));
    };

    return (
        <div className="modalMedicalRestContainer">
            <div className="modalMedicalRestBackgroundBlur"></div>
            <div className="modalMedicalRestContent">
                <div className="modalHeader">
                    <p className="searchTitle">Cerrar Reposos Médicos:</p>
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
                            <p className="searchTitle">Buscar Reposo Médico:</p>
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
                        
                        <div className="medicalRestList">
                            {filteredData.length > 0 ? (
                                filteredData.map((medicalRest) => (
                                    <div
                                        key={medicalRest._id}
                                        className="medicalRestItem"
                                    >
                                        <div className="medicalRestInfo" onClick={() => handleMedicalRestClick(medicalRest._id)}>
                                            <p><strong>ID:</strong> {medicalRest._id}</p>
                                            <p><strong>Nombre Paciente:</strong> {medicalRest.nombrePaciente}</p>
                                            <p><strong>Cédula Paciente:</strong> {medicalRest.cedulaPaciente}</p>
                                            <p><strong>Fecha:</strong> {new Date(medicalRest.fecha).toLocaleDateString()}</p>
                                        </div>
                                        <FaTrashAlt
                                            className="deleteIcon"
                                            onClick={() => handleDeleteClick(medicalRest._id)}
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
                <ModalCreateMedicalRest
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

export default ModalMedicalRest;
