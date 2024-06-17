import React from "react";
import { Link } from "react-router-dom";
import BtnGeneral from "../buttons/BtnGeneral";
import svg from "../../assets/check.svg";
import "./css/ModalCierre.css";

const ModalCierre = ({
	closeModal,
	ingresos,
	ingresosEfectivo,
	ingresosDivisas,
	ingresosBanesco,
	ingresosMercantil,
	ingresosBancaribe,
	ingresosPunto1,
	ingresosPunto2,
	ingresosPunto3,
	egresos,
	total,
	cantidadFacturas,
	responsable,
	fecha,
	hora,
}) => {
	return (
		<div className="modalContainer">
			<div className="modalBackgroundBlur"></div>
			<div className="modalContent">
				<div className="title">
					<h1>Resumen del cierre de caja</h1>
					<Link to="/" style={{ textDecoration: "none" }}>
						<BtnGeneral gap="0" text="X" width="40px" height="40px" color="#FF6060" bgColor="#FF0000" handleClick={closeModal} />
					</Link>
				</div>
				<div className="body">
					<div className="bodyContainer">
						<p>Responsable: {responsable}</p>
						<div className="FechaHora">
							<p>Fecha: {fecha}</p>
							<p>Hora: {hora}</p>
						</div>
						<div className="Estadisticas">
							<div className="EstadisticasGenerales">
								<p className="Estadistica">Estadística</p>
								<p>Facturas realizadas: {cantidadFacturas}</p>
								<p>Saldo de cierre: ${total}</p>
								<p>Ingresos totales:${ingresos}</p>
								<p>Egresos totales: ${egresos}</p>
							</div>
							<div className="EstadisticasGenerales">
								<p className="Estadistica">Metodos de Pago</p>
								<p>Efectivo: ${ingresosEfectivo}</p>
								<p>Divisas: ${ingresosDivisas}</p>
								<p>Transferencia: ${ingresosBanesco + ingresosMercantil + ingresosBancaribe}</p>
								<p>Tarjeta: ${ingresosPunto1 + ingresosPunto2 + ingresosPunto3}</p>
							</div>
							<div className="EstadisticasGenerales">
								<p className="Estadistica">Transferencias</p>
								<p>Banesco: ${ingresosBanesco}</p>
								<p>Mercantil: ${ingresosMercantil}</p>
								<p>Bancaribe: ${ingresosBancaribe}</p>
							</div>
							<div className="EstadisticasGenerales">
								<p className="Estadistica">Punto de Venta</p>
								<p>Punto 1: ${ingresosPunto1}</p>
								<p>Punto 2: ${ingresosPunto2}</p>
								<p>Punto 3: ${ingresosPunto3}</p>
							</div>
						</div>
					</div>
				</div>
				<div className="footer">
					<div className="footerContainer">
						<img src={svg} alt="Check" />
						<h4>El saldo de cierre concuerda con los ingresos y egresos de las transacciones.</h4>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ModalCierre;
