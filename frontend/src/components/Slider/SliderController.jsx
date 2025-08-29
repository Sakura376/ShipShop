import React, { useState, useEffect } from "react";
import Slider from "./Slider";
import { getProducts } from "../../services/api"; 

// Adaptador: backend (snake_case) -> front (camelCase del JSON viejo)
const adaptProduct = (p) => ({
  id: p.product_id,
  title: p.title,
  tipoNave: p.tipo_nave,
  descriptionProduct: p.description,
  descriptionInfo: p.description_info,
  caracteristics: p.caracteristics,
  imageProduct: p.image_product, 
  imageInfo: p.image_info,
  price: Number(p.price),
});

function SliderScroll() {
  const [imagenes, setImagenes] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const all = await getProducts({ active: 1 });
        const adapted = all.map(adaptProduct);

        // Mezcla aleatoria y toma 6 (como hacías antes)
        const aleatorias = [...adapted].sort(() => Math.random() - 0.5).slice(0, 6);

        setImagenes(aleatorias);
      } catch (err) {
        console.error("Error cargando imágenes para el slider:", err);
        setImagenes([]); // fallback vacío
      }
    })();
  }, []);

  return (
    <div>
      <Slider imagenes={imagenes} /> {/* mantiene la misma prop */}
    </div>
  );
}

export default SliderScroll;
