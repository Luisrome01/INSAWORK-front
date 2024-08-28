import React, { useState, useEffect } from "react";
import InputBusqueda from "../inputs/InputBusqueda";
import "./css/ModalReports.css";
import ModalCreateReport from "./ModalCreateReport";
import ModalConfirmDelete from "./ModalConfirmDelete";
import { FaTrashAlt } from "react-icons/fa";

const ModalReports = ({ closeModal }) => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedReportId, setSelectedReportId] = useState(null);

    // Fetch reports when the component mounts
    useEffect(() => {
        const doctorId = JSON.parse(localStorage.getItem('user'))._id;

        fetch(`http://localhost:3000/reports/${doctorId}`)
            .then(response => response.json())
            .then(data => {
                setData(data);
                setFilteredData(data);
            })
            .catch(error => console.error("Error fetching reports:", error));
    }, []);

    // Filter reports based on search term
    useEffect(() => {
        const results = data.filter(report =>
            (report.nombrePaciente && report.nombrePaciente.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (report.cedulaPaciente && report.cedulaPaciente.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredData(results);
    }, [searchTerm, data]);

    // Handle search term change
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Fetch and display the report
    const handleReportClick = (id) => {
        fetch(`http://localhost:3000/report/${id}`)
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
                    console.log("Fetched report details:", blob);
                    closeModal(false);
                }
            })
            .catch(error => console.error("Error fetching report details:", error));
    };

    // Handle click on delete button
    const handleDeleteClick = (id) => {
        setSelectedReportId(id);
        setIsDeleteModalOpen(true);
    };

    // Confirm and delete the report
    const confirmDelete = () => {
        fetch(`http://localhost:3000/reports/${selectedReportId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    setData(data.filter(report => report._id !== selectedReportId));
                    setFilteredData(filteredData.filter(report => report._id !== selectedReportId));
                    setIsDeleteModalOpen(false);
                } else {
                    alert("Error al eliminar el reporte médico.");
                }
            })
            .catch(error => console.error("Error deleting report:", error));
    };

    return (
        <div className="modalReportsContainer">
            <div className="modalReportsBackgroundBlur"></div>
            <div className="modalReportsContent">
                <div className="modalHeader">
                    <p className="searchTitle">Cerrar Reportes Médicos:</p>
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
                            <p className="searchTitle">Buscar Reporte Médico:</p>
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
                        
                        <div className="reportList">
                            {filteredData.length > 0 ? (
                                filteredData.map((report) => (
                                    <div
                                        key={report._id}
                                        className="reportItem"
                                    >
                                        <div className="reportInfo" onClick={() => handleReportClick(report._id)}>
                                            <p><strong>ID:</strong> {report._id}</p>
                                            <p><strong>Nombre Paciente:</strong> {report.nombrePaciente}</p>
                                            <p><strong>Cédula Paciente:</strong> {report.cedulaPaciente}</p>
                                            <p><strong>Fecha:</strong> {new Date(report.fecha_reporte).toLocaleDateString()}</p>
                                        </div>
                                        <FaTrashAlt
                                            className="deleteIcon"
                                            onClick={() => handleDeleteClick(report._id)}
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
                <ModalCreateReport
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

export default ModalReports;
