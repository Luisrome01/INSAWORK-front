import React, { useEffect, useState } from "react";
import "./css/ModalExternalExam.css"; // Asegúrate de tener la hoja de estilos adecuada

const ModalExternalExam = ({ closeModal, examId }) => {
  const [examData, setExamData] = useState(null);

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const response = await fetch(`https://insawork.onrender.com/externalExam/${examId}`); // Cambia la URL si es necesario
        if (!response.ok) {
          throw new Error('Error fetching exam data');
        }
        const data = await response.json();
        setExamData(data);
      } catch (error) {
        console.error("Error fetching external exam data:", error);
      }
    };

    if (examId) {
      fetchExamData();
    }
  }, [examId]);

  if (!examData) {
    return <div>Cargando...</div>; // Puedes mostrar un loader aquí
  }

  return (
    <div className="modalExternalExamContainer">
      <div className="modalExternalExamBackgroundBlur"></div>
      <div className="modalExternalExamContent">
        <div className="modalExternalExamHeader">
          <div className="spacer"></div>
          <p className="modalExternalExamHeaderTitle">Examen Externo</p>
          <button className="modalExternalExamCloseButton" onClick={() => closeModal(false)}>X</button>
        </div>
        <div className="modalExternalExamBody">
          <div className="modalExternalExamBodyContainer">
            <strong>Tipo:</strong> {examData.type || 'No disponible'} <br />
            <strong>Descripción:</strong> {examData.description || 'No disponible'} <br />
            <strong>Fecha:</strong> {new Date(examData.date).toLocaleDateString() || 'No disponible'} <br />
            <strong>Resultados:</strong> <a href={examData.path} target="_blank" rel="noopener noreferrer">Ver resultados</a> <br />
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalExternalExam;
