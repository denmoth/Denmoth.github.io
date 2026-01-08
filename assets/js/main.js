// ==========================================
// CONFIGURATION & GUARD
// ==========================================
(function() {
    // Защита от повторного запуска
    if (window.denmothMainInitialized) return;
    window.denmothMainInitialized = true;

    const SUPABASE_URL = 'https://dtkmclmaboutpbeogqmw.supabase.co'; 
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0a21jbG1hYm91dHBiZW9ncW13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNDA4NDUsImV4cCI6MjA4MjYxNjg0NX0.BcfRGmUuOKkAs5KYrLNyoymry1FnY4jqQyCanZ4x-PM';
    
    // Твой Email для админки
    const ADMIN_EMAIL = 'denmoth8871top@gmail.com'; 

    window.currentUser = null;

    // ==========================================
    // INITIALIZATION
    // ==========================================
    document.addEventListener('DOMContentLoaded', async () => {
        try {
            // Инициализация Supabase
            if (window.supabase && window.supabase.createClient) {
                const { createClient } = window.supabase;
                window.supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
                
                await initAuth();
                initComments();
            } else {
                console.error("Supabase client not loaded properly.");
            }
        } catch(e) {
            console.error("Init error:", e);
        }
        
        initTheme();
        initLangSwitcher();
        initCopyButtons();
        
        // Модальное окно (глобальный обработчик закрытия)
        const modal = document.getElementById('auth-modal');
        if(modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeAuthModal();
            });
        }
    });

    // ==========================================
    // AUTHENTICATION MODULE
    // ==========================================
    async function initAuth() {
        const { data: { session } } = await window.supabase.auth.getSession();
        updateUserUI(session?.user);

        window.supabase.auth.onAuthStateChange((_event, session) => {
            updateUserUI(session?.user);
        });
    }

    async function updateUserUI(user) {
        window.currentUser = user;
        const loginBtn = document.getElementById('login-btn');
        const isAdmin = user?.email === ADMIN_EMAIL;

        // Обновляем UI в профиле, если мы там
        if (window.location.pathname.includes('/profile/')) {
            renderProfilePage(user, isAdmin);
        }

        if(!loginBtn) return;

        if (user) {
            const avatar = user.user_metadata.avatar_url || 'https://www.gravatar.com/avatar/?d=mp';
            const name = user.user_metadata.full_name || user.email.split('@')[0];
            
            // Если админ - добавляем красный бейдж или рамку
            const borderStyle = isAdmin ? 'border: 2px solid #d73a49;' : 'border: 1px solid var(--border);';
            const adminIcon = isAdmin ? '<i class="fa-solid fa-crown" style="color:#d73a49; font-size:0.8rem; margin-right:5px;"></i>' : '';

            loginBtn.innerHTML = `
                <img src="${avatar}" style="width:24px; height:24px; border-radius:50%; object-fit:cover; margin-right:8px; ${borderStyle}">
                <span>${adminIcon}${name}</span>
            `;
            
            // Прямая ссылка на профиль
            loginBtn.href = "/profile/";
            
            // Убираем старые обработчики, чтобы ссылка работала
            const newBtn = loginBtn.cloneNode(true);
            loginBtn.parentNode.replaceChild(newBtn, loginBtn);
        } else {
            const isRu = window.location.pathname.startsWith('/ru');
            loginBtn.innerHTML = `<i class="fa-brands fa-github"></i> <span>${isRu ? 'Войти' : 'Log In'}</span>`;
            loginBtn.href = "#";
            
            // Возвращаем модалку при клике
            const newBtn = document.getElementById('login-btn'); // Получаем новый элемент после клона (если был)
            if(newBtn) {
                newBtn.onclick = (e) => { 
                    e.preventDefault(); 
                    openAuthModal(); 
                };
            }
        }
    }

    // ==========================================
    // PROFILE LOGIC (Settings & Sync)
    // ==========================================
    async function renderProfilePage(user, isAdmin) {
        const loading = document.getElementById('profile-loading');
        const content = document.getElementById('profile-content');
        const guest = document.getElementById('guest-view');
        
        if(!content) return;

        if(loading) loading.style.display = 'none';
        
        if(user) {
            content.style.display = 'block';
            if(guest) guest.style.display = 'none';
            
            // Заполняем данные
            document.getElementById('p-avatar').src = user.user_metadata.avatar_url;
            document.getElementById('p-name').textContent = user.user_metadata.full_name || 'User';
            document.getElementById('p-email').textContent = user.email;

            // Статус
            const badge = document.getElementById('p-status-badge');
            if (isAdmin) {
                badge.style.backgroundColor = '#d73a49';
                badge.innerHTML = '<i class="fa-solid fa-shield-halved"></i> Administrator';
                // Показываем админку
                const adminTab = document.getElementById('btn-tab-admin');
                if(adminTab) adminTab.style.display = 'inline-block';
            } else {
                badge.style.backgroundColor = '#238636';
                badge.textContent = 'User';
            }

            // Загрузка настроек из БД
            await loadUserSettings(user.id);

        } else {
            content.style.display = 'none';
            if(guest) guest.style.display = 'block';
        }
    }

    async function loadUserSettings(userId) {
        // Пытаемся получить профиль из таблицы 'profiles'
        // Таблица должна иметь поля: id (uuid), language (text), email_notif (bool)
        const { data, error } = await window.supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (data) {
            // Устанавливаем значения в инпуты
            const langSelect = document.getElementById('pref-lang');
            const notifCheck = document.getElementById('pref-email-notif');
            
            if(langSelect && data.language) langSelect.value = data.language;
            if(notifCheck && data.email_notif !== undefined) notifCheck.checked = data.email_notif;
        } else if (error && error.code === 'PGRST116') {
            // Профиля нет, создаем дефолтный (тихо)
            console.log("Creating new profile entry...");
            await window.supabase.from('profiles').insert({ id: userId });
        }
    }

    // Экспортируем функцию сохранения для кнопки в HTML
    window.saveProfile = async () => {
        if(!window.currentUser) return;
        
        const btn = document.getElementById('save-settings-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
        btn.disabled = true;

        const lang = document.getElementById('pref-lang').value;
        const notif = document.getElementById('pref-email-notif').checked;

        const { error } = await window.supabase
            .from('profiles')
            .upsert({ 
                id: window.currentUser.id, 
                language: lang, 
                email_notif: notif,
                updated_at: new Date()
            });

        if (!error) {
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Saved!';
            btn.style.borderColor = '#238636';
            btn.style.color = '#238636';
            
            // Если язык отличается от текущего URL, предлагаем перезагрузку
            const currentIsRu = window.location.pathname.startsWith('/ru');
            if ((lang === 'ru' && !currentIsRu) || (lang === 'en' && currentIsRu)) {
                setTimeout(() => {
                    window.location.href = lang === 'ru' ? '/ru/profile/' : '/profile/';
                }, 1000);
                return;
            }
        } else {
            btn.innerHTML = 'Error';
            btn.style.borderColor = '#d73a49';
            console.error(error);
        }

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            btn.style.borderColor = '';
            btn.style.color = '';
        }, 2000);
    };

    // ==========================================
    // COMMENTS MODULE
    // ==========================================
    async function initComments() {
        const container = document.getElementById('comments-container');
        const list = document.getElementById('comments-list');
        
        if (!container || !list) return;

        const pageSlug = window.location.pathname;

        // Загрузка комментов
        const { data: comments, error } = await window.supabase
            .from('comments')
            .select('*')
            .eq('page_slug', pageSlug)
            .order('created_at', { ascending: false });

        if (!error) {
            renderComments(comments || []);
        } else {
            list.innerHTML = `<div style="text-align:center; padding:20px; color:#d73a49;">Error loading comments</div>`;
        }

        // Отправка
        const sendBtn = document.getElementById('send-comment');
        if(sendBtn) {
            sendBtn.onclick = async () => {
                const input = document.getElementById('comment-input');
                const content = input.value.trim();
                if(!content) return;

                sendBtn.disabled = true;
                sendBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

                const guestNameInput = document.getElementById('guest-name');
                let authorName = "Guest";
                let authorAvatar = null;
                let userId = null;
                let isGuest = true;

                if(window.currentUser) {
                    authorName = window.currentUser.user_metadata.full_name || window.currentUser.email.split('@')[0];
                    authorAvatar = window.currentUser.user_metadata.avatar_url;
                    userId = window.currentUser.id;
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

                sendBtn.disabled = false;
                sendBtn.innerHTML = 'Post';

                if(!postError) {
                    input.value = '';
                    initComments(); // Refresh list
                } else {
                    alert("Error: " + postError.message);
                }
            };
        }
    }

    function renderComments(comments) {
        const list = document.getElementById('comments-list');
        if(!list) return;
        
        if(comments.length === 0) {
            list.innerHTML = `<div style="text-align:center; color:var(--text-muted); padding:20px;">No comments yet.</div>`;
            return;
        }

        list.innerHTML = comments.map(c => `
            <div class="comment-box">
                <div class="comment-header">
                    <img src="${c.author_avatar || 'https://www.gravatar.com/avatar/?d=mp'}" class="comment-avatar">
                    <span class="comment-author">${escapeHtml(c.author_name)}</span>
                    ${c.is_guest ? '<span class="guest-tag">Guest</span>' : ''}
                    ${c.user_id && c.user_id === window.currentUser?.id ? '<span class="badge" style="margin-left:5px; font-size:0.6rem;">You</span>' : ''}
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
        
        // Удаляем старые слушатели (клонированием)
        const newSelect = select.cloneNode(true);
        select.parentNode.replaceChild(newSelect, select);

        newSelect.addEventListener('change', (e) => {
            const target = e.target.value;
            const path = window.location.pathname; // например "/tools/" или "/ru/tools/"
            
            if (target === 'ru') {
                // Если мы уже на русском, ничего не делаем
                if (path.startsWith('/ru')) return;
                // Иначе добавляем /ru в начало
                // Учитываем корень сайта
                if (path === '/') window.location.href = '/ru/';
                else window.location.href = '/ru' + path;
            } 
            else if (target === 'en') {
                // Если мы НЕ на русском, ничего не делаем
                if (!path.startsWith('/ru')) return;
                // Убираем /ru
                let newPath = path.replace('/ru', '');
                // Если получилось пусто (было /ru/), ставим /
                if (newPath === '') newPath = '/';
                window.location.href = newPath;
            }
        });
    }

    function initCopyButtons() {
        // Код копирования (оставляем как был)
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

    function escapeHtml(text) {
        if(!text) return "";
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    // GLOBAL EXPORTS
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

})();
