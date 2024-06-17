import React, { useState, useEffect } from "react";
import NavBar from "../components/navBar/navBar";
import "./css/MainView.css";
//assets
import UserRound from "../assets/user-round.svg";
//components
import Facturacion from "../components/navBar/View/Facturacion";
import Productos from "../components/navBar/View/Productos";
import MetodosPago from "../components/navBar/View/MetodosPago";
import CierreCaja from "../components/navBar/View/CierreCaja";

const MainView = ({ getUser }) => {
	const [componenteActivo, setComponenteActivo] = useState("Facturacion");
	const [listProductos, setListProductos] = useState([]);
	const [totalFactura, setTotalFactura] = useState(0);
	const [cliente, setCliente] = useState({});

	useEffect(() => {
		let total = 0;
		listProductos.forEach((producto) => {
			total += producto.total;
		});
		setTotalFactura(total);
	}, [listProductos]);

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
						<img src={UserRound}></img>
						<p style={{ fontWeight: "bold" }}>Bienvenido {getUser}</p>
					</div>
				</div>
				<div className="FactContentBottom">
					{componenteActivo === "Productos" && <Productos setListaProductos={setListProductos} listaProductos={listProductos} />}
					{componenteActivo === "Facturacion" && (
						<Facturacion
							listaProductosInterna={listProductos}
							setListaProductosExterna={setListProductos}
							continuarVista={cambiarMetodoPago}
							ClienteExterno={cliente}
							setClienteExterno={setCliente}
						/>
					)}
					{componenteActivo === "Metodos de Pago" && (
						<MetodosPago
							totalCosto={totalFactura.toFixed(2)}
							listaProductos={listProductos}
							cliente={cliente}
							setClienteExterno={setCliente}
							setListaProductosExterna={setListProductos}
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
