// --- SUPABASE CONFIG ---
// Мы не объявляем переменную supabase через let/const, чтобы избежать конфликтов.
// Используем глобальный объект window.supabase, который инициализируется в head.html.

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Проверяем наличие клиента
        if (window.supabase && typeof window.supabase.auth !== 'undefined') {
            await initAuth();
            initComments();
            if (typeof initProfile === 'function') {
                initProfile(); 
            }
        } else {
            console.warn("Supabase client not found in window.supabase");
        }
    } catch(e) {
        console.error("Supabase logic error:", e);
    }
    
    // Инициализация темы и кнопок запускается в любом случае
    initTheme();
    initCopyButtons();
});

// --- AUTH SYSTEM ---
// Используем var, так как он безопасен при повторном объявлении (в отличие от let/const)
var currentUser = null;

async function initAuth() {
    if (!window.supabase) return;
    
    const { data: { session } } = await window.supabase.auth.getSession();
    updateUserUI(session?.user);

    window.supabase.auth.onAuthStateChange((_event, session) => {
        updateUserUI(session?.user);
    });

    const loginBtn = document.getElementById('login-btn');
    if(loginBtn) {
        loginBtn.onclick = (e) => {
            e.preventDefault();
            if(currentUser) {
                window.location.href = '/profile/'; 
            } else {
                openAuthModal();
            }
        };
    }
}

function updateUserUI(user) {
    currentUser = user;
    const loginBtn = document.getElementById('login-btn');
    if(!loginBtn) return;

    if (user) {
        const avatar = user.user_metadata.avatar_url || 'https://www.gravatar.com/avatar/?d=mp';
        loginBtn.innerHTML = `<img src="${avatar}" style="width:24px; height:24px; border-radius:50%; object-fit:cover; margin-right:5px;"> ${user.user_metadata.full_name || user.email.split('@')[0]}`;
        loginBtn.href = "/profile/";
    } else {
        loginBtn.innerHTML = `<i class="fa-brands fa-github"></i> Log In`;
    }
}

// --- COMMENTS SYSTEM (CUSTOM) ---
async function initComments() {
    if (!window.supabase) return;

    const container = document.getElementById('comments-container');
    if (!container) return;

    const pageSlug = window.location.pathname;

    const { data: comments, error } = await window.supabase
        .from('comments')
        .select('*')
        .eq('page_slug', pageSlug)
        .order('created_at', { ascending: false });

    if(error) console.error(error);
    renderComments(comments || []);

    const sendBtn = document.getElementById('send-comment');
    if(sendBtn) {
        sendBtn.onclick = async () => {
            const input = document.getElementById('comment-input');
            const content = input.value.trim();
            if(!content) return;

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

            const { error: postError } = await window.supabase.from('comments').insert({
                page_slug: pageSlug,
                content: content,
                author_name: authorName,
                author_avatar: authorAvatar,
                user_id: userId,
                is_guest: isGuest
            });

            if(!postError) {
                input.value = '';
                initComments();
            } else {
                alert("Error posting comment. Check console.");
                console.error(postError);
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

// --- UTILS ---
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

function initCopyButtons() {
    document.querySelectorAll('.result-group').forEach(group => {
        if(group.querySelector('.copy-icon-btn')) return;
        
        const target = group.querySelector('input, textarea');
        if(!target) return;

        const btn = document.createElement('button');
        btn.className = 'copy-icon-btn';
        btn.innerHTML = '<i class="fa-regular fa-copy"></i>';
        btn.onclick = () => {
            navigator.clipboard.writeText(target.value || target.textContent);
            btn.innerHTML = '<i class="fa-solid fa-check"></i>';
            setTimeout(() => btn.innerHTML = '<i class="fa-regular fa-copy"></i>', 1500);
        };
        group.appendChild(btn);
    });
}

function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

window.openAuthModal = () => {
    const modal = document.getElementById('auth-modal');
    if(modal) modal.style.display = 'flex';
};
window.closeAuthModal = () => {
    const modal = document.getElementById('auth-modal');
    if(modal) modal.style.display = 'none';
};
window.loginWith = async (provider) => {
    if(window.supabase) {
        await window.supabase.auth.signInWithOAuth({ provider: provider });
    }
};
