// ===== Configuration de la boutique =====
// Modifiez ces valeurs pour personnaliser votre boutique.
const SHOP_CONFIG = {
  name: "Sarafyna",
  tagline: "Mode, beauté & accessoires",
  currency: "EUR",          // ex : "EUR", "XOF" (FCFA), "USD", "CAD"
  locale: "fr-FR",
  freeShippingFrom: 60,     // livraison offerte à partir de ce montant
  shippingCost: 4.9,
  // Numéro WhatsApp (format international, sans "+" ni espaces) pour recevoir
  // les commandes. Laissez vide pour désactiver.
  whatsapp: "",
  email: "contact@sarafyna.com",
};

// ===== Catalogue =====
// Ajoutez, modifiez ou supprimez des produits ici.
// "image" peut être une URL (ex : "images/robe.jpg") ; sinon l'emoji est affiché.
const PRODUCTS = [
  { id: 1,  name: "Robe Wax Élégance",      category: "Vêtements",   price: 49.9, oldPrice: 65, emoji: "👗", color: "#f4a261", rating: 4.8, stock: 12, description: "Robe midi en tissu wax 100 % coton, coupe cintrée et ceinture assortie. Parfaite pour les grandes occasions comme pour le quotidien.", sizes: ["S", "M", "L", "XL"] },
  { id: 2,  name: "Chemise Lin Sable",       category: "Vêtements",   price: 39,   emoji: "👔", color: "#e9c46a", rating: 4.5, stock: 20, description: "Chemise légère en lin, respirante et élégante. Coupe droite, boutons en nacre.", sizes: ["S", "M", "L", "XL"] },
  { id: 3,  name: "Ensemble Kimono Soie",    category: "Vêtements",   price: 79,   emoji: "👘", color: "#e76f51", rating: 4.9, stock: 5,  description: "Kimono fluide et pantalon assorti en satin de soie. Un ensemble raffiné et confortable.", sizes: ["S", "M", "L"] },
  { id: 4,  name: "Sac Cabas Raphia",        category: "Accessoires", price: 34.5, emoji: "👜", color: "#d4a373", rating: 4.6, stock: 18, description: "Grand sac tressé à la main en raphia naturel, anses en cuir. Idéal pour l'été." },
  { id: 5,  name: "Lunettes Soleil Dorées",  category: "Accessoires", price: 24.9, oldPrice: 32, emoji: "🕶️", color: "#264653", rating: 4.3, stock: 30, description: "Monture dorée légère, verres polarisés catégorie 3, protection UV400." },
  { id: 6,  name: "Foulard Imprimé Bogolan", category: "Accessoires", price: 19,   emoji: "🧣", color: "#a98467", rating: 4.7, stock: 25, description: "Foulard carré en viscose aux motifs bogolan traditionnels. Se porte au cou, dans les cheveux ou sur un sac." },
  { id: 7,  name: "Boucles Créoles Or",      category: "Bijoux",      price: 29,   emoji: "💛", color: "#ffb703", rating: 4.8, stock: 40, description: "Créoles en acier inoxydable plaqué or 18 carats. Hypoallergéniques et résistantes à l'eau." },
  { id: 8,  name: "Collier Perles Cauris",   category: "Bijoux",      price: 22,   emoji: "📿", color: "#8ecae6", rating: 4.6, stock: 15, description: "Collier artisanal en cauris naturels et perles de verre. Pièce unique faite main." },
  { id: 9,  name: "Bague Pierre de Lune",    category: "Bijoux",      price: 35,   oldPrice: 42, emoji: "💍", color: "#b8c0ff", rating: 4.4, stock: 8,  description: "Bague ajustable en argent 925 sertie d'une pierre de lune naturelle.", sizes: ["50", "52", "54", "56"] },
  { id: 10, name: "Beurre de Karité Pur",    category: "Beauté",      price: 12.9, emoji: "🧴", color: "#ccd5ae", rating: 4.9, stock: 50, description: "Beurre de karité brut non raffiné, issu du commerce équitable. Nourrit peau et cheveux. Pot de 200 ml." },
  { id: 11, name: "Huile Sèche Baobab",      category: "Beauté",      price: 18.5, emoji: "🌿", color: "#90be6d", rating: 4.7, stock: 22, description: "Huile sèche multi-usage à l'huile de baobab et d'argan. Pénètre rapidement sans laisser de film gras. 100 ml." },
  { id: 12, name: "Parfum Fleur d'Oranger",  category: "Beauté",      price: 45,   emoji: "🌸", color: "#ffafcc", rating: 4.5, stock: 0,  description: "Eau de parfum aux notes de fleur d'oranger, jasmin et vanille. Flacon de 50 ml." },
];
