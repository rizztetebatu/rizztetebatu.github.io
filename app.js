/* ===== Rizz Tetebatu: how the page is built =====
   Normally you do not need to change this file.
   Prices and contact: config.js. Texts: lang/<language>.js. Layout and colours: index.html. */
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const waLink = text => "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(text);
const waIcon = '<svg class="wa" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Z"/></svg>';

/* Language names as shown in the menu, in the order of the menu */
const LANGS = {en:"English",nl:"Nederlands",de:"Deutsch",fr:"Français",es:"Español",it:"Italiano",pt:"Português",id:"Bahasa Indonesia",ms:"Bahasa Melayu",
  zh:"中文",ja:"日本語",ko:"한국어",th:"ไทย",vi:"Tiếng Việt",hi:"हिन्दी",ru:"Русский",uk:"Українська",pl:"Polski",cs:"Čeština",hu:"Magyar",ro:"Română",
  sv:"Svenska",da:"Dansk",nb:"Norsk",fi:"Suomi",tr:"Türkçe",ar:"العربية",he:"עברית"};
const RTL = ["ar","he"];
const PP = {en:"per person",nl:"per persoon",de:"pro Person",fr:"par personne",es:"por persona",it:"a persona",pt:"por pessoa",id:"per orang",ms:"seorang",
  zh:"每人",ja:"1人あたり",ko:"1인당",th:"ต่อคน",vi:"mỗi người",hi:"प्रति व्यक्ति",ru:"с человека",uk:"з особи",pl:"za osobę",cs:"za osobu",hu:"/ fő",ro:"de persoană",
  sv:"per person",da:"per person",nb:"per person",fi:"/ hlö",tr:"kişi başı",ar:"للشخص",he:"לאדם"};
/* Approximate price in the visitor's own currency. Rizz is paid in cash in IDR; this is only a guide.
   Rates refresh daily from a free source; the table below is the fallback (23 Nov 2026). */
const RATES_FALLBACK = {EUR:4.996e-5,USD:5.496e-5,GBP:4.186e-5,AUD:8.272e-5,CAD:7.869e-5,NZD:1.0033e-4,CHF:4.609e-5,SGD:7.086e-5,
  MYR:2.265e-4,CNY:3.665e-4,JPY:8.737e-3,KRW:7.387e-2,THB:1.870e-3,VND:1.4187,INR:5.101e-3,RUB:4.468e-3,UAH:2.470e-3,PLN:2.224e-4,
  CZK:1.222e-3,HUF:1.858e-2,RON:2.673e-4,SEK:5.602e-4,DKK:3.734e-4,NOK:5.344e-4,TRY:2.781e-3,ILS:1.829e-4,SAR:2.061e-4,AED:2.018e-4,
  BRL:3.272e-4,HKD:4.308e-4,TWD:1.808e-3,PHP:3.508e-3};
let RATES = RATES_FALLBACK;
const CUR_LANG = {en:"USD",nl:"EUR",de:"EUR",fr:"EUR",es:"EUR",it:"EUR",pt:"EUR",fi:"EUR",ms:"MYR",zh:"CNY",ja:"JPY",ko:"KRW",th:"THB",
  vi:"VND",hi:"INR",ru:"RUB",uk:"UAH",pl:"PLN",cs:"CZK",hu:"HUF",ro:"RON",sv:"SEK",da:"DKK",nb:"NOK",tr:"TRY",ar:"USD",he:"ILS"};
const EURO = "AT BE CY DE EE ES FI FR GR HR IE IT LT LU LV MT NL PT SI SK".split(" ");
const CUR_REGION = {US:"USD",GB:"GBP",AU:"AUD",CA:"CAD",NZ:"NZD",CH:"CHF",SG:"SGD",MY:"MYR",CN:"CNY",JP:"JPY",KR:"KRW",TH:"THB",VN:"VND",
  IN:"INR",RU:"RUB",UA:"UAH",PL:"PLN",CZ:"CZK",HU:"HUF",RO:"RON",SE:"SEK",DK:"DKK",NO:"NOK",TR:"TRY",IL:"ILS",SA:"SAR",AE:"AED",BR:"BRL",
  HK:"HKD",TW:"TWD",PH:"PHP",ID:""};
