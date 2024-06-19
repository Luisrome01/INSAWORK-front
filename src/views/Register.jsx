import React, { useState } from 'react';
import BtnGeneral from "../components/buttons/BtnGeneral";
import InputGeneral from "../components/inputs/InputGeneral";
import page from "../assets/logomedico.svg";
import "./css/Register.css";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = () => {
    if (!name || !email || !password) {
      setError('Por favor, completa todos los campos.');
    } else {
      console.log('Registro exitoso:', { name, email, password });
      navigate('/'); // Redirige al usuario a la ruta '/login'
    }
  };

  return (
    <div className="LogContainerGeneral">
      <div className="LogContainer">
        <div className="LogSubContainer">
          <div className="LogContainerTitle">
            <h3 className="LogTitle">Bill Master</h3>
          </div>

          <div className="LogContainerSubTitle">
            <p className="LogEnum">Regístrate</p>
            <h1 className="LogSubTitle">Crea tu cuenta</h1>
          </div>

          <InputGeneral
            name={'Nombre Completo'}
            type="text"
            placeholder=" ej. Jubert Pérez"
            width="80%"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <InputGeneral
            name={'Correo Electrónico'}
            type="email"
            placeholder=" ej. JubertPerez@gmail.com"
            width="80%"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <InputGeneral
            name={'Contraseña'}
            type="password"
            placeholder=" Contraseña"
            width="80%"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p style={{ color: 'red' }}>{error}</p>}
          <BtnGeneral text="Registrarse" handleClick={handleRegister} />

          <Link to="/" className="LogRegisterLink">
            ¿Ya tienes una cuenta? Inicia sesión aquí
          </Link>
        </div>
      </div>
      <img src={page} alt="imagen" className="LogImage" />
    </div>
  );
};

export default Register;