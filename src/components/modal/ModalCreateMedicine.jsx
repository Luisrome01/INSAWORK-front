import React, { useState, useEffect } from "react";
import "./css/ModalCreateMedicine.css";
import MessageBar, { showErrorMessage, showSuccessMessage } from "../messageBar/MessageBar";
import { FaTrashAlt } from 'react-icons/fa'; // Importar el icono de papelera

const ModalCreateMedicine = ({ doctorId, onClose }) => {
    const [medicines, setMedicines] = useState([]);
    const [filteredMedicines, setFilteredMedicines] = useState([]);
    const [filter, setFilter] = useState("");
    const [messageBar, setMessageBar] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [newMedicine, setNewMedicine] = useState({
        name: "",
        type: "",
        use: ""
    });

    const displayMessage = (messageComponent) => {
        setMessageBar(messageComponent);
        setTimeout(() => {
            setMessageBar("");
        }, 3000);
    };

    useEffect(() => {
        const fetchMedicines = async () => {
            try {
                const response = await fetch(`http://localhost:3000/medicines`);
                const data = await response.json();
                setMedicines(data);
                setFilteredMedicines(data);
            } catch (error) {
                displayMessage(showErrorMessage("Error al cargar las medicinas.", "center"));
            }
        };
        fetchMedicines();
    }, []);

    useEffect(() => {
        setFilteredMedicines(
            medicines.filter(medicine =>
                medicine.name.toLowerCase().includes(filter.toLowerCase())
            )
        );
    }, [filter, medicines]);

    const handleFormToggle = () => {
        setShowForm(!showForm);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMedicine({
            ...newMedicine,
            [name]: value
        });
    };

    const handleSubmitMedicine = async () => {
        if (!newMedicine.name || !newMedicine.type || !newMedicine.use) {
            displayMessage(showErrorMessage("Por favor, complete todos los campos.", "center"));
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/medicines", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newMedicine),
            });

            const result = await response.json();

            if (response.ok) {
                displayMessage(showSuccessMessage("Medicina creada exitosamente.", "center"));
                setNewMedicine({ name: "", type: "", use: "" });
                setShowForm(false);
                setMedicines([...medicines, result]);
                setFilteredMedicines([...filteredMedicines, result]);
            } else {
                displayMessage(showErrorMessage(result.msg || "Error al crear la medicina.", "center"));
            }
        } catch (error) {
            displayMessage(showErrorMessage("Error de conexión. Inténtelo de nuevo más tarde.", "center"));
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/medicines/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setMedicines(medicines.filter((medicine) => medicine._id !== id));
                setFilteredMedicines(filteredMedicines.filter((medicine) => medicine._id !== id));
                displayMessage(showSuccessMessage("Medicina eliminada exitosamente.", "center"));
            } else {
                const result = await response.json();
                displayMessage(showErrorMessage(result.msg || "Error al eliminar la medicina.", "center"));
            }
        } catch (error) {
            displayMessage(showErrorMessage("Error de conexión. Inténtelo de nuevo más tarde.", "center"));
        }
    };

    return (
        <div className="createMedicineModalContainer">
    <div className="createMedicineModalBackgroundBlur"></div>
    <div className="createMedicineModalContent">
        <div className="createMedicineModalHeader">
            <h2 className="createMedicineModalTitle">Gestionar Medicinas</h2>
            <button className="createMedicineCloseButton" onClick={onClose}>
                X
            </button>
        </div>
        <div className="createMedicineModalBody">
            {messageBar}
            {showForm ? (
                <>
                    <h3>Añadir Nueva Medicina</h3>
                    <label className="medicineLabel">
                        <input
                            type="text"
                            name="name"
                            value={newMedicine.name}
                            onChange={handleInputChange}
                            className="medicineInputField"
                            placeholder="Nombre de la medicina"
                        />
                    </label>
                    <label className="medicineLabel">
                        <input
                            type="text"
                            name="type"
                            value={newMedicine.type}
                            onChange={handleInputChange}
                            className="medicineInputField"
                            placeholder="Tipo de la medicina"
                        />
                    </label>
                    <label className="medicineLabel">
                        <input
                            type="text"
                            name="use"
                            value={newMedicine.use}
                            onChange={handleInputChange}
                            className="medicineInputField"
                            placeholder="Uso de la medicina"
                        />
                    </label>
                    <button className="createMedicineSubmitButton" onClick={handleSubmitMedicine}>
                        Crear Medicina
                    </button>
                    <button className="createMedicineToggleFormButton" onClick={handleFormToggle}>
                        Ocultar Formulario
                    </button>
                </>
            ) : (
                <>
                    <input
                        type="text"
                        placeholder="Buscar por nombre de medicina"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="createMedicineFilterInput"
                    />
                    <ul className="medicineList">
                        {filteredMedicines.map(medicine => (
                            <li key={medicine._id} className="medicineListItem">
                                <strong>{medicine.name}</strong> - {medicine.use} ({medicine.type})
                                <button
                                    className="deleteMedicineButton"
                                    onClick={() => handleDelete(medicine._id)}
                                    aria-label={`Eliminar ${medicine.name}`}
                                >
                                    <FaTrashAlt /> {/* Cambiado a usar el icono importado */}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button className="createMedicineToggleFormButton" onClick={handleFormToggle}>
                        Añadir Nueva Medicina
                    </button>
                </>
            )}
        </div>
    </div>
</div>


    );
};

export default ModalCreateMedicine;
