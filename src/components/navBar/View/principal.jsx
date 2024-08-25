import React, { useState } from "react";
import "./css/principal.css";
import ModalCreateMedicine from '../../modal/ModalCreateMedicine';
import ModalCreateAppointment from '../../modal/ModalCreateAppointment';

const Principal = () => {
    const [showModalMedicine, setShowModalMedicine] = useState(false);
    const [showModalAppointment, setShowModalAppointment] = useState(false);
    
    // Obtener el objeto completo del doctor y parsearlo
    const doctorData = JSON.parse(localStorage.getItem('user')); // Cambia 'user' por la clave que uses para guardar el objeto completo
    const doctorId = doctorData ? doctorData._id : null; // Obtiene el _id del doctor

    const handleOpenModalMedicine = () => {
        setShowModalMedicine(true);
    };

    const handleCloseModalMedicine = () => {
        setShowModalMedicine(false);
    };

    const handleOpenModalAppointment = () => {
        // Verifica que el doctorId no esté vacío antes de abrir el modal
        if (doctorId) {
            setShowModalAppointment(true);
        } else {
            console.error('No se pudo obtener el ID del doctor');
            // Manejo de error si es necesario
        }
    };

    const handleCloseModalAppointment = () => {
        setShowModalAppointment(false);
    };

    return (
        <div className="principalContainer">
            <div className="cardsContainer">
                <div className="card" onClick={handleOpenModalMedicine}>Añadir Medicina</div>
                <div className="card" onClick={handleOpenModalAppointment}>Crear Cita</div>
                <div className="card">Tarjeta 3</div>
                <div className="card">Tarjeta 4</div>
            </div>
            <div className="bottomContainers">
                <div className="imminentAppointmentsContainer">
                    <p>Aquí van a ir las citas inminentes</p>
                </div>
                <div className="notesContainer">
                    <p>Aquí van a ir las notas</p>
                </div>
            </div>
            {showModalMedicine && (
                <ModalCreateMedicine 
                    doctorId={doctorId} 
                    onClose={handleCloseModalMedicine} 
                />
            )}
            {showModalAppointment && (
                <ModalCreateAppointment 
                    doctorId={doctorId} 
                    onClose={handleCloseModalAppointment} 
                />
            )}
        </div>
    );
};

export default Principal;