function currencyFor(lang){
  const prefs = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ""]);
  for (const p of prefs){
    const parts = String(p).split("-"); const base = ALIAS[parts[0].toLowerCase()] || parts[0].toLowerCase();
    const region = (parts.find((x,i) => i > 0 && /^[A-Za-z]{2}$/.test(x)) || "").toUpperCase();
    if (base === lang && region){
      if (EURO.includes(region)) return "EUR";
      if (region in CUR_REGION) return CUR_REGION[region];
    }
  }
  return CUR_LANG[lang] || "";
}
function approx(idr, lang){
  const cur = currencyFor(lang); const rate = RATES[cur];
  if (!cur || !rate || !idr) return "";
  let v = idr * rate;
  v = v < 100 ? Math.round(v) : Number(v.toPrecision(2));
  try{ return "≈ " + new Intl.NumberFormat(lang, {style:"currency", currency:cur, maximumFractionDigits:0, minimumFractionDigits:0}).format(v); }
  catch(e){ return "≈ " + v + " " + cur; }
}
function loadRates(){
  try{
    const c = JSON.parse(localStorage.getItem("rizz-rates") || "null");
    if (c && c.rates) RATES = Object.assign({}, RATES_FALLBACK, c.rates);
    if (c && c.day === new Date().toISOString().slice(0,10)) return;
  }catch(e){}
  const urls = ["https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/idr.json",
                "https://latest.currency-api.pages.dev/v1/currencies/idr.json"];
  (function next(i){
    if (i >= urls.length) return;
    fetch(urls[i]).then(r => r.ok ? r.json() : Promise.reject()).then(d => {
      const fresh = {};
      Object.keys(RATES_FALLBACK).forEach(k => { const v = d && d.idr && d.idr[k.toLowerCase()]; if (typeof v === "number" && v > 0) fresh[k] = v; });
      if (!Object.keys(fresh).length) return next(i + 1);
      RATES = Object.assign({}, RATES_FALLBACK, fresh);
      try{ localStorage.setItem("rizz-rates", JSON.stringify({day:new Date().toISOString().slice(0,10), rates:fresh})); }catch(e){}
      render(T[document.getElementById("langSel").value] ? document.getElementById("langSel").value : "en");
    }).catch(() => next(i + 1));
  })(0);
}
const RIZZ_READS = ["en","nl","de","fr","id","ms"];   /* WhatsApp messages go to Rizz in a language he reads */
const ALIAS = {no:"nb",nn:"nb",iw:"he",in:"id",fil:"en"};
/* The language was picked early in index.html (RIZZ_LANG), so its file could start loading at once */
function pickLang(){ return (window.RIZZ_LANG && LANGS[window.RIZZ_LANG]) ? window.RIZZ_LANG : "en"; }
/* Load lang/<code>.js once, then call done (English is already loaded by index.html) */
function loadLang(code, done){
  if (T[code]) return done(code);
  const s = document.createElement("script");
  s.src = "lang/" + code + ".js";
  s.onload = () => done(T[code] ? code : "en");
  s.onerror = () => done("en");
  document.head.appendChild(s);
}
/* Price label from the number in config.js: 350000 becomes "IDR 350K" */
const priceLabel = idr => "IDR " + (idr % 1000 === 0 ? (idr / 1000) + "K" : idr.toLocaleString("id-ID"));
/* Business info for Google (built from CONFIG, so prices stay in one place) */
(function(){
  try {
    var en = T.en, priced = CONFIG.tours.filter(function(t){ return t.idr; });
    var nums = priced.map(function(t){ return t.idr; });
    var fmt = function(n){ return "IDR " + n.toLocaleString("id-ID"); };
    var ld = {
      "@context": "https://schema.org",
      "@type": "TravelAgency",
      "name": "Rizz Tetebatu",
      "description": "Local guide in Tetebatu, Lombok: rice field walks, spice gardens, waterfalls, the monkey forest and Mount Rinjani.",
      "url": "https://rizztetebatu.com/",
      "image": "https://rizztetebatu.com/img/hero.jpg",
      "telephone": "+" + CONFIG.whatsapp,
      "email": CONFIG.email,
      "address": { "@type": "PostalAddress", "streetAddress": "Jalan Desa Tetebatu", "addressLocality": "Tetebatu", "addressRegion": "Nusa Tenggara Barat", "addressCountry": "ID" },
      "geo": { "@type": "GeoCoordinates", "latitude": -8.528, "longitude": 116.414 },
      "areaServed": "Tetebatu, Lombok Timur",
      "priceRange": nums.length ? fmt(Math.min.apply(null, nums)) + " to " + fmt(Math.max.apply(null, nums)) : undefined,
      "knowsLanguage": ["id", "en"],
      "sameAs": ["https://www.instagram.com/" + CONFIG.instagram].concat(CONFIG.tiktok ? ["https://www.tiktok.com/@" + CONFIG.tiktok] : []).concat(CONFIG.googleMapsUrl ? [CONFIG.googleMapsUrl] : []),
      "makesOffer": priced.map(function(t){ return { "@type": "Offer", "name": en["tour_" + t.id + "_t"], "description": en["tour_" + t.id + "_p"], "price": String(t.idr), "priceCurrency": "IDR" }; })
    };
    var s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(ld);
    document.head.appendChild(s);
  } catch (e) {}
})();

