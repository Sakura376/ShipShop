import React, { createContext, useState, useContext } from "react";
import axios from "axios";
import { API_URL } from "../../config";
import CartModal from "./CartModal";
import PaymentForm from "../PaymentForm/PaymentForm";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false);

  const saveCartItem = async (product) => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      console.error("Usuario no autenticado.");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/order-details/create`,
        {
          user_id: userId,
          items: [
            {
              product_id: product.id,
              quantity: 1,
              price: product.price,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(
        "Producto añadido al carrito en la base de datos:",
        product.title
      );
    } catch (error) {
      console.error(
        "Error al guardar el producto en el carrito:",
        error.response?.data || error.message
      );
    }
  };

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const itemExists = prevItems.find((item) => item.id === product.id);
      if (itemExists) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });

    saveCartItem(product);

    setNotification(`${product.title} ha sido añadido al carrito`);

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const removeFromCart = async (productId) => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    try {
      await axios.delete(
        `${API_URL}/order-details/cart/${userId}/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== productId)
      );
    } catch (error) {
      console.error(
        "Error al eliminar el producto del carrito en la base de datos:",
        error
      );
    }
  };

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const openPaymentForm = () => {
    setIsPaymentFormOpen(true);
  };

  const closePaymentForm = () => {
    setIsPaymentFormOpen(false);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const clearCart = () => {
    setCartItems([]); // Vacía el carrito
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        toggleCart,
        cartCount,
        openPaymentForm, // Exportamos la función para abrir el formulario de pago
      }}
    >
      {children}
      {isCartOpen && (
        <CartModal
          cartItems={cartItems}
          onRemoveItem={removeFromCart}
          onClose={toggleCart}
          onProceedToPayment={openPaymentForm} // Pasamos la función al CartModal
        />
      )}
      {isPaymentFormOpen && (
        <PaymentForm
          onClose={closePaymentForm}
          onConfirmPayment={clearCart}
          totalAmount={totalAmount} 
        />
      )}
      {notification && <div className='cart-notification'>{notification}</div>}
    </CartContext.Provider>
  );
};
