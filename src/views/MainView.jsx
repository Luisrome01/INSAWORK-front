import React, { useState, useEffect } from "react";
import NavBar from "../components/navBar/navBar";
import "./css/MainView.css";
// assets
import UserRound from "../assets/user-round.svg";
// components
import Facturacion from "../components/navBar/View/Facturacion";
import CitasMedicas from "../components/navBar/View/CitasMedicas"; // Cambia esto a CitasMedicas
import MetodosPago from "../components/navBar/View/MetodosPago";
import CierreCaja from "../components/navBar/View/CierreCaja";

const MainView = ({ getUser }) => {
	const [componenteActivo, setComponenteActivo] = useState("Facturacion");
	const [listCitas, setListCitas] = useState([]);
	const [totalFactura, setTotalFactura] = useState(0);
	const [cliente, setCliente] = useState({});

	useEffect(() => {
		let total = 0;
		listCitas.forEach((cita) => {
			total += cita.total;
		});
		setTotalFactura(total);
	}, [listCitas]);

	const cambiarMetodoPago = () => {
		setComponenteActivo("Metodos de Pago");
	};
	const cambiarFacturacion = () => {
		setComponenteActivo("Facturacion");
	};

	if (!getUser) {
		window.location.href = "/";
	}

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
						<p style={{ fontWeight: "bold" }}>Bienvenido {getUser}</p>
					</div>
				</div>
				<div className="FactContentBottom">
					{componenteActivo === "Citas Médicas" && (
						<CitasMedicas setListaCitas={setListCitas} listaCitas={listCitas} />
					)}
					{componenteActivo === "Facturacion" && (
						<Facturacion
							listaCitasInterna={listCitas}
							setListaCitasExterna={setListCitas}
							continuarVista={cambiarMetodoPago}
							ClienteExterno={cliente}
							setClienteExterno={setCliente}
						/>
					)}
					{componenteActivo === "Metodos de Pago" && (
						<MetodosPago
							totalCosto={totalFactura.toFixed(2)}
							listaCitas={listCitas}
							cliente={cliente}
							setClienteExterno={setCliente}
							setListaCitasExterna={setListCitas}
							continuarVista={cambiarFacturacion}
						/>
					)}
					{componenteActivo === "Cierre de Caja" && <CierreCaja responsable={getUser} />}
				</div>
			</div>
		</div>
	);
};

export default MainView;
