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
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

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

  const handleSearch = async (text) => {
    setSearchTerm(text);

    if (text.trim() === "") {
      setResults([]);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/products/search?name=${text}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
    }
  };

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

const handleResultClick = (productId) => {
  // 1. Ir a la sección de productos
  const productsSection = document.getElementById("productos");
  if (productsSection) {
    productsSection.scrollIntoView({ behavior: "smooth" });
  }

  // 2. Dar un pequeño tiempo para que el scroll baje
  setTimeout(() => {
    const card = document.querySelector(
      `[data-product-id="${productId}"]`
    );

    if (card) {
      // Centrar la card
      card.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      // Simular un click en la card para abrir el modal
      card.dispatchEvent(
        new MouseEvent("click", {
          view: window,
          bubbles: true,
          cancelable: true,
        })
      );

      // Limpiar el buscador y cerrar el dropdown
      setResults([]);
      setSearchTerm("");
    } else {
      console.warn("No se encontró card para productId:", productId);
    }
  }, 400);
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
            <input
              type="text"
              id="input"
              required
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <label htmlFor="input" className="search"></label>
            <div className="underline"></div>
            <button className="search-button">
              <i className="fas fa-search"></i>
            </button>

            {/* 🔽 Dropdown de resultados */}
            {results.length > 0 && (
              <div className="search-dropdown">
                {results.map((p) => (
                  <div
                    key={p.product_id}
                    className="dropdown-item"
                    onClick={() => handleResultClick(p.product_id)}
                  >
                    <img src={p.imageUrl} alt={p.title} />
                    <span>{p.title}</span>
                  </div>
                ))}
              </div>
            )}
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
