import React, { useState } from "react";
import axios from "axios";
import "./PaymentForm.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard, faCalendarAlt, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import { API_URL } from "../../config"; // Asegúrate de tener la URL base configurada

const PaymentForm = ({ onClose, onConfirmPayment, totalAmount }) => {
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: ""
  });
  const [error, setError] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que todos los campos estén llenos
    if (!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardholderName) {
      setError("Por favor, complete todos los campos.");
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      // Enviar datos de la orden a la API
      await axios.post(
        `${API_URL}/orderFinal/create`,
        {
          user_id: userId,
          total:totalAmount
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      // Mostrar mensaje de confirmación y vaciar el carrito
      setConfirmationMessage("¡Compra confirmada!");
      setError("");
      onConfirmPayment(); // Llama a la función para vaciar el carrito

      // Limpia el formulario y cierra el modal después de un breve retraso
      setTimeout(() => {
        setConfirmationMessage("");
        setFormData({
          cardNumber: "",
          expiryDate: "",
          cvv: "",
          cardholderName: ""
        });
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error al confirmar el pago:", error.response?.data || error.message);
      setError("Error al procesar el pago.");
    }
  };

  return (
    <div className='payment-form-overlay' onClick={(e) => {
      if (e.target.className === "payment-form-overlay") {
        onClose();
      }
    }}>
      <div className='payment-form'>
        <form className='f-payment' onSubmit={handleSubmit}>
          <div className="input-payment">
            <FontAwesomeIcon icon={faCreditCard} className="input-icon" />
            <input
              className="i-payment"
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              placeholder="Número de tarjeta"
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
              placeholder="Fecha de vencimiento"
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
            />
          </div>

          {error && <p className="error-message">{error}</p>}
          {confirmationMessage && <p className="confirmation-message">{confirmationMessage}</p>}
          <button className="p-button" type="submit">Confirmar Pago</button>
        </form>
        <button className="close-btn" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default PaymentForm;
