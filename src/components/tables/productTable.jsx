import React, { useEffect, useState } from "react";

import "./css/productTable.css";
import trashbinSVG from "../../assets/trashbin.svg";
import exploreSVG from "../../assets/explore.svg";

const ProductTable = ({ width, height, color, rows, eliminarProducto }) => {
	const style = {
		width: width ? width : "90%",
		height: height ? height : "85%",
		backgroundColor: color ? color : "#ffffff",
	};

	return (
		<div style={style} className="ProductTableContainer">
			<div className="ProductTableWrapper">
				<div className="ProductTableHeader">
					<p></p>
					<p style={{ justifySelf: "left" }}>Código del producto</p>
					<p>Descripción</p>
					<p>Cantidad</p>
					<p>Precio/Unidad</p>
					<p>IVA</p>
					<p>Total</p>
					<p></p>
				</div>
				<div className="ProductTableBody">
					{rows.map((fila, index) => (
						<div key={index} className="ProductTableRow">
							<button
								onClick={() => eliminarProducto(fila.codigo)}
								style={{ justifySelf: "center", border: "none", backgroundColor: "transparent" }}
							>
								<img src={trashbinSVG}></img>
							</button>
							<p style={{ justifySelf: "left" }}>{fila.codigo}</p>
							<p>{fila.descripcion}</p>
							<p>{fila.cantidad}</p>
							<p>$ {fila.precio}</p>
							<p>$ {fila.iva}</p>
							<p>$ {fila.total.toFixed(2)}</p>
							<p></p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default ProductTable;
