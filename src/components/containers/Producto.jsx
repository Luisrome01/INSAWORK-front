import React from "react";
import "./css/producto.css";

const Producto = ({ name, price, img, handleClick }) => {
	const [isClicked, setIsClicked] = React.useState(false);

	const handleCardClick = () => {
		setIsClicked(true);
		setTimeout(() => {
			setIsClicked(false);
		}, 100);
		handleClick();
	};

	const cardClassName = `card ${isClicked ? "clicked" : ""}`;

	return (
		<div className={cardClassName} onClick={handleCardClick}>
			<div className="img-card">
				<img src={img} className="imgProduct" />
			</div>
			<div className="add-cart">Agregar al carrito</div>
			<div className="info-card">
				<div>
					<p>
						<strong>{name}</strong>
					</p>
					<p>Price : {price}$</p>
				</div>
			</div>
		</div>
	);
};

export default Producto;
