import React, { useState } from "react";
import axios from "axios";
import "./PaymentForm.css";
import { v4 as uuid } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard, faCalendarAlt, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import { API_URL } from "../../config"; // o toma de services/api si prefieres

// Props:
// - onClose(): cierra el modal
// - onConfirmPayment(): callback para vaciar carrito / finalizar
// - totalAmount: número mostrado en UI
// - orderId: (opcional) si no llega, se toma de localStorage('order_id')
const PaymentForm = ({ onClose, onConfirmPayment, totalAmount, orderId: orderIdProp }) => {
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: ""
  });
  const [error, setError] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // (Opcional) Validación de campos de tarjeta solo para UI. El backend NO usa estos datos.
    if (!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardholderName) {
      setError("Por favor, complete todos los campos.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const token = localStorage.getItem("token");
      const orderId = Number(orderIdProp ?? localStorage.getItem("order_id"));
      if (!orderId) {
        setError("No se encontró la orden. Vuelve al carrito e intenta de nuevo.");
        setSubmitting(false);
        return;
      }

      await axios.post(
        `${API_URL}/api/payments`,
        { order_id: orderId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Idempotency-Key": uuid(), // ← requerido por tu backend
          },
        }
      );

      setConfirmationMessage("¡Compra confirmada!");
      onConfirmPayment?.(); // limpia carrito en el padre si aplica

      setTimeout(() => {
        setConfirmationMessage("");
        setFormData({ cardNumber: "", expiryDate: "", cvv: "", cardholderName: "" });
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Error al confirmar el pago:", err?.response?.data || err?.message);
      const status = err?.response?.status;
      if (status === 409) setError("La orden no puede pagarse o la solicitud fue duplicada.");
      else setError("Error al procesar el pago. Intenta nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOverlayClick = (e) => {
    // Cierre robusto por click fuera
    if (e.currentTarget === e.target) onClose();
  };

  return (
    <div className="payment-form-overlay" onClick={handleOverlayClick}>
      <div className="payment-form" role="dialog" aria-modal="true" aria-label="Pago">
        <form className="f-payment" onSubmit={handleSubmit}>
          <div className="input-payment">
            <FontAwesomeIcon icon={faCreditCard} className="input-icon" />
            <input
              className="i-payment"
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              placeholder="Número de tarjeta"
              autoComplete="cc-number"
            />
          </div>

          <div className="input-payment">
            <FontAwesomeIcon icon={faCalendarAlt} className="input-icon" />
            <input
              className="i-payment"
              type="text"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              placeholder="Fecha de vencimiento (MM/AA)"
              autoComplete="cc-exp"
            />
          </div>

          <div className="input-payment">
            <FontAwesomeIcon icon={faLock} className="input-icon" />
            <input
              className="i-payment"
              type="text"
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              placeholder="CVV"
              autoComplete="cc-csc"
            />
          </div>

          <div className="input-payment">
            <FontAwesomeIcon icon={faUser} className="input-icon" />
            <input
              className="i-payment"
              type="text"
              name="cardholderName"
              value={formData.cardholderName}
              onChange={handleChange}
              placeholder="Nombre del titular"
              autoComplete="cc-name"
            />
          </div>

          {totalAmount != null && (
            <p className="total-pay">Total: ${Number(totalAmount).toFixed(2)}</p>
          )}

          {error && <p className="error-message">{error}</p>}
          {confirmationMessage && <p className="confirmation-message">{confirmationMessage}</p>}

          <button className="p-button" type="submit" disabled={submitting} aria-busy={submitting}>
            {submitting ? "Procesando..." : "Confirmar Pago"}
          </button>
        </form>

        <button className="close-btn" type="button" onClick={onClose} aria-label="Cerrar">
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default PaymentForm;
