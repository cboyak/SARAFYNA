// ===== Configuration de la boutique =====
// Modifiez ces valeurs pour personnaliser votre boutique.
const SHOP_CONFIG = {
  name: "Sarafyna",
  tagline: "Cosmétique · La boutique",
  currency: "EUR",          // ex : "EUR", "XOF" (FCFA), "USD", "CAD"
  locale: "fr-FR",
  freeShippingFrom: 50,     // livraison offerte à partir de ce montant
  shippingCost: 4.9,
  // Numéro WhatsApp qui reçoit les commandes (format international, sans "+"
  // ni espaces, ex : "33612345678"). Laissez vide pour masquer le bouton.
  whatsapp: "",
  email: "contact@sarafyna.com",
  // Enregistre automatiquement chaque commande dans Netlify Forms
  // (fonctionne uniquement une fois le site publié sur Netlify).
  netlifyForms: true,
};

// ===== Catalogue =====
// ⚠️ Produits d'EXEMPLE : remplacez-les par vos vrais produits, prix et photos.
// "image" : chemin d'une photo (ex : "images/serum.jpg") ; sinon l'emoji est affiché.
// "sizes" (facultatif) : contenances au choix, ex : ["50 ml", "100 ml"].
const PRODUCTS = [
  { id: 1,  name: "Sérum Éclat Vitamine C",     category: "Soins visage", price: 24.9, oldPrice: 29.9, emoji: "💧", color: "#f4a261", rating: 4.8, stock: 20, description: "Sérum concentré en vitamine C pour unifier le teint et raviver l'éclat. Texture légère, convient à tous les types de peau. 30 ml." },
  { id: 2,  name: "Crème Hydratante Karité",    category: "Soins visage", price: 19.9, emoji: "🫙", color: "#e9c46a", rating: 4.7, stock: 25, description: "Crème de jour au beurre de karité et à l'aloe vera. Hydrate 24 h sans effet gras. 50 ml." },
  { id: 3,  name: "Savon Noir Purifiant",       category: "Soins visage", price: 8.5,  emoji: "🧼", color: "#6d597a", rating: 4.6, stock: 40, description: "Savon noir traditionnel enrichi en huile d'olive. Nettoie en profondeur et prépare la peau au gommage. 200 g." },
  { id: 4,  name: "Beurre de Karité Pur",       category: "Soins corps",  price: 12.9, emoji: "🧴", color: "#ccd5ae", rating: 4.9, stock: 50, description: "Beurre de karité brut non raffiné. Nourrit intensément la peau et les cheveux secs.", sizes: ["200 ml", "500 ml"] },
  { id: 5,  name: "Lait Corporel Cacao",        category: "Soins corps",  price: 14.5, emoji: "🍫", color: "#a98467", rating: 4.5, stock: 18, description: "Lait corporel au beurre de cacao et à l'huile de coco. Peau douce et délicatement parfumée. 400 ml." },
  { id: 6,  name: "Gommage Sucre & Coco",       category: "Soins corps",  price: 16,   oldPrice: 19, emoji: "🥥", color: "#d4a373", rating: 4.6, stock: 12, description: "Gommage au sucre de canne et à l'huile de coco. Élimine les cellules mortes et laisse la peau satinée. 250 g." },
  { id: 7,  name: "Huile de Croissance Ricin",  category: "Cheveux",      price: 13.9, emoji: "🌿", color: "#90be6d", rating: 4.7, stock: 30, description: "Huile de ricin noir pure pour fortifier les cheveux, les cils et les sourcils. 100 ml." },
  { id: 8,  name: "Masque Capillaire Avocat",   category: "Cheveux",      price: 17.5, emoji: "🥑", color: "#52b788", rating: 4.8, stock: 15, description: "Masque nourrissant à l'huile d'avocat et au miel pour cheveux secs, bouclés et crépus. 300 ml." },
  { id: 9,  name: "Rouge à Lèvres Mat Nude",    category: "Maquillage",   price: 11.9, emoji: "💄", color: "#e76f51", rating: 4.4, stock: 22, description: "Rouge à lèvres mat longue tenue, formule enrichie en vitamine E. Ne dessèche pas les lèvres." },
  { id: 10, name: "Fond de Teint Fluide",       category: "Maquillage",   price: 21.9, emoji: "🎨", color: "#bc6c25", rating: 4.5, stock: 10, description: "Couvrance modulable et fini naturel. Formule non comédogène, tenue 12 h. 30 ml.", sizes: ["Clair", "Médium", "Caramel", "Ébène"] },
  { id: 11, name: "Eau de Parfum Fleur d'Oranger", category: "Parfums",   price: 39,   emoji: "🌸", color: "#ffafcc", rating: 4.6, stock: 8,  description: "Notes de fleur d'oranger, jasmin et vanille. Un sillage frais et lumineux.", sizes: ["30 ml", "50 ml"] },
  { id: 12, name: "Brume Corps Vanille Coco",   category: "Parfums",      price: 15.9, emoji: "✨", color: "#b8c0ff", rating: 4.5, stock: 0,  description: "Brume parfumée légère pour le corps et les cheveux. 100 ml." },
];
