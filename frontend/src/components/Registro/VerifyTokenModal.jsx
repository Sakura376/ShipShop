import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../../config";
import "./VerifyTokenModal.css";

const VerifyTokenModal = ({ email, onClose }) => {   // 👈 ya no necesitamos onVerified
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(`${API_URL}/users/verify`, { email, code });

      setSuccess(res.data?.message || "Cuenta verificada correctamente ✅");

      const { token, user } = res.data || {};

      if (token) {
        localStorage.setItem("token", token);
      }
      if (user?.id) {
        localStorage.setItem("userId", user.id);
      }

      // ⬇️ AQUÍ la magia: redirección dura a tu front
      setTimeout(() => {
        window.location.href = "http://localhost:5173/";
      }, 800);

    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Código inválido o expirado.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vtm-overlay">
      <div className="vtm-modal">
        <button className="vtm-close" onClick={onClose}>
          ✕
        </button>
        <h2>Verifica tu correo</h2>
        <p>
          Hemos enviado un código de verificación a: <b>{email}</b>
        </p>
        <p>Ingresa el código para activar tu cuenta.</p>

        <form onSubmit={handleSubmit} className="vtm-form">
          <input
            type="text"
            placeholder="Código de verificación"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          {error && <div className="vtm-error">{error}</div>}
          {success && <div className="vtm-success">{success}</div>}
          <button type="submit" disabled={loading}>
            {loading ? "Verificando..." : "Verificar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyTokenModal;
