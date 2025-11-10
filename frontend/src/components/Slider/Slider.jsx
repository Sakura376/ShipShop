import React, { useEffect, useMemo, useState } from "react";
import styles from "./Slider.module.css";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80&auto=format&fit=crop";

function Slider({ imagenes = [] }) {
  // Normaliza lo que venga: imageInfo / image_info / imageUrl / image_product, etc.
  const items = useMemo(
    () =>
      (Array.isArray(imagenes) ? imagenes : []).map((it, i) => {
        const id =
          it?.id ?? it?.product_id ?? it?.sku ?? `noid-${i}`;
        const title = it?.title || "Producto";
        const imageInfo =
          it?.imageInfo ?? it?.image_info ?? it?.imageUrl ?? it?.image_product ?? null;
        const descriptionInfo =
          it?.descriptionInfo ?? it?.description_info ?? it?.description ?? "";

        return {
          id,
          title,
          imageInfo: imageInfo || FALLBACK_IMG,
          descriptionInfo,
        };
      }),
    [imagenes]
  );

  const length = items.length;
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
      <button
        onClick={anteriorImagen}
        className={styles["slider-button"]}
        aria-label="Anterior"
      >
        {"<"}
      </button>

      {items.map((imagen, index) => {
        const key = `${imagen.id}-${index}`;
        const active = imagenActual === index;

        return (
          <div
            key={key}
            className={`${styles["slider-slide"]} ${
              active ? styles["slider-active"] : ""
            }`}
          >
            {active && (
              <>
                <img
                  src={imagen.imageInfo}
                  alt={imagen.title}
                  className={styles["slider-img"]}
                  onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
                />
                <div className={styles["slider-text"]}>
                  <h3>{imagen.title}</h3>
                  <p className="i-description">{imagen.descriptionInfo}</p>
                </div>
              </>
            )}
          </div>
        );
      })}

      <button
        onClick={siguienteImagen}
        className={styles["slider-button"]}
        aria-label="Siguiente"
      >
        {">"}
      </button>

      <div className={styles["slider-indicators"]}>
        {items.map((_, index) => (
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
