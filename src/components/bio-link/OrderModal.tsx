import { useState, useEffect, useRef } from "react";
import { X, Minus, Plus, Trash2, Send } from "lucide-react";
import { config, products } from "@/config/business";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateCart: (cart: CartItem[]) => void;
}

export function OrderModal({ isOpen, onClose, cart, onUpdateCart }: OrderModalProps) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [observation, setObservation] = useState("");
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

  const updateQuantity = (productId: number, delta: number) => {
    const newCart = cart.map(item => {
      if (item.id === productId) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0);
    
    onUpdateCart(newCart);
  };

  const removeItem = (productId: number) => {
    onUpdateCart(cart.filter(item => item.id !== productId));
  };

  const addProduct = (product: typeof products[0]) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      updateQuantity(product.id, 1);
    } else {
      onUpdateCart([...cart, { id: product.id, name: product.name, price: product.price, quantity: 1 }]);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = () => {
    if (!address.trim()) {
      alert("Por favor, informe o endereço de entrega.");
      return;
    }

    let message = `🍦 *Novo Pedido - ${config.businessName}*\n\n`;
    
    if (name.trim()) {
      message += `👤 *Nome:* ${name}\n`;
    }
    
    message += `📍 *Endereço:* ${address}\n\n`;
    message += `🛒 *Itens:*\n`;
    
    cart.forEach(item => {
      message += `• ${item.quantity}x ${item.name} - R$${(item.price * item.quantity).toFixed(2).replace('.', ',')}\n`;
    });
    
    message += `\n💰 *Total:* R$${total.toFixed(2).replace('.', ',')}\n`;
    
    if (observation.trim()) {
      message += `\n📝 *Observação:* ${observation}`;
    }

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${config.phoneNumber}?text=${encodedMessage}`, '_blank');
    
    // Reset form
    setName("");
    setAddress("");
    setObservation("");
    onUpdateCart([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-modal-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-md max-h-[90vh] bg-card rounded-t-3xl overflow-hidden animate-slide-up flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 id="order-modal-title" className="text-lg font-semibold text-foreground">
            Seu Pedido
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Cart Items */}
          {cart.length > 0 ? (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Itens selecionados</h3>
              {cart.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 glass-card">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-primary">
                      R${(item.price * item.quantity).toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-7 h-7 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                      aria-label="Diminuir quantidade"
                    >
                      <Minus className="w-3 h-3 text-foreground" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium text-foreground">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/30 transition-colors"
                      aria-label="Aumentar quantidade"
                    >
                      <Plus className="w-3 h-3 text-primary" />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="w-7 h-7 rounded-full bg-destructive/20 flex items-center justify-center hover:bg-destructive/30 transition-colors ml-1"
                      aria-label="Remover item"
                    >
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground text-sm mb-4">Nenhum item selecionado</p>
            </div>
          )}

          {/* Quick Add Products */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Adicionar mais</h3>
            <div className="flex flex-wrap gap-2">
              {products.map(product => (
                <button
                  key={product.id}
                  onClick={() => addProduct(product)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-muted hover:bg-muted/80 text-foreground transition-colors"
                >
                  + {product.name}
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-3">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-1">
                Nome (opcional)
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-muted-foreground mb-1">
                Endereço de entrega *
              </label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Rua, número, bairro"
                required
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                aria-required="true"
              />
            </div>
            
            <div>
              <label htmlFor="observation" className="block text-sm font-medium text-muted-foreground mb-1">
                Observação
              </label>
              <textarea
                id="observation"
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                placeholder="Ponto de referência, complemento..."
                rows={2}
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-muted-foreground text-sm">Total</span>
            <span className="text-xl font-bold text-primary">
              R${total.toFixed(2).replace('.', ',')}
            </span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={cart.length === 0}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold text-base flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <Send className="w-5 h-5" />
            <span>Enviar Pedido</span>
          </button>
        </div>
      </div>
    </div>
  );
}
