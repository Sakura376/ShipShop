import React from 'react';
import './Footer.css'; // Importa el archivo CSS para los estilos

const Footer = () => {
  return (
    <footer id='acerca-de' className="footer">
      <div className="footer-content">
        <div className="about-us">
          <h3>Acerca de Nosotros</h3>
          <p>
            Somos una empresa dedicada a la innovación en tecnología aeroespacial, 
            proporcionando soluciones avanzadas para la exploración espacial y más.
          </p>
        </div>

        <div className="social-media">
          <h3>Síguenos en:</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>

        <div className="additional-links">
          <h3>Enlaces</h3>
          <ul>
            <li><a href="#contacto">Contacto</a></li>
            <li><a href="#privacidad">Política de Privacidad</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 Space Explorers | Todos los derechos reservados</p>
      </div>
    </footer>
  );
};

export default Footer;
