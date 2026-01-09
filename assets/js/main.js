(function() {
    // 1. ЗАЩИТА ОТ ПОВТОРНОГО ЗАПУСКА
    if (window.denmothMainInitialized) return;
    window.denmothMainInitialized = true;

    // 2. КОНФИГУРАЦИЯ
    const SUPABASE_URL = 'https://dtkmclmaboutpbeogqmw.supabase.co'; 
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0a21jbG1hYm91dHBiZW9ncW13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNDA4NDUsImV4cCI6MjA4MjYxNjg0NX0.BcfRGmUuOKkAs5KYrLNyoymry1FnY4jqQyCanZ4x-PM';
    const ADMIN_EMAIL = 'denmoth8871top@gmail.com'; 

    // Глобальные переменные
    window.currentUser = null;
    window.isAdmin = false;
    let bannedUsersCache = [];

    // 3. ИНИЦИАЛИЗАЦИЯ
    document.addEventListener('DOMContentLoaded', async () => {
        console.log("Denmoth JS: Starting...");
        
        try {
            if (window.supabase && window.supabase.createClient) {
                const { createClient } = window.supabase;
                window.supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
                
                await initAuth();
                
                // Запускаем комменты только если есть контейнер
                if (document.getElementById('comments-container')) {
                    initCommentsModule();
                }
            } else {
                console.warn("Supabase SDK missing.");
            }
        } catch(e) {
            console.error("Init Error:", e);
        }
        
        initTheme();
        initLangSwitcher();
        initCopyButtons();
        initModalHandlers();
    });

    // --- АВТОРИЗАЦИЯ ---
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
        
        // Если мы на странице профиля
        if (window.location.pathname.includes('/profile/') && typeof window.renderProfilePage === 'function') {
            window.renderProfilePage(user, window.isAdmin);
        }
    }

    function updateHeaderUI(user) {
        const loginBtn = document.getElementById('login-btn');
        if(!loginBtn) return;

        if (user) {
            const avatar = user.user_metadata.avatar_url || 'https://www.gravatar.com/avatar/?d=mp';
            const name = user.user_metadata.full_name || user.email.split('@')[0];
            const borderStyle = window.isAdmin ? 'border: 2px solid #d73a49;' : 'border: 1px solid var(--border);';
            const adminIcon = window.isAdmin ? '<i class="fa-solid fa-crown" style="color:#d73a49; margin-right:5px;"></i>' : '';

            // Клонируем кнопку, чтобы убрать старые onclick и превратить в ссылку
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
    }

    // --- КОММЕНТАРИИ V2 ---
    async function initCommentsModule() {
        const container = document.getElementById('comments-container');
        if (!container) return;

        const pageSlug = getCleanSlug();
        const list = document.getElementById('comments-list');

        const { data: comments, error } = await window.supabase
            .from('comments')
            .select(`*, comment_votes ( user_id, vote_type )`)
            .eq('page_slug', pageSlug)
            .order('created_at', { ascending: true });

        if (error) {
            console.error("Comments Error:", error);
            list.innerHTML = `<div style="text-align:center; color:#d73a49;">Error loading comments. Check DB.</div>`;
            return;
        }

        renderCommentsTree(comments || []);

        // Настройка главной кнопки отправки
        const sendBtn = document.getElementById('send-comment');
        if(sendBtn) {
            const newBtn = sendBtn.cloneNode(true);
            if(sendBtn.parentNode) sendBtn.parentNode.replaceChild(newBtn, sendBtn);
            newBtn.onclick = () => window.postComment(null); 
        }
    }

    // ЭКСПОРТИРУЕМ ФУНКЦИЮ В WINDOW, ЧТОБЫ КНОПКИ ЕЁ ВИДЕЛИ
    window.postComment = async function(parentId) {
        const inputId = parentId ? `reply-input-${parentId}` : 'comment-input';
        const input = document.getElementById(inputId);
        
        if (!input) {
            console.error("Input not found:", inputId);
            return;
        }

        const content = input.value.trim();
        if(!content) return;

        // Проверка бана
        if (window.currentUser) {
            const { data: profile } = await window.supabase.from('profiles').select('is_banned').eq('id', window.currentUser.id).single();
            if (profile?.is_banned) return alert("You are banned.");
        }

        let authorName = "Guest", authorAvatar = null, userId = null, isGuest = true;
        if(window.currentUser) {
            authorName = window.currentUser.user_metadata.full_name || window.currentUser.email.split('@')[0];
            authorAvatar = window.currentUser.user_metadata.avatar_url;
            userId = window.currentUser.id;
            isGuest = false;
        } else {
            const gName = document.getElementById('guest-name');
            if(gName) authorName = gName.value.trim() || "Guest";
        }

        const { error } = await window.supabase.from('comments').insert({
            page_slug: getCleanSlug(),
            content, author_name: authorName, author_avatar: authorAvatar,
            user_id: userId, is_guest: isGuest, parent_id: parentId
        });

        if(!error) {
            input.value = '';
            if (parentId) {
                const area = document.getElementById(`reply-area-${parentId}`);
                if(area) area.style.display = 'none';
            }
            initCommentsModule();
        } else {
            alert("Error: " + error.message);
        }
    };

    function renderCommentsTree(comments) {
        const list = document.getElementById('comments-list');
        list.innerHTML = '';
        if (comments.length === 0) {
            list.innerHTML = `<div style="text-align:center; color:var(--text-muted); padding:30px;">No comments yet.</div>`;
            return;
        }

        const commentMap = {};
        comments.forEach(c => {
            c.children = [];
            c.score = c.comment_votes ? c.comment_votes.reduce((acc, v) => acc + v.vote_type, 0) : 0;
            c.userVote = 0;
            if (window.currentUser && c.comment_votes) {
                const myVote = c.comment_votes.find(v => v.user_id === window.currentUser.id);
                if (myVote) c.userVote = myVote.vote_type;
            }
            commentMap[c.id] = c;
        });

        const rootComments = [];
        comments.forEach(c => {
            if (c.parent_id && commentMap[c.parent_id]) {
                commentMap[c.parent_id].children.push(c);
            } else {
                rootComments.push(c);
            }
        });

        rootComments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        rootComments.forEach(c => list.appendChild(createCommentElement(c)));
    }

    function createCommentElement(c) {
        const el = document.createElement('div');
        el.className = 'comment-box';
        el.id = `comment-${c.id}`;
        
        const isOwner = window.currentUser && window.currentUser.id === c.user_id;
        const canDelete = window.isAdmin || isOwner;
        const badge = c.is_guest ? '<span class="guest-tag">Guest</span>' : '';
        const adminControls = (window.isAdmin && c.user_id) ? 
            `<button onclick="banUser('${c.user_id}')" title="Ban" style="color:#d73a49; border:none; background:none; cursor:pointer; margin-left:5px;"><i class="fa-solid fa-ban"></i></button>` : '';

        let scoreColor = 'var(--text-muted)';
        if(c.score > 0) scoreColor = '#238636';
        if(c.score < 0) scoreColor = '#d73a49';

        el.innerHTML = `
            <div class="comment-inner">
                <div class="comment-header">
                    <img src="${c.author_avatar || 'https://www.gravatar.com/avatar/?d=mp'}" class="comment-avatar">
                    <span class="comment-author">${escapeHtml(c.author_name)}</span>
                    ${badge} ${adminControls}
                    <span class="comment-date" style="margin-left:auto;">${new Date(c.created_at).toLocaleDateString()}</span>
                </div>
                <div class="comment-body" id="body-${c.id}">${escapeHtml(c.content)}</div>
                
                <div class="comment-actions">
                    <div class="vote-group">
                        <button onclick="voteComment(${c.id}, 1, ${c.userVote})" class="vote-btn ${c.userVote === 1 ? 'active' : ''}"><i class="fa-solid fa-chevron-up"></i></button>
                        <span style="color:${scoreColor}; font-weight:bold; font-size:0.9rem;">${c.score}</span>
                        <button onclick="voteComment(${c.id}, -1, ${c.userVote})" class="vote-btn ${c.userVote === -1 ? 'active-down' : ''}"><i class="fa-solid fa-chevron-down"></i></button>
                    </div>
                    
                    <button onclick="toggleReply(${c.id})" class="act-btn"><i class="fa-solid fa-reply"></i> Reply</button>
                    
                    ${isOwner ? `<button onclick="editComment(${c.id})" class="act-btn"><i class="fa-solid fa-pen"></i> Edit</button>` : ''}
                    ${canDelete ? `<button onclick="deleteComment(${c.id})" class="act-btn del"><i class="fa-solid fa-trash"></i></button>` : ''}
                    ${!isOwner && window.currentUser ? `<button onclick="reportComment(${c.id})" class="act-btn" title="Report"><i class="fa-regular fa-flag"></i></button>` : ''}
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

        if (c.children && c.children.length > 0) {
            const childrenContainer = el.querySelector('.comment-children');
            c.children.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            c.children.forEach(child => childrenContainer.appendChild(createCommentElement(child)));
        }
        return el;
    }

    // --- ДЕЙСТВИЯ (Глобальные функции) ---

    window.toggleReply = function(id) {
        const area = document.getElementById(`reply-area-${id}`);
        if(area) area.style.display = area.style.display === 'none' ? 'block' : 'none';
    };

    window.editComment = function(id) {
        const body = document.getElementById(`body-${id}`);
        
        // ЕСЛИ УЖЕ ОТКРЫТО ПОЛЕ РЕДАКТИРОВАНИЯ - ОТМЕНЯЕМ
        if (body.querySelector('textarea')) {
            window.cancelEdit(id);
            return;
        }

        const currentText = body.innerText;
        body.dataset.original = body.innerHTML;
        body.innerHTML = `
            <textarea id="edit-txt-${id}" class="form-area" style="min-height:60px; margin-bottom:5px;">${currentText}</textarea>
            <div style="display:flex; gap:5px;">
                <button onclick="saveEdit(${id})" class="btn primary" style="padding:4px 10px; font-size:0.8rem;">Save</button>
                <button onclick="cancelEdit(${id})" class="btn" style="padding:4px 10px; font-size:0.8rem;">Cancel</button>
            </div>
        `;
    };

    window.cancelEdit = function(id) {
        const body = document.getElementById(`body-${id}`);
        if(body.dataset.original) body.innerHTML = body.dataset.original;
    };

    window.saveEdit = async function(id) {
        const text = document.getElementById(`edit-txt-${id}`).value;
        const { error } = await window.supabase.from('comments').update({ content: text }).eq('id', id);
        if(!error) initCommentsModule();
        else alert(error.message);
    };

    window.voteComment = async function(id, type, currentVote) {
        if (!window.currentUser) return window.openAuthModal();
        if (currentVote !== 0) {
            await window.supabase.from('comment_votes').delete().match({ user_id: window.currentUser.id, comment_id: id });
        }
        if (currentVote !== type) {
            await window.supabase.from('comment_votes').insert({ user_id: window.currentUser.id, comment_id: id, vote_type: type });
        }
        initCommentsModule();
    };

    window.deleteComment = async function(id) {
        if (confirm('Delete this comment?')) {
            const { error } = await window.supabase.from('comments').delete().eq('id', id);
            if (!error) initCommentsModule();
            else alert("Error: " + error.message);
        }
    };

    window.banUser = async function(uid) {
        if (!window.isAdmin) return;
        if (confirm("Ban user? All their comments will be deleted.")) {
            // Триггер в БД сам удалит комменты
            const { error } = await window.supabase.from('profiles').upsert({ id: uid, is_banned: true });
            if (!error) {
                alert("User banned.");
                location.reload(); 
            } else alert(error.message);
        }
    };

    window.unbanUser = async function(uid) {
        if (!window.isAdmin) return;
        if (confirm("Unban this user?")) {
            const { error } = await window.supabase.from('profiles').update({ is_banned: false }).eq('id', uid);
            if (!error) {
                alert("User unbanned.");
                if (typeof window.loadBannedUsers === 'function') window.loadBannedUsers();
            } else alert(error.message);
        }
    };

    // --- ПРОФИЛЬ ---
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
                const badge = document.getElementById('p-status-badge');
                badge.style.backgroundColor = '#d73a49';
                badge.innerHTML = '<i class="fa-solid fa-shield-halved"></i> Administrator';
                document.getElementById('btn-tab-admin').style.display = 'inline-flex';
                window.loadBannedUsers();
            }

            const { data } = await window.supabase.from('profiles').select('*').eq('id', user.id).single();
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

    window.loadBannedUsers = async function() {
        const tbody = document.getElementById('ban-list-body');
        if(!tbody) return;
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; padding:20px;">Loading...</td></tr>';
        
        const { data, error } = await window.supabase
            .from('profiles')
            .select('*')
            .eq('is_banned', true)
            .order('updated_at', { ascending: false });

        if (data) {
            bannedUsersCache = data;
            window.renderBanList(data);
        } else {
            tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; color:#d73a49;">Error loading list</td></tr>';
        }
    };

    window.renderBanList = function(list) {
        const tbody = document.getElementById('ban-list-body');
        if (list.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" style="padding:15px; text-align:center; color:var(--text-muted);">No banned users found.</td></tr>';
            return;
        }
        tbody.innerHTML = list.map(u => `
            <tr style="border-bottom:1px solid var(--border);">
                <td style="padding:10px;">
                    <div style="font-weight:600;">${escapeHtml(u.full_name || 'Unknown')}</div>
                    <div style="font-size:0.75rem; color:var(--text-muted);">${escapeHtml(u.email || u.id)}</div>
                </td>
                <td style="padding:10px; font-size:0.85rem;">
                    ${u.updated_at ? new Date(u.updated_at).toLocaleDateString() : 'N/A'}
                </td>
                <td style="padding:10px;">
                    <button onclick="unbanUser('${u.id}')" class="btn" style="padding:4px 8px; font-size:0.8rem; border-color:#238636; color:#238636;">Unban</button>
                </td>
            </tr>
        `).join('');
    };

    window.filterBanList = function() {
        const q = document.getElementById('ban-search').value.toLowerCase();
        const filtered = bannedUsersCache.filter(u => 
            (u.full_name && u.full_name.toLowerCase().includes(q)) || 
            (u.email && u.email.toLowerCase().includes(q))
        );
        window.renderBanList(filtered);
    };

    // --- UTILS ---
    function getCleanSlug() {
        let path = window.location.pathname;
        if (path.startsWith('/ru')) path = path.substring(3);
        if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
        if (path === '') path = '/';
        return path;
    }

    window.openAuthModal = () => document.getElementById('auth-modal').style.display = 'flex';
    window.closeAuthModal = () => document.getElementById('auth-modal').style.display = 'none';
    window.loginWith = async (p) => {
        await window.supabase.auth.signInWithOAuth({ 
            provider: p, 
            options: { redirectTo: window.location.origin + '/profile/' } 
        });
    };
    
    function initTheme() {
        const btn = document.getElementById('theme-toggle');
        if(!btn) return;
        let current = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', current);
        const updateIcon = (t) => btn.innerHTML = t === 'dark' ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
        updateIcon(current);
        btn.onclick = () => {
            current = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', current);
            localStorage.setItem('theme', current);
            updateIcon(current);
        };
    }
    
    function initLangSwitcher() {
        const select = document.getElementById('lang-select');
        if(!select) return;
        const newSelect = select.cloneNode(true);
        if(select.parentNode) select.parentNode.replaceChild(newSelect, select);
        newSelect.addEventListener('change', (e) => {
            const path = window.location.pathname;
            if (e.target.value === 'ru' && !path.startsWith('/ru')) {
                window.location.href = path === '/' ? '/ru/' : '/ru' + path;
            } else if (e.target.value === 'en' && path.startsWith('/ru')) {
                window.location.href = path.replace('/ru', '') || '/';
            }
        });
    }
    
    function initCopyButtons() {
        document.querySelectorAll('.result-group, .code-container').forEach(group => {
            if(group.querySelector('.copy-icon-btn, .copy-btn')) return;
            let target = group.querySelector('input, textarea') || group.querySelector('pre, code');
            const btn = document.createElement('button');
            if (group.classList.contains('code-container')) {
                btn.className = 'copy-btn btn'; btn.innerHTML = 'Copy'; btn.style.cssText = 'position:absolute; right:10px; top:8px;';
                const head = group.querySelector('.code-head'); head ? head.appendChild(btn) : group.appendChild(btn);
            } else {
                btn.className = 'copy-icon-btn'; btn.innerHTML = '<i class="fa-regular fa-copy"></i>'; group.appendChild(btn);
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
        window.openAuthModal = () => document.getElementById('auth-modal').style.display = 'flex';
        window.closeAuthModal = () => document.getElementById('auth-modal').style.display = 'none';
    }
    
    function escapeHtml(text) {
        if(!text) return "";
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }
})();
