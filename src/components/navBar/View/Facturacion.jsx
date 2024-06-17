import React, { useState, useEffect } from "react";
import "./css/Facturacion.css";
import BtnGeneral from "../../../components/buttons/BtnGeneral";
import InputDinamico from "../../../components/inputs/InputDinamico";
import InputDiferente from "../../../components/inputs/InputDiferente";
import svgAdd from "../../../assets/svg_add.svg";
import svgSearch from "../../../assets/SearchSVG.svg";
import svgCatalog from "../../../assets/catalog.svg";
import cartSVG from "../../../assets/marketKart.svg";
import ProductTable from "../../tables/productTable";
import ModalBuscar from "../../modal/ModalBuscar";
import { showErrorMessage, showSuccessMessage, showWarningMessage, showInfoMessage } from "../../messageBar/MessageBar";

const Facturacion = ({ setListaProductosExterna, continuarVista, listaProductosInterna, setClienteExterno, ClienteExterno }) => {
	const [listProductos, setListProductos] = useState(listaProductosInterna);
	const [montoTotal, setMontoTotal] = useState("0.00");
	const [getCantidad, setCantidad] = useState(1);
	const [getCodigo, setCodigo] = useState("");
	const [getIdentificacion, setIdentificacion] = useState("Cedula");
	const [getValorIdentificacion, setValorIdentificacion] = useState(ClienteExterno ? ClienteExterno.identificacion : "");
	const [getClientes, setClientes] = useState([]);
	const [getValorNombre, setValorNombre] = useState(ClienteExterno ? ClienteExterno.name : "");
	const [getValorDireccion, setValorDireccion] = useState(ClienteExterno ? ClienteExterno.direccion : "");
	const [getValorRif, setValorRif] = useState(ClienteExterno ? ClienteExterno.rif : "");
	const [getValorCodigo, setValorCodigo] = useState("");
	const [getValorCantidad, setValorCantidad] = useState("");
	const [getName, setName] = useState(ClienteExterno ? ClienteExterno.name : "");
	const [getDireccion, setDireccion] = useState(ClienteExterno ? ClienteExterno.direccion : "");
	const [getRif, setRif] = useState(ClienteExterno ? ClienteExterno.rif : "");
	const [disabledInput, setDisabledInput] = useState(false);
	const [openModal, setOpenModal] = useState(false);
	const [message, setMessage] = useState({});
	const [crearClienteDisabled, setCrearClienteDisabled] = useState(ClienteExterno ? (ClienteExterno.identificacion ? true : false) : false);
	const [continueMetodoPago, setContinueMetodoPago] = useState(true);

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

	const handleClickModal = () => {
		setOpenModal(true);
	};

	const handleCloseModal = () => {
		setOpenModal(false);
	};

	useEffect(() => {
		fetch("/src/json/clientes.json")
			.then((response) => {
				if (!response.ok) {
					throw new Error("Error fetching data");
				}
				return response.json();
			})
			.then((data) => {
				setClientes(data.data);
			});
	}, []);

	const eliminarProducto = (codigo) => {
		const index = listProductos.findIndex((element) => element.codigo === codigo);
		if (index !== -1) {
			const updatedProductos = [...listProductos];
			updatedProductos.splice(index, 1);
			setListProductos(updatedProductos);
		}
	};

	const agregarProducto = (producto) => {
		const index = listProductos.findIndex((p) => p.codigo === producto.codigo);
		if (index !== -1) {
			const updatedProductos = [...listProductos];
			updatedProductos[index].cantidad += producto.cantidad;
			updatedProductos[index].total += producto.total;
			setListProductos(updatedProductos);
		} else {
			setListProductos([...listProductos, producto]);
		}
	};

	const addProduct = () => {
		fetch("/src/json/productos.json")
			.then((response) => {
				if (!response.ok) {
					throw new Error("Error fetching data");
				}
				return response.json();
			})
			.then((data) => {
				let product = data[getCodigo];
				if (product) {
					const index = listProductos.findIndex((element) => element.codigo === getCodigo);
					if (index !== -1) {
						if (parseFloat(getCantidad) <= 0) {
							setMessage({ text: "La cantidad debe ser mayor a 0", severity: "warning" });
							return;
						}
						const updatedProductos = [...listProductos];
						updatedProductos[index].cantidad += parseFloat(getCantidad);
						updatedProductos[index].total =
							parseFloat(updatedProductos[index].cantidad) *
							(parseFloat(updatedProductos[index].precio) + parseFloat(updatedProductos[index].iva));
						setListProductos(updatedProductos);
						setValorCodigo("");
						setValorCantidad("");
					} else {
						if (parseFloat(getCantidad) <= 0) {
							setMessage({ text: "La cantidad debe ser mayor a 0", severity: "warning" });
							return;
						}
						setListProductos([
							...listProductos,
							{
								codigo: getCodigo,
								descripcion: product.name,
								cantidad: parseFloat(getCantidad),
								precio: parseFloat(product.price),
								iva: parseFloat(product.IVA),
								total: parseFloat(product.total) * parseFloat(getCantidad),
							},
						]);
						setCodigo("");
						setCantidad(1);
						setValorCodigo("");
						setValorCantidad("");
					}
				} else {
					setMessage({ text: "Producto no encontrado", severity: "error" });
				}
			});
	};

	useEffect(() => {
		setListaProductosExterna(listProductos);
		let total = 0;
		listProductos.forEach((element) => {
			total += parseFloat(element.total);
		});
		setMontoTotal(total.toFixed(2));
		if (ClienteExterno) {
			if (ClienteExterno.identificacion && listProductos.length > 0) {
				setContinueMetodoPago(false);
			} else {
				setContinueMetodoPago(true);
			}
		}
	}, [listProductos]);

	useEffect(() => {
		if (ClienteExterno && ClienteExterno.identificacion && listProductos.length > 0) {
			setContinueMetodoPago(false);
		} else {
			setContinueMetodoPago(true);
		}
	}, [ClienteExterno]);

	const cleanInputs = () => {
		setValorNombre("");
		setValorDireccion("");
		setValorRif("");
	};

	const handleOnBlur = () => {
		switch (getIdentificacion) {
			case "Cedula":
				const client = getClientes.find((element) => element.ci === getValorIdentificacion);
				if (client && client.ci) {
					setDisabledInput(true);
					setValorNombre(client.name);
					setValorDireccion(client.direccion);
					setValorRif(client.rif);
					client.identificationType = "C.I.";
					client.identificacion = getValorIdentificacion;
					setClienteExterno(client);
					setCrearClienteDisabled(true);
				} else {
					setDisabledInput(false);
					setClienteExterno({});
					setCrearClienteDisabled(false);
					cleanInputs();
				}
				break;
			case "Pasaporte":
				const client2 = getClientes.find((element) => element.pasaporte === getValorIdentificacion);
				if (client2 && client2.pasaporte) {
					setDisabledInput(true);
					setValorNombre(client2.name);
					setValorDireccion(client2.direccion);
					setValorRif(client2.rif);
					client2.identificationType = "PASAPORTE";
					client2.identificacion = getValorIdentificacion;
					setClienteExterno(client2);
					setCrearClienteDisabled(true);
				} else {
					setDisabledInput(false);
					setClienteExterno({});
					setCrearClienteDisabled(false);
					cleanInputs();
				}
				break;
			case "ID Extranjero":
				const client3 = getClientes.find((element) => element.idExtranjera === getValorIdentificacion);
				if (client3 && client3.idExtranjera) {
					setDisabledInput(true);
					setValorNombre(client3.name);
					setValorDireccion(client3.direccion);
					setValorRif(client3.rif);
					client3.identificationType = "ID EXTRANJERO";
					client3.identificacion = getValorIdentificacion;
					setClienteExterno(client3);
					setCrearClienteDisabled(true);
				} else {
					setDisabledInput(false);
					setClienteExterno({});
					setCrearClienteDisabled(false);
					cleanInputs();
				}
				break;
			default:
				console.log("Error");
				break;
		}
	};

	const createClient = () => {
		console.log(getName, getDireccion, getRif, getValorIdentificacion, getIdentificacion);
		if (
			getValorIdentificacion === "" ||
			getValorIdentificacion === undefined ||
			getDireccion === "" ||
			getDireccion === undefined ||
			getRif === "" ||
			getRif === undefined ||
			getName === "" ||
			getName === undefined
		) {
			setMessage({ text: "Por favor llene todos los campos", severity: "warning" });
			return;
		}
		const client = getClientes.find((element) => element.ci === getValorIdentificacion);
		if (client) {
			setMessage({ text: "Cliente ya existe", severity: "info" });
			return;
		}
		switch (getIdentificacion) {
			case "Cedula":
				setClientes([
					...getClientes,
					{
						ci: getValorIdentificacion,
						name: getName,
						direccion: getDireccion,
						rif: getRif,
						identificacion: getValorIdentificacion,
						tipoIdentificacion: "C.I.",
					},
				]);
				setClienteExterno({
					ci: getValorIdentificacion,
					name: getName,
					direccion: getDireccion,
					rif: getRif,
					identificacion: getValorIdentificacion,
					tipoIdentificacion: "C.I.",
				});

				break;
			case "Pasaporte":
				setClientes([
					...getClientes,
					{
						pasaporte: getValorIdentificacion,
						name: getName,
						direccion: getDireccion,
						rif: getRif,
						identificacion: getValorIdentificacion,
						tipoIdentificacion: "PASAPORTE",
					},
				]);
				setClienteExterno({
					pasaporte: getValorIdentificacion,
					name: getName,
					direccion: getDireccion,
					rif: getRif,
					identificacion: getValorIdentificacion,
					tipoIdentificacion: "PASAPORTE",
				});
				break;
			case "ID Extranjero":
				setClientes([
					...getClientes,
					{
						idExtranjera: getValorIdentificacion,
						name: getName,
						direccion: getDireccion,
						rif: getRif,
						identificacion: getValorIdentificacion,
						tipoIdentificacion: "ID EXTRANJERO",
					},
				]);
				setClienteExterno({
					idExtranjera: getValorIdentificacion,
					name: getName,
					direccion: getDireccion,
					rif: getRif,
					identificacion: getValorIdentificacion,
					tipoIdentificacion: "ID EXTRANJERO",
				});
				break;
		}
		setValorDireccion(getDireccion);
		setValorNombre(getName);
		setValorRif(getRif);
		setDisabledInput(true);
		setMessage({ text: "Cliente creado con exito", severity: "success" });
		setCrearClienteDisabled(true);
	};

	return (
		<>
			<div className="FacturaContainer">
				{message && (
					<div className="message-bar-wrapper">
						{message.severity === "success" && showSuccessMessage(message.text, "left")}
						{message.severity === "error" && showErrorMessage(message.text, "left")}
						{message.severity === "warning" && showWarningMessage(message.text, "left")}
						{message.severity === "info" && showInfoMessage(message.text, "left")}
					</div>
				)}
				<h1 className="FacturaHeaderContainer">Nueva Factura</h1>

				<div className="FacturaInputsEntre2">
					<div className="FacturaInput1">
						<div className="FacturaCedula-nombre">
							<div className="FacturaCedula">
								<InputDinamico
									value={getValorIdentificacion}
									name="Cedula o Pasaporte:"
									color="#D9D9D9"
									width="200px"
									onBlur={handleOnBlur}
									onTypeChange={(newType) => setIdentificacion(newType)}
									onValueChange={(newValue) => setValorIdentificacion(newValue)}
									onEnter={handleOnBlur}
								/>
							</div>

							<div className="FacturaNombre">
								<InputDiferente
									value={getValorNombre}
									name="Nombre:"
									color="#D9D9D9"
									width="50%"
									placeholder="ej. Jhon Doe"
									onChange={(newName) => setName(newName)}
									disabled={disabledInput}
								/>
							</div>
						</div>
						<div className="FacturaDireccion">
							<InputDiferente
								name="Direccion:"
								value={getValorDireccion}
								flexBasis="100%"
								color="#D9D9D9"
								width="70%"
								placeholder="ej. Avenida Río Caura Torre Humboldt Prados del Este Piso 20 Oficina 20-06"
								disabled={disabledInput}
								onChange={(newDireccion) => setDireccion(newDireccion)}
							/>
						</div>
						<div className="FacturaRif-BotonCrear">
							<div className="FacturaRif">
								<InputDiferente
									value={getValorRif}
									name="Rif:"
									color="#D9D9D9"
									width="80%"
									placeholder="ej. J123456789"
									disabled={disabledInput}
									onChange={(newRif) => setRif(newRif)}
								/>
							</div>
							<div className="FacturaBotonCrear">
								<BtnGeneral
									img={svgAdd}
									text="Crear Cliente"
									width="165px"
									handleClick={createClient}
									disabled={crearClienteDisabled}
								/>
							</div>
						</div>
					</div>

					<div className="FacturaInput2">
						<div className="FacturaoCodigo-buscar">
							<div className="FacturaCodigo">
								<InputDiferente
									value={getValorCodigo}
									name="Codigo:"
									color="#D9D9D9"
									onChange={(newValue) => {
										setCodigo(newValue);
										setValorCodigo(newValue);
									}}
									onEnter={addProduct}
								/>
							</div>
							<div className="FacturaBuscar">
								<button className="FacturaSearch" onClick={handleClickModal}>
									<img src={svgSearch}></img>
								</button>
								{openModal && <ModalBuscar closeModal={handleCloseModal} agregarProducto={agregarProducto} />}
							</div>
						</div>
						<div className="FacturaCantidad">
							<InputDiferente
								value={getValorCantidad}
								type="number"
								name="Cantidad:"
								color="#D9D9D9"
								width="80px"
								placeholder="1"
								onChange={(newCantidad) => {
									setCantidad(newCantidad);
									setValorCantidad(newCantidad);
								}}
								onEnter={addProduct}
							/>
						</div>
						<div className="FacturaBotonAgregar">
							<BtnGeneral img={svgAdd} text="Agregar Producto" width="200px" handleClick={() => addProduct(getCodigo)} />
						</div>
					</div>
				</div>

				<div className="FacturaTableContainer">
					<ProductTable width="90%" height="85%" rows={listProductos} eliminarProducto={eliminarProducto} />
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
							Total:
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
					<BtnGeneral
						text="Metodo de Pago"
						width="140px"
						color="#ff6060"
						onHoverColor="#c54444"
						img={cartSVG}
						handleClick={() => {
							if (listProductos.length === 0) {
								setMessage({ text: "No hay productos en la factura", severity: "error" });
								return;
							}
							if (
								!ClienteExterno ||
								!ClienteExterno.identificacion ||
								!ClienteExterno.name ||
								!ClienteExterno.direccion ||
								!ClienteExterno.rif
							) {
								setMessage({ text: "Por favor seleccione un cliente", severity: "warning" });
								return;
							}
							continuarVista();
						}}
						disabled={continueMetodoPago}
					/>
				</div>
			</div>
		</>
	);
};

export default Facturacion;
