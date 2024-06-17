import React from "react";
import "./css/InputGeneral.css";

const InputGeneral = ({ type, placeholder, width, value, onChange, height, color, borderRadius, shadow, name, onEnter }) => {
	const style = {
		width: width,
		height: height,
		backgroundColor: color,
		borderRadius: borderRadius,
		boxShadow: shadow,
	};

	return (
		<>
			<div className="containerName">
				<span>{name}</span>
			</div>
			<input
				type={type}
				placeholder={placeholder}
				style={style}
				value={value}
				onChange={onChange}
				className="InputGeneral"
				onKeyDown={(Event) => {
					if (Event.key === "Enter") {
						onEnter();
					}
				}}
			/>
		</>
	);
};

export default InputGeneral;
