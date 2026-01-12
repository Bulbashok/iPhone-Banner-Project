const SUPPORTED_LANGS = ["de", "en", "es", "fr", "ja", "pt"];
let translations = {};

const lang = getCurrentLanguage();
setupEventListeners();
loadTranslations(lang).then(() => {
  applyTranslations(lang);
});

function getCurrentLanguage() {
  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get("lang");
  if (langParam && SUPPORTED_LANGS.includes(langParam)) {
    return langParam;
  }
  const browserLang = navigator.language.substring(0, 2);
  return SUPPORTED_LANGS.includes(browserLang) ? browserLang : "en";
}

async function loadTranslations(lang) {
  try {
    const response = await fetch(`/lang/${lang}.json`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    translations = await response.json();
  } catch (error) {
    console.error(`Failed to load ${lang} translations:`, error);
    if (lang !== "en") {
      await loadTranslations("en");
    }
  }
}

function applyTranslations(lang) {
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-translate]").forEach((el) => {
    const key = el.getAttribute("data-translate");
    const price = el.getAttribute("data-price");
    const text = translations[key] || "";

    if (text) {
      const finalText = price ? text.replace("{{price}}", price) : text;
      el.innerHTML = finalText;
    }
  });
}

function setupEventListeners() {
  const container = document.querySelector(".access-buttons-container");
  if (container) {
    container.addEventListener("click", function (e) {
      const btn = e.target.closest(".action-btn");
      if (!btn) return;
      e.preventDefault();

      container.querySelectorAll(".action-btn").forEach((b) => {
        b.classList.remove("active");
        b.classList.add("inactive");
        b.querySelector(".best-offer-badge")?.classList.remove("active");
      });

      btn.classList.add("active");
      btn.classList.remove("inactive");
      btn.querySelector(".best-offer-badge")?.classList.add("active");
    });
  }

  document.querySelector(".close-btn")?.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("Close button clicked");
  });

  document
    .getElementById("btn-continue")
    .addEventListener("click", function (e) {
      e.preventDefault();
      const activeBtn = document.querySelector(
        ".access-buttons-container .action-btn.active"
      );
      if (activeBtn.id === "btn-restore") {
        window.location.href = "https://apple.com/";
      } else if (activeBtn.id === "btn-restore-weekly") {
        window.location.href = "https://google.com/";
      }
    });
}
