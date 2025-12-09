import { MessageCircle, Instagram, Menu, MapPin } from "lucide-react";
import { config } from "@/config/business";

interface QuickActionsProps {
  onOpenMenu: () => void;
  onOpenAreas: () => void;
}

export function QuickActions({ onOpenMenu, onOpenAreas }: QuickActionsProps) {
  const handleWhatsApp = () => {
    const message = encodeURIComponent(config.defaultMessage);
    window.open(`https://wa.me/${config.phoneNumber}?text=${message}`, '_blank');
  };

  const handleInstagram = () => {
    window.open(config.instagramUrl, '_blank');
  };

  const actions = [
    {
      icon: MessageCircle,
      label: "WhatsApp",
      onClick: handleWhatsApp,
      primary: true,
    },
    {
      icon: Instagram,
      label: "Instagram",
      onClick: handleInstagram,
    },
    {
      icon: Menu,
      label: "Cardápio",
      onClick: onOpenMenu,
    },
    {
      icon: MapPin,
      label: "Entregas",
      onClick: onOpenAreas,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 animate-fade-up-delay-2">
      {actions.map((action, index) => (
        <button
          key={action.label}
          onClick={action.onClick}
          className={`
            glass-card p-4 flex flex-col items-center gap-2 
            transition-all duration-300 
            hover:scale-105 hover:border-primary/30
            active:scale-95
            ${action.primary ? 'border-primary/30 glow-accent' : ''}
          `}
          aria-label={action.label}
        >
          <action.icon 
            className={`w-6 h-6 ${action.primary ? 'text-primary' : 'text-foreground/80'}`} 
          />
          <span className="text-xs font-medium text-foreground/90">
            {action.label}
          </span>
        </button>
      ))}
    </div>
  );
}
