/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "./Header.css";
import { useCart } from "../CartModal/CartGlobal";
import Login from "../Login/login";
import { API_URL } from "../../config"; // Asegúrate de que está configurada la URL de la API

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount, toggleCart } = useCart();
  const [activeModal, setActiveModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRatings, setUserRatings] = useState([]); // Estado para calificaciones del usuario

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) {
      setIsAuthenticated(true);
      setUserName(storedUserName);
      loadUserRatings(); // Cargar calificaciones si el usuario ya está autenticado
    }
  }, []);

  // Función para cargar las calificaciones del usuario desde el backend
  const loadUserRatings = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) return;

    try {
      const response = await fetch(`${API_URL}/ratings/ratings/user/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUserRatings(data); // Guardamos las calificaciones en el estado
    } catch (error) {
      console.error("Error al cargar las calificaciones del usuario:", error);
    }
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleModal = () => {
    setActiveModal(!activeModal);
  };

  const handleLogout = () => {
    // Elimina la información de autenticación y calificaciones del almacenamiento local
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");

    // Reinicia el estado de autenticación y el nombre de usuario
    setIsAuthenticated(false);
    setUserName("");
    setUserRatings([]); // Limpia las calificaciones al cerrar sesión

    // Recargar la página
    window.location.reload();
  };

  const handleLoginSuccess = (username) => {
    setIsAuthenticated(true);
    setUserName(username);
    setActiveModal(false);
    loadUserRatings(); // Cargar las calificaciones después de iniciar sesión
  };

  return (
    <>
      <nav id="navbar">
        <div className="nav-content">
          <div className="hamburger" onClick={toggleMenu}>
            <i className="fas fa-bars"></i>
          </div>
          <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
            <li><a href="#home" onClick={toggleMenu}>Inicio</a></li>
            <li><a href="#productos" onClick={toggleMenu}>Productos</a></li>
            <li><a href="#informacion" onClick={toggleMenu}>Información</a></li>
            <li><a href="#acerca-de" onClick={toggleMenu}>Acerca de Nosotros</a></li>
          </ul>

          <div className="input-container">
            <input type="text" id="input" required />
            <label htmlFor="input" className="search">Search</label>
            <div className="underline"></div>
            <button className="search-button">
              <i className="fas fa-search"></i>
            </button>
          </div>

          <div className="shopping-cart">
            <button className="cart-container" onClick={toggleCart}>
              <i className="fas fa-shopping-cart"></i>
              <span className="cart-count">{cartCount}</span>
            </button>

            {isAuthenticated ? (
              <div className="user-menu">
                <button className="log-button">
                  <i className="fas fa-user"></i>
                  <span className="log-cta">{userName}</span>
                </button>
                <div className="submenu">
                  <button className="logout-button" onClick={handleLogout}>
                    Cerrar sesión
                  </button>
                </div>
              </div>
            ) : (
              <button className="log-button" onClick={handleModal}>
                <i className="fas fa-user"></i>
                <span className="log-cta">Iniciar Sesión</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      <section id="home" className="intro">
        <h1>ShipShop</h1>
        <h2>“Viaja Más Allá con Nuestros Modelos de Naves Espaciales”</h2>
      </section>

      {activeModal && (
        <Login closeModal={handleModal} statusModal={activeModal} onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  );
};

export default Header;
