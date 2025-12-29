document.addEventListener('DOMContentLoaded', () => {
  const translations = {
    en: {
      site_title: "Denmoth's Mods",
      nav_home: "Home",
      nav_cso: "Create: Structures Overhaul",
      nav_cubeui: "CubeUI",
      nav_aaso: "Ad Astra: Structures",
      nav_uncanny: "Uncanny",
      
      hub_title: "Denmoth's Mods",
      hub_subtitle: "Quality of life, structures, and tools for Minecraft.",
      hub_badge: "Official Hub",
      

      proj_title: "Projects",

      cso_desc: "World generation addon for Create. Adds handcrafted, biome-aware structures with functional contraptions.",
      cso_btn: "Documentation",

      cui_desc: "GUI Library for Forge. Features 9-slice rendering, custom widgets, and container integration.",
      cui_note: "Currently in Beta (0.1.0)",
      cui_btn: "API Reference",

      aaso_desc: "Expansion for Ad Astra. Adds abandoned bases, rovers, and alien ruins to planets.",
      aaso_btn: "Coming Soon",

      uncanny_desc: "Atmospheric horror expansion. Something is wrong with the silence.",
      uncanny_btn: "Coming Soon",
      
      footer_text: "© 2025 Denmoth"
    },
    ru: {
      site_title: "Моды Denmoth",
      nav_home: "Главная",
      nav_cso: "Create: Structures Overhaul",
      nav_cubeui: "CubeUI",
      nav_aaso: "Ad Astra: Structures",
      nav_uncanny: "Uncanny",

      hub_title: "Моды Denmoth",
      hub_subtitle: "Структуры, интерфейсы и инструменты для Minecraft.",
      hub_badge: "Официальный хаб",
      
      proj_title: "Проекты",
      
      cso_desc: "Аддон генерации для Create. Добавляет проработанные структуры с механизмами.",
      cso_btn: "Документация",
      
      cui_desc: "Библиотека интерфейсов (GUI). 9-slice рендер, виджеты и работа с контейнерами.",
      cui_note: "Сейчас в Бете (0.1.0)",
      cui_btn: "API Справка",
      
      aaso_desc: "Расширение для Ad Astra. Заброшенные базы, роверы и руины на планетах.",
      aaso_btn: "Скоро",
      
      uncanny_desc: "Атмосферный хоррор мод. С тишиной что-то не так.",
      uncanny_btn: "Скоро",
      
      footer_text: "© 2025 Denmoth"
    }
  };

  let currentLang = localStorage.getItem('cso_lang') || navigator.language.slice(0, 2).toLowerCase();
  if (!translations[currentLang]) currentLang = 'en';

  const langSelect = document.getElementById('language-select');
  if(langSelect) {
      langSelect.value = currentLang;
      langSelect.addEventListener('change', () => {
          localStorage.setItem('cso_lang', langSelect.value);
          location.reload(); 
      });
  }

  function loadLanguage() {
    const t = translations[currentLang] || translations.en;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key]) el.textContent = t[key];
    });
  }
  loadLanguage();
  
  if (!localStorage.getItem('theme')) document.body.classList.add('dark');
});
