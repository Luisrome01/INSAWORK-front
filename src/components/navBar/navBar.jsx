import React, { useState } from "react";
import { Link } from "react-router-dom";
import BtnGeneral from "../buttons/BtnGeneral";
import logo from "../../assets/BillMasterLogo.svg";
import logoutLogo from "../../assets/tabler_logout.svg";
import "./navBar.css";

const NavBar = ({ componenteActivo, setComponenteActivo }) => {
	const baseLogoColor = "#A4A4A5";
	const activeLogoColor = "#000000";

	const styleHover = {
		//background color is clearer when the mouse is over the button than when is selected
		backgroundColor: "lightGray",
	};

	const styleSelected = {
		backgroundColor: "#AEBBFD",
		boxShadow: "5px 5px 1px rgba(0, 0, 0, 1)",
	};

	const [componenteHover, setComponenteHover] = useState({
		Productos: false,
		Facturacion: false,
		"Metodos de Pago": false,
		"Cierre de Caja": false,
	});

	const handleMouseEnter = (componente) => {
		setComponenteHover((prevHover) => ({
			...prevHover,
			[componente]: true,
		}));
	};

	const handleMouseLeave = (componente) => {
		setComponenteHover((prevHover) => ({
			...prevHover,
			[componente]: false,
		}));
	};

	return (
		<nav className="NavNavbar">
			<div className="NavLogo">
				<img src={logo}></img>
				<h1 className="NavBarTitle">Bill Master</h1>
			</div>
			<div className="NavContent">
				<h2 style={{ color: "#A4A4A5" }}>MENÚ PRINCIPAL</h2>
				<div
					className="nav-link"
					onClick={() => setComponenteActivo("CitasMedicas")}
					style={componenteActivo === "CitasMedicas" ? styleSelected : componenteHover.CitasMedicas ? styleHover : {}}
					onMouseEnter={() => handleMouseEnter("CitasMedicas")}
					onMouseLeave={() => handleMouseLeave("CitasMedicas")}
				>
					<svg width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg" className="nav-link-img">
						<path
							d="M22.273 7.86802L21.9971 5.23267C21.5975 2.35948 20.2941 1.18927 17.5065 1.18927L15.2613 1.18927H13.8532L10.961 1.18927H9.55294L7.2696 1.18927C4.47252 1.18927 3.17863 2.35948 2.76954 5.26121L2.51266 7.87753C2.41752 8.89552 2.69342 9.88496 3.2928 10.6556C4.01585 11.5975 5.12898 12.1302 6.36579 12.1302C7.56454 12.1302 8.71572 11.5309 9.43877 10.57C10.0857 11.5309 11.1893 12.1302 12.4166 12.1302C13.6439 12.1302 14.719 11.5594 15.3754 10.608C16.108 11.5499 17.2402 12.1302 18.4199 12.1302C19.6852 12.1302 20.8269 11.5689 21.5404 10.5795C22.1113 9.81837 22.3681 8.85746 22.273 7.86802Z"
							fill={componenteActivo === "CitasMedicas" ? activeLogoColor : baseLogoColor}
						/>
						<path
							d="M11.7978 15.8502C10.5895 15.9739 9.67621 17.0014 9.67621 18.2192V20.826C9.67621 21.0829 9.88551 21.2922 10.1424 21.2922H14.6805C14.9374 21.2922 15.1467 21.0829 15.1467 20.826V18.5522C15.1562 16.5638 13.986 15.6219 11.7978 15.8502Z"
							fill={componenteActivo === "CitasMedicas" ? activeLogoColor : baseLogoColor}
						/>
						<path
							d="M21.3307 13.7V16.5352C21.3307 19.161 19.1996 21.2921 16.5737 21.2921C16.3169 21.2921 16.1076 21.0828 16.1076 20.8259V18.5521C16.1076 17.3343 15.7365 16.383 15.0135 15.736C14.376 15.1557 13.5103 14.8702 12.4352 14.8702C12.1973 14.8702 11.9595 14.8798 11.7026 14.9083C10.0091 15.0795 8.72477 16.5066 8.72477 18.2191V20.8259C8.72477 21.0828 8.51547 21.2921 8.25859 21.2921C5.63276 21.2921 3.50165 19.161 3.50165 16.5352L3.50165 13.7191C3.50165 13.0531 4.15811 12.6059 4.77651 12.8248C5.03338 12.9104 5.29026 12.977 5.55665 13.015C5.67081 13.0341 5.79449 13.0531 5.90866 13.0531C6.06088 13.0721 6.21311 13.0816 6.36533 13.0816C7.46894 13.0816 8.55352 12.6725 9.40977 11.9685C10.228 12.6725 11.2935 13.0816 12.4162 13.0816C13.5483 13.0816 14.5948 12.6916 15.413 11.9875C16.2693 12.682 17.3348 13.0816 18.4194 13.0816C18.5907 13.0816 18.7619 13.0721 18.9237 13.0531C19.0378 13.0436 19.1425 13.0341 19.2471 13.015C19.5421 12.977 19.8085 12.8914 20.0748 12.8057C20.6932 12.5964 21.3307 13.0531 21.3307 13.7Z"
							fill={componenteActivo === "CitasMedicas" ? activeLogoColor : baseLogoColor}
						/>
					</svg>
					<h3 style={{ color: componenteActivo === "CitasMedicas" ? activeLogoColor : baseLogoColor }}>CitasMedicas</h3>
				</div>
				<div
					className="nav-link"
					onClick={() => setComponenteActivo("Facturacion")}
					style={componenteActivo === "Facturacion" ? styleSelected : componenteHover.Facturacion ? styleHover : {}}
					onMouseEnter={() => handleMouseEnter("Facturacion")}
					onMouseLeave={() => handleMouseLeave("Facturacion")}
				>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="nav-link-img">
						<path
							d="M21.764 21.4306H2.73625C2.34618 21.4306 2.02271 21.1072 2.02271 20.7171C2.02271 20.327 2.34618 20.0035 2.73625 20.0035H21.764C22.1541 20.0035 22.4776 20.327 22.4776 20.7171C22.4776 21.1072 22.1541 21.4306 21.764 21.4306Z"
							fill={componenteActivo === "Facturacion" ? activeLogoColor : baseLogoColor}
						/>
						<path
							d="M10.1096 4.30561L10.1096 21.4306H14.3909V4.30561C14.3909 3.25908 13.9627 2.40283 12.6784 2.40283H11.8221C10.5377 2.40283 10.1096 3.25908 10.1096 4.30561Z"
							fill={componenteActivo === "Facturacion" ? activeLogoColor : baseLogoColor}
						/>
						<path
							d="M3.68799 10.014L3.68799 21.4307H7.49354L7.49354 10.014C7.49354 8.96746 7.11299 8.11121 5.97132 8.11121H5.21021C4.06854 8.11121 3.68799 8.96746 3.68799 10.014Z"
							fill={componenteActivo === "Facturacion" ? activeLogoColor : baseLogoColor}
						/>
						<path
							d="M17.0073 14.7709V21.4307H20.8129V14.7709C20.8129 13.7244 20.4323 12.8682 19.2907 12.8682H18.5295C17.3879 12.8682 17.0073 13.7244 17.0073 14.7709Z"
							fill={componenteActivo === "Facturacion" ? activeLogoColor : baseLogoColor}
						/>
					</svg>
					<h3 style={{ color: componenteActivo === "Facturacion" ? activeLogoColor : baseLogoColor }}>Facturación</h3>
				</div>
				<div
					className="nav-link"
					onClick={() => setComponenteActivo("Metodos de Pago")}
					style={componenteActivo === "Metodos de Pago" ? styleSelected : componenteHover["Metodos de Pago"] ? styleHover : {}}
					onMouseEnter={() => handleMouseEnter("Metodos de Pago")}
					onMouseLeave={() => handleMouseLeave("Metodos de Pago")}
				>
					<svg width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg" className="nav-link-img">
						<path
							d="M21.7643 14.271C21.7643 17.9529 18.7864 20.9307 15.1046 20.9307L16.1035 19.2658"
							stroke={componenteActivo === "Metodos de Pago" ? activeLogoColor : baseLogoColor}
							strokeWidth="1.42708"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M2.73621 8.56268C2.73621 4.8808 5.71405 1.90295 9.39593 1.90295L8.39697 3.56788"
							stroke={componenteActivo === "Metodos de Pago" ? activeLogoColor : baseLogoColor}
							strokeWidth="1.42708"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M21.7636 3.99601V4.10066C21.7636 4.36705 21.5543 4.57636 21.2879 4.57636H12.7254C12.459 4.57636 12.2497 4.36705 12.2497 4.10066V3.99601C12.2497 2.32157 12.6683 1.90295 14.3618 1.90295L19.6515 1.90295C21.345 1.90295 21.7636 2.32157 21.7636 3.99601Z"
							fill={componenteActivo === "Metodos de Pago" ? activeLogoColor : baseLogoColor}
						/>
						<path
							d="M12.7254 5.52771C12.459 5.52771 12.2497 5.73702 12.2497 6.0034V6.95479V7.89667C12.2497 9.57111 12.6683 9.98972 14.3618 9.98972H19.6515C21.345 9.98972 21.7636 9.57111 21.7636 7.89667V6.95479V6.0034C21.7636 5.73702 21.5543 5.52771 21.2879 5.52771L12.7254 5.52771Z"
							fill={componenteActivo === "Metodos de Pago" ? activeLogoColor : baseLogoColor}
						/>
						<path
							d="M12.2501 14.937V15.0417C12.2501 15.3081 12.0408 15.5174 11.7744 15.5174H3.2119C2.94551 15.5174 2.73621 15.3081 2.73621 15.0417V14.937C2.73621 13.2626 3.15482 12.844 4.84829 12.844H10.138C11.8315 12.844 12.2501 13.2626 12.2501 14.937Z"
							fill={componenteActivo === "Metodos de Pago" ? activeLogoColor : baseLogoColor}
						/>
						<path
							d="M3.2119 16.4688C2.94551 16.4688 2.73621 16.6781 2.73621 16.9444V17.8958V18.8377C2.73621 20.5122 3.15482 20.9308 4.84829 20.9308H10.138C11.8315 20.9308 12.2501 20.5122 12.2501 18.8377V17.8958V16.9444C12.2501 16.6781 12.0408 16.4688 11.7744 16.4688H3.2119Z"
							fill={componenteActivo === "Metodos de Pago" ? activeLogoColor : baseLogoColor}
						/>
					</svg>
					<h3 style={{ color: componenteActivo === "Metodos de Pago" ? activeLogoColor : baseLogoColor }}>Métodos de Pago</h3>
				</div>
				<div
					className="nav-link"
					onClick={() => setComponenteActivo("Cierre de Caja")}
					style={componenteActivo === "Cierre de Caja" ? styleSelected : componenteHover["Cierre de Caja"] ? styleHover : {}}
					onMouseEnter={() => handleMouseEnter("Cierre de Caja")}
					onMouseLeave={() => handleMouseLeave("Cierre de Caja")}
				>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="nav-link-img">
						<path
							d="M16.7697 3.88704V2.40287C16.7697 2.0128 16.4462 1.68933 16.0561 1.68933C15.6661 1.68933 15.3426 2.0128 15.3426 2.40287V3.82996H9.15858V2.40287C9.15858 2.0128 8.8351 1.68933 8.44504 1.68933C8.05497 1.68933 7.73149 2.0128 7.73149 2.40287V3.88704C5.16274 4.12489 3.91642 5.65662 3.72615 7.93044C3.70712 8.20634 3.93545 8.43468 4.20184 8.43468H20.2993C20.5752 8.43468 20.8036 8.19683 20.775 7.93044C20.5848 5.65662 19.3384 4.12489 16.7697 3.88704Z"
							fill={componenteActivo === "Cierre de Caja" ? activeLogoColor : baseLogoColor}
						/>
						<path
							d="M18.9101 14.771C16.8075 14.771 15.1046 16.474 15.1046 18.5766C15.1046 19.2901 15.3043 19.9656 15.6564 20.5364C16.3128 21.64 17.5211 22.3821 18.9101 22.3821C20.2991 22.3821 21.5074 21.64 22.1639 20.5364C22.5159 19.9656 22.7157 19.2901 22.7157 18.5766C22.7157 16.474 21.0127 14.771 18.9101 14.771ZM20.8795 18.1675L18.853 20.0417C18.7198 20.1654 18.5391 20.232 18.3678 20.232C18.1871 20.232 18.0063 20.1654 17.8636 20.0227L16.9217 19.0808C16.6458 18.8049 16.6458 18.3482 16.9217 18.0723C17.1976 17.7964 17.6543 17.7964 17.9302 18.0723L18.3868 18.529L19.9091 17.1209C20.1945 16.8545 20.6512 16.8736 20.9175 17.159C21.1839 17.4444 21.1649 17.8916 20.8795 18.1675Z"
							fill={componenteActivo === "Cierre de Caja" ? activeLogoColor : baseLogoColor}
						/>
						<path
							d="M19.8614 9.86182L4.63919 9.86182C4.11593 9.86182 3.68781 10.2899 3.68781 10.8132L3.68781 16.6738C3.68781 19.5279 5.11489 21.4307 8.44475 21.4307H13.1351C13.7916 21.4307 14.2482 20.7933 14.0389 20.1749C13.8486 19.6231 13.6869 19.0142 13.6869 18.5765C13.6869 15.6938 16.0368 13.3439 18.9195 13.3439C19.1954 13.3439 19.4713 13.3629 19.7377 13.4105C20.3086 13.4961 20.8223 13.049 20.8223 12.4781V10.8227C20.8128 10.2899 20.3847 9.86182 19.8614 9.86182ZM9.59593 17.8249C9.41517 17.9962 9.16781 18.1008 8.92044 18.1008C8.67308 18.1008 8.42572 17.9962 8.24496 17.8249C8.07371 17.6442 7.96906 17.3968 7.96906 17.1495C7.96906 16.9021 8.07371 16.6547 8.24496 16.474C8.3401 16.3883 8.43524 16.3217 8.55892 16.2742C8.91093 16.122 9.32954 16.2076 9.59593 16.474C9.76718 16.6547 9.87183 16.9021 9.87183 17.1495C9.87183 17.3968 9.76718 17.6442 9.59593 17.8249ZM9.59593 14.4951C9.54836 14.5331 9.50079 14.5712 9.45322 14.6092C9.39614 14.6473 9.33906 14.6758 9.28197 14.6949C9.22489 14.7234 9.16781 14.7424 9.11072 14.752C9.04412 14.7615 8.97753 14.771 8.92044 14.771C8.67308 14.771 8.42572 14.6663 8.24496 14.4951C8.07371 14.3143 7.96906 14.067 7.96906 13.8196C7.96906 13.5722 8.07371 13.3249 8.24496 13.1441C8.46378 12.9253 8.79676 12.8206 9.11072 12.8872C9.16781 12.8967 9.22489 12.9158 9.28197 12.9443C9.33906 12.9633 9.39614 12.9919 9.45322 13.0299C9.50079 13.068 9.54836 13.1061 9.59593 13.1441C9.76718 13.3249 9.87183 13.5722 9.87183 13.8196C9.87183 14.067 9.76718 14.3143 9.59593 14.4951ZM12.9258 14.4951C12.745 14.6663 12.4977 14.771 12.2503 14.771C12.0029 14.771 11.7556 14.6663 11.5748 14.4951C11.4036 14.3143 11.2989 14.067 11.2989 13.8196C11.2989 13.5722 11.4036 13.3249 11.5748 13.1441C11.9363 12.7921 12.5738 12.7921 12.9258 13.1441C13.097 13.3249 13.2017 13.5722 13.2017 13.8196C13.2017 14.067 13.097 14.3143 12.9258 14.4951Z"
							fill={componenteActivo === "Cierre de Caja" ? activeLogoColor : baseLogoColor}
						/>
					</svg>
					<h3 style={{ color: componenteActivo === "Cierre de Caja" ? activeLogoColor : baseLogoColor }}>Cierre de Caja</h3>
				</div>
			</div>
			<div className="nav-last-link">
				<Link to="/" style={{ textDecoration: "none" }}>
					<BtnGeneral text="Logout" color="#ff6060" onHoverColor="#c54444" className="NavBarLogout" img={logoutLogo} />
				</Link>
			</div>
		</nav>
	);
};

export default NavBar;
