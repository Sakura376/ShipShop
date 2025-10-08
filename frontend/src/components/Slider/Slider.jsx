import React, { useState, useEffect } from "react";
import styles from "./Slider.module.css";

function Slider({ imagenes }) {
  const [imagenActual, setImagenActual] = useState(0);
  const length = imagenes.length;

  // Cambiar a la siguiente imagen automáticamente cada 10 segundos
  useEffect(() => {
    const autoSlide = setInterval(() => {
      setImagenActual((prev) => (prev === length - 1 ? 0 : prev + 1));
    }, 10000); // Cambiar cada 10 segundos

    return () => clearInterval(autoSlide); // Limpiar el intervalo al desmontar
  }, [length]);

  const siguienteImagen = () => {
    setImagenActual((prev) => (prev === length - 1 ? 0 : prev + 1));
  };

  const anteriorImagen = () => {
    setImagenActual((prev) => (prev === 0 ? length - 1 : prev - 1));
  };


  return (
    <section id="informacion" className={styles["slider-container"]}>
      <button onClick={anteriorImagen} className={styles["slider-button"]}>
        {"<"}
      </button>

      {imagenes.map((imagen, index) => (
        <div
          key={imagen.id}
          className={`${styles["slider-slide"]} ${
            imagenActual === index ? styles["slider-active"] : ""
          }`}
        >
          {imagenActual === index && (
            <>
              <img
                src={imagen.imageInfo}
                alt={imagen.title}
                className={styles["slider-img"]}
              />
              <div className={styles["slider-text"]}>
                <h3>{imagen.title}</h3>
                <p className="i-description">{imagen.descriptionInfo}</p>
              </div>
            </>
          )}
        </div>
      ))}

      <button onClick={siguienteImagen} className={styles["slider-button"]}>
        {">"}
      </button>

      <div className={styles["slider-indicators"]}>
        {imagenes.map((_, index) => (
          <span
            key={index}
            className={
              imagenActual === index
                ? styles["slider-dot-active"]
                : styles["slider-dot"]
            }
            onClick={() => setImagenActual(index)}
          ></span>
        ))}
      </div>
    </section>
  );
}

export default Slider;
