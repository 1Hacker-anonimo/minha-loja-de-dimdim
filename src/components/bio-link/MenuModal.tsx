import { useState, useEffect, useRef } from "react";
import { X, Plus, Check } from "lucide-react";
import { products } from "@/config/business";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onAddToCart: (product: typeof products[0]) => void;
}

export function MenuModal({ isOpen, onClose, cart, onAddToCart }: MenuModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const getQuantityInCart = (productId: number) => {
    const item = cart.find(i => i.id === productId);
    return item?.quantity || 0;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="menu-modal-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-md max-h-[85vh] bg-card rounded-t-3xl overflow-hidden animate-slide-up flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 id="menu-modal-title" className="text-lg font-semibold text-foreground">
            Cardápio
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Products List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {products.map((product) => {
            const quantity = getQuantityInCart(product.id);
            
            return (
              <div
                key={product.id}
                className={`flex gap-3 p-3 rounded-2xl transition-all duration-200 ${
                  quantity > 0 ? 'glass-card border-primary/30' : 'glass-card'
                }`}
              >
                {/* Product Image */}
                <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {product.isPromo && (
                    <span className="absolute top-1 left-1 bg-accent text-accent-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      PROMO
                    </span>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {product.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-primary font-bold">
                      R${product.price.toFixed(2).replace('.', ',')}
                    </span>
                    <button
                      onClick={() => onAddToCart(product)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 ${
                        quantity > 0
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-primary/20 hover:bg-primary/40 text-primary'
                      }`}
                      aria-label={`Adicionar ${product.name} ao carrinho`}
                    >
                      {quantity > 0 ? (
                        <span className="text-xs font-bold">{quantity}</span>
                      ) : (
                        <Plus className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-border bg-card">
            <button
              onClick={onClose}
              className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Check className="w-4 h-4" />
              <span>
                {cart.reduce((sum, item) => sum + item.quantity, 0)} itens selecionados
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
