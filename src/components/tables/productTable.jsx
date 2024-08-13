import React from "react";
import PropTypes from 'prop-types'; // Importar PropTypes para la validación de props
import "./css/productTable.css";
import trashbinSVG from "../../assets/trashbin.svg";
import exploreSVG from "../../assets/explore.svg";

const ProductTable = ({
  width = "90%",
  height = "85%",
  color = "#ffffff",
  rows = [], // Valor predeterminado como array vacío
  eliminarProducto
}) => {
  const style = {
    width: width,
    height: height,
    backgroundColor: color,
  };

  return (
    <div style={style} className="ProductTableContainer">
      <div className="ProductTableWrapper">
        <div className="ProductTableHeader">
          <p></p>
          <p style={{ justifySelf: "left" }}>Código del producto</p>
          <p>Descripción</p>
          <p>Cantidad</p>
          <p>Precio/Unidad</p>
          <p>IVA</p>
          <p>Total</p>
          <p></p>
        </div>
        <div className="ProductTableBody">
          {rows.length > 0 ? (
            rows.map((fila, index) => (
              <div key={index} className="ProductTableRow">
                <button
                  onClick={() => eliminarProducto(fila.codigo)}
                  style={{ justifySelf: "center", border: "none", backgroundColor: "transparent" }}
                >
                  <img src={trashbinSVG} alt="Eliminar" />
                </button>
                <p style={{ justifySelf: "left" }}>{fila.codigo}</p>
                <p>{fila.descripcion}</p>
                <p>{fila.cantidad}</p>
                <p>$ {fila.precio}</p>
                <p>$ {fila.iva}</p>
                <p>$ {fila.total.toFixed(2)}</p>
                <p></p>
              </div>
            ))
          ) : (
            <p>No hay productos disponibles</p>
          )}
        </div>
      </div>
    </div>
  );
};

ProductTable.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  color: PropTypes.string,
  rows: PropTypes.array,
  eliminarProducto: PropTypes.func.isRequired,
};

export default ProductTable;
