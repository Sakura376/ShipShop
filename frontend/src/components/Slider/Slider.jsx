import React, { useState, useEffect } from "react";
import styles from "./Slider.module.css";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80&auto=format&fit=crop";

function Slider({ imagenes = [] }) {
  const length = imagenes.length;
  const [imagenActual, setImagenActual] = useState(0);

  // Evita intervalos si no hay suficientes imágenes
  useEffect(() => {
    if (length < 2) return;
    const autoSlide = setInterval(() => {
      setImagenActual((prev) => (prev === length - 1 ? 0 : prev + 1));
    }, 10000);
    return () => clearInterval(autoSlide);
  }, [length]);

  const siguienteImagen = () =>
    setImagenActual((prev) => (prev === length - 1 ? 0 : prev + 1));
  const anteriorImagen = () =>
    setImagenActual((prev) => (prev === 0 ? length - 1 : prev - 1));

  if (!length) {
    return (
      <section id="informacion" className={styles["slider-container"]}>
        <div className={styles["slider-slide"]}>
          <img
            src={FALLBACK_IMG}
            alt="Sin imágenes disponibles"
            className={styles["slider-img"]}
          />
          <div className={styles["slider-text"]}>
            <h3>Cargando contenido</h3>
            <p className="i-description">Pronto verás nuestras naves destacadas.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="informacion" className={styles["slider-container"]}>
      <button onClick={anteriorImagen} className={styles["slider-button"]} aria-label="Anterior">
        {"<"}
      </button>

      {imagenes.map((imagen, index) => {
        // ✅ key robusta: usa id si existe, si no combina con index
        const key = `${imagen?.id ?? "noid"}-${index}`;
        const src = imagen?.imageInfo || imagen?.image || FALLBACK_IMG;
        const title = imagen?.title || "Producto";
        const desc = imagen?.descriptionInfo || imagen?.description || "";

        return (
          <div
            key={key}
            className={`${styles["slider-slide"]} ${
              imagenActual === index ? styles["slider-active"] : ""
            }`}
          >
            {imagenActual === index && (
              <>
                <img src={src} alt={title} className={styles["slider-img"]} />
                <div className={styles["slider-text"]}>
                  <h3>{title}</h3>
                  <p className="i-description">{desc}</p>
                </div>
              </>
            )}
          </div>
        );
      })}

      <button onClick={siguienteImagen} className={styles["slider-button"]} aria-label="Siguiente">
        {">"}
      </button>

      <div className={styles["slider-indicators"]}>
        {imagenes.map((_, index) => (
          // Aquí está bien usar index porque es un indicador ligado a posición
          <span
            key={`dot-${index}`}
            className={
              imagenActual === index
                ? styles["slider-dot-active"]
                : styles["slider-dot"]
            }
            onClick={() => setImagenActual(index)}
          />
        ))}
      </div>
    </section>
  );
}

export default Slider;
