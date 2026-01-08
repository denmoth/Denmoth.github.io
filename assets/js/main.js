// ==========================================
// CONFIGURATION
// ==========================================
const SUPABASE_URL = 'https://dtkmclmaboutpbeogqmw.supabase.co'; 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0a21jbG1hYm91dHBiZW9ncW13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNDA4NDUsImV4cCI6MjA4MjYxNjg0NX0.BcfRGmUuOKkAs5KYrLNyoymry1FnY4jqQyCanZ4x-PM';

let supabase; 
let currentUser = null;

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const { createClient } = window.supabase;
        supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
        
        await initAuth();
        initComments();
        
        // Запускаем профиль ТОЛЬКО если функция существует (логика может быть локальной)
        if (typeof initProfile === 'function') {
            initProfile(); 
        } else {
            // Если мы на странице профиля, но функции нет - обрабатываем тут
            if(window.location.pathname === '/profile/') {
                checkProfilePage();
            }
        }
    } catch(e) {
        console.error("Supabase init failed:", e);
    }
    
    initTheme();
    initLangSwitcher();
    initCopyButtons();
});

// ==========================================
// AUTHENTICATION MODULE
// ==========================================
async function initAuth() {
    // Проверка текущей сессии
    const { data: { session } } = await supabase.auth.getSession();
    updateUserUI(session?.user);

    // Подписка на изменения (вход/выход)
    supabase.auth.onAuthStateChange((_event, session) => {
        updateUserUI(session?.user);
    });
}

function updateUserUI(user) {
    currentUser = user;
    const loginBtn = document.getElementById('login-btn');
    if(!loginBtn) return;

    if (user) {
        const avatar = user.user_metadata.avatar_url || 'https://www.gravatar.com/avatar/?d=mp';
        const name = user.user_metadata.full_name || user.email.split('@')[0];
        
        // Меняем кнопку "Войти" на мини-профиль
        loginBtn.innerHTML = `
            <img src="${avatar}" style="width:24px; height:24px; border-radius:50%; object-fit:cover; margin-right:8px; border:1px solid var(--border);">
            <span>${name}</span>
        `;
        loginBtn.href = "/profile/";
        // Убираем onclick чтобы ссылка работала как переход
        loginBtn.onclick = null; 
        
        // Если мы уже на странице профиля - обновляем данные
        if(window.location.pathname === '/profile/') {
            checkProfilePage();
        }
    } else {
        // Возвращаем кнопку входа
        loginBtn.innerHTML = `<i class="fa-brands fa-github"></i> <span>Log In</span>`;
        loginBtn.href = "#";
        loginBtn.onclick = (e) => { 
            e.preventDefault(); 
            openAuthModal(); 
        };
    }
}

// Логика страницы профиля (перенесена из profile.html чтобы не терялась)
function checkProfilePage() {
    const loading = document.getElementById('profile-loading');
    const content = document.getElementById('profile-content');
    const guest = document.getElementById('guest-view');
    
    if(!content) return;

    if(loading) loading.style.display = 'none';
    
    if(currentUser) {
        content.style.display = 'block';
        if(guest) guest.style.display = 'none';
        
        const avatar = currentUser.user_metadata.avatar_url || 'https://www.gravatar.com/avatar/?d=mp';
        const name = currentUser.user_metadata.full_name || 'User';
        
        const pAvatar = document.getElementById('p-avatar');
        const pName = document.getElementById('p-name');
        const pEmail = document.getElementById('p-email');
        
        if(pAvatar) pAvatar.src = avatar;
        if(pName) pName.textContent = name;
        if(pEmail) pEmail.textContent = currentUser.email;
    } else {
        content.style.display = 'none';
        if(guest) guest.style.display = 'block';
    }
}

// ==========================================
// COMMENTS MODULE
// ==========================================
async function initComments() {
    const container = document.getElementById('comments-container');
    const list = document.getElementById('comments-list');
    
    if (!container || !list) return;

    const pageSlug = window.location.pathname;

    try {
        const { data: comments, error } = await supabase
            .from('comments')
            .select('*')
            .eq('page_slug', pageSlug)
            .order('created_at', { ascending: false });

        if(error) throw error;
        renderComments(comments || []);
    } catch (e) {
        console.error("Comments error:", e);
        list.innerHTML = `
            <div style="text-align:center; padding:20px; color:#d73a49;">
                <i class="fa-solid fa-triangle-exclamation"></i> Error loading comments.<br>
                <span style="font-size:0.8rem; color:var(--text-muted);">Ensure 'comments' table exists & RLS enabled.</span>
            </div>
        `;
    }

    const sendBtn = document.getElementById('send-comment');
    if(sendBtn) {
        sendBtn.onclick = async () => {
            const input = document.getElementById('comment-input');
            const content = input.value.trim();
            if(!content) return;

            // Блокируем кнопку
            sendBtn.disabled = true;
            sendBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

            const guestNameInput = document.getElementById('guest-name');
            let authorName = "Guest";
            let authorAvatar = null;
            let userId = null;
            let isGuest = true;

            if(currentUser) {
                authorName = currentUser.user_metadata.full_name || currentUser.email.split('@')[0];
                authorAvatar = currentUser.user_metadata.avatar_url;
                userId = currentUser.id;
                isGuest = false;
            } else if (guestNameInput) {
                authorName = guestNameInput.value.trim() || "Guest";
            }

            const { error: postError } = await supabase.from('comments').insert({
                page_slug: pageSlug,
                content: content,
                author_name: authorName,
                author_avatar: authorAvatar,
                user_id: userId,
                is_guest: isGuest
            });

            sendBtn.disabled = false;
            sendBtn.innerHTML = 'Post';

            if(!postError) {
                input.value = '';
                initComments(); // Refresh list
            } else {
                alert("Failed to post: " + postError.message);
            }
        };
    }
}

