// --- AUTH MODULE ---

window.loginWith = async (provider) => {
    await window.supabase.auth.signInWithOAuth({ 
        provider: provider, 
        options: { redirectTo: window.location.origin + '/profile/' } 
    });
};

window.initAuth = async function() {
    const { data: { session } } = await window.supabase.auth.getSession();
    await window.handleUserSession(session?.user);

    window.supabase.auth.onAuthStateChange(async (_event, session) => {
        await window.handleUserSession(session?.user);
    });
};

window.handleUserSession = async function(user) {
    window.currentUser = user;
    window.isAdmin = user?.email === window.DENMOTH_CONFIG.ADMIN_EMAIL;
    
    window.updateHeaderUI(user);
    
    // Рендер профиля, если мы на странице профиля
    if (window.location.pathname.includes('/profile/') && typeof window.renderProfilePage === 'function') {
        window.renderProfilePage(user, window.isAdmin);
    }
};

window.updateHeaderUI = function(user) {
    const loginBtn = document.getElementById('login-btn');
    if(!loginBtn) return;

    if (user) {
        const avatar = user.user_metadata.avatar_url || 'https://www.gravatar.com/avatar/?d=mp';
        const name = user.user_metadata.full_name || user.email.split('@')[0];
        const borderStyle = window.isAdmin ? 'border: 2px solid #d73a49;' : 'border: 1px solid var(--border);';
        const adminIcon = window.isAdmin ? '<i class="fa-solid fa-crown" style="color:#d73a49; margin-right:5px;"></i>' : '';

        const newBtn = loginBtn.cloneNode(false);
        newBtn.innerHTML = `
            <img src="${avatar}" style="width:24px; height:24px; border-radius:50%; object-fit:cover; margin-right:8px; ${borderStyle}">
            <span>${adminIcon}${name}</span>
        `;
        newBtn.href = "/profile/";
        newBtn.id = "login-btn";
        newBtn.onclick = null;
        
        if(loginBtn.parentNode) loginBtn.parentNode.replaceChild(newBtn, loginBtn);
    } else {
        const isRu = window.location.pathname.startsWith('/ru');
        loginBtn.innerHTML = `<i class="fa-brands fa-github"></i> <span>${isRu ? 'Войти' : 'Log In'}</span>`;
        loginBtn.href = "#";
        loginBtn.onclick = (e) => { 
            e.preventDefault(); 
            window.openAuthModal(); 
        };
    }
};

// --- PROFILE PAGE LOGIC ---

window.renderProfilePage = async function(user, isAdmin) {
    const loading = document.getElementById('profile-loading');
    const content = document.getElementById('profile-content');
    const guest = document.getElementById('guest-view');
    
    if(!content) return;
    if(loading) loading.style.display = 'none';
    
    if(user) {
        content.style.display = 'block';
        if(guest) guest.style.display = 'none';
        
        document.getElementById('p-avatar').src = user.user_metadata.avatar_url;
        document.getElementById('p-name').textContent = user.user_metadata.full_name || 'User';
        document.getElementById('p-email').textContent = user.email;

        if (isAdmin) {
            document.getElementById('p-status-badge').style.backgroundColor = '#d73a49';
            document.getElementById('p-status-badge').innerHTML = '<i class="fa-solid fa-shield-halved"></i> Administrator';
            document.getElementById('btn-tab-admin').style.display = 'inline-flex';
            if(window.loadBannedUsers) window.loadBannedUsers();
        }

        // Загрузка настроек (maybeSingle чтобы не было 406)
        const { data } = await window.supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
        if (data) {
            const ls = document.getElementById('pref-lang');
            const ns = document.getElementById('pref-email-notif');
            if(ls && data.language) ls.value = data.language;
            if(ns && data.email_notif !== undefined) ns.checked = data.email_notif;
        }
    } else {
        content.style.display = 'none';
        if(guest) guest.style.display = 'block';
    }
};

window.saveProfile = async function() {
    if(!window.currentUser) return;
    const btn = document.getElementById('save-settings-btn');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
    btn.disabled = true;

    const lang = document.getElementById('pref-lang').value;
    const notif = document.getElementById('pref-email-notif').checked;

    const { error } = await window.supabase.from('profiles').upsert({ 
        id: window.currentUser.id, 
        language: lang, 
        email_notif: notif,
        updated_at: new Date()
    });

    if (!error) {
        btn.innerHTML = 'Saved!';
        btn.style.color = '#238636';
        
        const path = window.location.pathname;
        if ((lang === 'ru' && !path.startsWith('/ru')) || (lang === 'en' && path.startsWith('/ru'))) {
            setTimeout(() => window.location.href = lang === 'ru' ? '/ru/profile/' : '/profile/', 500);
        } else {
            setTimeout(() => { btn.innerHTML = 'Save Changes'; btn.disabled = false; btn.style.color = ''; }, 2000);
        }
    } else {
        btn.innerHTML = 'Error';
        alert("Save Error: " + error.message);
        btn.disabled = false;
    }
};

window.switchTab = function(tabName) {
    document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.settings-section').forEach(s => s.classList.remove('active'));
    if(event.currentTarget) event.currentTarget.classList.add('active');
    document.getElementById('tab-' + tabName).classList.add('active');
};
