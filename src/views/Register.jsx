import React, { useState } from 'react';
import BtnGeneral from "../components/buttons/BtnGeneral";
import InputGeneral from "../components/inputs/InputGeneral";
import page from "../assets/logomedico.svg";
import { FaEye, FaEyeSlash, FaCamera } from 'react-icons/fa'; // Asegúrate de tener react-icons instalado
import { Link, useNavigate } from 'react-router-dom';
import { showSuccessMessage, showErrorMessage } from '../components/messageBar/MessageBar';
import "./css/Register.css";

const Register = () => {
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profileImg, setProfileImg] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null); // Estado para el mensaje
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Nombre es requerido';
    if (!lastname) newErrors.lastname = 'Apellido es requerido';
    if (!email) newErrors.email = 'Correo electrónico es requerido';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Formato de correo electrónico inválido';
    if (!username) newErrors.username = 'Nombre de usuario es requerido';
    if (!password) newErrors.password = 'Contraseña es requerida';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('lastname', lastname);
    formData.append('email', email);
    formData.append('username', username);
    formData.append('password', password);
    if (profileImg) {
      formData.append('profileImg', profileImg);
    }

    try {
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setMessage(showSuccessMessage('Registro exitoso', 'center')); // Mostrar mensaje de éxito
        setTimeout(() => {
          navigate('/'); // Redirige al usuario a la ruta '/'
        }, 3000); // Espera 3 segundos antes de redirigir
      } else {
        const data = await response.json();
        setErrors({ general: data.msg || 'Error al registrar el usuario' });
        setMessage(showErrorMessage(data.msg || 'Error al registrar el usuario', 'center')); // Mostrar mensaje de error
      }
    } catch (error) {
      console.error('Error:', error);
      setErrors({ general: 'Error al conectar con el servidor' });
      setMessage(showErrorMessage('Error al conectar con el servidor', 'center')); // Mostrar mensaje de error
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImg(file);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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

          <div className="ImageUploadContainer">
            <label htmlFor="profileImg" className="ImageUploadLabel">
              {!profileImg && (
                <>
                  <FaCamera className="CameraIcon" />
                  <span>Ingresa una foto de perfil</span>
                </>
              )}
              <input
                type="file"
                id="profileImg"
                name="profileImg"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              {profileImg && (
                <img
                  src={URL.createObjectURL(profileImg)}
                  alt="Vista previa"
                  className="ImagePreview"
                />
              )}
            </label>
          </div>

          <InputGeneral
            name={'Nombre Completo'}
            type="text"
            placeholder="ej. Jubert"
            width="80%"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={errors.name ? 'InputError' : ''}
          />
          {errors.name && <p className="ErrorText">{errors.name}</p>}
          <InputGeneral
            name={'Apellido'}
            type="text"
            placeholder="ej. Perez"
            width="80%"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            className={errors.lastname ? 'InputError' : ''}
          />
          {errors.lastname && <p className="ErrorText">{errors.lastname}</p>}
          <InputGeneral
            name={'Correo Electrónico'}
            type="email"
            placeholder="ej. jubert.perez@example.com"
            width="80%"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? 'InputError' : ''}
          />
          {errors.email && <p className="ErrorText">{errors.email}</p>}
          <InputGeneral
            name={'Nombre de Usuario'}
            type="text"
            placeholder="ej. jubertperez123"
            width="80%"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={errors.username ? 'InputError' : ''}
          />
          {errors.username && <p className="ErrorText">{errors.username}</p>}
          <div className="PasswordContainer">
            <InputGeneral
              name={'Contraseña'}
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              width="100%"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`LastInput ${errors.password ? 'InputError' : ''}`}
            />
            <button
              type="button"
              className="PasswordToggle"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
          {errors.password && <p className="ErrorText">{errors.password}</p>}
          {errors.general && <p className="ErrorText">{errors.general}</p>}
          <Link to="/" className="LogRegisterLink"></Link>
          <BtnGeneral text="Registrarse" handleClick={handleRegister} className="RegisterButton" />
          <Link to="/" className="LogRegisterLink">
            ¿Ya tienes una cuenta? Inicia sesión aquí
          </Link>
        </div>
      </div>
      <img src={page} alt="imagen" className="LogImage" />
      {message}
    </div>
  );
};

export default Register;
