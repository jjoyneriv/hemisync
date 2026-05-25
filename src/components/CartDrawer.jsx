import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ShoppingBag, CreditCard, Check, AlertCircle, Loader2 } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function CartDrawer() {
  const {
    items, removeItem, clearCart, total,
    isOpen, setIsOpen, checkout,
    checkoutStatus, setCheckoutStatus,
    checkoutError, setCheckoutError,
    isLoading,
  } = useCart();

  return (
    <AnimatePresence>
      {(isOpen || checkoutStatus) && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => { setIsOpen(false); setCheckoutStatus(null); setCheckoutError(null); }}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md z-50 bg-cosmic-900 border-l border-glass-border shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-glass-border">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-nebula-400" />
                <h2 className="text-lg font-semibold text-white">
                  {checkoutStatus === "success" ? "Order Complete" : `Cart (${items.length})`}
                </h2>
              </div>
              <button
                onClick={() => { setIsOpen(false); setCheckoutStatus(null); setCheckoutError(null); }}
                className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {checkoutStatus === "success" ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Payment Successful!</h3>
                <p className="text-sm text-slate-400 mb-6">
                  Thank you for your purchase. Your download links have been sent to your email.
                </p>
                <button
                  onClick={() => { setCheckoutStatus(null); setIsOpen(false); }}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-nebula-500 to-aurora-500 rounded-full hover:opacity-90 transition-opacity"
                >
                  Continue Browsing
                </button>
              </div>
            ) : checkoutStatus === "cancelled" ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Checkout Cancelled</h3>
                <p className="text-sm text-slate-400 mb-6">
                  Your cart items are still saved. You can complete your purchase anytime.
                </p>
                <button
                  onClick={() => setCheckoutStatus(null)}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-nebula-500 to-aurora-500 rounded-full hover:opacity-90 transition-opacity"
                >
                  View Cart
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <ShoppingBag className="w-12 h-12 text-slate-600 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Your cart is empty</h3>
                <p className="text-sm text-slate-400 mb-6">
                  Browse our audio library and add sessions to your cart.
                </p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2.5 text-sm font-medium text-slate-300 border border-glass-border rounded-full hover:bg-white/5 transition-colors"
                >
                  Continue Browsing
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-5 space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="glass-card rounded-xl p-3 flex items-center gap-3">
                      <img
                        src={item.coverSrc}
                        alt={item.title}
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{item.title}</p>
                        <p className="text-xs text-slate-500">{item.subtitle}</p>
                        <p className="text-xs text-slate-400 mt-0.5">MP3 Digital Download</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold text-white">
                          ${typeof item.price === "number" ? item.price.toFixed(2) : "0.00"}
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="mt-1 p-1 rounded hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors"
                          aria-label={`Remove ${item.title}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-glass-border p-5 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Subtotal</span>
                      <span className="text-white">${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Tax</span>
                      <span className="text-white">$0.00</span>
                    </div>
                    <div className="flex justify-between text-base font-semibold pt-2 border-t border-glass-border">
                      <span className="text-white">Total</span>
                      <span className="text-white">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {checkoutError && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-red-300">{checkoutError}</p>
                    </div>
                  )}

                  <button
                    onClick={checkout}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-base font-medium text-white bg-gradient-to-r from-nebula-500 to-aurora-500 rounded-full hover:opacity-90 transition-opacity glow-nebula disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Redirecting to Stripe...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Checkout with Stripe
                      </>
                    )}
                  </button>

                  <button
                    onClick={clearCart}
                    disabled={isLoading}
                    className="w-full text-center text-xs text-slate-500 hover:text-slate-300 transition-colors py-1 disabled:opacity-30"
                  >
                    Clear Cart
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
