import React, { useState, useEffect } from "react";
import BtnGeneral from "../buttons/BtnGeneral";
import BuscarProductoTable from "../tables/buscarProductoTable";
import InputBusqueda from "../inputs/InputBusqueda";
import productosData from "../../json/productos.json";
import "./css/ModalBuscar.css";

const ModalBuscar = ({ closeModal, agregarProducto }) => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const formattedData = Object.keys(productosData).map((id) => ({
            id: id,
            ...productosData[id],
        }));
        setData(formattedData);
        setFilteredData(formattedData);
    }, []);

    useEffect(() => {
        const results = data.filter(producto =>
            producto.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredData(results);
    }, [searchTerm, data]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className="modalBuscarContainer">
            <div className="modalBuscarBackgroundBlur"></div>
            <div className="modalBuscarContent">
                <div className="modalHeader">
                    <div className="spacer"></div>
                    <BtnGeneral
                        gap="0"
                        text="X"
                        width="40px"
                        height="40px"
                        color="#FF6060"
                        bgColor="#FF0000"
                        handleClick={() => {
                            closeModal(false);
                        }}
                    />
                </div>
                <div className="modalBody">
                    <div className="modalBodyContainer">
                        <div className="modalSearchContainer">
                            <p className="searchTitle">Nombre del producto:</p>
                            <InputBusqueda
                                width="250px"
                                height="40px"
                                color="#D9D9D9"
                                placeholder="Buscar producto"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                        <BuscarProductoTable
                            width="90%"
                            height="85%"
                            rows={filteredData}
                            agregarProducto={agregarProducto}
                            closeModal={closeModal}
                        />
                        <div className="spacer"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalBuscar;
