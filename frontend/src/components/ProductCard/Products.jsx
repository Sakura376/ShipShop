import React, { useEffect, useMemo, useState } from "react";
import Carousel from "../Carousel/Carousel";
import { getProducts } from "../../services/api";
import CaracNasa from "../Caracteristics/CaracNasa";
import CaracSpaceX from "../Caracteristics/CaracSpaceX";

const adaptProduct = (p) => ({
  id: p.id ?? p.product_id,
  title: p.title,
  tipoNave: p.tipoNave ?? p.tipo_nave ?? "",
  descriptionProduct: p.description,
  descriptionInfo: p.descriptionInfo ?? p.description_info,
  caracteristics: p.caracteristics,
  imageProduct: p.imageUrl ?? p.image_product,
  imageInfo: p.imageInfo ?? p.image_info,
  price: Number(p.price ?? 0),
  quantity: p.quantity ?? 0,
  active: p.active ?? p.is_active ?? 1,
});

const Products = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const list = await getProducts({ active: 1 }); // devuelve r.data.items
        const adapted = list.map(adaptProduct);
        console.log("Productos cargados:", adapted.length, adapted.slice(0, 2));
        setItems(adapted);
      } catch (e) {
        console.error("Error al cargar los productos:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const spaceX = useMemo(
    () => items.filter(p => (p.tipoNave || "").toLowerCase() === "spacex"),
    [items]
  );
  const nasa = useMemo(
    () => items.filter(p => (p.tipoNave || "").toLowerCase() === "nasa"),
    [items]
  );

  if (loading) return null;

  return (
    <section id="productos" className="products">
      <h2 className="products-title">Naves de SpaceX</h2>
      <Carousel products={spaceX.length ? spaceX : items} />

      <CaracNasa />

      <h2 className="products-title">Naves de NASA</h2>
      <Carousel products={nasa.length ? nasa : items} />

      <CaracSpaceX />
    </section>
  );
};

export default Products;
