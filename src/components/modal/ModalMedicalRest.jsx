import React, { useState, useEffect } from "react";
import InputBusqueda from "../inputs/InputBusqueda";
import "./css/ModalMedicalRest.css";
import ModalCreateMedicalRest from "./ModalCreateMedicalRest";
import ModalConfirmDelete from "./ModalConfirmDelete"; // Importar el nuevo modal
import { FaTrashAlt, FaTimes } from "react-icons/fa";

const ModalMedicalRest = ({ closeModal }) => { 
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedMedicalRestId, setSelectedMedicalRestId] = useState(null);

    // Fetch reposos médicos
    useEffect(() => {
        const doctorId = JSON.parse(localStorage.getItem('user'))._id;
 
        fetch(`https://insawork.onrender.com/getall-medical-rest/${doctorId}`)
            .then(response => response.json())
            .then(data => {
                // Verifica que data sea un array antes de usar setData
                if (Array.isArray(data)) {
                    setData(data);
                    setFilteredData(data);
                } else {
                    setData([]); // Asigna un array vacío si no es un array
                    setFilteredData([]);
                }
            })
            .catch(error => console.error("Error fetching medical rests:", error));
    }, []);

    // Filtrar los reposos médicos
    useEffect(() => {
        if (Array.isArray(data)) {
            const results = data.filter(medicalRest =>
                (medicalRest.nombrePaciente && medicalRest.nombrePaciente.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (medicalRest.cedulaPaciente && medicalRest.cedulaPaciente.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            setFilteredData(results);
        }
    }, [searchTerm, data]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleMedicalRestClick = (id) => {
        fetch(`https://insawork.onrender.com/get-medical-rest/${id}`)
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
        fetch(`https://insawork.onrender.com/delete-medical-rest/${selectedMedicalRestId}`, {
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
                <div className="medicalRestHeader">
                    <h2 className="createMedicineModalTitle">Reposos Médicos</h2>
                    <button className="usuarioCloseButton" onClick={() => closeModal(false)}>
                        <FaTimes />
                    </button>
                </div>
                <div className="modalBody">
                    <div className="modalBodyContainer">
                        <div className="medicalRestSearch">
                            <InputBusqueda
                                width="430px"
                                height="40px"
                                color="#D9D9D9"
                                placeholder="Busca por nombre o cédula..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            <button
                                className="createRestButton"
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
                                            <p><strong>Nombre Paciente:</strong> {medicalRest.nombrePaciente}</p>
                                            <p><strong>Cédula Paciente:</strong> {medicalRest.cedulaPaciente}</p>
                                        </div>
                                        <button
                                            className="deleteButton"
                                            onClick={() => handleDeleteClick(medicalRest._id)}
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p>No se encontraron reposos médicos.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {isCreateModalOpen && <ModalCreateMedicalRest closeModal={() => setIsCreateModalOpen(false)} />}
            {isDeleteModalOpen && <ModalConfirmDelete onConfirm={confirmDelete} onCancel={() => setIsDeleteModalOpen(false)} />}
        </div>
    );
}; 

export default ModalMedicalRest;
