import React, { useEffect, useMemo, useState } from "react";
import Carousel from "../Carousel/Carousel";
import { getProducts } from "../../services/api";
import CaracNasa from "../Caracteristics/CaracNasa";
import CaracSpaceX from "../Caracteristics/CaracSpaceX";

// La API ya devuelve { id, title, description, descriptionInfo, imageUrl, imageInfo, tipoNave, caracteristics, price, quantity, active }
const adaptProduct = (p) => ({
  id: p.id,
  title: p.title,
  tipoNave: p.tipoNave, // ya viene mapeado desde el backend
  descriptionProduct: p.description,
  descriptionInfo: p.descriptionInfo,
  caracteristics: p.caracteristics,
  imageProduct: p.imageUrl, // ← tu Carousel espera imageProduct
  imageInfo: p.imageInfo,
  price: Number(p.price),
  quantity: p.quantity,
  active: p.active,
});

const Products = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const list = await getProducts({ active: 1 }); // getProducts ya retorna data.items
        if (!alive) return;
        setItems(list.map(adaptProduct));
      } catch (err) {
        console.error("Error al cargar productos:", err);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const spaceXProducts = useMemo(
    () => items.filter((p) => (p.tipoNave || "").toLowerCase() === "SpaceX"),
    [items]
  );
  const nasaProducts = useMemo(
    () => items.filter((p) => (p.tipoNave || "").toLowerCase() === "Nasa"),
    [items]
  );

  if (loading) return null; // o un spinner si prefieres

  return (
    <section className="products" id="productos">
      <h2 className="products-title">Naves de SpaceX</h2>
      <Carousel products={spaceXProducts} />
      <CaracNasa />

      <h2 className="products-title">Naves de NASA</h2>
      <Carousel products={nasaProducts} />
      <CaracSpaceX />
    </section>
  );
};

export default Products;
