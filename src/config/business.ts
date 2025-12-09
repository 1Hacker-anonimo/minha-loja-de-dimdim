/**
 * ============================================
 * 🛠️ CONFIGURAÇÕES DO NEGÓCIO - EDITAR AQUI
 * ============================================
 * 
 * Substitua os valores abaixo pelos dados reais do seu negócio.
 * 
 * phoneNumber: número do WhatsApp com código do país (55) + DDD + número
 * instagramUrl: link completo do perfil do Instagram
 * deliveryAreas: lista de bairros onde você entrega
 * products: lista de produtos com nome, preço e imagem
 */

export const config = {
  // Dados do negócio
  businessName: "Dim Dim Gourmet",
  tagline: "Delivery — Geladinhos Artesanais",
  description: "Geladinhos artesanais feitos com ingredientes selecionados e muito amor!",
  
  // Horário de funcionamento
  workingHours: "18h às 22h",
  paymentMethods: "Dinheiro / PIX",
  
  // Contato
  phoneNumber: "558591902359", // Formato: código país + DDD + número (sem espaços ou traços)
  
  // Redes sociais
  instagramUrl: "https://instagram.com/dimdim_geladinhos",
  instagramHandle: "@dimdim_geladinhos",
  
  // Áreas de entrega
  deliveryAreas: [
    "Centro",
    "Jardim América",
    "Vila Nova",
    "Boa Vista",
    "Santa Cruz",
    "Parque das Flores"
  ],
  
  // Taxa de entrega (opcional)
  deliveryFee: "Consulte",
  
  // Mensagem padrão do WhatsApp
  defaultMessage: "Olá! Gostaria de fazer um pedido de geladinhos 🍦",
  
  // Observação padrão
  defaultNote: "Delivery somente — confirme endereço antes de finalizar.",
};

export const products = [
  {
    id: 1,
    name: "Prestígio",
    price: 4.50,
    description: "Chocolate com coco",
    image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&h=400&fit=crop"
  },
  {
    id: 2,
    name: "Doce de Leite",
    price: 5.00,
    description: "Cremoso e irresistível",
    image: "https://images.unsplash.com/photo-1570197571499-166b36435b9e?w=400&h=400&fit=crop"
  },
  {
    id: 3,
    name: "Maracujá",
    price: 4.50,
    description: "Refrescante e azedinho",
    image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400&h=400&fit=crop"
  },
  {
    id: 4,
    name: "Morango",
    price: 4.50,
    description: "Sabor clássico",
    image: "https://images.unsplash.com/photo-1488900128323-21503983a07e?w=400&h=400&fit=crop"
  },
  {
    id: 5,
    name: "Limão",
    price: 4.00,
    description: "Super refrescante",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=400&fit=crop"
  },
  {
    id: 6,
    name: "Combo 6 un.",
    price: 22.00,
    description: "Escolha seus sabores",
    image: "https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?w=400&h=400&fit=crop",
    isPromo: true
  }
];
