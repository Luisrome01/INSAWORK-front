import React, { useEffect, useState } from "react";
import "./css/MetodosTable.css";
import trashbinSVG from "../../assets/trashbin.svg";
const MetodosTable = ({ width, height, color, data, eliminarPago }) => {
	const style = {
		width: width ? width : "90%",
		height: height ? height : "85%",
		backgroundColor: color ? color : "#ffffff",
	};
	return (
		<div style={style} className="MetodosTableContainer">
			<div className="MetodosTableWrapper">
				<div className="MetodosTableHeader">
					<p>Metodo de Pago</p>
					<p>Banco</p>
					<p>Monto</p>
					<p>Numero de Punto</p>
					<p></p>
				</div>
				<div className="MetodosTableBody">
					{data.map((fila, index) => (
						<div key={index} className="MetodosTableRow">
							<p>{fila.metodosPago}</p>
							<p>{fila.banco}</p>
							<p>{fila.monto}</p>
							<p>{fila.numeroPunto}</p>
							<button
								style={{ justifySelf: "center", border: "none", backgroundColor: "transparent" }}
								onClick={() => eliminarPago(index)}
							>
								<img src={trashbinSVG}></img>
							</button>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default MetodosTable;
