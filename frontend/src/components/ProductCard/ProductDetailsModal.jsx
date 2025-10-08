import React from 'react';
import ReactDOM from 'react-dom';
import './ProductDetailsModal.css';

const ProductDetailsModal = ({ product, onClose, onAddToCart, selectedRating }) => {
  const { title, imageProduct, price, caracteristics } = product;

  // Función para detectar clic fuera del contenido del modal
  const handleOverlayClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      onClose();
    }
  };

  // Renderizamos el modal dentro del portal (fuera del carrusel)
  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="close-modal" onClick={onClose}>
          &times;
        </button>
        <img src={imageProduct} alt={title} className="product-image" />
        <h2>{title}</h2>
        <p><strong>Precio:</strong>{parseFloat(price).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
        {selectedRating && (
          <p><strong>Calificación seleccionada:</strong> {selectedRating} estrellas</p>
        )}
        <button onClick={() => onAddToCart(product)} className="add-to-cart">
          Añadir al carrito
        </button>
      </div>
    </div>,
    document.body // Aquí renderizamos el modal en el <body> del HTML
  );
};

export default ProductDetailsModal;
