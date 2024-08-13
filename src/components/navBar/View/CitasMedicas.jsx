import React, { useState, useEffect } from 'react';
import './css/CitasMedicas.css'; // Asegúrate de que la ruta del CSS sea correcta

const CitasMedicas = ({ setListaCitas, listaCitas }) => {
  const [citas, setCitas] = useState([]);
  const [showMessageBar, setShowMessageBar] = useState(false);

  useEffect(() => {
    fetch("/src/json/citas.json") // Cambia la ruta al archivo de citas según tu estructura
      .then(response => {
        if (!response.ok) {
          throw new Error("Error fetching data");
        }
        return response.json();
      })
      .then(data => {
        const citasArray = Object.entries(data).map(
          ([key, value]) => ({
            ...value,
            id: key,
          })
        );
        setCitas(citasArray);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleClick = (id) => {
    fetch("/src/json/citas.json") // Cambia la ruta al archivo de citas según tu estructura
      .then(response => {
        if (!response.ok) {
          throw new Error("Error fetching data");
        }
        return response.json();
      })
      .then(data => {
        const cita = data[id];
        const index = listaCitas.findIndex(cita => cita.id === id);
        if (index !== -1) {
          const updatedCitas = [...listaCitas];
          updatedCitas[index].cantidad++;
          updatedCitas[index].total =
            updatedCitas[index].cantidad *
            (updatedCitas[index].precio + updatedCitas[index].iva);
          setListaCitas(updatedCitas);
        } else {
          setListaCitas([
            ...listaCitas,
            {
              id: id,
              cantidad: 1,
              descripcion: cita.name,
              precio: parseFloat(cita.price),
              iva: parseFloat(cita.IVA),
              total:
                1 * (parseFloat(cita.price) + parseFloat(cita.IVA)),
            },
          ]);
        }
        setShowMessageBar(true);
        setTimeout(() => setShowMessageBar(false), 3000);
      });
  };

  return (
    <div className="containerMain">
      <div className="containerCard">
        {citas.map(cita => (
          <div
            key={cita.id}
            className="citaCard"
            onClick={() => handleClick(cita.id)}
          >
            <h3>{cita.name}</h3>
            <p>Precio: ${cita.price}</p>
            {/* Asegúrate de incluir imágenes si es necesario */}
          </div>
        ))}
      </div>
      {showMessageBar && (
        <div className="message-bar-wrapper">
          <p>Cita añadida</p>
        </div>
      )}
    </div>
  );
};

export default CitasMedicas;
