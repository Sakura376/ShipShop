/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "./Header.css";
import { useCart } from "../CartModal/CartGlobal";
import Login from "../Login/login";
import { API_URL } from "../../config";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount, toggleCart } = useCart();
  const [activeModal, setActiveModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRatings, setUserRatings] = useState([]); // por ahora opcional/no usado

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserName = localStorage.getItem("userName");
    const storedUser = localStorage.getItem("user");

    if (!token) return;

    let finalName = storedUserName;

    if (!finalName && storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        finalName = parsed.username || parsed.name || "";
        const id = parsed.id || parsed.user_id;

        if (finalName) {
          localStorage.setItem("userName", finalName);
        }
        if (id) {
          localStorage.setItem("userId", id);
        }
      } catch (e) {
        console.error("No se pudo parsear localStorage.user:", e);
      }
    }

    if (finalName) {
      setIsAuthenticated(true);
      setUserName(finalName);
      // loadUserRatings(); // solo si algún día creas /ratings/user/:id
    }
  }, []);

  // De momento esta función apunta a un endpoint inexistente, así que mejor dejarla comentada
  // const loadUserRatings = async () => {
  //   const userId = localStorage.getItem("userId");
  //   const token = localStorage.getItem("token");
  //   if (!userId || !token) return;
  //   try {
  //     const response = await fetch(`${API_URL}/ratings/user/${userId}`, {
  //       method: "GET",
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     const data = await response.json();
  //     setUserRatings(data);
  //   } catch (error) {
  //     console.error("Error al cargar las calificaciones del usuario:", error);
  //   }
  // };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleModal = () => {
    setActiveModal(!activeModal);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");

    setIsAuthenticated(false);
    setUserName("");
    setUserRatings([]);

    window.location.reload();
  };

  const handleLoginSuccess = (username) => {
    if (username) {
      localStorage.setItem("userName", username);
      setUserName(username);
    }
    setIsAuthenticated(true);
    setActiveModal(false);
    // loadUserRatings();
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
        <Login
          closeModal={handleModal}
          statusModal={activeModal}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
};

export default Header;
