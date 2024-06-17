import React, { useState, useEffect } from "react";
import "./css/InputDiferente.css";

const InputBusqueda = ({ type, placeholder, width, height, color, borderRadius, shadow, name, flexBasis, onChange, disabled, id, value, updateState }) => {
    const [inputText, setInputText] = useState(value || "");

    const handleChange = (e) => {
        setInputText(e.target.value);
        if (onChange) {
            onChange(e);
        }
        if (updateState) {
            updateState(e.target.value);
        }
    };

    useEffect(() => {
        setInputText(value);
    }, [value]);

    return (
        <div className="InputDContainer" style={{ flexBasis: flexBasis }}>
            <p className="InputDTitle">{name}</p>
            <input
                type={type}
                placeholder={placeholder}
                style={{
                    height: height || "32px",
                    backgroundColor: color || "rgba(174, 187, 253, 0.25)",
                    borderRadius: borderRadius || "10px",
                    boxShadow: shadow,
                    width: width || undefined,
                }}
                className="InputDiferente"
                value={inputText}
                onChange={handleChange}
                disabled={disabled}
                id={id}
            />
        </div>
    );
};

export default InputBusqueda;