function renderComments(comments) {
    const list = document.getElementById('comments-list');
    if(!list) return;
    
    if(comments.length === 0) {
        list.innerHTML = `<div style="text-align:center; color:var(--text-muted); padding:20px;">No comments yet. Be the first!</div>`;
        return;
    }

    list.innerHTML = comments.map(c => `
        <div class="comment-box">
            <div class="comment-header">
                <img src="${c.author_avatar || 'https://www.gravatar.com/avatar/?d=mp'}" class="comment-avatar">
                <span class="comment-author">${escapeHtml(c.author_name)}</span>
                ${c.is_guest ? '<span class="guest-tag">Guest</span>' : ''}
                <span class="comment-date" style="margin-left:auto;">${new Date(c.created_at).toLocaleDateString()}</span>
            </div>
            <div class="comment-body">${escapeHtml(c.content)}</div>
        </div>
    `).join('');
}

// ==========================================
// UTILS & UI
// ==========================================
function initTheme() {
    const btn = document.getElementById('theme-toggle');
    let current = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', current);
    
    if(btn) {
        btn.textContent = current === 'dark' ? '🌙' : '☀️';
        btn.onclick = () => {
            current = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', current);
            localStorage.setItem('theme', current);
            btn.textContent = current === 'dark' ? '🌙' : '☀️';
        };
    }
}

function initLangSwitcher() {
    const select = document.getElementById('lang-select');
    if(!select) return;
    select.addEventListener('change', (e) => {
        const target = e.target.value;
        const path = window.location.pathname;
        if (target === 'ru' && !path.startsWith('/ru')) window.location.href = '/ru' + path;
        else if (target === 'en' && path.startsWith('/ru')) window.location.href = path.replace('/ru', '') || '/';
    });
}

function initCopyButtons() {
    document.querySelectorAll('.result-group, .code-container').forEach(group => {
        if(group.querySelector('.copy-icon-btn, .copy-btn')) return;
        
        let target = group.querySelector('input, textarea');
        if (!target) target = group.querySelector('pre, code');

        const btn = document.createElement('button');
        if (group.classList.contains('code-container')) {
            btn.className = 'copy-btn btn';
            btn.innerHTML = 'Copy';
            btn.style.cssText = 'position:absolute; right:10px; top:8px;';
            const head = group.querySelector('.code-head');
            if(head) {
                head.style.position = 'relative';
                head.appendChild(btn);
            } else {
                group.style.position = 'relative';
                group.appendChild(btn);
            }
        } else {
            btn.className = 'copy-icon-btn';
            btn.innerHTML = '<i class="fa-regular fa-copy"></i>';
            group.appendChild(btn);
        }

        btn.onclick = () => {
            const txt = target && (target.value || target.innerText) || "";
            navigator.clipboard.writeText(txt);
            
            if (group.classList.contains('code-container')) {
                btn.innerText = 'Copied!';
                setTimeout(() => btn.innerText = 'Copy', 1500);
            } else {
                btn.innerHTML = '<i class="fa-solid fa-check"></i>';
                setTimeout(() => btn.innerHTML = '<i class="fa-regular fa-copy"></i>', 1500);
            }
        };
    });
}

function escapeHtml(text) {
    if(!text) return "";
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// Global Exports
window.openAuthModal = () => {
    const modal = document.getElementById('auth-modal');
    if(modal) modal.style.display = 'flex';
};
window.closeAuthModal = () => {
    const modal = document.getElementById('auth-modal');
    if(modal) modal.style.display = 'none';
};
window.loginWith = async (provider) => {
    // ВАЖНО: Добавлена опция redirectTo, чтобы после GitHub/Google возвращало на профиль
    await supabase.auth.signInWithOAuth({ 
        provider: provider,
        options: {
            redirectTo: window.location.origin + '/profile/'
        }
    });
};
