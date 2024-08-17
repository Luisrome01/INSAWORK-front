import React, { useState } from 'react';
import BtnGeneral from "../components/buttons/BtnGeneral";
import InputGeneral from "../components/inputs/InputGeneral";
import page from "../assets/logomedico.svg";
import "./css/Register.css";
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !lastname || !email || !username || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          lastname,
          email,
          username,
          password,
        }),
      });

      if (response.ok) {
        console.log('Registro exitoso');
        navigate('/'); // Redirige al usuario a la ruta '/'
      } else {
        const data = await response.json();
        setError(data.msg || 'Error al registrar el usuario');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al conectar con el servidor');
    }
  };

  return (
    <div className="LogContainerGeneral">
      <div className="LogContainer">
        <div className="LogSubContainer">
          <div className="LogContainerTitle">
            <h3 className="LogTitle">INSAWORK</h3>
          </div>
          <div className="LogContainerSubTitle">
            <p className="LogEnum">Regístrate</p>
            <h1 className="LogSubTitle">Crea tu cuenta</h1>
          </div>
          <InputGeneral
            name={'Nombre Completo'}
            type="text"
            placeholder="ej. Juan"
            width="80%"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <InputGeneral
            name={'Apellido'}
            type="text"
            placeholder="ej. Pérez"
            width="80%"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
          />
          <InputGeneral
            name={'Correo Electrónico'}
            type="email"
            placeholder="ej. juan.perez@example.com"
            width="80%"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputGeneral
            name={'Nombre de Usuario'}
            type="text"
            placeholder="ej. juanperez123"
            width="80%"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <InputGeneral
            name={'Contraseña'}
            type="password"
            placeholder="Contraseña"
            width="80%"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="LastInput"
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <Link to="/" className="LogRegisterLink">
            
          </Link>
          <BtnGeneral text="Registrarse" handleClick={handleRegister} className="RegisterButton" />
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