import React, {
  createContext,
  useState,
  useContext,
  useEffect,
} from "react";
import CartModal from "./CartModal";
import PaymentForm from "../PaymentForm/PaymentForm";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false);

  // Cargar carrito guardado
  useEffect(() => {
    const saved = localStorage.getItem("cart_items");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Filtrar basura vieja con id inválido
        const cleaned = Array.isArray(parsed)
          ? parsed.filter(
              (it) => it.id && !Number.isNaN(Number(it.id))
            )
          : [];
        setCartItems(cleaned);
      } catch {
        setCartItems([]);
      }
    }
  }, []);

  // Persistir carrito
  useEffect(() => {
    localStorage.setItem("cart_items", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      console.log("👀 prevItems antes:", prevItems);
      console.log("🆕 product recibido:", product);

      // ID tal como viene del backend
      const rawId = product.product_id ?? product.id;
      const id = Number(rawId);

      if (!rawId || Number.isNaN(id)) {
        console.error(
          "❌ Producto sin ID válido, no se agrega al carrito:",
          { rawId, product }
        );
        return prevItems; // no tocamos el estado
      }

      const existingIndex = prevItems.findIndex(
        (item) => Number(item.id) === id
      );

      let updated;

      if (existingIndex !== -1) {
        // Ya existe → sumamos cantidad
        const current = prevItems[existingIndex];
        const updatedItem = {
          ...current,
          quantity: (current.quantity || 1) + 1,
        };

        updated = [...prevItems];
        updated[existingIndex] = updatedItem;

        console.log(
          `✅ Incrementando cantidad del producto ${id}`,
          updatedItem
        );
      } else {
        // Nuevo producto
        const newItem = {
          id, // ID limpio
          title: product.title,
          price: Number(product.price) || 0,
          imageProduct:
            product.image_product ||
            product.imageProduct ||
            product.imageUrl,
          quantity: 1,
        };

        updated = [...prevItems, newItem];
        console.log(`🛒 Agregado nuevo producto ${id}`, newItem);
      }

      console.log("📦 updatedItems:", updated);
      return updated;
    });

    setNotification(`${product.title} ha sido añadido al carrito`);
    setTimeout(() => setNotification(null), 3000);
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => Number(item.id) !== Number(productId)
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart_items");
  };

  const toggleCart = () => setIsCartOpen((v) => !v);

  const openPaymentForm = () => setIsPaymentFormOpen(true);
  const closePaymentForm = () => setIsPaymentFormOpen(false);

  const cartCount = cartItems.reduce(
    (acc, item) => acc + (item.quantity || 1),
    0
  );

  const totalAmount = cartItems.reduce(
    (acc, item) =>
      acc + (Number(item.price) || 0) * (item.quantity || 1),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        toggleCart,
        cartCount,
        openPaymentForm,
        clearCart,
      }}
    >
      {children}

      {isCartOpen && (
        <CartModal
          cartItems={cartItems}
          onRemoveItem={removeFromCart}
          onClose={toggleCart}
          onProceedToPayment={openPaymentForm}
        />
      )}

      {isPaymentFormOpen && (
        <PaymentForm
          onClose={closePaymentForm}
          onConfirmPayment={clearCart}
          totalAmount={totalAmount}
        />
      )}

      {notification && (
        <div className="cart-notification">{notification}</div>
      )}
    </CartContext.Provider>
  );
};
