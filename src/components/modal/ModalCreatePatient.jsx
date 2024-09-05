import React, { useState, useEffect } from "react";
import "./css/ModalCreatePatient.css";
import { showErrorMessage, showSuccessMessage, showWarningMessage } from "../messageBar/MessageBar";

const ModalCreatePatient = ({ closeModal }) => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [lastname, setLastname] = useState("");
    const [gender, setGender] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [age, setAge] = useState("");
    const [cedula, setCedula] = useState("");
    const [positionDescription, setPositionDescription] = useState("");
    const [grupoSanguineo, setGrupoSanguineo] = useState("");
    const [company, setCompany] = useState("");
    const [companies, setCompanies] = useState([]);
    const [photo, setPhoto] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await fetch("http://localhost:3000/company");
                const data = await response.json();
                setCompanies(data);
            } catch (error) {
                console.error("Error fetching companies:", error);
                setMessage(showErrorMessage("Error fetching companies. Please try again.", "center"));
            }
        };

        fetchCompanies();
    }, []);

    const handleCreate = async () => {
        const doctorId = JSON.parse(localStorage.getItem('user'))._id;

        if (!doctorId) {
            setMessage(showErrorMessage("Doctor ID not found", "center"));
            return;
        }

        const formData = new FormData();
        formData.append("email", email);
        formData.append("name", name);
        formData.append("lastname", lastname);
        formData.append("doctorId", doctorId);
        formData.append("gender", gender);
        formData.append("phone", phone);
        formData.append("address", address);
        formData.append("birthdate", birthdate);
        formData.append("age", age);
        formData.append("cedula", cedula);
        formData.append("company", company);
        formData.append("grupoSanguineo", grupoSanguineo);
        formData.append("positionDescription", positionDescription);
        if (photo) {
            formData.append("photo", photo);
        }

        try {
            const response = await fetch("http://localhost:3000/patients", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                setMessage(showSuccessMessage("Patient created successfully", "center"));

                // Crear la historia clínica para el paciente recién creado
                const medicalRecord = {
                    patientId: result._id,
                    doctorId: doctorId,
                    observaciones: "",
                    ant_medicos: "",
                    ant_familiares: "",
                    ant_laborales: "",
                    alergias: "",
                    vacunas: "",
                    enf_cronicas: "",
                    habits: {
                        alcohol: "sin informacion",
                        estupefacientes: "sin informacion",
                        actividad_fisica: "sin informacion",
                        tabaco: "sin informacion",
                        cafe: "sin informacion",
                        sueño: "sin informacion",
                        alimentacion: "sin informacion",
                        sexuales: "sin informacion"
                    },
                    treatment: null,
                    externalExams: []
                };

                const medicalRecordResponse = await fetch("http://localhost:3000/medicalRecord", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(medicalRecord),
                });
    
                if (medicalRecordResponse.ok) {
                    console.log("Medical record created successfully");
                } else {
                    const medicalRecordError = await medicalRecordResponse.json();
                    setMessage(showWarningMessage(`Error creating medical record: ${medicalRecordError.msg}`, "center"));
                }
    
                
                window.location.href = window.location.href;
            } else {
                const errorData = await response.json();
                if (response.status === 400) {
                    setMessage(showWarningMessage(`Error: ${errorData.msg}`, "center"));
                } else {
                    setMessage(showErrorMessage(`Error: ${errorData.msg}`, "center"));
                }
            }
        } catch (error) {
            console.error("Error in request:", error);
            setMessage(showErrorMessage("Error in request. Please try again.", "center"));
        }
    
        // Cerrar el modal después de recargar la página
        setTimeout(() => closeModal(false), 1000);
    };

    const handlePhotoChange = (e) => {
        setPhoto(e.target.files[0]);
    };

    return (
        <div className="modal-create-patient-container">
    <div className="modal-create-patient-overlay"></div>
    <div className="modal-create-patient-content">
        <div className="modal-create-patient-header">
            <h2>Crear Paciente</h2>
            <button className="modal-create-patient-close-button" onClick={() => closeModal(false)}>X</button>
        </div>
        <div className="modal-create-patient-body">
            <div className="modal-create-patient-form-group">
                <label>Correo Electrónico:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="modal-create-patient-form-group">
                <label>Nombre:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="modal-create-patient-form-group">
                <label>Apellido:</label>
                <input
                    type="text"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                />
            </div>
            <div className="modal-create-patient-form-group">
                <label>Género:</label>
                <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                >
                    <option value="">Seleccionar Género</option>
                    <option value="male">Masculino</option>
                    <option value="female">Femenino</option>
                </select>
            </div>
            <div className="modal-create-patient-form-group">
                <label>Teléfono:</label>
                <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
            </div>
            <div className="modal-create-patient-form-group">
                <label>Dirección:</label>
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
            </div>
            <div className="modal-create-patient-form-group">
                <label>Fecha de Nacimiento:</label>
                <input
                    type="date"
                    value={birthdate}
                    onChange={(e) => setBirthdate(e.target.value)}
                />
            </div>
            <div className="modal-create-patient-form-group">
                <label>Edad:</label>
                <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                />
            </div>
            <div className="modal-create-patient-form-group">
                <label>Cédula:</label>
                <input
                    type="text"
                    value={cedula}
                    onChange={(e) => setCedula(e.target.value)}
                />
            </div>
            <div className="modal-create-patient-form-group">
                <label>Compañía:</label>
                <select
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                >
                    <option value="">Seleccionar Compañía</option>
                    {companies.map((comp) => (
                        <option key={comp._id} value={comp._id}>
                            {comp.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="modal-create-patient-form-group">
                <label>Grupo Sanguíneo:</label>
                <select
                    value={grupoSanguineo}
                    onChange={(e) => setGrupoSanguineo(e.target.value)}
                >
                    <option value="">Seleccionar Grupo Sanguíneo</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                </select>
            </div>
            <div className="modal-create-patient-form-group">
                <label>Descripción del Cargo:</label>
                <input
                    type="text"
                    value={positionDescription}
                    onChange={(e) => setPositionDescription(e.target.value)}
                />
            </div>
            <div className="modal-create-patient-form-group">
                <input
                    type="file"
                    id="photoInput"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    style={{ display: "none" }}
                />
                <label htmlFor="photoInput" className="photo-input-label">
                    {photo ? (
                        <img
                            src={URL.createObjectURL(photo)}
                            alt="Vista Previa"
                            className="photo-preview"
                        />
                    ) : (
                        <span className="photo-placeholder">Seleccionar Foto</span>
                    )}
                </label>
            </div>
            <div className="modal-create-patient-form-group">
                <button className="modal-create-patient-submit-button" onClick={handleCreate}>
                    Crear Paciente
                </button>
            </div>
        </div>
        {message && <div className="modal-create-patient-message-container">{message}</div>}
    </div>
</div>

    
    );
};

export default ModalCreatePatient;
