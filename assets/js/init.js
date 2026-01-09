// --- MAIN INITIALIZATION ---

document.addEventListener('DOMContentLoaded', async () => {
    console.log("Denmoth JS: Booting modules...");
    
    // 1. Инит конфига и библиотек
    try {
        if (window.supabase && window.supabase.createClient) {
            window.supabase = window.supabase.createClient(window.DENMOTH_CONFIG.SUPABASE_URL, window.DENMOTH_CONFIG.SUPABASE_KEY);
            console.log("Supabase Client Ready");
            
            // 2. Инит Аутентификации (асинхронно)
            await window.initAuth();
            
            // 3. Инит Комментариев (если есть блок)
            if (document.getElementById('comments-container')) {
                window.initCommentsModule();
            }
        } else {
            console.error("Supabase SDK not loaded!");
        }
    } catch(e) {
        console.error("Initialization Critical Error:", e);
    }
    
    // 4. Инит UI (синхронно)
    window.initTheme();
    window.initLangSwitcher();
    window.initCopyButtons();
    window.initModalHandlers();
});
