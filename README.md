# Sarafyna — Boutique en ligne

Boutique en ligne en HTML, CSS et JavaScript, sans dépendances ni étape de compilation.

## Fonctionnalités

- Catalogue avec filtres par catégorie, recherche et tri (prix, note, nom)
- Fiche produit : description, stock, choix de taille et de quantité
- Panier persistant (conservé dans le navigateur), seuil de livraison offerte
- Formulaire de commande (paiement à la livraison, Mobile Money ou virement)
- Envoi de la commande par **WhatsApp** et/ou **e-mail**
- Mise en page adaptée au mobile

## Lancer la boutique

Ouvrez `index.html` dans un navigateur. Vous pouvez aussi lancer un petit serveur :

```bash
python3 -m http.server 8000
# puis ouvrez http://localhost:8000
```

## Personnaliser

Tout se règle dans **`products.js`** :

- `SHOP_CONFIG` : nom, devise (`EUR`, `XOF` pour le FCFA…), frais de livraison,
  numéro WhatsApp (ex : `"33612345678"`) et e-mail qui reçoivent les commandes.
- `PRODUCTS` : la liste des produits. Pour utiliser une vraie photo, placez-la
  dans un dossier `images/` et ajoutez `image: "images/ma-photo.jpg"` au produit.

Les couleurs du site se changent en haut de `styles.css` (variables `--primary`, etc.).

## Mettre en ligne

Le site est statique : vous pouvez l'héberger gratuitement avec **GitHub Pages**
(Settings → Pages → branche à publier), Netlify ou Vercel.

> Remarque : il n'y a pas de paiement en ligne par carte. Les commandes sont
> transmises par WhatsApp ou e-mail, et le paiement se fait à la livraison, par
> Mobile Money ou par virement. Le paiement par carte nécessiterait un service
> comme Stripe et un serveur.
