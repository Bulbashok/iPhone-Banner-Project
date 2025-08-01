let translations = {};

document.addEventListener("DOMContentLoaded", function () {
  const htmlElement = document.documentElement;
  const lang = getCurrentLanguage();

  setupEventListeners();
  loadTranslations(lang).then(() => {
    applyTranslations(lang);
    adaptForDevice();
  });

  window.addEventListener("resize", adaptForDevice);
});

function getCurrentLanguage() {
  const supportedLangs = ["de", "en", "es", "fr", "ja", "pt"];
  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get("lang");

  if (langParam && supportedLangs.includes(langParam)) {
    return langParam;
  }

  const browserLang = navigator.language.substring(0, 2);
  return supportedLangs.includes(browserLang) ? browserLang : "en";
}

async function loadTranslations(lang) {
  try {
    const response = await fetch(`/lang/${lang}.json`);
    if (!response.ok) throw new Error("Language not found");
    translations = await response.json();
  } catch (error) {
    console.error(`Failed to load ${lang} translations:`, error);
    if (lang !== "en") {
      await loadTranslations("en"); // Fallback to English
    }
  }
}

function applyTranslations(lang) {
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-translate]").forEach((el) => {
    const key = el.getAttribute("data-translate");
    if (translations[key]) {
      el.innerHTML = processTranslation(translations[key], el);
    }
  });

  updatePriceElements();
  adjustStylesForLanguage(lang);
}

function processTranslation(translation, element) {
  return translation.replace(/<br>/g, "<br/>");
}

function updatePriceElements() {
  document.querySelectorAll("[data-price]").forEach((el) => {
    const price = el.getAttribute("data-price");
    const translationKey = el.getAttribute("data-translate");

    if (translations[translationKey]) {
      el.innerHTML = translations[translationKey]
        .replace("{{price}}", price)
        .replace(/<br>/g, "<br/>");
    }
  });
}

function adjustStylesForLanguage(lang) {
  const title = document.getElementById("title");

  if (["de", "fr"].includes(lang)) {
    title.style.fontSize = "36px";
    title.style.lineHeight = "40px";
  } else {
    title.style.fontSize = "";
    title.style.lineHeight = "";
  }
}

function adaptForDevice() {
  const width = window.innerWidth;
  const banner = document.querySelector(".banner-container");
  const title = document.querySelector(".title");

  if (width <= 375) {
    // iPhone SE, 8
    banner.style.backgroundPosition = "center 30%";
    title.style.marginTop = "120px";
  } else if (width <= 414) {
    // iPhone 8+
    banner.style.backgroundPosition = "center 35%";
  }
}

function setupEventListeners() {
  document
    .querySelectorAll(".access-buttons-container .action-btn")
    .forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault();

        // Сбрасываем все кнопки
        document
          .querySelectorAll(".access-buttons-container .action-btn")
          .forEach((btn) => {
            btn.classList.remove("active");
            btn.classList.add("inactive");
            // Удаляем active у всех бейджей
            btn.querySelector(".best-offer-badge")?.classList.remove("active");
          });

        // Активируем текущую кнопку
        this.classList.add("active");
        this.classList.remove("inactive");

        // Активируем бейдж только если он есть у текущей кнопки
        if (this.querySelector(".best-offer-badge")) {
          this.querySelector(".best-offer-badge").classList.add("active");
        }
      });
    });

  document.querySelector(".close-btn").addEventListener("click", function (e) {
    e.preventDefault();
    console.log("Close button clicked");
  });

  document
    .getElementById("btn-continue")
    .addEventListener("click", function (e) {
      e.preventDefault();
      console.log("Continue button clicked");
    });
}
