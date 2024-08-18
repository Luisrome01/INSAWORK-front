import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/navBar/navBar";
import "./css/MainView.css";
// assets
import UserRound from "../assets/user-round.svg";
// components
import Principal from "../components/navBar/View/principal";
import CitasMedicas from "../components/navBar/View/CitasMedicas";
import Reportes from "../components/navBar/View/reportes";
import Historias from "../components/navBar/View/historias";

const MainView = () => {
	const [componenteActivo, setComponenteActivo] = useState("Principal");
	const [listCitas, setListCitas] = useState([]);
	const [totalFactura, setTotalFactura] = useState(0);
	const [cliente, setCliente] = useState({});
	const [user, setUser] = useState(null);

	const navigate = useNavigate();

	useEffect(() => {
		// Get user from localStorage
		const storedUser = JSON.parse(localStorage.getItem("user"));
		if (storedUser) {
			setUser(storedUser.username || storedUser.email);
		} else {
			navigate("/");
		}
	}, [navigate]);

	useEffect(() => {
		let total = 0;
		listCitas.forEach((cita) => {
			total += cita.total;
		});
		setTotalFactura(total);
	}, [listCitas]);

	const cambiarReportes = () => {
		setComponenteActivo("Reportes");
	};
	const cambiarPrincipal = () => {
		setComponenteActivo("Principal");
	};

	return (
		<div className="MainContainer">
			<div className="MainNavContainer">
				<NavBar componenteActivo={componenteActivo} setComponenteActivo={setComponenteActivo} />
			</div>
			<div className="MainContentContainer">
				<div className="MainContentTop">
					<h1 className="MainTitle">{componenteActivo}</h1>

					<div className="MainUserDiv">
						<img src={UserRound} alt="User" />
						<p style={{ fontWeight: "bold" }}>Bienvenido {user}</p>
					</div>
				</div>
				<div className="FactContentBottom">
					{componenteActivo === "Citas Médicas" && (
						<CitasMedicas setListaCitas={setListCitas} listaCitas={listCitas} />
					)}
					{componenteActivo === "Principal" && (
						<Principal
							listaCitasInterna={listCitas}
							setListaCitasExterna={setListCitas}
							continuarVista={cambiarReportes}
							ClienteExterno={cliente}
							setClienteExterno={setCliente}
						/>
					)}
					{componenteActivo === "Reportes" && (
						<Reportes
							totalCosto={totalFactura.toFixed(2)}
							listaCitas={listCitas}
							cliente={cliente}
							setClienteExterno={setCliente}
							setListaCitasExterna={setListCitas}
							continuarVista={cambiarPrincipal}
						/>
					)}
					{componenteActivo === "Historias" && <Historias responsable={user} />}
				</div>
			</div>
		</div>
	);
};

export default MainView;
