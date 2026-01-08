// ==========================================
// CONFIGURATION & GUARD
// ==========================================
(function() {
    if (window.denmothMainInitialized) return;
    window.denmothMainInitialized = true;

    const SUPABASE_URL = 'https://dtkmclmaboutpbeogqmw.supabase.co'; 
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0a21jbG1hYm91dHBiZW9ncW13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNDA4NDUsImV4cCI6MjA4MjYxNjg0NX0.BcfRGmUuOKkAs5KYrLNyoymry1FnY4jqQyCanZ4x-PM';
    
    // Впиши сюда свой email, чтобы скрипт дал тебе права админа в интерфейсе
    const ADMIN_EMAIL = 'denmoth8871top@gmail.com'; 

    window.currentUser = null;
    window.isAdmin = false;

    // ==========================================
    // INITIALIZATION
    // ==========================================
    document.addEventListener('DOMContentLoaded', async () => {
        try {
            if (window.supabase && window.supabase.createClient) {
                const { createClient } = window.supabase;
                window.supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
                await initAuth();
                // Комментарии грузим после авторизации, чтобы знать лайки юзера
                initCommentsModule();
            }
        } catch(e) {
            console.error("Supabase init failed:", e);
        }
        
        initTheme();
        initLangSwitcher();
        initCopyButtons();
        initModalHandlers();
    });

    // ==========================================
    // AUTHENTICATION
    // ==========================================
    async function initAuth() {
        const { data: { session } } = await window.supabase.auth.getSession();
        await handleUserSession(session?.user);

        window.supabase.auth.onAuthStateChange(async (_event, session) => {
            await handleUserSession(session?.user);
        });
    }

    async function handleUserSession(user) {
        window.currentUser = user;
        window.isAdmin = user?.email === ADMIN_EMAIL;
        
        updateHeaderUI(user);
        
        if (window.location.pathname.includes('/profile/')) {
            // Если есть функция рендера профиля (в profile.html), вызываем её
            if (typeof window.renderProfilePage === 'function') {
                window.renderProfilePage(user, window.isAdmin);
            }
        }
    }

    function updateHeaderUI(user) {
        const loginBtn = document.getElementById('login-btn');
        if(!loginBtn) return;

        if (user) {
            const avatar = user.user_metadata.avatar_url || 'https://www.gravatar.com/avatar/?d=mp';
            const name = user.user_metadata.full_name || user.email.split('@')[0];
            const borderStyle = window.isAdmin ? 'border: 2px solid #d73a49;' : 'border: 1px solid var(--border);';
            
            // Меняем содержимое и поведение кнопки
            loginBtn.innerHTML = `
                <img src="${avatar}" style="width:24px; height:24px; border-radius:50%; object-fit:cover; margin-right:8px; ${borderStyle}">
                <span>${name}</span>
            `;
            loginBtn.href = "/profile/";
            loginBtn.onclick = null; // Убираем открытие модалки
        } else {
            const isRu = window.location.pathname.startsWith('/ru');
            loginBtn.innerHTML = `<i class="fa-brands fa-github"></i> <span>${isRu ? 'Войти' : 'Log In'}</span>`;
            loginBtn.href = "#";
            loginBtn.onclick = (e) => { e.preventDefault(); window.openAuthModal(); };
        }
    }

    // ==========================================
    // ADVANCED COMMENTS SYSTEM
    // ==========================================
    async function initCommentsModule() {
        const container = document.getElementById('comments-container');
        if (!container) return;

        const pageSlug = window.location.pathname;
        const list = document.getElementById('comments-list');

        // 1. Получаем комментарии и голоса
        const { data: comments, error } = await window.supabase
            .from('comments')
            .select(`
                *,
                comment_votes ( user_id, vote_type )
            `)
            .eq('page_slug', pageSlug)
            .order('created_at', { ascending: true }); // Сначала старые, потом строим дерево

        if (error) {
            list.innerHTML = `<div style="text-align:center; color:#d73a49;">Error loading comments</div>`;
            return;
        }

        renderCommentsTree(comments || []);

        // 2. Обработчик отправки главного комментария
        const sendBtn = document.getElementById('send-comment');
        if(sendBtn) {
            // Клонируем кнопку, чтобы убрать старые слушатели
            const newBtn = sendBtn.cloneNode(true);
            sendBtn.parentNode.replaceChild(newBtn, sendBtn);
            
            newBtn.onclick = () => postComment(null); // null = нет родителя
        }
    }

    async function postComment(parentId = null) {
        const inputId = parentId ? `reply-input-${parentId}` : 'comment-input';
        const input = document.getElementById(inputId);
        const content = input.value.trim();
        
        if(!content) return;

        // Проверка бана перед отправкой (клиентская часть, на сервере тоже есть policy)
        if (window.currentUser) {
            const { data: profile } = await window.supabase.from('profiles').select('is_banned').eq('id', window.currentUser.id).single();
            if (profile?.is_banned) {
                alert("You are banned from commenting.");
                return;
            }
        }

        let authorName = "Guest";
        let authorAvatar = null;
        let userId = null;
        let isGuest = true;

        if(window.currentUser) {
            authorName = window.currentUser.user_metadata.full_name || window.currentUser.email.split('@')[0];
            authorAvatar = window.currentUser.user_metadata.avatar_url;
            userId = window.currentUser.id;
            isGuest = false;
        } else {
            const guestName = document.getElementById('guest-name');
            if(guestName) authorName = guestName.value.trim() || "Guest";
        }

        const { error } = await window.supabase.from('comments').insert({
            page_slug: window.location.pathname,
            content: content,
            author_name: authorName,
            author_avatar: authorAvatar,
            user_id: userId,
            is_guest: isGuest,
            parent_id: parentId
        });

        if(!error) {
            input.value = '';
            initCommentsModule(); // Перезагружаем список
        } else {
            alert("Error: " + error.message);
        }
    }

    function renderCommentsTree(comments) {
        const list = document.getElementById('comments-list');
        list.innerHTML = '';

        if (comments.length === 0) {
            list.innerHTML = `<div style="text-align:center; color:var(--text-muted); padding:30px;">No comments yet. Be the first!</div>`;
            return;
        }

        // Строим карту ID -> Комментарий
        const commentMap = {};
        comments.forEach(c => {
            c.children = [];
            // Считаем рейтинг
            c.score = c.comment_votes ? c.comment_votes.reduce((acc, v) => acc + v.vote_type, 0) : 0;
            // Лайкнул ли текущий юзер?
            c.userVote = 0;
            if (window.currentUser && c.comment_votes) {
                const myVote = c.comment_votes.find(v => v.user_id === window.currentUser.id);
                if (myVote) c.userVote = myVote.vote_type;
            }
            commentMap[c.id] = c;
        });

        // Собираем дерево
        const rootComments = [];
        comments.forEach(c => {
            if (c.parent_id && commentMap[c.parent_id]) {
                commentMap[c.parent_id].children.push(c);
            } else {
                rootComments.push(c);
            }
        });

        // Рендерим рекурсивно
        // Сортируем: сначала новые для корня (или по популярности можно)
        rootComments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        rootComments.forEach(c => {
            list.appendChild(createCommentElement(c));
        });
    }

    function createCommentElement(c) {
        const el = document.createElement('div');
        el.className = 'comment-box';
        el.id = `comment-${c.id}`;
        
        // --- Header ---
        const isAdminComment = c.user_id === 'e84d...'; // Хардкод ID админа если надо, но лучше по флагу
        const badge = c.is_guest ? '<span class="guest-tag">Guest</span>' : '';
        const adminBadge = (window.isAdmin && c.user_id) ? 
            `<button onclick="banUser('${c.user_id}')" title="Ban User" style="border:none; background:none; color:#d73a49; cursor:pointer; margin-left:5px;"><i class="fa-solid fa-ban"></i></button>` : '';
        
        // --- Actions ---
        const canDelete = window.isAdmin || (window.currentUser && window.currentUser.id === c.user_id);
        const deleteBtn = canDelete ? `<button onclick="deleteComment(${c.id})" class="act-btn del"><i class="fa-solid fa-trash"></i></button>` : '';
        const replyBtn = `<button onclick="toggleReply(${c.id})" class="act-btn"><i class="fa-solid fa-reply"></i> Reply</button>`;
        
        // --- Voting Color ---
        let scoreColor = 'var(--text-muted)';
        if(c.userVote === 1) scoreColor = '#238636';
        if(c.userVote === -1) scoreColor = '#d73a49';

        el.innerHTML = `
            <div class="comment-inner">
                <div class="comment-header">
                    <img src="${c.author_avatar || 'https://www.gravatar.com/avatar/?d=mp'}" class="comment-avatar">
                    <span class="comment-author">${escapeHtml(c.author_name)}</span>
                    ${badge} ${adminBadge}
                    <span class="comment-date">${new Date(c.created_at).toLocaleDateString()}</span>
                </div>
                <div class="comment-body">${escapeHtml(c.content)}</div>
                <div class="comment-actions">
                    <div class="vote-group">
                        <button onclick="voteComment(${c.id}, 1)" class="vote-btn ${c.userVote === 1 ? 'active' : ''}"><i class="fa-solid fa-chevron-up"></i></button>
                        <span style="color:${scoreColor}; font-weight:bold; font-size:0.9rem;">${c.score}</span>
                        <button onclick="voteComment(${c.id}, -1)" class="vote-btn ${c.userVote === -1 ? 'active-down' : ''}"><i class="fa-solid fa-chevron-down"></i></button>
                    </div>
                    ${replyBtn}
                    ${deleteBtn}
                </div>
                <div id="reply-area-${c.id}" class="reply-input-area" style="display:none; margin-top:10px;">
                    <div style="display:flex; gap:10px;">
                        <input type="text" id="reply-input-${c.id}" class="form-input" placeholder="Write a reply..." style="padding:8px;">
                        <button onclick="postComment(${c.id})" class="btn primary" style="padding:0 15px;"><i class="fa-solid fa-paper-plane"></i></button>
                    </div>
                </div>
            </div>
            <div class="comment-children"></div>
        `;

        // Render Children
        if (c.children && c.children.length > 0) {
            const childrenContainer = el.querySelector('.comment-children');
            c.children.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)); // Oldest first for replies
            c.children.forEach(child => {
                childrenContainer.appendChild(createCommentElement(child));
            });
        }

        return el;
    }

    // --- Comment Actions Exports ---
    window.voteComment = async (commentId, type) => {
        if (!window.currentUser) {
            window.openAuthModal();
            return;
        }
        
        // Supabase upsert logic for votes
        // Сначала удаляем старый голос, если был такой же (тогл)
        // Но для простоты сделаем upsert через RPC или просто insert/delete
        
        // Простой вариант: удалить любой голос юзера на этот коммент, потом вставить новый
        await window.supabase.from('comment_votes').delete().match({ user_id: window.currentUser.id, comment_id: commentId });
        
        // Вставляем новый (если это не снятие голоса, но тут упростим - всегда ставим)
        // В идеале: если нажал на активный - снять.
        // Реализуем в следующей версии детально, сейчас просто перезапись.
        await window.supabase.from('comment_votes').insert({
            user_id: window.currentUser.id,
            comment_id: commentId,
            vote_type: type
        });

        initCommentsModule(); // Обновить UI
    };

    window.toggleReply = (id) => {
        const area = document.getElementById(`reply-area-${id}`);
        const current = area.style.display;
        area.style.display = current === 'none' ? 'block' : 'none';
    };

    window.deleteComment = async (id) => {
        if (!confirm('Delete this comment?')) return;
        const { error } = await window.supabase.from('comments').delete().eq('id', id);
        if (!error) initCommentsModule();
        else alert(error.message);
    };

    window.banUser = async (userId) => {
        if (!window.isAdmin) return;
        if (!confirm('Ban this user from commenting?')) return;
        
        // Создаем профиль если нет, и ставим бан
        const { error } = await window.supabase
            .from('profiles')
            .upsert({ id: userId, is_banned: true });
            
        if (!error) alert('User Banned');
        else alert(error.message);
    };

    // ==========================================
    // UTILS & EXPORTS
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
        
        const newSelect = select.cloneNode(true);
        select.parentNode.replaceChild(newSelect, select);

        newSelect.addEventListener('change', (e) => {
            const target = e.target.value;
            const path = window.location.pathname;
            if (target === 'ru') {
                if (path.startsWith('/ru')) return;
                if (path === '/') window.location.href = '/ru/';
                else window.location.href = '/ru' + path;
            } else if (target === 'en') {
                if (!path.startsWith('/ru')) return;
                let newPath = path.replace('/ru', '');
                if (newPath === '') newPath = '/';
                window.location.href = newPath;
            }
        });
    }

    function initCopyButtons() {
        document.querySelectorAll('.result-group, .code-container').forEach(group => {
            if(group.querySelector('.copy-icon-btn, .copy-btn')) return;
            let target = group.querySelector('input, textarea') || group.querySelector('pre, code');
            
            const btn = document.createElement('button');
            if (group.classList.contains('code-container')) {
                btn.className = 'copy-btn btn';
                btn.innerHTML = 'Copy';
                btn.style.cssText = 'position:absolute; right:10px; top:8px;';
                const head = group.querySelector('.code-head');
                head ? head.appendChild(btn) : group.appendChild(btn);
            } else {
                btn.className = 'copy-icon-btn';
                btn.innerHTML = '<i class="fa-regular fa-copy"></i>';
                group.appendChild(btn);
            }

            btn.onclick = () => {
                const txt = target && (target.value || target.innerText) || "";
                navigator.clipboard.writeText(txt);
                const originalHtml = btn.innerHTML;
                btn.innerHTML = group.classList.contains('code-container') ? 'Copied!' : '<i class="fa-solid fa-check"></i>';
                setTimeout(() => btn.innerHTML = originalHtml, 1500);
            };
        });
    }

    function initModalHandlers() {
        window.openAuthModal = () => {
            const modal = document.getElementById('auth-modal');
            if(modal) modal.style.display = 'flex';
        };
        window.closeAuthModal = () => {
            const modal = document.getElementById('auth-modal');
            if(modal) modal.style.display = 'none';
        };
        window.loginWith = async (provider) => {
            await window.supabase.auth.signInWithOAuth({ 
                provider: provider,
                options: { redirectTo: window.location.origin + '/profile/' }
            });
        };
    }

    function escapeHtml(text) {
        if(!text) return "";
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

})();
