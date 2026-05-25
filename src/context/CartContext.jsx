import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

const API_URL = "";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState(null);
  const [checkoutError, setCheckoutError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("hemisync-cart");
      if (saved) setItems(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("hemisync-cart", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") === "success") {
      setCheckoutStatus("success");
      setIsOpen(true);
      setItems([]);
      localStorage.removeItem("hemisync-cart");
      window.history.replaceState({}, "", window.location.pathname);
    } else if (params.get("checkout") === "cancelled") {
      setCheckoutStatus("cancelled");
      setIsOpen(true);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const addItem = (product) => {
    setItems((prev) => {
      if (prev.some((i) => i.id === product.id)) return prev;
      const price = typeof product.price === "object" ? product.price.mp3 : product.price;
      return [...prev, {
        id: product.id,
        title: product.title,
        subtitle: product.subtitle || "",
        price: Number(price) || 0,
        coverSrc: product.coverSrc || product.coverImageUrl || "",
      }];
    });
    setIsOpen(true);
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const isInCart = (id) => items.some((i) => i.id === id);

  const total = items.reduce((sum, i) => sum + (Number(i.price) || 0), 0);

  const checkout = async () => {
    if (!items.length) return;
    setIsLoading(true);
    setCheckoutError(null);

    const payload = {
      items: items.map((i) => ({
        id: i.id,
        title: i.title,
        subtitle: i.subtitle,
        price: Number(i.price) || 0,
        coverUrl: i.coverSrc ? `https://hemisync.org${i.coverSrc}` : null,
      })),
    };

    try {
      const res = await fetch(`${API_URL}/api/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error: ${res.status}`);
      }

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned from Stripe");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setCheckoutError(err.message || "Failed to connect to payment server. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, clearCart, isInCart,
      total, itemCount: items.length,
      isOpen, setIsOpen, checkout,
      checkoutStatus, setCheckoutStatus,
      checkoutError, setCheckoutError,
      isLoading,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
