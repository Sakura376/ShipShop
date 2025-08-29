import React, { useState } from 'react';
import './registro.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { API_URL } from '../../config';
function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
    
        if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden");
        return;
        }
    
        try {
        const response = await axios.post(`${API_URL}/users`, {
            username,
            email,
            password
        });
    
        if (response.status === 201) {
            alert("¡Registro exitoso!");
            navigate("/"); // Redirigir después del registro
        }
        } catch (error) {
        console.error("Error al registrar el usuario:", error);
        alert("Hubo un problema al registrar el usuario");
        }
    };

    const handleBack = () => {
        navigate("/"); // Navega de vuelta al inicio
    };

    return (
        <form onSubmit={handleRegister} className="register-form">
            <button type="button" className="back-button" onClick={handleBack}>
                <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <h2 className='r-title'>Register</h2>

            <div className="input-register">
                <label className='label' htmlFor="username">Username:</label>
                <FontAwesomeIcon icon={faUser} className="input-icon" />
                <input className='input'
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>

            <div className="input-register">
                <label className='label' htmlFor="email">Email:</label>
                <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                <input className='input'
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div className="input-register">
                <label className='label' htmlFor="password">Password:</label>
                <FontAwesomeIcon icon={faLock} className="input-icon" />
                <input className='input'
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <div className="input-register">
                <label className='label' htmlFor="confirmPassword">Confirm Password:</label>
                <FontAwesomeIcon icon={faLock} className="input-icon" />
                <input className='input'
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </div>

            <button className='reg-button' type="submit">Register</button>
        </form>
    );
}

export default Register;
