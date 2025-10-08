import React from "react";
import "./CartModal.css"; // Puedes crear este archivo para los estilos del modal

const CartModal = ({ cartItems, onRemoveItem, onClose, onProceedToPayment  }) => {
  // Calcula el total del precio y la cantidad total de productos
  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Función para detectar clic fuera del contenido del modal
  const handleOverlayClick = (e) => {
    if (e.target.className === "cart-modal-overlay") {
      onClose();
    }
  };

  return (
    <div className='cart-modal-overlay' onClick={handleOverlayClick}>
      <div className='cart-modal'>
        <button className='close-modal' onClick={onClose}>
          &times; {/* Botón para cerrar el modal */}
        </button>

        {/* Si no hay productos en el carrito */}
        {cartItems.length === 0 ? (
          <div className='empty-cart'>
            <p>Tu carrito está vacío</p>
            <button className='continue-shopping' onClick={onClose}>
              Seguir comprando
            </button>
          </div>
        ) : (
          <div>
            <h2>Tu Carrito</h2>
            {/* Lista de productos en el carrito */}
            {cartItems.map((item) => (
              <div key={item.id} className='cart-item'>
                <img
                  src={item.imageProduct}
                  alt={item.title}
                  className='cart-item-image'
                />
                <div className='cart-item-details'>
                  <h3>{item.title}</h3>
                  <p>Cantidad: {item.quantity}</p>
                  <p>Precio: ${(item.price * item.quantity).toFixed(2)}</p>
                  <button
                    className='remove-item'
                    onClick={() => onRemoveItem(item.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}

            {/* Resumen del carrito */}
            <div className='cart-summary'>
              <p>Total de productos: {totalQuantity}</p>
              <p>Total a pagar: ${totalAmount.toFixed(2)}</p>
            </div>

            {/* Botones de acción */}
            <div className='cart-actions'>
              <button className='continue-shopping' onClick={onClose}>
                Seguir comprando
              </button>
              <button className='checkout' onClick={onProceedToPayment}>Proceder al pago</button>
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
