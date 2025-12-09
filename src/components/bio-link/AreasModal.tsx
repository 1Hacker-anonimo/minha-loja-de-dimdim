import { useEffect, useRef } from "react";
import { X, MapPin, ExternalLink } from "lucide-react";
import { config } from "@/config/business";

interface AreasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AreasModal({ isOpen, onClose }: AreasModalProps) {
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="areas-modal-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-md max-h-[70vh] bg-card rounded-t-3xl overflow-hidden animate-slide-up flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 id="areas-modal-title" className="text-lg font-semibold text-foreground">
            Áreas de Entrega
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
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-sm text-muted-foreground mb-4 text-center">
            Realizamos entregas nos seguintes bairros:
          </p>
          
          <div className="grid grid-cols-2 gap-2">
            {config.deliveryAreas.map((area, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 glass-card"
              >
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm text-foreground">{area}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 glass-card text-center">
            <p className="text-xs text-muted-foreground mb-1">Taxa de entrega</p>
            <p className="text-primary font-semibold">{config.deliveryFee}</p>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-4">
            {config.defaultNote}
          </p>
        </div>
      </div>
    </div>
  );
}
