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
import VerifyTokenModal from "./VerifyTokenModal";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const [showVerify, setShowVerify] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();

    // Validaciones personalizadas
    if (!username || !cleanEmail || !password || !confirmPassword) {
      setError("Completa todos los campos.");
      return;
    }

    // Validación de correo @gmail.com
    const regexGmail = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!regexGmail.test(cleanEmail)) {
      setError("Ingresa un correo @gmail.com válido.");
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
      await axios.post(`${API_URL}/users/register`, {
        username,
        email: cleanEmail,
        password,
      });

      setRegisteredEmail(cleanEmail);
      setShowVerify(true);
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

  const handleVerified = () => {
    navigate("/");
  };

  return (
    <>
      <form onSubmit={handleRegister} className="register-form">
        <button type="button" className="back-button" onClick={handleBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>

        <h2 className="r-title">Register</h2>

        <div className="input-register">
          <label className="label" htmlFor="username">Username:</label>
          <FontAwesomeIcon icon={faUser} className="input-icon" />
          <input
            className="input"
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="input-register">
          <label className="label" htmlFor="email">Email:</label>
          <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
          <input
            className="input"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-register">
          <label className="label" htmlFor="password">Password:</label>
          <FontAwesomeIcon icon={faLock} className="input-icon" />
          <input
            className="input"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="input-register">
          <label className="label" htmlFor="confirmPassword">Confirm Password:</label>
          <FontAwesomeIcon icon={faLock} className="input-icon" />
          <input
            className="input"
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {/* Mensaje de error debajo del formulario */}
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
