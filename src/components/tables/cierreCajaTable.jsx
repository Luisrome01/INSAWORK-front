import React, { useEffect, useState } from "react";
import "./css/cierreCajaTable.css";
import exploreSVG from "../../assets/explore.svg";

const CierreCajaTable = ({ width, height, color, data }) => {
	const style = {
		width: width ? width : "90%",
		height: height ? height : "85%",
		backgroundColor: color ? color : "#ffffff",
	};

	const calculateIngresos = (metodosPago) => {
		return metodosPago.reduce((total, metodo) => total + metodo.monto, 0);
	};
	const calculateEgresos = (metodosPago, monto) => {
		return (metodosPago.reduce((total, metodo) => total + metodo.monto, 0) - monto).toFixed(2);
	};

	return (
		<div style={style} className="cierreCajaTableContainer">
			<div className="cierreCajaTableWrapper">
				<div className="cierreCajaTableHeader">
					<p>Número de factura</p>
					<p>Fecha</p>
					<p>Monto</p>
					<p>Ingresos</p>
					<p>Egresos</p>
					<p></p>
				</div>
				<div className="cierreCajaTableBody">
					{data.map((fila, index) => (
						<div key={index} className="cierreCajaTableRow">
							<p>{fila.id}</p>
							<p>{fila.date}</p>
							<p>{fila.monto}</p>
							<p>{calculateIngresos(fila.metodosPago)}</p>
							<p>{calculateEgresos(fila.metodosPago, fila.monto)}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default CierreCajaTable;
