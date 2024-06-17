import React, { useState } from "react";
import "./css/InputBanco.css";

function InputBanco({ width, height, color, padding, boderRadius}) {
	// Estado para almacenar el tipo de documento seleccionado y el valor ingresado
	const [tipoDocumento, setTipoDocumento] = useState("Banco");
	const [valorDocumento, setValorDocumento] = useState("");

	// Función para manejar cambios en la selección del tipo de documento
	const handleTipoDocumentoChange = (event) => {
		setTipoDocumento(event.target.value);
		setValorDocumento("");
	};

	// Función para manejar cambios en el valor del documento ingresado
	const handleValorDocumentoChange = (event) => {
		setValorDocumento(event.target.value);
	};

	const style = {
		width: width,
		height: height,
		backgroundColor: color,
		padding: padding,
		borderRadius: boderRadius,
		textAlign: 'center', 
	};
	return (
		<div className="IDIFMainContainer">
			<p className="IDIFTitle" style={style}>{tipoDocumento}</p>
			<select value={tipoDocumento} onChange={handleTipoDocumentoChange} className="IDIFSelect" >
				<option value="BANESCO">BANESCO</option>
				<option value="MERCANTIL">MERCANTIL</option>
				<option value="BANCARIBE">BANCARIBE</option>
			</select>
		</div>
	);
}

export default InputBanco;
