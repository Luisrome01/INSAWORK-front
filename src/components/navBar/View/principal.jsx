import React, { useEffect, useState } from "react";
import "./css/principal.css";
import ModalCreateMedicine from '../../modal/ModalCreateMedicine';
import ModalCreateAppointment from '../../modal/ModalCreateAppointment';
import ModalNotas from '../../modal/ModalNotas'; 

const Principal = () => {
    const [showModalMedicine, setShowModalMedicine] = useState(false);
    const [showModalAppointment, setShowModalAppointment] = useState(false);
    const [showModalNotas, setShowModalNotas] = useState(false); // Estado para el modal de notas
    const [imminentAppointments, setImminentAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [monthFilter, setMonthFilter] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [notes, setNotes] = useState([]); // Estado para las notas

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

    const handleOpenModalNotas = () => {
        setShowModalNotas(true);
    };

    const handleCloseModalNotas = () => {
        setShowModalNotas(false);
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

    const fetchNotes = async () => {
        if (!doctorId) return;
        
        try {
            const response = await fetch(`http://localhost:3000/user/note/${doctorId}`); // Cambia la URL según tu API
            if (!response.ok) {
                throw new Error('Failed to fetch notes');
            }
            const data = await response.json();
            setNotes(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchImminentAppointments();
        fetchNotes(); // Obtén las notas al cargar el componente
    }, [doctorId]);

    const formatDateWithLeadingZero = (date) => {
        const d = String(date.getDate()).padStart(2, '0');
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const y = date.getFullYear();
        return `${d}/${m}/${y}`;
    };

    return (
        <div className="principalContainer">
            <div className="cardsContainer">
                <div className="card" onClick={handleOpenModalMedicine}>Añadir Medicina</div>
                <div className="card" onClick={handleOpenModalAppointment}>Crear Cita</div>
                <div className="card">Añadir Paciente</div>
                <div className="card">Gestion de Informes</div>
            </div>
            <div className="bottomContainers">
                <div className="imminentAppointmentsContainer">
                    <h2>Citas Inminentes</h2>
                    {loading && <p>Cargando citas inminentes...</p>}
                    {error && <p>Error: {error}</p>}
                    
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
                <div className="notesContainer" onClick={handleOpenModalNotas}>
                    <h2>Notas Médicas</h2>
                    <p>Tienes un total de {notes.length} notas.</p>
                    {notes.length > 0 ? (
                        notes.slice(0, 3).map(note => (
                            <div key={note._id} className="appointment-card">
                                <p>{note.content}</p> {/* Asegúrate de que `content` sea el campo correcto */}
                            </div>
                        ))
                    ) : (
                        <p>No hay notas disponibles.</p>
                    )}
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
           {showModalNotas && (
                <ModalNotas 
                    doctorId={doctorId} 
                    onClose={handleCloseModalNotas} 
                />
            )}
        </div> 
    );
};

export default Principal;
