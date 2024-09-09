import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaFileInvoice, FaHome, FaUser, FaSignOutAlt } from "react-icons/fa";
import page from "../../assets/logomedico.svg"; // Ruta actualizada
import "./navBar.css";

const NavBar = ({ componenteActivo, setComponenteActivo }) => {
  const baseLogoColor = "#A4A4A5";
  const activeLogoColor = "#FFFFFF";
  const navigate = useNavigate();

  const styleHover = {
    backgroundColor: "lightGray",
  };

  const styleSelected = {
    color: "#FFFFFF",
    backgroundColor: "#005BFF",
    // boxShadow: "5px 5px 1px rgba(209, 237, 255, 1)",
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

    const token = localStorage.getItem("authToken");
    console.log("Current authToken:", token);

    if (token) {
      localStorage.removeItem("authToken");
      console.log("authToken removed");
    } else {
      console.log("No authToken found");
    }

    localStorage.clear();
    console.log("All localStorage cleared");

    navigate("/");
    console.log("Navigating to home page");
  };

  const handleComponenteClick = (componente) => {
    setComponenteActivo(componente);
    console.log(`${componente} está seleccionado`);
  };

  return (
    <nav className="NavNavbar">
      <div className="NavLogo">
        <img src={page} alt="INSAWORK Logo" /> {/* Cambié `logo` a `page` */}
        <h1 className="NavBarTitle">INSAWORK</h1>
      </div>
      <div className="NavContent">
        <h2 style={{ color: "#A4A4A5" }}>MENÚ PRINCIPAL</h2>
        <div
          className="nav-link"
          onClick={() => handleComponenteClick("Principal")}
          style={
            componenteActivo === "Principal"
              ? styleSelected
              : componenteHover.Principal
              ? styleHover
              : {}
          }
          onMouseEnter={() => handleMouseEnter("Principal")}
          onMouseLeave={() => handleMouseLeave("Principal")}
        >
          <FaHome
            className="nav-link-img"
            color={componenteActivo === "Principal" ? activeLogoColor : baseLogoColor}
          />
          <h3
            style={{
              color: componenteActivo === "Principal" ? activeLogoColor : baseLogoColor,
            }}
          >
            Principal
          </h3>
        </div>
        <div
          className="nav-link"
          onClick={() => handleComponenteClick("Historias")}
          style={
            componenteActivo === "Historias"
              ? styleSelected
              : componenteHover.Historias
              ? styleHover
              : {}
          }
          onMouseEnter={() => handleMouseEnter("Historias")}
          onMouseLeave={() => handleMouseLeave("Historias")}
        >
          <FaUser
            className="nav-link-img"
            color={componenteActivo === "Historias" ? activeLogoColor : baseLogoColor}
          />
          <h3
            style={{
              color: componenteActivo === "Historias" ? activeLogoColor : baseLogoColor,
            }}
          >
            Pacientes
          </h3>
        </div>
        <div
          className="nav-link"
          onClick={() => handleComponenteClick("CitasMedicas")}
          style={
            componenteActivo === "CitasMedicas"
              ? styleSelected
              : componenteHover.CitasMedicas
              ? styleHover
              : {}
          }
          onMouseEnter={() => handleMouseEnter("CitasMedicas")}
          onMouseLeave={() => handleMouseLeave("CitasMedicas")}
        >
          <FaCalendarAlt
            className="nav-link-img"
            color={componenteActivo === "CitasMedicas" ? activeLogoColor : baseLogoColor}
          />
          <h3
            style={{
              color: componenteActivo === "CitasMedicas" ? activeLogoColor : baseLogoColor,
            }}
          >
            Citas Médicas
          </h3>
        </div>
        <div
          className="nav-link"
          onClick={() => handleComponenteClick("Reportes")}
          style={
            componenteActivo === "Reportes"
              ? styleSelected
              : componenteHover.Reportes
              ? styleHover
              : {}
          }
          onMouseEnter={() => handleMouseEnter("Reportes")}
          onMouseLeave={() => handleMouseLeave("Reportes")}
        >
          <FaFileInvoice
            className="nav-link-img"
            color={componenteActivo === "Reportes" ? activeLogoColor : baseLogoColor}
          />
          <h3
            style={{
              color: componenteActivo === "Reportes" ? activeLogoColor : baseLogoColor,
            }}
          >
            Reportes
          </h3>
        </div>
      </div>
      <div className="LogoutContainer">
        <button onClick={handleLogout} className="LogoutButton">
          <FaSignOutAlt style={{ marginRight: "8px", color: "black" }} />
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
