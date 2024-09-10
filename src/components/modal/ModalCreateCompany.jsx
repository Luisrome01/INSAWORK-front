import React, { useState, useEffect } from 'react';
import { FaTrash, FaTimes } from 'react-icons/fa';
import './css/ModalCreateCompany.css';

const ModalCreateCompany = ({ onClose }) => {
    const [companyData, setCompanyData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        rif: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showList, setShowList] = useState(true); // Mostrar la lista primero
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await fetch('https://insawork.onrender.com/company');
                const data = await response.json();
                setCompanies(data);
            } catch (error) {
                setError('Error al cargar las empresas.');
            }
        };

        fetchCompanies();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCompanyData({
            ...companyData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('https://insawork.onrender.com/company', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(companyData)
            });

            if (!response.ok) {
                throw new Error('Failed to create company');
            }

            onClose();
            window.location.reload(); // Recargar la página después de la creación exitosa
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCompany = async (companyId) => {
        try {
            const response = await fetch(`https://insawork.onrender.com/company/${companyId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setCompanies(companies.filter(company => company._id !== companyId));
            } else {
                throw new Error('Failed to delete company');
            }
        } catch (error) {
            setError('Error al eliminar la empresa.');
        }
    };

    const handleToggleView = () => {
        setShowList(!showList);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="createMedicineModalHeader">
                    <h2 className="createMedicineModalTitle">{showList ? 'Lista de Empresas' : 'Crear Empresa'}</h2>
                    <button className="usuarioCloseButton" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                {showList ? (
                    <>
                        {error && <p className="error">{error}</p>}
                        <ul className="company-list">
                            {companies.map((company) => (
                                <li key={company._id} className="company-list-item">
                                    <div className="company-details">
                                        <strong>{company.name}</strong>
                                        <span>Email: {company.email}</span>
                                        <span>Teléfono: {company.phone}</span>
                                        <span>Dirección: {company.address}</span>
                                        <span>RIF: {company.rif}</span>
                                    </div>
                                    <FaTrash 
                                        className="delete-icon"
                                        onClick={() => handleDeleteCompany(company._id)}
                                    />
                                </li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Nombre:</label>
                            <input
                                type="text"
                                name="name"
                                value={companyData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Correo Electrónico:</label>
                            <input
                                type="email"
                                name="email"
                                value={companyData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Teléfono:</label>
                            <input
                                type="tel"
                                name="phone"
                                value={companyData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Dirección:</label>
                            <input
                                type="text"
                                name="address"
                                value={companyData.address}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>RIF:</label>
                            <input
                                type="text"
                                name="rif"
                                value={companyData.rif}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        {error && <p className="error">{error}</p>}
                        <button type="submit" disabled={loading}>
                            {loading ? 'Creando...' : 'Crear Empresa'}
                        </button>
                    </form>
                )}
                <button className={showList ? 'toggle-view-button-show' : 'toggle-view-button-hide'} onClick={handleToggleView}>
                    {showList ? 'Crear Nueva Empresa' : 'Ver Empresas'}
                </button>
            </div>
        </div>
    );
};

export default ModalCreateCompany;
