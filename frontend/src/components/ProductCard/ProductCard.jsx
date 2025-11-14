import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Products.css";
import { useCart } from "../CartModal/CartGlobal";
import ProductDetailsModal from "./ProductDetailsModal";
import { API_URL } from "../../config";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80&auto=format&fit=crop";

const ProductCard = (rawProps) => {

  const p = rawProps?.product ? rawProps.product : rawProps || {};

  const {
    id,
    title,
    imageProduct,
    imageInfo,
    price,
    caracteristics,
    rating,
  } = p;

  const [selectedRating, setSelectedRating] = useState(rating ?? null);
  const { addToCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setSelectedRating(rating ?? null);
  }, [rating]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleRatingChange = async (event) => {
    event.stopPropagation();

    const token = localStorage.getItem("token");
    if (!token) {
      event.preventDefault();
      alert("Debes iniciar sesión para calificar productos.");
      return;
    }

    const ratingValue = parseInt(event.target.value, 10);
    if (ratingValue < 1 || ratingValue > 5) {
      event.preventDefault();
      console.error("Calificación inválida.");
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/products/${id}/ratings`,
        {
          // 👇 IMPORTANTE: el backend espera "rating", no "rating_value"
          rating: ratingValue,
          // comment: "opcional si quieres enviar algo"
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Si el backend responde OK, reflejamos selección
      setSelectedRating(ratingValue);
      console.log("Calificación guardada:", res.data);
    } catch (error) {
      console.error(
        "Error al guardar la calificación:",
        error.response?.data || error.message
      );

      const status = error.response?.status;
      if (status === 403) {
        alert("Solo puedes calificar productos que has comprado.");
      } else if (status === 401) {
        alert("Tu sesión expiró. Inicia sesión nuevamente.");
      } else if (status === 400) {
        alert("Datos de calificación inválidos.");
      } else {
        alert("No se pudo guardar la calificación.");
      }

      event.preventDefault();
    }
  };




  if (!id) return null;

  const safePrice =
    typeof price === "number"
      ? price
      : Number.isNaN(Number(price))
        ? 0
        : Number(price);

  const imgSrc = imageProduct || imageInfo || FALLBACK_IMG;

  const product = {
    id,
    title,
    imageProduct: imgSrc,
    price: safePrice,
    caracteristics,
  };

  return (
    <>
      {isModalOpen && (
        <ProductDetailsModal
          product={product}
          onClose={closeModal}
          onAddToCart={addToCart}
          selectedRating={selectedRating}
        />
      )}

      <div
        className="product-card"
        data-product-id={id}   // 👈 AQUÍ MARCAMOS EL PRODUCTO
        onClick={openModal}
      >
        <img
          src={imgSrc}
          alt={title || "Producto"}
          className="product-image"
          onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
        />

        <div className="w-product">
          <button
            className="add-to-cart-p"
            onClick={(e) => {
              e.stopPropagation();
              addToCart({ id, title, price: safePrice, imageProduct: imgSrc });
            }}
          >
            Añadir al carrito
          </button>
        </div>
        <h2>{title}</h2>
        <p>
          <strong>Precio:</strong>{" "}
          {safePrice.toLocaleString("en-US", { style: "currency", currency: "USD" })}
        </p>

        {/* Estrellas */}
        <div className="rating">
          {[5, 4, 3, 2, 1].map((star) => (
            <React.Fragment key={star}>
              <input
                value={star}
                name={`rate-${id}`}
                id={`star${star}-${id}`}
                type="radio"
                onChange={handleRatingChange}
                onClick={(e) => e.stopPropagation()}
                checked={selectedRating === star}
              />
              <label
                title={`${star} estrellas`}
                htmlFor={`star${star}-${id}`}
                onClick={(e) => e.stopPropagation()}
              />
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductCard;
