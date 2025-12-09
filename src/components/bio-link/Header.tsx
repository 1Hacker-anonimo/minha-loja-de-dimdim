import { config } from "@/config/business";

export function Header() {
  return (
    <header className="text-center animate-fade-up">
      {/* Avatar/Logo */}
      <div className="relative mx-auto mb-4 w-28 h-28">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent opacity-50 blur-xl animate-pulse-glow" />
        <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-primary/50 glass-card p-1">
          <img
            src="https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=200&h=200&fit=crop"
            alt={config.businessName}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      </div>

      {/* Business Name */}
      <h1 className="text-2xl font-bold text-foreground mb-1">
        {config.businessName}
      </h1>
      
      {/* Tagline */}
      <p className="text-gradient font-medium text-sm tracking-wide">
        {config.tagline}
      </p>
    </header>
  );
}
