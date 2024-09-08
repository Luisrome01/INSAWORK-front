import React from 'react';
import "./css/ModalConfirmDelete.css";

const ModalConfirmDelete = ({ onConfirm, onCancel }) => {
    return (
        <div className="modalConfirmDeleteContainer">
            <div className="modalConfirmDeleteBackgroundBlur"></div>
            <div className="modalConfirmDeleteContent">
                <h3>¿Estás seguro de que deseas eliminar esto?</h3>
                <p>Esta acción no se puede deshacer.</p>
                <div className="modalConfirmDeleteActions">
                    <button className="cancelButton" onClick={onCancel}>
                        Cancelar
                    </button>
                    <button className="confirmButton" onClick={onConfirm}>
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalConfirmDelete;
