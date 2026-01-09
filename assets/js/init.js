// assets/js/init.js

document.addEventListener('DOMContentLoaded', async () => {
    console.log("Denmoth JS: Booting modules...");
    
    try {
        // ИСПРАВЛЕНО: Берем конфиг из правильного места
        const config = window.Denmoth ? window.Denmoth.Config : null;

        if (window.supabase && window.supabase.createClient && config) {
            // ИСПРАВЛЕНО: Передаем config.SUPABASE_URL
            window.supabase = window.supabase.createClient(config.SUPABASE_URL, config.SUPABASE_KEY);
            console.log("Supabase Client Ready");
            
            await window.initAuth();
            
            if (document.getElementById('comments-container')) {
                window.initCommentsModule();
            }
        } else {
            console.error("Critical: Supabase SDK or Config not loaded!", { sb: !!window.supabase, cfg: !!config });
        }
    } catch(e) {
        console.error("Initialization Critical Error:", e);
    }
    
    // UI инициализация
    if (window.initTheme) window.initTheme();
    if (window.initLangSwitcher) window.initLangSwitcher();
    if (window.initCopyButtons) window.initCopyButtons();
    if (window.initModalHandlers) window.initModalHandlers();
});
