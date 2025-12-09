import { useState } from "react";
import { Header } from "@/components/bio-link/Header";
import { InfoCard } from "@/components/bio-link/InfoCard";
import { QuickActions } from "@/components/bio-link/QuickActions";
import { ProductCarousel } from "@/components/bio-link/ProductCarousel";
import { MainCTA } from "@/components/bio-link/MainCTA";
import { Footer } from "@/components/bio-link/Footer";
import { OrderModal } from "@/components/bio-link/OrderModal";
import { MenuModal } from "@/components/bio-link/MenuModal";
import { AreasModal } from "@/components/bio-link/AreasModal";
import { products } from "@/config/business";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const Index = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isAreasModalOpen, setIsAreasModalOpen] = useState(false);

  const handleAddToCart = (product: typeof products[0]) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-40 -right-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 py-8 relative">
        <div className="space-y-5">
          <Header />
          <InfoCard />
          <QuickActions
            onOpenMenu={() => setIsMenuModalOpen(true)}
            onOpenAreas={() => setIsAreasModalOpen(true)}
          />
          <ProductCarousel cart={cart} onAddToCart={handleAddToCart} />
          <MainCTA cartCount={cartCount} onOpenOrder={() => setIsOrderModalOpen(true)} />
          <Footer />
        </div>
      </main>

      {/* Modals */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        cart={cart}
        onUpdateCart={setCart}
      />
      <MenuModal
        isOpen={isMenuModalOpen}
        onClose={() => setIsMenuModalOpen(false)}
        cart={cart}
        onAddToCart={handleAddToCart}
      />
      <AreasModal
        isOpen={isAreasModalOpen}
        onClose={() => setIsAreasModalOpen(false)}
      />
    </div>
  );
};

export default Index;
