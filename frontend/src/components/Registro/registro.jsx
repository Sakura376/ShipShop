import React, { useState } from "react";
import "./registro.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faLock,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config";
import VerifyTokenModal from "./VerifyTokenModal"; // ⬅️ nuevo import

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const [showVerify, setShowVerify] = useState(false);      // ⬅️ controla el modal
  const [registeredEmail, setRegisteredEmail] = useState(""); // ⬅️ email al que se envió el código

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Validaciones básicas
    if (!username || !email || !password || !confirmPassword) {
      setError("Completa todos los campos.");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      // Tu endpoint actual de registro
      await axios.post(`${API_URL}/users/register`, {
        username,
        email,
        password,
      });

      // Si el backend creó el pending user y envió el código:
      setRegisteredEmail(email);
      setShowVerify(true); // abrimos el modal para ingresar el token
    } catch (err) {
      const s = err?.response?.status;
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Datos inválidos. Revisa el formulario.";
      if (s === 409) setError("Ese correo ya está registrado.");
      else setError(msg);

      console.error("Registro fallido:", err?.response?.data || err?.message);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  // Cuando el backend confirma el código correctamente:
  const handleVerified = () => {
    // ya está logueado, mándalo a la home o donde muestres sesión iniciada
    navigate("/"); // o "/home" según tus rutas reales
  };


  return (
    <>
      <form onSubmit={handleRegister} className="register-form">
        <button
          type="button"
          className="back-button"
          onClick={handleBack}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>

        <h2 className="r-title">Register</h2>

        <div className="input-register">
          <label className="label" htmlFor="username">
            Username:
          </label>
          <FontAwesomeIcon icon={faUser} className="input-icon" />
          <input
            className="input"
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="input-register">
          <label className="label" htmlFor="email">
            Email:
          </label>
          <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
          <input
            className="input"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-register">
          <label className="label" htmlFor="password">
            Password:
          </label>
          <FontAwesomeIcon icon={faLock} className="input-icon" />
          <input
            className="input"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="input-register">
          <label className="label" htmlFor="confirmPassword">
            Confirm Password:
          </label>
          <FontAwesomeIcon icon={faLock} className="input-icon" />
          <input
            className="input"
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {error && <div className="error-msg">{error}</div>}

        <button className="reg-button" type="submit">
          Register
        </button>
      </form>

      {showVerify && (
        <VerifyTokenModal
          email={registeredEmail}
          onClose={() => setShowVerify(false)}
          onVerified={handleVerified}
        />
      )}
    </>
  );
}

export default Register;
