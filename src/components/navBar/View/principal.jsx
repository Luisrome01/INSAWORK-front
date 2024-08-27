import React, { useEffect, useState } from "react";
import "./css/principal.css";
import ModalCreateMedicine from '../../modal/ModalCreateMedicine';
import ModalCreateAppointment from '../../modal/ModalCreateAppointment';
import BtnGeneral from '../../buttons/BtnGeneral';

const Principal = () => {
    const [showModalMedicine, setShowModalMedicine] = useState(false);
    const [showModalAppointment, setShowModalAppointment] = useState(false);
    const [imminentAppointments, setImminentAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [monthFilter, setMonthFilter] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const doctorData = JSON.parse(localStorage.getItem('user')); 
    const doctorId = doctorData ? doctorData._id : null;

    const handleOpenModalMedicine = () => {
        setShowModalMedicine(true);
    };

    const handleCloseModalMedicine = () => {
        setShowModalMedicine(false);
    };

    const handleOpenModalAppointment = () => {
        setShowModalAppointment(true);
    };

    const handleCloseModalAppointment = () => {
        setShowModalAppointment(false);
    };

    const fetchImminentAppointments = async () => {
        if (!doctorId) {
            setError('Doctor ID not found in local storage.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/appointments/${doctorId}/imminent`);
            if (!response.ok) {
                throw new Error('Failed to fetch imminent appointments');
            }
            const data = await response.json();
            setImminentAppointments(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImminentAppointments();
    }, [doctorId]);

    const formatDateWithLeadingZero = (date) => {
        const d = String(date.getDate()).padStart(2, '0');
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const y = date.getFullYear();
        return `${d}/${m}/${y}`;
    };

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    const handleMonthFilter = () => {
        if (!monthFilter) return;

        const month = parseInt(monthFilter);
        if (isNaN(month) || month < 1 || month > 12) {
            alert('Por favor, selecciona un mes válido.');
            return;
        }

        const filtered = imminentAppointments.filter((appointment) => {
            const appointmentDate = new Date(appointment.date);
            return appointmentDate.getMonth() === month - 1;
        });

        setImminentAppointments(filtered);
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
                    <h2>Citas Inminentes</h2>
                    {loading && <p>Cargando citas inminentes...</p>}
                    {error && <p>Error: {error}</p>}
                    
                    {/* Contador de citas inminentes */}
                    <p>
                        Tienes un total de {imminentAppointments.length} citas para los próximos días.
                    </p>

                    {imminentAppointments.length > 0 ? (
                        imminentAppointments.map((appointment) => {
                            const patient = appointment.patientId || appointment.patient;
                            return (
                                <div key={appointment._id} className="appointment-card">
                                    <h3>
                                        Cita de {patient.name || 'Nombre no disponible'} {patient.lastname || 'Apellido no disponible'}
                                    </h3>
                                    <p>Fecha: {formatDateWithLeadingZero(new Date(appointment.date))}</p>
                                    <p>Estado: {appointment.status}</p>
                                </div>
                            );
                        })
                    ) : (
                        <p>No hay citas inminentes.</p>
                    )}
                </div>
                <div className="notesContainer">
                    <p>Aquí van a ir las notas</p>
                </div>
            </div>
            {showModalMedicine && (
                <ModalCreateMedicine 
                    doctorId={doctorId} 
                    onClose={() => {
                        handleCloseModalMedicine();
                        setTimeout(() => setShowModalMedicine(false), 100);
                    }} 
                />
            )}
            {showModalAppointment && (
                <ModalCreateAppointment 
                    key={showModalAppointment ? 'open' : 'close'} 
                    doctorId={doctorId} 
                    onClose={() => {
                        handleCloseModalAppointment();
                        setTimeout(() => setShowModalAppointment(false), 100);
                    }} 
                />
            )}
        </div>
    );
};

export default Principal;
