import { Clock, CreditCard, MapPin } from "lucide-react";
import { config } from "@/config/business";

export function InfoCard() {
  return (
    <div className="glass-card p-4 animate-fade-up-delay-1">
      <p className="text-foreground/90 text-sm text-center mb-3 font-light">
        {config.description}
      </p>
      
      <div className="flex flex-wrap justify-center gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="w-3.5 h-3.5 text-primary" />
          <span>{config.workingHours}</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <CreditCard className="w-3.5 h-3.5 text-primary" />
          <span>{config.paymentMethods}</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 text-primary" />
          <span>Delivery</span>
        </div>
      </div>
    </div>
  );
}
