window.loginWith = async (provider) => {
    await window.supabase.auth.signInWithOAuth({ 
        provider: provider, 
        options: { redirectTo: window.location.origin + '/profile/' } 
    });
};
window.initAuth = async function() {
    const { data: { session } } = await window.supabase.auth.getSession();
    window.currentUser = session?.user;
    // Обновление UI хедера здесь если нужно
};