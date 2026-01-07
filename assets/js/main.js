const SUPABASE_URL = 'https://dtkmclmaboutpbeogqmw.supabase.co'; 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0a21jbG1hYm91dHBiZW9ncW13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNDA4NDUsImV4cCI6MjA4MjYxNjg0NX0.BcfRGmUuOKkAs5KYrLNyoymry1FnY4jqQyCanZ4x-PM';

let supabase;

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
    initCopyButtons();
});

let currentUser = null;

async function initAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    updateUserUI(session?.user);

    supabase.auth.onAuthStateChange((_event, session) => {
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

async function initComments() {
    const container = document.getElementById('comments-container');
    if (!container) return;

    const pageSlug = window.location.pathname;

    const { data: comments, error } = await supabase
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

            const { error: postError } = await supabase.from('comments').insert({
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

function initTheme() {
    const themes = ['dark', 'light'];
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
    document.querySelectorAll('.result-group, .code-container').forEach(group => {
        if(group.querySelector('.copy-icon-btn, .copy-btn')) return;
        
        let target = group.querySelector('input, textarea');
        let textToCopy = "";

        if (!target) {
            target = group.querySelector('pre, code');
            if (target) textToCopy = target.innerText;
        }

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
            const txt = target && (target.value || target.innerText) || textToCopy;
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
    await supabase.auth.signInWithOAuth({ provider: provider });
};
