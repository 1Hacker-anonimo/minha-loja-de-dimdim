import { Instagram, MessageCircle, Download } from "lucide-react";
import { config } from "@/config/business";

export function Footer() {
  const handleWhatsApp = () => {
    const message = encodeURIComponent(config.defaultMessage);
    window.open(`https://wa.me/${config.phoneNumber}?text=${message}`, '_blank');
  };

  const handleInstagram = () => {
    window.open(config.instagramUrl, '_blank');
  };

  const handleSaveContact = () => {
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${config.businessName}
ORG:${config.businessName}
TEL;TYPE=CELL:+${config.phoneNumber}
URL:${config.instagramUrl}
NOTE:${config.tagline} - ${config.workingHours}
END:VCARD`;

    const blob = new Blob([vCardData], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${config.businessName.replace(/\s+/g, '_')}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <footer className="pt-6 pb-8 animate-fade-up-delay-4">
      {/* Save Contact Button */}
      <button
        onClick={handleSaveContact}
        className="w-full py-3 px-4 rounded-xl glass-card flex items-center justify-center gap-2 text-foreground/80 hover:text-foreground transition-colors mb-4 hover:border-primary/30"
        aria-label="Salvar contato"
      >
        <Download className="w-4 h-4" />
        <span className="text-sm font-medium">Salvar Contato</span>
      </button>

      {/* Social Icons */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={handleWhatsApp}
          className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:border-primary/30 transition-all hover:scale-110 active:scale-95"
          aria-label="WhatsApp"
        >
          <MessageCircle className="w-5 h-5 text-foreground/80" />
        </button>
        <button
          onClick={handleInstagram}
          className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:border-primary/30 transition-all hover:scale-110 active:scale-95"
          aria-label="Instagram"
        >
          <Instagram className="w-5 h-5 text-foreground/80" />
        </button>
      </div>

      {/* Copyright */}
      <p className="text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {config.businessName}
      </p>
      <p className="text-center text-[10px] text-muted-foreground/50 mt-1">
        {config.instagramHandle}
      </p>
    </footer>
  );
}
