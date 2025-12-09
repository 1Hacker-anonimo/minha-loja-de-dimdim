import { Plus } from "lucide-react";
import { products } from "@/config/business";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface ProductCarouselProps {
  cart: CartItem[];
  onAddToCart: (product: typeof products[0]) => void;
}

export function ProductCarousel({ cart, onAddToCart }: ProductCarouselProps) {
  const getQuantityInCart = (productId: number) => {
    const item = cart.find(i => i.id === productId);
    return item?.quantity || 0;
  };

  return (
    <div className="animate-fade-up-delay-3">
      <h2 className="text-sm font-semibold text-foreground/90 mb-3 px-1">
        Nossos Sabores
      </h2>
      
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
        {products.map((product) => {
          const quantity = getQuantityInCart(product.id);
          
          return (
            <div
              key={product.id}
              className="flex-shrink-0 w-32 glass-card overflow-hidden group"
            >
              {/* Product Image */}
              <div className="relative h-24 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
                {product.isPromo && (
                  <span className="absolute top-1 right-1 bg-accent text-accent-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    PROMO
                  </span>
                )}
                {quantity > 0 && (
                  <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {quantity}
                  </span>
                )}
              </div>
              
              {/* Product Info */}
              <div className="p-2">
                <h3 className="text-xs font-semibold text-foreground truncate">
                  {product.name}
                </h3>
                <p className="text-[10px] text-muted-foreground truncate">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-primary font-bold text-sm">
                    R${product.price.toFixed(2).replace('.', ',')}
                  </span>
                  <button
                    onClick={() => onAddToCart(product)}
                    className="w-7 h-7 rounded-full bg-primary/20 hover:bg-primary/40 flex items-center justify-center transition-all duration-200 active:scale-90"
                    aria-label={`Adicionar ${product.name} ao carrinho`}
                  >
                    <Plus className="w-4 h-4 text-primary" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