function render(lang){
  const t = Object.assign({}, T.en, T[lang]);   /* missing text falls back to English */
  document.documentElement.lang = lang;
  document.documentElement.dir = RTL.includes(lang) ? "rtl" : "ltr";
  document.getElementById("langSel").value = lang;
  const w = RIZZ_READS.includes(lang) ? t : T.en;
  document.querySelectorAll("[data-i18n]").forEach(el => { const k = el.dataset.i18n; if (t[k]) el.textContent = t[k]; });
  document.querySelectorAll("[data-i18n-html]").forEach(el => { el.innerHTML = t[el.dataset.i18nHtml]; });
  document.querySelectorAll(".js-wa").forEach(a => a.href = waLink(w.wa_general));
  document.getElementById("promises").innerHTML = t.promises.map(([b,s]) => "<li><b>" + esc(b) + "</b><span>" + esc(s) + "</span></li>").join("");

  document.getElementById("tourList").innerHTML = CONFIG.tours.map(tour => {
    const k = "tour_" + tour.id + "_";
    const hours = /^\d+(-\d+)?$/.test(tour.hours) ? tour.hours + " " + t.hours : tour.hours;
    const price = tour.idr ? esc(priceLabel(tour.idr)) + " <small>" + esc(PP[lang] || PP.en) + "</small>" : esc(t.ask_price);
    const conv = tour.idr ? approx(tour.idr, lang) : "";
    const photo = tour.photo ? '<img src="' + esc(tour.photo) + '" width="1200" height="900" loading="lazy" alt="' + esc(t[k+"t"]) + '">' : esc(t.photo);
    const note = t[k+"n"] ? '<p class="note">' + esc(t[k+"n"]) + '</p>' : "";
    const facts = [
      tour.start ? [t.l_start, tour.start] : null,
      [t.l_level, t.level[tour.level]],
      [t.l_incl, t[k+"inc"]],
      tour.id !== "rinjani" ? [t.l_bring, t.bring_walk] : null
    ].filter(Boolean).map(([a,b]) => "<dt>" + esc(a) + "</dt><dd>" + esc(b) + "</dd>").join("");
    return '<article class="tour"><div class="photo">' + photo + '</div><div class="body">' +
      '<div class="meta"><span>' + esc(hours) + '</span><span class="price">' + price + '</span>' + (conv ? '<span class="conv">' + esc(conv) + '</span>' : '') + '</div>' +
      '<h3>' + esc(t[k+"t"]) + '</h3><p>' + esc(t[k+"p"]) + '</p>' +
      '<ul>' + t[k+"i"].map(i => '<li>' + esc(i) + '</li>').join("") + '</ul>' +
      '<dl class="facts">' + facts + '</dl>' + note +
      '<a class="btn" target="_blank" rel="noopener" href="' + waLink(w.wa_tour + w[k+"t"]) + '">' + waIcon + esc(t.book) + '</a></div></article>';
  }).join("");

  document.getElementById("moreList").innerHTML = t.more.map(m => '<span class="chip">' + esc(m) + '</span>').join("");
  document.getElementById("plants").innerHTML = t.plants.map(p => "<span>" + esc(p) + "</span>").join("");
  document.getElementById("faq").innerHTML = t.faq.map(([q,a]) => "<details><summary>" + esc(q) + "</summary><p>" + esc(a) + "</p></details>").join("");
  if (CONFIG.photos.about) document.getElementById("aboutPhoto").innerHTML = '<img src="' + esc(CONFIG.photos.about) + '" width="880" height="1100" loading="lazy" alt="Rizz">';
}
function setup(){
  const maps = CONFIG.googleMapsUrl || "https://www.google.com/maps/search/Rizz+Tetebatu";
  document.getElementById("waNum").textContent = "+" + CONFIG.whatsapp;
  document.getElementById("igLink").href = "https://instagram.com/" + CONFIG.instagram;
  const tt = document.getElementById("ttLink");
  if (CONFIG.tiktok) tt.href = "https://www.tiktok.com/@" + CONFIG.tiktok; else tt.remove();
  document.getElementById("mailLink").href = "mailto:" + CONFIG.email;
  document.getElementById("mailLink").textContent = CONFIG.email;
  document.getElementById("mapsLink").href = maps;
  document.getElementById("revRead").href = maps;
  document.getElementById("revWrite").href = CONFIG.googleReviewUrl || maps;
  const sel = document.getElementById("langSel");
  sel.innerHTML = Object.keys(LANGS).map(c => '<option value="' + c + '">' + LANGS[c] + '</option>').join("");
  sel.addEventListener("change", () => {
    try{ localStorage.setItem("rizz-lang", sel.value); }catch(e){}
    loadLang(sel.value, render);
  });
  loadLang(pickLang(), lang => { render(lang); loadRates(); });
}
setup();
