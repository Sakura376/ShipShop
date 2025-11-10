import React, { useState, useEffect } from "react";
import Slider from "./Slider";
import { getProducts } from "../../services/api";

// Adaptador: normaliza lo que viene del backend al formato que usa Slider
const adaptProduct = (p, index) => {
  const id =
    p.id ??
    p.product_id ??
    p.sku ??
    `slide-${index}`;

  const title = p.title || "Producto";

  const descriptionInfo =
    p.descriptionInfo ??
    p.description_info ??
    p.description ??
    "";

  const imageInfo =
    p.imageInfo ??
    p.image_info ??
    p.imageUrl ??
    p.image_product ??
    null;

  return {
    id,
    title,
    descriptionInfo,
    imageInfo, // Slider.jsx ya hace fallback si esto viene null
  };
};

function SliderScroll() {
  const [imagenes, setImagenes] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const all = await getProducts({ active: 1 }); // r.data.items
        const adapted = all.map(adaptProduct);

        // Mezcla aleatoria y toma hasta 6
        const aleatorias = adapted
          .filter((it) => !!it) // safety
          .sort(() => Math.random() - 0.5)
          .slice(0, 6);

        setImagenes(aleatorias);
      } catch (err) {
        console.error("Error cargando imágenes para el slider:", err);
        setImagenes([]);
      }
    })();
  }, []);

  return (
    <div>
      <Slider imagenes={imagenes} />
    </div>
  );
}

export default SliderScroll;
