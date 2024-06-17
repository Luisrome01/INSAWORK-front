import React from "react";
import { useState, useEffect } from "react";
import BtnGeneral from "../../../components/buttons/BtnGeneral";
import CierreCajaTable from "../../../components/tables/cierreCajaTable";
import ModalCierre from "../../modal/ModalCierre";
import checkSVG from "../../../assets/checkmark.svg";

import "./css/CierreCaja.css";

const CierreCaja = ({ responsable }) => {
	const [montoTotal, setMontoTotal] = useState("0.00");
	const [listIngresos, setListIngresos] = useState([]);
	const [listEgresos, setListEgresos] = useState([]);
	const [ingresosEfectivo, setIngresosEfectivo] = useState(0);
	const [ingresosDivisas, setIngresosDivisas] = useState(0);
	const [ingresosBanesco, setIngresosBanesco] = useState(0);
	const [ingresosMercantil, setIngresosMercantil] = useState(0);
	const [ingresosBancaribe, setIngresosBancaribe] = useState(0);
	const [ingresosPunto1, setIngresosPunto1] = useState(0);
	const [ingresosPunto2, setIngresosPunto2] = useState(0);
	const [ingresosPunto3, setIngresosPunto3] = useState(0);
	const [data, setData] = useState([]);
	const [openModal, setOpenModal] = useState(false);
	const [cantidadFacturas, setCantidadFacturas] = useState(0);
	const [responsableState, setResponsableState] = useState(responsable);
	const [fecha, setFecha] = useState("");
	const [hora, setHora] = useState("");

	useEffect(() => {
		fetch("/src/json/facturas.json")
			.then((response) => {
				if (!response.ok) {
					throw new Error("Error fetching data");
				}
				return response.json();
			})
			.then((data) => {
				setData(data.data);
				const total = data.data.reduce((acc, item) => acc + item.monto, 0);
				const ingresos = data.data.reduce((acc, item) => {
					const metodosPago = item.metodosPago || [];
					metodosPago.forEach((metodo) => {
						switch (metodo.metodo) {
							case "efectivo":
								console.log("metodo: " + metodo.metodo + " monto: " + metodo.monto);
								setIngresosEfectivo((prevValue) => prevValue + metodo.monto);
								break;
							case "tarjeta":
								console.log("metodo: " + metodo.metodo + " monto: " + metodo.monto + " punto: punto" + metodo.punto);
								switch (metodo.punto) {
									case 1:
										setIngresosPunto1((prevValue) => prevValue + metodo.monto);
										break;
									case 2:
										setIngresosPunto2((prevValue) => prevValue + metodo.monto);
										break;
									case 3:
										setIngresosPunto3((prevValue) => prevValue + metodo.monto);
										break;
									default:
										break;
								}
								break;
							case "transferencia":
								console.log("metodo: " + metodo.metodo + " monto: " + metodo.monto + " banco: " + metodo.banco);
								switch (metodo.banco) {
									case "banesco":
										setIngresosBanesco((prevValue) => prevValue + metodo.monto);
										break;
									case "mercantil":
										setIngresosMercantil((prevValue) => prevValue + metodo.monto);
										break;
									case "bancaribe":
										setIngresosBancaribe((prevValue) => prevValue + metodo.monto);
										break;
									default:
										break;
								}
								break;
							case "divisas":
								console.log("metodo: " + metodo.metodo + " monto: " + metodo.monto);
								setIngresosDivisas((prevValue) => prevValue + metodo.monto);
								break;
							default:
								break;
						}
					});
					const ingresosMetodo = metodosPago.reduce((acc, metodo) => acc + (metodo.monto || 0), 0);
					return acc + ingresosMetodo;
				}, 0);
				const egresos = Math.abs(total - ingresos);
				setMontoTotal(total.toFixed(2));
				setListIngresos(ingresos.toFixed(2));
				setListEgresos(egresos.toFixed(2));
				setCantidadFacturas(data.data.length);
			});
	}, []);

	const handleClickCierreCaja = () => {
		const currentDateTime = new Date();
		const options = {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
			timeZone: "America/Caracas",
		};
		const formattedDate = currentDateTime.toLocaleDateString("es-AR");
		const formattedTime = currentDateTime.toLocaleTimeString("en-US", options);
		setFecha(formattedDate);
		setHora(formattedTime);
		setOpenModal(true);
	};

	const blockCaja = () => {
		const currentDateTime = new Date();
		localStorage.setItem("cajaBloqueada", "true");
		localStorage.setItem("blockedDate", currentDateTime.toLocaleDateString("es-AR"));
	};

	return (
		<div className="CierreContainer">
			<h2 className="CierreHeaderContainer">Este proceso cierra la caja del turno asignado:</h2>
			<div className="FacturaTableContainer">
				<CierreCajaTable data={data} />
			</div>

			<div className="FacturaCheckoutContainer">
				<div style={{ display: "flex", flexDirection: "column" }}>
					<p
						style={{
							position: "relative",
							marginLeft: "auto",
							fontSize: "18px",
						}}
					>
						Saldo de cierre:
					</p>
					<p
						style={{
							position: "relative",
							marginLeft: "auto",
							fontSize: "25.4331px",
							fontWeight: "bold",
						}}
					>
						$ {montoTotal}
					</p>
				</div>

				<div style={{ display: "flex", flexDirection: "column" }}>
					<p
						style={{
							color: "#12B422",
							position: "relative",
							marginLeft: "auto",
							fontSize: "18px",
						}}
					>
						Ingresos: $ {listIngresos}
					</p>
					<p
						style={{
							color: "#EB0000",
							position: "relative",
							marginLeft: "auto",
							fontSize: "18px",
							fontWeight: "bold",
						}}
					>
						Egresos: $ {listEgresos}
					</p>
				</div>

				<BtnGeneral
					text="Cierre de caja"
					width="140px"
					color="#ff6060"
					onHoverColor="#c54444"
					img={checkSVG}
					handleClick={handleClickCierreCaja}
				/>
			</div>
			{openModal && (
				<ModalCierre
					closeModal={blockCaja}
					cantidadFacturas={cantidadFacturas}
					ingresos={listIngresos}
					ingresosEfectivo={ingresosEfectivo}
					ingresosDivisas={ingresosDivisas}
					ingresosBanesco={ingresosBanesco}
					ingresosMercantil={ingresosMercantil}
					ingresosBancaribe={ingresosBancaribe}
					ingresosPunto1={ingresosPunto1}
					ingresosPunto2={ingresosPunto2}
					ingresosPunto3={ingresosPunto3}
					egresos={listEgresos}
					total={montoTotal}
					responsable={responsableState}
					fecha={fecha}
					hora={hora}
				/>
			)}
		</div>
	);
};

export default CierreCaja;
