// --- MAIN INITIALIZATION ---

document.addEventListener('DOMContentLoaded', async () => {
    console.log("Denmoth JS: Booting modules...");
    
    // 1. Инит конфига и библиотек
    try {
        // FIX: Берем конфиг из правильного места
        const config = window.Denmoth ? window.Denmoth.Config : null;

        if (window.supabase && window.supabase.createClient && config) {
            // FIX: Используем полученный конфиг
            window.supabase = window.supabase.createClient(config.SUPABASE_URL, config.SUPABASE_KEY);
            console.log("Supabase Client Ready");
            
            // 2. Инит Аутентификации (асинхронно)
            await window.initAuth();
            
            // 3. Инит Комментариев (если есть блок)
            if (document.getElementById('comments-container')) {
                window.initCommentsModule();
            }
        } else {
            console.error("Supabase SDK not loaded or Config missing!");
        }
    } catch(e) {
        console.error("Initialization Critical Error:", e);
    }
    
    // 4. Инит UI (синхронно)
    if(window.initTheme) window.initTheme();
    if(window.initLangSwitcher) window.initLangSwitcher();
    if(window.initCopyButtons) window.initCopyButtons();
    if(window.initModalHandlers) window.initModalHandlers();
    
    // 5. Инит поиска (если мы на странице tools)
    if(window.initToolSearch) window.initToolSearch();
});
