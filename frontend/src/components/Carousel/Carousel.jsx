import React, { useMemo, useState } from "react";
import ProductCard from "../ProductCard/ProductCard";
import styles from "./Carousel.module.css";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80&auto=format&fit=crop";

function Carousel({ products = [] }) {
  const length = Array.isArray(products) ? products.length : 0;
  const [productoActual, setProductoActual] = useState(0);

  // Normaliza items y garantiza imagen
  const items = useMemo(
    () =>
      (Array.isArray(products) ? products : []).map((p, i) => {
        const id = p?.id ?? p?.product_id ?? p?.sku ?? `noid-${i}`;
        const imageProduct =
          p?.imageProduct ??
          p?.imageUrl ??
          p?.image_product ??
          p?.imageInfo ??
          p?.image_info ??
          FALLBACK_IMG;

        return { ...p, id, imageProduct };
      }),
    [products]
  );

  // Manejo correcto cuando hay < 3 items
  const productosVisibles = Math.min(3, Math.max(1, items.length || 1));
  const maxInicio = Math.max(0, items.length - productosVisibles);

  const siguienteProducto = () =>
    setProductoActual((prev) => (prev >= maxInicio ? 0 : prev + 1));

  const anteriorProducto = () =>
    setProductoActual((prev) => (prev <= 0 ? maxInicio : prev - 1));

  const trackWidthPct =
    (100 * Math.max(items.length, productosVisibles)) / productosVisibles;
  const translatePct = productoActual * (100 / productosVisibles);

  return (
    <div className={styles["product-slider-container"]}>
      <button
        onClick={anteriorProducto}
        className={styles["product-slider-button"]}
        aria-label="Anterior"
        disabled={!items.length}
      >
        {"<"}
      </button>

      <div className={styles["product-slider-wrapper"]}>
        {items.length ? (
          <div
            className={styles["product-slider"]}
            style={{
              transform: `translateX(-${translatePct}%)`,
              width: `${trackWidthPct}%`,
            }}
          >
            {items.map((producto, i) => (
              <div key={`${producto.id}-${i}`} className={styles["product-slider-item"]}>
                <ProductCard
                  product={{
                    id: producto.id,
                    title: producto.title,
                    imageProduct: producto.imageProduct,
                    price: producto.price,
                    caracteristics: producto.caracteristics,
                    rating: producto.rating,
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className={styles["product-slider"]} style={{ width: "100%" }}>
            <div className={styles["product-slider-item"]} style={{ width: "100%" }}>
              <div className="product-card" style={{ textAlign: "center", padding: 24 }}>
                <img
                  src={FALLBACK_IMG}
                  alt="Sin productos"
                  className="product-image"
                />
                <h3>No hay productos para mostrar</h3>
                <p style={{ opacity: 0.8, marginTop: 8 }}>
                  Revisa el filtro o la carga desde /api/products.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={siguienteProducto}
        className={styles["product-slider-button"]}
        aria-label="Siguiente"
        disabled={!items.length}
      >
        {">"}
      </button>
    </div>
  );
}

export default Carousel;
