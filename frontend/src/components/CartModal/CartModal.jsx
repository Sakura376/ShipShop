import React, { useMemo, useState } from "react";
import "./CartModal.css";
import { createOrder } from "../../services/api";

const formatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const CartModal = ({ cartItems, onRemoveItem, onClose, onProceedToPayment }) => {
  const [creating, setCreating] = useState(false);

  const { totalAmount, totalQuantity } = useMemo(() => {
    const tAmount = cartItems.reduce(
      (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
      0
    );
    const tQty = cartItems.reduce(
      (acc, item) => acc + (item.quantity || 1),
      0
    );
    return { totalAmount: tAmount, totalQuantity: tQty };
  }, [cartItems]);

  const handleOverlayClick = (e) => {
    if (e.currentTarget === e.target) onClose();
  };

const handleProceedToPayment = async () => {
  if (!cartItems.length || creating) return;

  const token = localStorage.getItem("token");
  console.log("token:", token);

  if (!token) {
    alert("Debes iniciar sesión para completar la compra.");
    return;
  }

  const items = cartItems
    .map((item) => {
      const product_id = Number(item.id || item.product_id);
      const quantity = Number(item.quantity || 1);

      if (!product_id || Number.isNaN(product_id)) return null;
      if (!quantity || Number.isNaN(quantity) || quantity < 1) return null;

      return { product_id, quantity };
    })
    .filter(Boolean);

  console.log("Cart items raw:", cartItems);
  console.log("Payload /orders items:", items);

  if (!items.length) {
    alert("El carrito no es válido. Vuelve a agregar los productos.");
    return;
  }

  try {
    setCreating(true);

    const { order_id, total, status } = await createOrder(items);

    localStorage.setItem("order_id", order_id);
    localStorage.setItem("order_total", total);

    if (typeof onProceedToPayment === "function") {
      onProceedToPayment({ orderId: order_id, total, status });
    }
  } catch (err) {
    const data = err?.response?.data;
    console.error("Error creando orden:", data || err.message);

    // Si el backend manda detalles de validation, los mostramos en consola
    if (data?.validation) {
      console.error(
        "Detalle validación /orders:",
        JSON.stringify(data.validation, null, 2)
      );
    }

    const msg = data?.error || data?.message;

    if (msg === "Producto no disponible") {
      alert(
        "Uno de los productos del carrito ya no está disponible o no coincide el ID. " +
          "Actualiza la página y vuelve a agregarlo."
      );
    } else {
      alert(msg || "Bad Request");
    }
  } finally {
    setCreating(false);
  }
};



  return (
    <div className="cart-modal-overlay" onClick={handleOverlayClick}>
      <div
        className="cart-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Carrito"
      >
        <button
          className="close-modal"
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
        >
          &times;
        </button>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>Tu carrito está vacío</p>
            <button
              className="continue-shopping"
              type="button"
              onClick={onClose}
            >
              Seguir comprando
            </button>
          </div>
        ) : (
          <div>
            <h2>Tu Carrito</h2>

            {cartItems.map((item) => (
              <div key={item.id || item.product_id} className="cart-item">
                <img
                  src={item.imageProduct || item.imageUrl}
                  alt={item.title}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3>{item.title}</h3>
                  <p>Cantidad: {item.quantity}</p>
                  <p>
                    Precio:{" "}
                    {formatter.format(
                      (item.price || 0) * (item.quantity || 1)
                    )}
                  </p>
                  <button
                    className="remove-item"
                    type="button"
                    onClick={() =>
                      onRemoveItem(item.id || item.product_id)
                    }
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
              <button
                className="continue-shopping"
                type="button"
                onClick={onClose}
              >
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
