import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaFileInvoice, FaCreditCard, FaCashRegister, FaSignOutAlt } from "react-icons/fa";
import logo from "../../assets/BillMasterLogo.svg";
import "./navBar.css";

const NavBar = ({ componenteActivo, setComponenteActivo }) => {
  const baseLogoColor = "#A4A4A5";
  const activeLogoColor = "#000000";
  const navigate = useNavigate();

  // Define los estilos para hover y seleccionado
  const styleHover = {
    backgroundColor: "lightGray",
  };

  const styleSelected = {
    backgroundColor: "#AEBBFD",
    boxShadow: "5px 5px 1px rgba(0, 0, 0, 1)",
  };

  const [componenteHover, setComponenteHover] = useState({
    CitasMedicas: false,
    Principal: false,
    Reportes: false,
    Historias: false,
  });

  const handleMouseEnter = (componente) => {
    setComponenteHover((prevHover) => ({
      ...prevHover,
      [componente]: true,
    }));
  };

  const handleMouseLeave = (componente) => {
    setComponenteHover((prevHover) => ({
      ...prevHover,
      [componente]: false,
    }));
  };

  const handleLogout = () => {
    console.log("Logout button clicked");

    // Verifica y elimina authToken del localStorage
    const token = localStorage.getItem("authToken");
    console.log("Current authToken:", token);

    if (token) {
      localStorage.removeItem("authToken");
      console.log("authToken removed");
    } else {
      console.log("No authToken found");
    }

    // Limpia cualquier otro dato relevante del localStorage
    localStorage.clear();
    console.log("All localStorage cleared");

    // Navega a la ruta "/"
    navigate("/");
    console.log("Navigating to home page");
  };

  return (
    <nav className="NavNavbar">
      <div className="NavLogo">
        <img src={logo} alt="Bill Master Logo" />
        <h1 className="NavBarTitle">Bill Master</h1>
      </div>
      <div className="NavContent">
        <h2 style={{ color: "#A4A4A5" }}>MENÚ PRINCIPAL</h2>
        <div
          className="nav-link"
          onClick={() => setComponenteActivo("CitasMedicas")}
          style={componenteActivo === "CitasMedicas" ? styleSelected : componenteHover.CitasMedicas ? styleHover : {}}
          onMouseEnter={() => handleMouseEnter("CitasMedicas")}
          onMouseLeave={() => handleMouseLeave("CitasMedicas")}
        >
          <FaCalendarAlt
            className="nav-link-img"
            color={componenteActivo === "CitasMedicas" ? activeLogoColor : baseLogoColor}
          />
          <h3 style={{ color: componenteActivo === "CitasMedicas" ? activeLogoColor : baseLogoColor }}>Citas Médicas</h3>
        </div>
        <div
          className="nav-link"
          onClick={() => setComponenteActivo("Principal")}
          style={componenteActivo === "Principal" ? styleSelected : componenteHover.Principal ? styleHover : {}}
          onMouseEnter={() => handleMouseEnter("Principal")}
          onMouseLeave={() => handleMouseLeave("Principal")}
        >
          <FaFileInvoice
            className="nav-link-img"
            color={componenteActivo === "Principal" ? activeLogoColor : baseLogoColor}
          />
          <h3 style={{ color: componenteActivo === "Principal" ? activeLogoColor : baseLogoColor }}>Principal</h3>
        </div>
        <div
          className="nav-link"
          onClick={() => setComponenteActivo("Reportes")}
          style={componenteActivo === "Reportes" ? styleSelected : componenteHover.Reportes ? styleHover : {}}
          onMouseEnter={() => handleMouseEnter("Reportes")}
          onMouseLeave={() => handleMouseLeave("Reportes")}
        >
          <FaCreditCard
            className="nav-link-img"
            color={componenteActivo === "Reportes" ? activeLogoColor : baseLogoColor}
          />
          <h3 style={{ color: componenteActivo === "Reportes" ? activeLogoColor : baseLogoColor }}>Reportes</h3>
        </div>
        <div
          className="nav-link"
          onClick={() => setComponenteActivo("Historias")}
          style={componenteActivo === "Historias" ? styleSelected : componenteHover.Historias ? styleHover : {}}
          onMouseEnter={() => handleMouseEnter("Historias")}
          onMouseLeave={() => handleMouseLeave("Historias")}
        >
          <FaCashRegister
            className="nav-link-img"
            color={componenteActivo === "Historias" ? activeLogoColor : baseLogoColor}
          />
          <h3 style={{ color: componenteActivo === "Historias" ? activeLogoColor : baseLogoColor }}>Historias</h3>
        </div>
      </div>
      <div className="NavLogout">
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#FF0000",
            padding: "10px",
            fontSize: "16px",
          }}
        >
          <FaSignOutAlt style={{ marginRight: "8px" }} />
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
