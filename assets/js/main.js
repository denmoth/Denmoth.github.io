(function() {
    if (window.denmothMainInitialized) return;
    window.denmothMainInitialized = true;

    const SUPABASE_URL = 'https://dtkmclmaboutpbeogqmw.supabase.co'; 
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0a21jbG1hYm91dHBiZW9ncW13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNDA4NDUsImV4cCI6MjA4MjYxNjg0NX0.BcfRGmUuOKkAs5KYrLNyoymry1FnY4jqQyCanZ4x-PM';
    
    // Впиши свой email для прав админа
    const ADMIN_EMAIL = 'denmoth8871top@gmail.com'; 

    window.currentUser = null;
    window.isAdmin = false;

    document.addEventListener('DOMContentLoaded', async () => {
        try {
            if (window.supabase && window.supabase.createClient) {
                const { createClient } = window.supabase;
                window.supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
                await initAuth();
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

    // --- HELPER ---
    function getCleanSlug() {
        let path = window.location.pathname;
        if (path.startsWith('/ru')) path = path.substring(3);
        if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
        if (path === '') path = '/';
        return path;
    }

    // --- AUTH ---
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
            loginBtn.onclick = (e) => { e.preventDefault(); window.openAuthModal(); };
        }
    }

    // --- COMMENTS SYSTEM FIXED ---
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
            console.error(error);
            list.innerHTML = `<div style="text-align:center; color:#d73a49;">Error loading comments.</div>`;
            return;
        }

        renderCommentsTree(comments || []);

        const sendBtn = document.getElementById('send-comment');
        if(sendBtn) {
            const newBtn = sendBtn.cloneNode(true);
            if(sendBtn.parentNode) sendBtn.parentNode.replaceChild(newBtn, sendBtn);
            newBtn.onclick = () => postComment(null); 
        }
    }

    async function postComment(parentId) {
        // Если parentId есть, это ответ. Если null — новый коммент.
        const inputId = parentId ? `reply-input-${parentId}` : 'comment-input';
        const input = document.getElementById(inputId);
        
        if (!input) {
            console.error("Input ID not found:", inputId);
            return;
        }

        const content = input.value.trim();
        if(!content) return;

        // Бан чек
        if (window.currentUser) {
            const { data: profile } = await window.supabase.from('profiles').select('is_banned').eq('id', window.currentUser.id).single();
            if (profile?.is_banned) return alert("You are banned from commenting.");
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
            content: content,
            author_name: authorName,
            author_avatar: authorAvatar,
            user_id: userId,
            is_guest: isGuest,
            parent_id: parentId
        });

        if(!error) {
            input.value = '';
            // Скрываем форму ответа если это был ответ
            if (parentId) {
                const area = document.getElementById(`reply-area-${parentId}`);
                if(area) area.style.display = 'none';
            }
            initCommentsModule();
        } else {
            alert("Error sending comment: " + error.message);
        }
    }

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

        // Сортируем: новые сверху
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
                    <span class="comment-date">${new Date(c.created_at).toLocaleDateString()}</span>
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

    // --- ACTIONS EXPORTS ---
    window.toggleReply = (id) => {
        const area = document.getElementById(`reply-area-${id}`);
        if(area) area.style.display = area.style.display === 'none' ? 'block' : 'none';
    };

    window.voteComment = async (id, type, currentVote) => {
        if (!window.currentUser) return window.openAuthModal();
        if (currentVote !== 0) {
            await window.supabase.from('comment_votes').delete().match({ user_id: window.currentUser.id, comment_id: id });
        }
        if (currentVote !== type) {
            await window.supabase.from('comment_votes').insert({ user_id: window.currentUser.id, comment_id: id, vote_type: type });
        }
        initCommentsModule();
    };

    window.deleteComment = async (id) => {
        if (confirm('Delete this comment?')) {
            const { error } = await window.supabase.from('comments').delete().eq('id', id);
            if (!error) initCommentsModule();
            else alert("Error deleting: " + error.message);
        }
    };

    window.banUser = async (uid) => {
        if (!window.isAdmin) return;
        if (confirm("Ban this user permanently?")) {
            const { error } = await window.supabase.from('profiles').upsert({ id: uid, is_banned: true });
            if (!error) {
                alert("User banned.");
                location.reload(); 
            } else alert(error.message);
        }
    };

    window.unbanUser = async (uid) => {
        if (!window.isAdmin) return;
        if (confirm("Unban this user?")) {
            const { error } = await window.supabase.from('profiles').update({ is_banned: false }).eq('id', uid);
            if (!error) {
                alert("User unbanned.");
                // Если мы в профиле, перезагружаем список
                if (typeof window.loadBannedUsers === 'function') window.loadBannedUsers();
            } else alert(error.message);
        }
    };

    window.editComment = (id) => {
        const body = document.getElementById(`body-${id}`);
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

    window.saveEdit = async (id) => {
        const text = document.getElementById(`edit-txt-${id}`).value;
        const { error } = await window.supabase.from('comments').update({ content: text }).eq('id', id);
        if(!error) initCommentsModule();
        else alert(error.message);
    };

    window.cancelEdit = (id) => {
        const body = document.getElementById(`body-${id}`);
        if(body.dataset.original) body.innerHTML = body.dataset.original;
    };

    window.reportComment = async (id) => {
        if (!window.currentUser) return window.openAuthModal();
        const reason = prompt("Reason for reporting:");
        if (reason) {
            await window.supabase.from('reports').insert({ reporter_id: window.currentUser.id, comment_id: id, reason });
            alert("Report sent.");
        }
    };

    // --- GLOBAL HELPERS FOR ADMIN ---
    // Функция получения списка забаненных (вызывается из профиля)
    window.fetchBannedUsers = async () => {
        const { data, error } = await window.supabase
            .from('profiles')
            .select('*')
            .eq('is_banned', true)
            .order('updated_at', { ascending: false });
        return data || [];
    };

    // --- EXPORTS ---
    window.openAuthModal = () => document.getElementById('auth-modal').style.display = 'flex';
    window.closeAuthModal = () => document.getElementById('auth-modal').style.display = 'none';
    window.loginWith = async (p) => {
        await window.supabase.auth.signInWithOAuth({ 
            provider: p, 
            options: { redirectTo: window.location.origin + '/profile/' } 
        });
    };

    function initTheme() { /*... theme logic ...*/ }
    function initLangSwitcher() { /*... lang logic ...*/ }
    function initCopyButtons() { /*... copy logic ...*/ }
    function initModalHandlers() {
        window.openAuthModal = () => document.getElementById('auth-modal').style.display = 'flex';
        window.closeAuthModal = () => document.getElementById('auth-modal').style.display = 'none';
    }
    function escapeHtml(text) {
        if(!text) return "";
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }
})();
