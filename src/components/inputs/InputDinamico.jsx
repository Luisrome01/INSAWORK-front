import React, { useEffect, useState } from "react";
import "./css/InputDinamico.css";

function InputDinamico({ width, height, color, onBlur, onTypeChange, onValueChange, value, onEnter }) {
	// Estado para almacenar el tipo de documento seleccionado y el valor ingresado
	const [tipoDocumento, setTipoDocumento] = useState("Cedula");
	const [valorDocumento, setValorDocumento] = useState("");

	// Función para manejar cambios en la selección del tipo de documento
	const handleTipoDocumentoChange = (event) => {
		setTipoDocumento(event.target.value);
		if (onTypeChange) onTypeChange(event.target.value);
	};

	// Función para manejar cambios en el valor del documento ingresado
	const handleValorDocumentoChange = (event) => {
		setValorDocumento(event.target.value);
		if (onValueChange) onValueChange(event.target.value);
	};

	useEffect(() => {
		setValorDocumento(value);
	}, [value]);

	const style = {
		width: width,
		height: height,
		backgroundColor: color,
	};
	return (
		<div className="IDIFMainContainer">
			<p className="IDIFTitle">{tipoDocumento}</p>
			<select value={tipoDocumento} onChange={handleTipoDocumentoChange} className="IDIFSelect">
				<option value="ID Extranjero">ID Extranjero</option>
				<option value="Cedula">Cédula de Identidad</option>
				<option value="Pasaporte">Pasaporte</option>
			</select>
			{tipoDocumento && (
				<div>
					<input
						className="IDIFInput"
						style={style}
						type="text"
						value={valorDocumento ? valorDocumento : ""}
						onChange={handleValorDocumentoChange}
						onKeyDown={(Event) => {
							if (Event.key === "Enter") {
								onEnter();
							}
						}}
						placeholder={`Ingrese el número de documento`}
						onBlur={onBlur ? onBlur : undefined}
					/>
				</div>
			)}
		</div>
	);
}

export default InputDinamico;
