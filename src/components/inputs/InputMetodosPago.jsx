import React, { useState } from "react";
import "./css/InputMetodosPago.css";

function InputMetodosPago({ width, height, color, padding, boderRadius, valorMetodoPago, valorBanco, valorPunto }) {
	// Estado para almacenar el tipo de documento seleccionado y el valor ingresado
	const [tipoDocumento, setTipoDocumento] = useState("Metodo de pago:");
	const [tipoBanco, setTipoBanco] = useState("Banco: ");
	const [numeroPunto, setNumeroPunto] = useState("Numero del punto: ");
	const [valorDocumento, setValorDocumento] = useState("");

	// Función para manejar cambios en la selección del tipo de documento
	const handleTipoDocumentoChange = (event) => {
		setTipoDocumento(event.target.value);
		valorMetodoPago(event.target.value);
	};

	// Función para manejar cambios en el valor del documento ingresado
	const handleValorDocumentoChange = (event) => {};

	const handleTipoBancoChange = (event) => {
		setTipoBanco(event.target.value);
		valorBanco(event.target.value);
	};

	const handleValorBancoChange = (event) => {
		setTipoBanco(event.target.value);
	};

	const handleNumeroPuntoChange = (event) => {
		setNumeroPunto(event.target.value);
		valorPunto(event.target.value);
	};

	const style = {
		width: width,
		height: height,
		backgroundColor: color,
		padding: padding,
		borderRadius: boderRadius,
		textAlign: "center",
	};
	return (
		<div className="InputMetodoPagoContainer">
			<div className="IDIFMainContainer" style={{ height: height }}>
				<p className="IDIFTitle" style={style}>
					{tipoDocumento}
				</p>
				<select value={tipoDocumento} onChange={handleTipoDocumentoChange} className="IDIFSelect">
					<option value="Metodo de Pago:" hidden={true}>
						Metodo de Pago:
					</option>
					<option value="EFECTIVO">EFECTIVO</option>
					<option value="TRANSFERENCIA">TRANSFERENCIA</option>
					<option value="DIVISAS">DIVISAS</option>
					<option value="TARJETA">TARJETA</option>
				</select>
			</div>

			<div className="IDIFMainContainer" style={{ height: height }}>
				<p className="IDIFTitle" style={style}>
					{tipoBanco}
				</p>
				<select
					value={tipoBanco}
					onChange={handleTipoBancoChange}
					className="IDIFSelect"
					disabled={tipoDocumento === "TRANSFERENCIA" || tipoDocumento === "TARJETA" ? false : true}
				>
					<option value="Banco Origen:" hidden={true}>
						Banco
					</option>
					<option value="BANESCO">BANESCO</option>
					<option value="MERCANTIL">MERCANTIL</option>
					<option value="BANCARIBE">BANCARIBE</option>
				</select>
				<p className="IDIFTitle" style={style}>
					{numeroPunto}
				</p>
				<select
					value={numeroPunto}
					onChange={handleNumeroPuntoChange}
					className="IDIFSelect"
					disabled={tipoDocumento === "TARJETA" ? false : true}
				>
					<option value="Numero del punto: " hidden={true}>
						Metodo de Pago:
					</option>
					<option value="PUNTO 1">PUNTO 1</option>
					<option value="PUNTO 2">PUNTO 2</option>
					<option value="PUNTO 3">PUNTO 3</option>
				</select>
			</div>
		</div>
	);
}

export default InputMetodosPago;
