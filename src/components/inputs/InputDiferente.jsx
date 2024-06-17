import React, { useState, useEffect } from "react";
import "./css/InputDiferente.css";

const InputDiferente = ({ type, placeholder, width, height, color, borderRadius, shadow, name, flexBasis, onChange, disabled, id, value, updateState, onEnter }) => {
	value = value ? value : "";
	const style = {
		height: height ? height : "32px",
		backgroundColor: color ? color : "rgba(174, 187, 253, 0.25)",
		borderRadius: borderRadius ? borderRadius : "10px",
		boxShadow: shadow,
		width: width ? width : undefined,
	};

	const [inputText, setInputText] = useState("");

	const handleChange = (e) => {
        setInputText(e.target.value);
        if (onChange) {
            onChange(e.target.value);
        }
        if (updateState) {
            updateState(e.target.value);
        }
    };

	useEffect(() => {
		setInputText(value);
	}, [value]);

	return (
		<>
			<div className="InputDContainer" style={{ flexBasis: flexBasis }}>
				<p className="InputDTitle">{name}</p>

				<input
					type={type}
					placeholder={placeholder}
					style={style}
					className="InputDiferente"
					onKeyDown={(Event) => {
						if (Event.key === "Enter") {
							onEnter();
						}
					}}
					value={inputText}
					onChange={handleChange}
					disabled={disabled}
					id={id}
				/>
			</div>
		</>
	);
};

export default InputDiferente;
