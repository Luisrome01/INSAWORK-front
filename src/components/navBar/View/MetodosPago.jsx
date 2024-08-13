import "./css/MetodosPago.css";
import React, { useState, useEffect } from "react";
import BtnGeneral from "../../../components/buttons/BtnGeneral";
import InputMetodosPago from "../../../components/inputs/InputMetodosPago";
import InputBanco from "../../../components/inputs/InputBanco";
import InputDiferente from "../../../components/inputs/InputDiferente";
import svgAdd from "../../../assets/svg_add.svg";
import cartSVG from "../../../assets/marketKart.svg";
import MetodosTable from "../../tables/MetodosTable";
import { jsPDF } from "jspdf";
import { showErrorMessage, showSuccessMessage, showWarningMessage, showInfoMessage } from "../../messageBar/MessageBar";
import "./css/MetodosPago.css";

const MetodosPago = ({ totalCosto, listaProductos, cliente, setClienteExterno, setListaProductosExterna, continuarVista }) => {
	const [montoTotal, setMontoTotal] = useState(totalCosto ? totalCosto : "0.00");
	const [montoPagado, setMontoPagado] = useState("0.00");
	const [listMetodosPago, setListMetodosPago] = useState([]);
	const [metodoPago, setMetodoPago] = useState("");
	const [numeroPunto, setNumeroPunto] = useState("");
	const [banco, setBanco] = useState("");
	const [monto, setMonto] = useState("");
	const [message, setMessage] = useState({});

	const MESSAGE_DURATION = 3000;

	useEffect(() => {
		let messageTimer;
		if (message.text) {
			messageTimer = setTimeout(() => {
				setMessage({});
			}, MESSAGE_DURATION);
		}
		return () => clearTimeout(messageTimer);
	}, [message]);

	const agregarMetodoPago = (numero) => {
		let valido = true;
		function revisarCampos() {
			if (monto === "") {
				setMessage({ text: "Por favor ingrese un monto", severity: "warning" });
				return false;
			}
			if (banco === "" || banco === "Banco:") {
				setMessage({ text: "Por favor seleccione un banco", severity: "warning" });
				return false;
			}
			if (numero === 1 && (numeroPunto === "" || numeroPunto === "Numero del punto:")) {
				setMessage({ text: "Por favor ingrese un numero de punto", severity: "warning" });
				return false;
			}
			return true;
		}

		switch (metodoPago) {
			case "TRANSFERENCIA":
				valido = revisarCampos(0);
				break;
			case "TARJETA":
				valido = revisarCampos(1);
				break;
			default:
				if (monto === "" || monto === "0.00" || monto === "0") {
					setMessage({ text: "Por favor ingrese un monto", severity: "warning" });
					setBanco("NO APLICABLE");
					valido = false;
				}
				if (!metodoPago) {
					setMessage({ text: "Por favor seleccione un metodo de pago", severity: "warning" });
					valido = false;
				}
				break;
		}
		if (!valido) return;
		setListMetodosPago([
			...listMetodosPago,
			{
				metodosPago: metodoPago,
				banco: metodoPago === "TRANSFERENCIA" || metodoPago === "TARJETA" ? banco : "NO APLICA",
				monto: parseFloat(monto),
				numeroPunto: metodoPago === "TARJETA" ? numeroPunto : "NO APLICA",
			},
		]);
		setMontoPagado((prev) => (parseFloat(prev) + parseFloat(monto)).toFixed(2));
		setMonto("");
	};

	const eliminarPago = (index) => {
		setMontoPagado((prev) => (parseFloat(prev) - listMetodosPago[index].monto).toFixed(2));
		const newList = listMetodosPago.filter((_, i) => i !== index);
		setListMetodosPago(newList);
	};

	const generarPDF = ({ codigoFactura, nombre, tipoIdentificacion, identificacion, direccion, rif, listaProductos = [] }) => {
		const doc = new jsPDF();
		doc.setFontSize(16);
		doc.setFont("Courier", "bold");
		doc.text("SENIAT", 90, 10);
		doc.setFont("Courier", "normal");
		doc.text("BillMaster. C.A.", 78, 20);
		doc.text("billmaster calle 123", 68, 30);
		doc.text("Tierra Negra, Mcbo, Edo. Zulia", 53, 40);

		doc.setFontSize(13);
		doc.text("RIF: J-0123456789", 10, 50);
		doc.text("Fecha: " + new Date().toLocaleDateString(), 10, 60);
		doc.text("COD DE FACTURA: " + codigoFactura, 80, 60);
		doc.text("------------------------ INFORMACION DEL CONSUMIDOR ------------------------", 0, 75);
		doc.text("NOMBRE: " + nombre, 10, 85);
		doc.text(tipoIdentificacion + ": " + identificacion, 10, 95);
		doc.text("DIRECCION: " + direccion, 10, 105);
		doc.text("RIF: " + rif, 10, 115);
		doc.text("--------------------------------- FACTURA ---------------------------------", 0, 130);
		let index = 140;
		let total_preIVA = 0;
		let total_iva = 0;
		listaProductos.forEach((producto) => {
			doc.text(`${producto.descripcion}`, 30, index);
			doc.text(`ref. ${producto.precio.toFixed(2)}`, 150, index);
			doc.text(`x${producto.cantidad}`, 185, index);
			index += 10;
			total_preIVA += producto.precio * producto.cantidad;
			total_iva += producto.iva * producto.cantidad;
			if (index > doc.internal.pageSize.height) {
				doc.addPage();
				index = 10;
			}
		});
		const nextText = [
			{ text: "----------------------------------- TOTAL ----------------------------------", x: 0 },
			{ text: `MONTO NETO:                                        ref. ${total_preIVA.toFixed(2)}`, x: 10 },
			{ text: `IVA:                                               ref. ${total_iva.toFixed(2)}`, x: 10 },
			{ text: `MONTO TOTAL:                                       ref. ${(total_preIVA + total_iva).toFixed(2)}`, x: 10 },
			{ text: "----------------------------------------------------------------------------", x: 0 },
			{ text: "NO. DE DOCUMENTO: 02047411", x: 10 },
			{ text: "GRACIAS POR SU COMPRA", x: 10 },
			{ text: "----------------------------- BILLMASTER. C.A. -----------------------------", x: 0 },
			{ text: "TIENDA: 001                                              CAJA: 001", x: 10 },
		];
		nextText.forEach((element) => {
			index += 10;
			if (index > doc.internal.pageSize.height) {
				doc.addPage();
				index = 10;
			}
			doc.text(element.text, element.x, index);
		});

		doc.save("factura.pdf");
	};

	return (
		<>
			<div className="MetodosContainer">
				{message && (
					<div className="message-bar-wrapper">
						{message.severity === "success" && showSuccessMessage(message.text, "left")}
						{message.severity === "error" && showErrorMessage(message.text, "left")}
						{message.severity === "warning" && showWarningMessage(message.text, "left")}
						{message.severity === "info" && showInfoMessage(message.text, "left")}
					</div>
				)}
				<h1 className="MetodosHeaderContainer">Agregar metodos de pago</h1>
				<div className="MetodosInput">
					<div className="MetodoMetododPago">
						<InputMetodosPago
							name="Metodo de pago:"
							color="#D9D9D9"
							width={"150px"}
							padding={"5px"}
							boderRadius={"10px"}
							height={"20%"}
							valorMetodoPago={setMetodoPago}
							valorBanco={setBanco}
							valorPunto={setNumeroPunto}
						/>
					</div>

					<div className="MetodoMonto-BotonAgregar">
						<div className="MetodoMonto">
							<InputDiferente name="Monto:" color="#D9D9D9" width="15%" onChange={setMonto} value={monto} />
						</div>
						<div className="MetodoBotonAgregar">
							<BtnGeneral img={svgAdd} text="Agregar Pago" width="165px" handleClick={agregarMetodoPago} />
						</div>
					</div>
				</div>

				<div className="MetodosPagoTableContainer">
					<MetodosTable data={listMetodosPago} eliminarPago={eliminarPago} />
				</div>

				<div className="MetodosCheckoutContainer">
					<div style={{ display: "flex", flexDirection: "column" }}>
						<p style={{ position: "relative", marginLeft: "auto", fontSize: "18px" }}>Total:</p>
						<p style={{ position: "relative", marginLeft: "auto", fontSize: "25.4331px", fontWeight: "bold" }}>$ {montoTotal}</p>
					</div>
					<div style={{ display: "flex", flexDirection: "column" }}>
						<p style={{ color: "green", position: "relative", marginLeft: "auto", fontSize: "18px" }}>Pagado: $ {montoPagado}</p>
						<p style={{ color: "red", position: "relative", marginLeft: "auto", fontSize: "18px", fontWeight: "bold" }}>
							Faltante: $ {(parseFloat(montoTotal) - listMetodosPago.reduce((acc, curr) => acc + curr.monto, 0)).toFixed(2) || "0.00"}
						</p>
					</div>
					<BtnGeneral
						text="Checkout"
						width="140px"
						color="#ff6060"
						onHoverColor="#c54444"
						img={cartSVG}
						disabled={parseFloat(montoTotal) - listMetodosPago.reduce((acc, curr) => acc + curr.monto, 0) > 0}
						handleClick={() => {
							if (parseFloat(montoTotal) - listMetodosPago.reduce((acc, curr) => acc + curr.monto, 0) > 0) {
								setMessage({ text: "Faltan pagos por realizar", severity: "error" });
								return;
							}
							if (!cliente || !cliente.name || !cliente.identificacion || !cliente.direccion || !cliente.rif) {
								setMessage({ text: "Por favor ingrese un cliente", severity: "warning" });
								return;
							}
							if (listaProductos.length === 0) {
								setMessage({ text: "Por favor ingrese productos", severity: "warning" });
								return;
							}
							generarPDF({
								codigoFactura: "2548574",
								nombre: cliente.name,
								tipoIdentificacion: cliente.identificationType,
								identificacion: cliente.identificacion,
								direccion: cliente.direccion,
								rif: cliente.rif,
								listaProductos: listaProductos,
							});
							setListaProductosExterna([]);
							setClienteExterno({});
							continuarVista();
						}}
					/>
				</div>
			</div>
		</>
	);
};

export default MetodosPago;
