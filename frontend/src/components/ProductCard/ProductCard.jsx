import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Products.css";
import { useCart } from "../CartModal/CartGlobal";
import ProductDetailsModal from "./ProductDetailsModal";
import { API_URL } from "../../config";

const ProductCard = (rawProps) => {
  // Soporta ambos patrones:
  // 1) <ProductCard product={p} />
  // 2) <ProductCard id={...} title={...} ... />
  const p = rawProps?.product ? rawProps.product : rawProps || {};

  const {
    id,
    title,
    imageProduct,
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
    const ratingValue = parseInt(event.target.value, 10);
    setSelectedRating(ratingValue);

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) return console.error("Usuario no autenticado.");
    if (ratingValue < 1 || ratingValue > 5) return console.error("Calificación inválida.");

    try {
      const response = await axios.post(
        `${API_URL}/ratings/create`,
        { product_id: id, user_id: userId, rating_value: ratingValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Calificación guardada:", response.data);
    } catch (error) {
      console.error("Error al guardar la calificación:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // Evita crashear si aún no hay datos (por ejemplo, primer render)
  if (!id) return null;

  const safePrice =
    typeof price === "number"
      ? price
      : Number.isNaN(Number(price))
      ? 0
      : Number(price);

  const product = { id, title, imageProduct, price: safePrice, caracteristics };

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

      <div className="product-card" onClick={openModal}>
        <img src={imageProduct} alt={title} />
        <div className="w-product">
          <button
            className="add-to-cart-p"
            onClick={(e) => {
              e.stopPropagation();
              addToCart({ id, title, price: safePrice, imageProduct });
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
                checked={selectedRating === star}
              />
              <label title={`${star} estrellas`} htmlFor={`star${star}-${id}`}></label>
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductCard;
