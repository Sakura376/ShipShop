import React, { useState } from "react";
import ProductCard from "../ProductCard/ProductCard";
import styles from "./Carousel.module.css";

function Carousel({ products }) {
  const [productoActual, setProductoActual] = useState(0);
  const productosVisibles = 3;
  const length = products.length;

  const siguienteProducto = () => {
    setProductoActual((prev) => (prev + 1) % (length - productosVisibles + 1));
  };

  const anteriorProducto = () => {
    setProductoActual((prev) =>
      prev === 0 ? length - productosVisibles : prev - 1
    );
  };

  return (
    <div className={styles["product-slider-container"]}>
      <button onClick={anteriorProducto} className={styles["product-slider-button"]}>
        {"<"}
      </button>
      <div className={styles["product-slider-wrapper"]}>
        <div
          className={styles["product-slider"]}
          style={{
            transform: `translateX(-${productoActual * (100 / productosVisibles)}%)`,
            width: `${100 * (length / productosVisibles)}%`,
          }}
        >
          {products.map((producto) => (
            <div key={producto.id} className={styles["product-slider-item"]}>
              <ProductCard
                id={producto.id}
                title={producto.title}
                imageProduct={producto.imageProduct}
                price={producto.price}
              />
            </div>
          ))}
        </div>
      </div>
      <button onClick={siguienteProducto} className={styles["product-slider-button"]}>
        {">"}
      </button>
    </div>
  );
}

export default Carousel;
