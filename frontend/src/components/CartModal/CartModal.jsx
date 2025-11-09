import React, { useMemo, useState } from "react";
import "./CartModal.css";
import { createOrder } from "../../services/api"; // ← usa tu helper del front

const formatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const CartModal = ({ cartItems, onRemoveItem, onClose, onProceedToPayment }) => {
  const [creating, setCreating] = useState(false);

  // Totales derivados
  const { totalAmount, totalQuantity } = useMemo(() => {
    const tAmount = cartItems.reduce(
      (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
      0
    );
    const tQty = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
    return { totalAmount: tAmount, totalQuantity: tQty };
  }, [cartItems]);

  // Cierre al hacer clic fuera (más robusto)
  const handleOverlayClick = (e) => {
    if (e.currentTarget === e.target) onClose();
  };

  // Crear la orden en el backend y notificar al padre
  const handleProceedToPayment = async () => {
    if (!cartItems.length || creating) return;
    try {
      setCreating(true);

      // El backend espera items [{ product_id, quantity }]
      const items = cartItems.map((p) => ({
        product_id: Number(p.id),
        quantity: Number(p.quantity || 1),
      }));

      const { order_id, total } = await createOrder(items); // { order_id, total, status:'created' }
      // Guarda por si PaymentForm lo lee de localStorage
      localStorage.setItem("order_id", order_id);

      // Avanza al flujo de pago; pasamos datos útiles al padre
      if (typeof onProceedToPayment === "function") {
        onProceedToPayment({ orderId: order_id, total });
      }
    } catch (err) {
      alert("No se pudo crear la orden. Intenta de nuevo.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="cart-modal-overlay" onClick={handleOverlayClick}>
      <div className="cart-modal" role="dialog" aria-modal="true" aria-label="Carrito">
        <button className="close-modal" type="button" onClick={onClose} aria-label="Cerrar">
          &times;
        </button>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>Tu carrito está vacío</p>
            <button className="continue-shopping" type="button" onClick={onClose}>
              Seguir comprando
            </button>
          </div>
        ) : (
          <div>
            <h2>Tu Carrito</h2>

            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.imageProduct || item.imageUrl}
                  alt={item.title}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3>{item.title}</h3>
                  <p>Cantidad: {item.quantity}</p>
                  <p>Precio: {formatter.format((item.price || 0) * (item.quantity || 1))}</p>
                  <button
                    className="remove-item"
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    aria-label={`Eliminar ${item.title}`}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}

            <div className="cart-summary">
              <p>Total de productos: {totalQuantity}</p>
              <p>Total a pagar: {formatter.format(totalAmount)}</p>
            </div>

            <div className="cart-actions">
              <button className="continue-shopping" type="button" onClick={onClose}>
                Seguir comprando
              </button>

              <button
                className="checkout"
                type="button"
                onClick={handleProceedToPayment}
                disabled={creating}
                aria-busy={creating}
                aria-disabled={creating}
              >
                {creating ? "Creando orden..." : "Proceder al pago"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
