(() => {
  "use strict";

  const CART_KEY = "sarafyna-cart";
  const $ = (sel, root = document) => root.querySelector(sel);

  const fmt = new Intl.NumberFormat(SHOP_CONFIG.locale, { style: "currency", currency: SHOP_CONFIG.currency });
  const money = (n) => fmt.format(n);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const byId = (id) => PRODUCTS.find((p) => p.id === id);

  const state = { category: "Tout", query: "", sort: "default", cart: loadCart() };

  // ---------- Panier (persistant) ----------
  function loadCart() {
    try {
      const saved = JSON.parse(localStorage.getItem(CART_KEY)) || [];
      return saved.filter((l) => byId(l.id) && l.qty > 0);
    } catch { return []; }
  }
  function saveCart() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(state.cart)); } catch { /* stockage indisponible */ }
  }
  const lineKey = (id, size) => `${id}|${size || ""}`;

  function addToCart(id, qty = 1, size = null) {
    const p = byId(id);
    if (!p || p.stock <= 0) return;
    const existing = state.cart.find((l) => lineKey(l.id, l.size) === lineKey(id, size));
    const inCart = state.cart.filter((l) => l.id === id).reduce((s, l) => s + l.qty, 0);
    const allowed = Math.min(qty, p.stock - inCart);
    if (allowed <= 0) return toast(`Stock maximum atteint pour « ${p.name} »`);
    if (existing) existing.qty += allowed;
    else state.cart.push({ id, size, qty: allowed });
    saveCart();
    renderCart();
    toast(`✓ ${p.name} ajouté au panier`);
    const badge = $("#cartCount");
    badge.classList.remove("bump"); void badge.offsetWidth; badge.classList.add("bump");
  }

  function setQty(key, qty) {
    const line = state.cart.find((l) => lineKey(l.id, l.size) === key);
    if (!line) return;
    const p = byId(line.id);
    const others = state.cart.filter((l) => l.id === line.id && l !== line).reduce((s, l) => s + l.qty, 0);
    line.qty = Math.min(qty, p.stock - others);
    if (line.qty <= 0) state.cart = state.cart.filter((l) => l !== line);
    saveCart();
    renderCart();
  }

  function totals() {
    const subtotal = state.cart.reduce((s, l) => s + byId(l.id).price * l.qty, 0);
    const shipping = subtotal === 0 || subtotal >= SHOP_CONFIG.freeShippingFrom ? 0 : SHOP_CONFIG.shippingCost;
    const count = state.cart.reduce((s, l) => s + l.qty, 0);
    return { subtotal, shipping, total: subtotal + shipping, count };
  }

  // ---------- Rendu ----------
  const media = (p) => p.image
    ? `<img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy" />`
    : `<span aria-hidden="true">${p.emoji}</span>`;
  const bg = (p) => `background: linear-gradient(135deg, ${p.color}33, ${p.color}88)`;
  const stars = (r) => `★`.repeat(Math.round(r)) + `☆`.repeat(5 - Math.round(r));

  function renderFilters() {
    const cats = ["Tout", ...new Set(PRODUCTS.map((p) => p.category))];
    $("#filters").innerHTML = cats.map((c) =>
      `<button class="chip ${c === state.category ? "active" : ""}" data-cat="${esc(c)}" role="tab" aria-selected="${c === state.category}">${esc(c)}</button>`
    ).join("");
  }

  function visibleProducts() {
    const q = state.query.trim().toLowerCase();
    let list = PRODUCTS.filter((p) =>
      (state.category === "Tout" || p.category === state.category) &&
      (!q || `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(q))
    );
    const sorters = {
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      rating: (a, b) => b.rating - a.rating,
      name: (a, b) => a.name.localeCompare(b.name, "fr"),
    };
    if (sorters[state.sort]) list = [...list].sort(sorters[state.sort]);
    return list;
  }

  function renderGrid() {
    const list = visibleProducts();
    $("#results").textContent = `${list.length} produit${list.length > 1 ? "s" : ""}`;
    $("#grid").innerHTML = list.length ? list.map((p) => `
      <article class="card">
        <button class="card__media" style="${bg(p)}" data-view="${p.id}" aria-label="Voir ${esc(p.name)}">
          ${media(p)}
          ${p.stock <= 0 ? `<span class="tag tag--out">Épuisé</span>` : p.oldPrice ? `<span class="tag">-${Math.round((1 - p.price / p.oldPrice) * 100)} %</span>` : ""}
        </button>
        <div class="card__body">
          <span class="card__cat">${esc(p.category)}</span>
          <h3 class="card__name">${esc(p.name)}</h3>
          <div class="rating">${stars(p.rating)} <span>${p.rating.toFixed(1)}</span></div>
          <div class="price"><strong>${money(p.price)}</strong>${p.oldPrice ? `<s>${money(p.oldPrice)}</s>` : ""}</div>
          <div class="card__actions">
            ${p.sizes
              ? `<button class="btn btn--block" data-view="${p.id}" ${p.stock <= 0 ? "disabled" : ""}>Choisir une option</button>`
              : `<button class="btn btn--primary btn--block" data-add="${p.id}" ${p.stock <= 0 ? "disabled" : ""}>${p.stock <= 0 ? "Épuisé" : "Ajouter au panier"}</button>`}
          </div>
        </div>
      </article>`).join("")
      : `<div class="empty">Aucun produit ne correspond à votre recherche.</div>`;
  }

  function renderCart() {
    const t = totals();
    $("#cartCount").textContent = t.count;

    if (!state.cart.length) {
      $("#cartItems").innerHTML = `<div class="cart-empty"><div>🛍️</div><p>Votre panier est vide.</p></div>`;
      $("#cartFoot").innerHTML = `<button class="btn btn--primary btn--block" data-close>Continuer mes achats</button>`;
      return;
    }

    $("#cartItems").innerHTML = state.cart.map((l) => {
      const p = byId(l.id);
      const key = esc(lineKey(l.id, l.size));
      return `
        <div class="line">
          <div class="line__thumb" style="${bg(p)}">${media(p)}</div>
          <div>
            <div class="line__name">${esc(p.name)}</div>
            <div class="line__meta">${l.size ? `${esc(l.size)} · ` : ""}${money(p.price)}</div>
            <div class="qty" style="margin-top:6px">
              <button data-dec="${key}" aria-label="Retirer un">−</button>
              <span>${l.qty}</span>
              <button data-inc="${key}" aria-label="Ajouter un">+</button>
            </div>
          </div>
          <div class="line__right">
            <strong>${money(p.price * l.qty)}</strong>
            <button class="link-btn" data-remove="${key}">Supprimer</button>
          </div>
        </div>`;
    }).join("");

    const left = SHOP_CONFIG.freeShippingFrom - t.subtotal;
    $("#cartFoot").innerHTML = `
      ${left > 0 ? `<div class="hint">Plus que <strong>${money(left)}</strong> pour la livraison offerte !</div>` : `<div class="hint">🎉 Livraison offerte !</div>`}
      <div class="row"><span>Sous-total</span><span>${money(t.subtotal)}</span></div>
      <div class="row"><span>Livraison</span><span>${t.shipping ? money(t.shipping) : "Offerte"}</span></div>
      <div class="row row--total"><span>Total</span><span>${money(t.total)}</span></div>
      <button class="btn btn--primary btn--block" id="goCheckout">Passer la commande</button>`;
  }

  // ---------- Fiche produit ----------
  function openProduct(id) {
    const p = byId(id);
    if (!p) return;
    let size = null, qty = 1;
    const stockLabel = p.stock <= 0
      ? `<span class="stock stock--out">● Rupture de stock</span>`
      : p.stock <= 5
        ? `<span class="stock stock--low">● Plus que ${p.stock} en stock</span>`
        : `<span class="stock stock--ok">● En stock</span>`;

    $("#pmContent").innerHTML = `
      <div class="pm__media" style="${bg(p)}">${media(p)}</div>
      <div class="pm__info">
        <span class="card__cat">${esc(p.category)}</span>
        <h2 id="pmTitle">${esc(p.name)}</h2>
        <div class="rating">${stars(p.rating)} <span>${p.rating.toFixed(1)} / 5</span></div>
        <div class="price"><strong>${money(p.price)}</strong>${p.oldPrice ? `<s>${money(p.oldPrice)}</s>` : ""}</div>
        <p>${esc(p.description)}</p>
        ${stockLabel}
        ${p.sizes ? `<div><strong style="font-size:14px">Option</strong><div class="sizes" style="margin-top:6px">${p.sizes.map((s) => `<button class="size" data-size="${esc(s)}">${esc(s)}</button>`).join("")}</div></div>` : ""}
        <div class="pm__buy">
          <div class="qty"><button id="pmDec" aria-label="Moins">−</button><span id="pmQty">1</span><button id="pmInc" aria-label="Plus">+</button></div>
          <button class="btn btn--primary" id="pmAdd" style="flex:1" ${p.stock <= 0 ? "disabled" : ""}>${p.stock <= 0 ? "Épuisé" : "Ajouter au panier"}</button>
        </div>
      </div>`;

    const root = $("#pmContent");
    root.querySelectorAll(".size").forEach((b) => b.addEventListener("click", () => {
      root.querySelectorAll(".size").forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      size = b.dataset.size;
    }));
    $("#pmDec").onclick = () => { qty = Math.max(1, qty - 1); $("#pmQty").textContent = qty; };
    $("#pmInc").onclick = () => { qty = Math.min(Math.max(p.stock, 1), qty + 1); $("#pmQty").textContent = qty; };
    $("#pmAdd").onclick = () => {
      if (p.sizes && !size) return toast("Veuillez choisir une option");
      addToCart(p.id, qty, size);
      close($("#productModal"));
    };
    open($("#productModal"));
  }

  // ---------- Commande ----------
  function openCheckout() {
    if (!state.cart.length) return;
    const t = totals();
    $("#checkoutContent").innerHTML = `
      <h2 id="coTitle" style="margin-top:0">Finaliser ma commande</h2>
      <div class="summary">
        ${state.cart.map((l) => { const p = byId(l.id); return `<div class="row"><span>${l.qty} × ${esc(p.name)}${l.size ? ` (${esc(l.size)})` : ""}</span><span>${money(p.price * l.qty)}</span></div>`; }).join("")}
        <div class="row"><span>Livraison</span><span>${t.shipping ? money(t.shipping) : "Offerte"}</span></div>
        <div class="row row--total"><span>Total</span><span>${money(t.total)}</span></div>
      </div>
      <form class="form" id="checkoutForm" novalidate>
        <label>Prénom<input name="firstName" required autocomplete="given-name" /></label>
        <label>Nom<input name="lastName" required autocomplete="family-name" /></label>
        <label class="full">E-mail<input name="email" type="email" required autocomplete="email" /></label>
        <label class="full">Téléphone<input name="phone" type="tel" required autocomplete="tel" /></label>
        <label class="full">Adresse<input name="address" required autocomplete="street-address" /></label>
        <label>Ville<input name="city" required autocomplete="address-level2" /></label>
        <label>Code postal<input name="zip" autocomplete="postal-code" /></label>
        <div class="full payment">
          <strong style="font-size:14px">Mode de paiement</strong>
          <label><input type="radio" name="payment" value="Paiement à la livraison" checked /> 💵 Paiement à la livraison</label>
          <label><input type="radio" name="payment" value="Mobile Money" /> 📱 Mobile Money</label>
          <label><input type="radio" name="payment" value="Virement bancaire" /> 🏦 Virement bancaire</label>
        </div>
        <label class="full">Note (facultatif)<textarea name="note" rows="2"></textarea></label>
        <button class="btn btn--primary btn--block full" type="submit">Confirmer la commande · ${money(t.total)}</button>
      </form>`;

    $("#checkoutForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const form = e.currentTarget;
      const invalid = [...form.elements].find((el) => el.willValidate && !el.checkValidity());
      if (invalid) { invalid.focus(); invalid.reportValidity(); return; }
      placeOrder(Object.fromEntries(new FormData(form)));
    });
    close($("#cartDrawer"));
    open($("#checkoutModal"));
  }

  function placeOrder(customer) {
    const t = totals();
    const ref = "SF-" + Date.now().toString(36).toUpperCase().slice(-6);
    const lines = state.cart.map((l) => { const p = byId(l.id); return `- ${l.qty} × ${p.name}${l.size ? ` (${l.size})` : ""} : ${money(p.price * l.qty)}`; });
    const message = [
      `Nouvelle commande ${SHOP_CONFIG.name} — ${ref}`, "",
      ...lines,
      `Livraison : ${t.shipping ? money(t.shipping) : "offerte"}`,
      `TOTAL : ${money(t.total)}`, "",
      `Client : ${customer.firstName} ${customer.lastName}`,
      `Tél : ${customer.phone} · E-mail : ${customer.email}`,
      `Adresse : ${customer.address}, ${customer.zip || ""} ${customer.city}`.replace(/\s+/g, " "),
      `Paiement : ${customer.payment}`,
      customer.note ? `Note : ${customer.note}` : "",
    ].filter((x) => x !== "").join("\n");

    sendToNetlify({
      reference: ref,
      client: `${customer.firstName} ${customer.lastName}`,
      telephone: customer.phone,
      email: customer.email,
      adresse: `${customer.address}, ${customer.zip || ""} ${customer.city}`.replace(/\s+/g, " "),
      paiement: customer.payment,
      total: money(t.total),
      articles: lines.join("\n"),
      note: customer.note || "",
    });

    const wa = SHOP_CONFIG.whatsapp ? `https://wa.me/${SHOP_CONFIG.whatsapp}?text=${encodeURIComponent(message)}` : "";
    const mail = `mailto:${SHOP_CONFIG.email}?subject=${encodeURIComponent(`Commande ${ref}`)}&body=${encodeURIComponent(message)}`;

    $("#checkoutContent").innerHTML = `
      <div class="success">
        <div class="success__icon">🎉</div>
        <h2>Merci ${esc(customer.firstName)} !</h2>
        <p>Votre commande <strong>${ref}</strong> d'un montant de <strong>${money(t.total)}</strong> a bien été enregistrée.</p>
        <p>Pour confirmer plus rapidement, envoyez-nous aussi le récapitulatif :</p>
        ${wa ? `<a class="btn btn--whatsapp btn--block" href="${wa}" target="_blank" rel="noopener">💬 Envoyer sur WhatsApp</a>` : ""}
        <a class="btn btn--block" href="${mail}">✉️ Envoyer par e-mail</a>
        <button class="btn btn--primary btn--block" data-close>Retour à la boutique</button>
      </div>`;

    state.cart = [];
    saveCart();
    renderCart();
  }

  // Enregistre la commande dans Netlify Forms (visible dans le tableau de bord
  // Netlify, avec notification par e-mail). Sans effet hors de Netlify.
  function sendToNetlify(fields) {
    if (!SHOP_CONFIG.netlifyForms || location.protocol === "file:") return;
    const body = new URLSearchParams({ "form-name": "commande", ...fields }).toString();
    fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body })
      .catch(() => { /* la commande reste transmissible par WhatsApp ou e-mail */ });
  }

  // ---------- Modales / tiroir ----------
  let lastFocus = null;
  function open(el) {
    lastFocus = document.activeElement;
    el.hidden = false;
    document.body.classList.add("no-scroll");
    const first = el.querySelector("button, input, a");
    if (first) first.focus();
  }
  function close(el) {
    el.hidden = true;
    if (![...document.querySelectorAll(".modal, .drawer")].some((m) => !m.hidden)) document.body.classList.remove("no-scroll");
    if (lastFocus) lastFocus.focus();
  }

  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
  }

  // ---------- Événements ----------
  document.addEventListener("click", (e) => {
    const t = e.target.closest("button, a, [data-close]");
    if (!t) return;
    const d = t.dataset;
    if (d.close !== undefined) return close(t.closest(".modal, .drawer"));
    if (d.cat) { state.category = d.cat; renderFilters(); renderGrid(); }
    else if (d.add) addToCart(Number(d.add));
    else if (d.view) openProduct(Number(d.view));
    else if (d.inc || d.dec) {
      const key = d.inc || d.dec;
      const line = state.cart.find((l) => lineKey(l.id, l.size) === key);
      if (line) setQty(key, line.qty + (d.inc ? 1 : -1));
    }
    else if (d.remove) setQty(d.remove, 0);
    else if (t.id === "goCheckout") openCheckout();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    const openEl = [...document.querySelectorAll(".modal, .drawer")].reverse().find((m) => !m.hidden);
    if (openEl) close(openEl);
  });

  $("#openCart").addEventListener("click", () => open($("#cartDrawer")));
  $("#search").addEventListener("input", (e) => {
    state.query = e.target.value;
    if (state.query && state.category !== "Tout") { state.category = "Tout"; renderFilters(); }
    renderGrid();
  });
  $("#sort").addEventListener("change", (e) => { state.sort = e.target.value; renderGrid(); });
  $("#logo").addEventListener("click", (e) => { e.preventDefault(); window.scrollTo({ top: 0 }); });

  // ---------- Initialisation ----------
  document.title = `${SHOP_CONFIG.name} — Boutique en ligne`;
  $("#tagline").textContent = SHOP_CONFIG.tagline;
  $("#freeShip").textContent = money(SHOP_CONFIG.freeShippingFrom);
  $("#footerEmail").textContent = SHOP_CONFIG.email;
  $("#footerEmail").href = `mailto:${SHOP_CONFIG.email}`;
  $("#year").textContent = new Date().getFullYear();
  renderFilters();
  renderGrid();
  renderCart();
})();
