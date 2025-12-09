import { ShoppingBag, MessageCircle } from "lucide-react";

interface MainCTAProps {
  cartCount: number;
  onOpenOrder: () => void;
}

export function MainCTA({ cartCount, onOpenOrder }: MainCTAProps) {
  return (
    <div className="animate-fade-up-delay-4">
      <button
        onClick={onOpenOrder}
        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold text-base flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] btn-glow animate-pulse-glow"
        aria-label="Fazer pedido via WhatsApp"
      >
        {cartCount > 0 ? (
          <>
            <ShoppingBag className="w-5 h-5" />
            <span>Finalizar Pedido ({cartCount})</span>
          </>
        ) : (
          <>
            <MessageCircle className="w-5 h-5" />
            <span>Fazer Pedido</span>
          </>
        )}
      </button>
    </div>
  );
}
