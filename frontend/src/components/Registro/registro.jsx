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
function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
  e.preventDefault();

  // Validación mínima en cliente
  if (!username || !email || !password) {
    alert("Completa todos los campos.");
    return;
  }
  if (password.length < 8) {
    alert("La contraseña debe tener al menos 8 caracteres.");
    return;
  }
  if (password !== confirmPassword) {
    alert("Las contraseñas no coinciden.");
    return;
  }

  try {
    // OJO: API_URL debe ser http://localhost:3001/api (sin /api duplicado)
    await axios.post(`${API_URL}/users/register`, {
      username,          // ← el backend exige 'username'
      email,
      password,
    });

    alert("¡Registro iniciado! Revisa tu correo para el código (OTP).");
    // Si tienes pantalla de verificación:
    // navigate("/verify", { state: { email } });
  } catch (err) {
    const s = err?.response?.status;
    const msg = err?.response?.data?.error || "Datos inválidos. Revisa el formulario.";
    if (s === 409) alert("Ese correo ya está registrado.");
    else alert(msg);
    console.error("Registro fallido:", err?.response?.data || err?.message);
  }
};


  const handleBack = () => {
    navigate("/"); // Navega de vuelta al inicio
  };

  return (
    <form onSubmit={handleRegister} className='register-form'>
      <button type='button' className='back-button' onClick={handleBack}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <h2 className='r-title'>Register</h2>

      <div className='input-register'>
        <label className='label' htmlFor='username'>
          Username:
        </label>
        <FontAwesomeIcon icon={faUser} className='input-icon' />
        <input
          className='input'
          type='text'
          id='username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className='input-register'>
        <label className='label' htmlFor='email'>
          Email:
        </label>
        <FontAwesomeIcon icon={faEnvelope} className='input-icon' />
        <input
          className='input'
          type='email'
          id='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className='input-register'>
        <label className='label' htmlFor='password'>
          Password:
        </label>
        <FontAwesomeIcon icon={faLock} className='input-icon' />
        <input
          className='input'
          type='password'
          id='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className='input-register'>
        <label className='label' htmlFor='confirmPassword'>
          Confirm Password:
        </label>
        <FontAwesomeIcon icon={faLock} className='input-icon' />
        <input
          className='input'
          type='password'
          id='confirmPassword'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <button className='reg-button' type='submit'>
        Register
      </button>
    </form>
  );
}

export default Register;
