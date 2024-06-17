import React from "react";
import "./css/btn.css";
import { useState } from "react";

const BtnGeneral = ({ text, handleClick, gap, width, height, color, onHoverColor, borderRadius, img, shadow, disabled }) => {
	const [isHovered, setIsHovered] = useState(false);

	const handleMouseEnter = () => {
		setIsHovered(true);
	};
	const handleMouseLeave = () => {
		setIsHovered(false);
		if (isPressed) {
			setIsPressed(false);
		}
	};

	const [isPressed, setIsPressed] = useState(false);

	const handlePress = () => {
		setIsPressed(true);
	};
	const handleRelease = () => {
		setIsPressed(false);
	};

	const style = {
		gap: gap ? gap : "10px",
		width: width ? width : "110px",
		height: height ? height : "46px",
		backgroundColor: color ? color : "#AEBBFD",
		borderRadius: borderRadius ? borderRadius : "11.4167px",
		boxShadow: shadow ? shadow : "1.90278px 3.80556px 0px #000000",
		transition: "background-color 0.3s, transform 0.1s, box-shadow 0.1s",

		//obscurece el color del boton cuando el mouse esta sobre el boton
		...(isHovered && { backgroundColor: onHoverColor ? onHoverColor : "#8E9BFF", cursor: "pointer" }),
		// Anima que el boton se hunda cuando se presiona
		...(isPressed && { transform: "scale(0.95)", boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.75)" }),
		// Desactiva el boton
		...(disabled && { color: "rgba(0, 0, 0, 0.5)", backgroundColor: "rgba(138, 138, 138, 0.5)", cursor: "not-allowed" }),
	};
	return (
		<div>
			<button
				style={style}
				onClick={handleClick}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				onMouseDown={handlePress}
				onMouseUp={handleRelease}
				className="BtnGeneral"
				disabled={disabled ? true : false}
			>
				<img src={img} />
				{text}
			</button>
		</div>
	);
};

export default BtnGeneral;
