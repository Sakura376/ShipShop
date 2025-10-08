import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { API_URL } from "../../config";
import "./login.css";

function Login({ closeModal, statusModal, onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/users/login`, {
        email: username,
        password: password
      });

      if (response.status === 200) {
        alert("Inicio de sesión exitoso");
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userName", response.data.username); // Guardamos el nombre de usuario desde la respuesta
        localStorage.setItem("userId", response.data.userId); // Guardamos el user_id desde la respuesta
        onLoginSuccess(response.data.username); // Llamamos a la función de éxito del login
        closeModal();
        navigate("/");
      }
    } catch (error) {
      console.error("Error en el inicio de sesión:", error);
      alert("Correo o contraseña incorrectos");
    }
  };

  const handleRegister = () => {
    navigate("/registro");
    closeModal();
  };

  return (
    <div className={`log-modal ${statusModal && "active"}`}>
      <button onClick={closeModal} className="close-modal">&times;</button>
      <form className="log-form" onSubmit={handleLogin}>
        <div className="input-user">
          <label className="log-lbl" htmlFor="username">Email:</label>
          <FontAwesomeIcon icon={faUser} className="input-icon" />
          <input
            className="log-input"
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="input-user">
          <label className="log-lbl" htmlFor="password">Password:</label>
          <FontAwesomeIcon icon={faLock} className="input-icon" />
          <input
            className="log-input"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="submit-btn" type="submit">Login</button>
        <button className="register-btn" type="button" onClick={handleRegister}>Register</button>
      </form>
    </div>
  );
}

Login.propTypes = {
  closeModal: PropTypes.func.isRequired,
  statusModal: PropTypes.bool.isRequired,
  onLoginSuccess: PropTypes.func.isRequired // Validamos que onLoginSuccess esté definido
};

export default Login;