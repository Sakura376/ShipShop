import React, { useEffect, useState } from 'react';
import Carousel from '../Carousel/Carousel';
import { getProducts } from '../../services/api';
import CaracNasa from '../Caracteristics/CaracNasa';
import CaracSpaceX from '../Caracteristics/CaracSpaceX';

const adaptProduct = (p) => ({
  id: p.product_id,
  title: p.title,
  tipoNave: p.tipo_nave,              // backend -> camelCase que usa el front
  descriptionProduct: p.description,
  descriptionInfo: p.description_info,
  caracteristics: p.caracteristics,
  imageProduct: p.image_product,      // <-- clave que espera tu Carousel
  imageInfo: p.image_info,
  price: Number(p.price),
});

const Products = () => {
  const [spaceXProducts, setSpaceXProducts] = useState([]);
  const [nasaProducts, setNasaProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const all = await getProducts({ active: 1 });
        const adapted = all.map(adaptProduct);

        const spaceX = adapted.filter(p => p.tipoNave === 'SpaceX');
        const nasa   = adapted.filter(p => p.tipoNave === 'NASA');

        setSpaceXProducts(spaceX);
        setNasaProducts(nasa);
      } catch (error) {
        console.error('Error al cargar los productos:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section id='productos' className='products'>
      <h2 id='product-type' className='products-title'>Naves de SpaceX</h2>
      <Carousel products={spaceXProducts} />
      <CaracNasa/>     {/* lo dejo tal cual lo tenías */}

      <h2 id='product-type' className='products-title'>Naves de NASA</h2>
      <Carousel products={nasaProducts} />
      <CaracSpaceX/>   {/* lo dejo tal cual lo tenías */}
    </section>
  );
};

export default Products;
