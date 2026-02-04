document.addEventListener('DOMContentLoaded', async () => {
    const config = window.Denmoth?.Config;
    if (window.supabase?.createClient && config) {
        window.supabase = window.supabase.createClient(config.SUPABASE_URL, config.SUPABASE_KEY);
        if(window.initAuth) await window.initAuth();
    }
    if(window.initModalHandlers) window.initModalHandlers();
});