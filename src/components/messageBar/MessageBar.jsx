import React, { useEffect, useState } from "react";
import "./MessageBar.css";

const MessageBar = ({ text, showTime, position, severity }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setVisible(false);
        }, showTime);

        return () => {
            clearTimeout(timeout);
        };
    }, [showTime]);

    const getPositionClass = () => {
        switch (position) {
            case "left":
                return "MessageBar_PositionLeft";
            case "center":
                return "MessageBar_PositionCenter";
            case "right":
                return "MessageBar_PositionRight";
            default:
                return "";
        }
    };

    return visible ? (
        <div
            className={`MessageBar_Container ${getPositionClass()} ${severity}`}
        >
            <div className="MessageBar_Text">{text}</div>
        </div>
    ) : null;
};

export default MessageBar;

export const showErrorMessage = (text, position, options = {}) => {
    const defaultOptions = {
        showTime: 3000,
        severity: "error",
        ...options,
    };

    return <MessageBar text={text} position={position} {...defaultOptions} />;
};

export const showSuccessMessage = (text, position, options = {}) => {
    const defaultOptions = {
        showTime: 3000,
        severity: "success",
        ...options,
    };

    return <MessageBar text={text} position={position} {...defaultOptions} />;
};

export const showWarningMessage = (text, position, options = {}) => {
    const defaultOptions = {
        showTime: 3000,
        severity: "warning",
        ...options,
    };

    return <MessageBar text={text} position={position} {...defaultOptions} />;
};

export const showInfoMessage = (text, position, options = {}) => {
    const defaultOptions = {
        showTime: 3000,
        severity: "info",
        ...options,
    };

    return <MessageBar text={text} position={position} {...defaultOptions} />;
};
