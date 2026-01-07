// ==========================================
// CONFIGURATION
// ==========================================
// URL проекта Supabase.
const SUPABASE_URL = 'https://dtkmclmaboutpbeogqmw.supabase.co'; 
// Публичный (anon) ключ. 
// ВАЖНО: Убедись, что в Supabase включен RLS (Row Level Security), 
// иначе любой сможет редактировать данные, имея этот ключ.
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0a21jbG1hYm91dHBiZW9ncW13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNDA4NDUsImV4cCI6MjA4MjYxNjg0NX0.BcfRGmUuOKkAs5KYrLNyoymry1FnY4jqQyCanZ4x-PM';

let supabase; // Глобальный клиент Supabase

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Инициализация клиента Supabase
        const { createClient } = window.supabase;
        supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
        
        // Последовательный запуск модулей
        await initAuth();      // Аутентификация
        initComments();        // Система комментариев
        initProfile();         // Профиль пользователя (если есть на странице)
    } catch(e) {
        console.error("Supabase init failed:", e);
    }
    
    // UI инициализация (не зависит от бэкенда)
    initTheme();           // Темная/светлая тема
    initLangSwitcher();    // Переключатель языка (FIX)
    initCopyButtons();     // Кнопки "Копировать"
});

let currentUser = null; // Текущий залогиненный юзер

// ==========================================
// AUTHENTICATION MODULE
// ==========================================
async function initAuth() {
    // Проверка текущей сессии при загрузке
    const { data: { session } } = await supabase.auth.getSession();
    updateUserUI(session?.user);

    // Слушатель изменений состояния (вход/выход)
    supabase.auth.onAuthStateChange((_event, session) => {
        updateUserUI(session?.user);
    });

    // Обработчик кнопки входа в хедере
    const loginBtn = document.getElementById('login-btn');
    if(loginBtn) {
        loginBtn.onclick = (e) => {
            e.preventDefault();
            if(currentUser) {
                // Если уже вошел -> идем в профиль
                window.location.href = '/profile/'; 
            } else {
                // Если нет -> открываем модалку
                openAuthModal();
            }
        };
    }
}

// Обновление кнопки входа (Аватар + Имя или "Log In")
function updateUserUI(user) {
    currentUser = user;
    const loginBtn = document.getElementById('login-btn');
    if(!loginBtn) return;

    if (user) {
        const avatar = user.user_metadata.avatar_url || 'https://www.gravatar.com/avatar/?d=mp';
        // Показываем аватар и имя
        loginBtn.innerHTML = `<img src="${avatar}" style="width:24px; height:24px; border-radius:50%; object-fit:cover; margin-right:5px;"> ${user.user_metadata.full_name || user.email.split('@')[0]}`;
        loginBtn.href = "/profile/";
    } else {
        // Показываем кнопку входа
        loginBtn.innerHTML = `<i class="fa-brands fa-github"></i> Log In`;
    }
}

// ==========================================
// COMMENTS MODULE
// ==========================================
async function initComments() {
    const container = document.getElementById('comments-container');
    if (!container) return; // Если на странице нет блока комментов, выходим

    // Используем путь страницы как идентификатор треда
    const pageSlug = window.location.pathname;

    // Загрузка комментариев из БД
    const { data: comments, error } = await supabase
        .from('comments')
        .select('*')
        .eq('page_slug', pageSlug)
        .order('created_at', { ascending: false });

    if(error) console.error(error);
    renderComments(comments || []);

    // Обработка отправки нового комментария
    const sendBtn = document.getElementById('send-comment');
    if(sendBtn) {
        sendBtn.onclick = async () => {
            const input = document.getElementById('comment-input');
            const content = input.value.trim();
            if(!content) return;

            // Логика определения автора (Авторизованный или Гость)
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

            // Отправка в БД
            const { error: postError } = await supabase.from('comments').insert({
                page_slug: pageSlug,
                content: content,
                author_name: authorName,
                author_avatar: authorAvatar,
                user_id: userId,
                is_guest: isGuest
            });

            if(!postError) {
                input.value = ''; // Очистка поля
                initComments();   // Перезагрузка списка (можно оптимизировать через добавление в DOM)
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

    // Генерация HTML списка комментариев
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
// UI & THEME UTILS
// ==========================================

// Переключение темы (Dark/Light) с сохранением в LocalStorage
function initTheme() {
    const themes = ['dark', 'light'];
    const btn = document.getElementById('theme-toggle');
    let current = localStorage.getItem('theme') || 'dark'; // По дефолту темная
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

// [FIX] Исправленная логика переключения языка
// Ранее переключатель не работал, так как не было слушателя событий.
function initLangSwitcher() {
    const select = document.getElementById('lang-select');
    if(!select) return;

    select.addEventListener('change', (e) => {
        const targetLang = e.target.value;
        const currentPath = window.location.pathname;
        let newPath = currentPath;

        // Логика URL для Jekyll Polyglot:
        // RU версия: /ru/some-page/
        // EN версия: /some-page/ (дефолтная)
        
        if (targetLang === 'ru' && !currentPath.startsWith('/ru')) {
            // Переход EN -> RU
            newPath = '/ru' + currentPath;
        } else if (targetLang === 'en' && currentPath.startsWith('/ru')) {
            // Переход RU -> EN (убираем префикс)
            newPath = currentPath.replace('/ru', '') || '/';
        }

        if (newPath !== currentPath) {
            window.location.href = newPath;
        }
    });
}

// Инициализация кнопок копирования для блоков кода и инпутов
function initCopyButtons() {
    document.querySelectorAll('.result-group, .code-container').forEach(group => {
        // Проверка, чтобы не дублировать кнопки
        if(group.querySelector('.copy-icon-btn, .copy-btn')) return;
        
        let target = group.querySelector('input, textarea');
        let textToCopy = "";

        // Если это блок кода (pre/code)
        if (!target) {
            target = group.querySelector('pre, code');
            if (target) textToCopy = target.innerText;
        }

        const btn = document.createElement('button');
        
        // Стилизация кнопки в зависимости от типа контейнера
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
            // Маленькая иконка для простых полей
            btn.className = 'copy-icon-btn';
            btn.innerHTML = '<i class="fa-regular fa-copy"></i>';
            group.appendChild(btn);
        }

        // Обработчик клика (Copy to Clipboard)
        btn.onclick = () => {
            const txt = target && (target.value || target.innerText) || textToCopy;
            navigator.clipboard.writeText(txt);
            
            // Визуальная обратная связь
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

// Безопасность: Экранирование HTML тегов для защиты от XSS в комментариях
function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// Экспорт функций для вызова из HTML (onclick)
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
