// ==========================================
// CONFIGURATION
// ==========================================
const SUPABASE_URL = 'https://dtkmclmaboutpbeogqmw.supabase.co'; 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0a21jbG1hYm91dHBiZW9ncW13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNDA4NDUsImV4cCI6MjA4MjYxNjg0NX0.BcfRGmUuOKkAs5KYrLNyoymry1FnY4jqQyCanZ4x-PM';

let supabase; 
let currentUser = null;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const { createClient } = window.supabase;
        supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
        
        await initAuth();
        initComments();
        initProfile(); 
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
    const { data: { session } } = await supabase.auth.getSession();
    updateUserUI(session?.user);

    supabase.auth.onAuthStateChange((_event, session) => {
        updateUserUI(session?.user);
    });

    const loginBtn = document.getElementById('login-btn');
    if(loginBtn) {
        loginBtn.onclick = (e) => {
            // Если уже вошли - это ссылка на профиль или дропдаун, не перехватываем
            if(currentUser) return; 
            e.preventDefault();
            openAuthModal();
        };
    }
}

function updateUserUI(user) {
    currentUser = user;
    const loginBtn = document.getElementById('login-btn');
    if(!loginBtn) return;

    if (user) {
        const avatar = user.user_metadata.avatar_url || 'https://www.gravatar.com/avatar/?d=mp';
        const name = user.user_metadata.full_name || user.email.split('@')[0];
        
        // Меняем кнопку на профиль с выпадающим меню (если нужно) или просто ссылка
        loginBtn.innerHTML = `
            <img src="${avatar}" style="width:24px; height:24px; border-radius:50%; object-fit:cover; margin-right:8px; border:1px solid var(--border);">
            <span>${name}</span>
        `;
        loginBtn.href = "/profile/";
        loginBtn.onclick = null; // Удаляем обработчик модалки
        
        // Для страницы профиля - заполняем данные
        if(window.location.pathname === '/profile/') {
            const pName = document.getElementById('p-name');
            if(pName) pName.textContent = name;
            const pEmail = document.getElementById('p-email');
            if(pEmail) pEmail.textContent = user.email;
            const pAv = document.getElementById('p-avatar');
            if(pAv) pAv.src = avatar;
        }
    } else {
        loginBtn.innerHTML = `<i class="fa-brands fa-github"></i> <span>Log In</span>`;
        loginBtn.href = "#";
        loginBtn.onclick = (e) => { e.preventDefault(); openAuthModal(); };
    }
}

// ==========================================
// COMMENTS MODULE (FIXED INFINITE LOADING)
// ==========================================
async function initComments() {
    const container = document.getElementById('comments-container');
    const list = document.getElementById('comments-list');
    
    if (!container || !list) return;

    const pageSlug = window.location.pathname;

    try {
        const { data: comments, error } = await supabase
            .from('comments') // Убедись, что таблица существует!
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
                <span style="font-size:0.8rem; color:var(--text-muted);">Ensure 'comments' table exists in Supabase.</span>
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
// UTILS
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
        const btn = document.createElement('button');
        
        if (group.classList.contains('code-container')) {
            btn.className = 'copy-btn btn';
            btn.innerHTML = 'Copy';
            btn.style.cssText = 'position:absolute; right:10px; top:8px;';
            const head = group.querySelector('.code-head');
            (head || group).style.position = 'relative';
            (head || group).appendChild(btn);
        } else {
            btn.className = 'copy-icon-btn';
            btn.innerHTML = '<i class="fa-regular fa-copy"></i>';
            group.appendChild(btn);
        }

        btn.onclick = () => {
            let target = group.querySelector('input, textarea') || group.querySelector('pre, code');
            if(target) {
                navigator.clipboard.writeText(target.value || target.innerText);
                const old = btn.innerHTML;
                btn.innerHTML = group.classList.contains('code-container') ? 'Copied!' : '<i class="fa-solid fa-check"></i>';
                setTimeout(() => btn.innerHTML = old, 1500);
            }
        };
    });
}

function escapeHtml(text) { return text ? text.replace(/</g, "&lt;").replace(/>/g, "&gt;") : ''; }

// EXPORTS
window.openAuthModal = () => document.getElementById('auth-modal').style.display = 'flex';
window.closeAuthModal = () => document.getElementById('auth-modal').style.display = 'none';
window.loginWith = async (provider) => {
    await supabase.auth.signInWithOAuth({ 
        provider: provider,
        options: { redirectTo: window.location.origin + '/profile/' } // Redirect back
    });
};
