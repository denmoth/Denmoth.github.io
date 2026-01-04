document.addEventListener('DOMContentLoaded', () => {
    try { initTheme(); } catch(e) {}
    try { initLanguage(); } catch(e) {}
    try { initAuth(); } catch(e) {}
    try { initSpoiler(); } catch(e) {}
    
    initSidebar();
    if(document.getElementById('gradle-output')) initGradleGen();
    initCopy();
    initStats();
    try { initScrollSpy(); } catch(e) {}
    
    const searchInput = document.getElementById('tool-search');
    if(searchInput) {
        searchInput.addEventListener('input', (e) => filterTools(e.target.value));
    }
});

function initTheme() {
    const themes = ['dark', 'light'];
    const btn = document.getElementById('theme-toggle');
    
    let currentTheme = localStorage.getItem('theme') || 'dark';
    if (!themes.includes(currentTheme)) currentTheme = 'dark';
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(btn, currentTheme);

    if(btn) {
        btn.onclick = () => {
            const currentIndex = themes.indexOf(currentTheme);
            const nextIndex = (currentIndex + 1) % themes.length;
            currentTheme = themes[nextIndex];
            
            document.documentElement.setAttribute('data-theme', currentTheme);
            localStorage.setItem('theme', currentTheme);
            updateThemeIcon(btn, currentTheme);
        };
    }
}

function updateThemeIcon(btn, theme) {
    if(!btn) return;
    const icons = { 'dark': '🌙', 'light': '☀️' };
    btn.textContent = icons[theme] || '🌙';
}

function initSpoiler() {
    const modal = document.getElementById('spoiler-modal');
    if (!modal) return;

    if (localStorage.getItem('cso_spoilers_accepted') === 'true') {
        modal.style.display = 'none';
    } else {
        modal.style.display = 'flex';
    }
    
    window.acceptSpoilers = () => {
        localStorage.setItem('cso_spoilers_accepted', 'true');
        modal.style.opacity = '0';
        setTimeout(() => modal.style.display = 'none', 300);
    };
}

// Новая логика: редирект на /ru/ или обратно
function initLanguage() {
    const sel = document.getElementById('lang-select');
    if(!sel) return;

    // Определяем текущий язык по URL
    const currentPath = window.location.pathname;
    const isRu = currentPath.startsWith('/ru/');
    sel.value = isRu ? 'ru' : 'en';

    sel.addEventListener('change', (e) => {
        const targetLang = e.target.value;
        let newPath = currentPath;

        if (targetLang === 'ru' && !isRu) {
            // Переход на RU: добавляем префикс
            newPath = '/ru' + currentPath;
        } else if (targetLang === 'en' && isRu) {
            // Переход на EN: убираем префикс
            newPath = currentPath.replace('/ru', '') || '/';
        }

        if (newPath !== currentPath) {
            window.location.href = newPath;
        }
    });
}

function initAuth() {
    const loginBtn = document.getElementById('login-btn');
    if(!loginBtn || typeof supabase === 'undefined') return;

    supabase.auth.getSession().then(({ data: { session } }) => {
        handleSession(session);
    });

    supabase.auth.onAuthStateChange((event, session) => {
        handleSession(session);
    });

    function handleSession(session) {
        if(session) {
            document.body.classList.add('premium-user');
            loginBtn.innerHTML = `<img src="${session.user.user_metadata.avatar_url || 'https://github.com/identicons/user.png'}" style="width:20px;border-radius:50%">`;
            loginBtn.title = "Log Out";
            loginBtn.onclick = async () => {
                if(confirm("Log out?")) {
                    await supabase.auth.signOut();
                    window.location.reload();
                }
            };
        } else {
            document.body.classList.remove('premium-user');
            initAds();
            loginBtn.innerHTML = `<i class="fa-brands fa-github"></i> Log In`;
            loginBtn.onclick = async () => {
                await supabase.auth.signInWithOAuth({ provider: 'github' });
            };
        }
    }
}

function initAds() {
    // Исправлен ID на тот, что в head.html
    if(!document.getElementById('adsense-script')) {
        const script = document.createElement('script');
        script.id = 'adsense-script';
        script.async = true;
        script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9900275648830301";
        script.crossOrigin = "anonymous";
        document.head.appendChild(script);
    }
}

function filterTools(query) {
    const cards = document.querySelectorAll('.card-grid .card');
    const q = query.toLowerCase();
    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if(text.includes(q)) card.classList.remove('hidden');
        else card.classList.add('hidden');
    });
}

function initSidebar() {
    const btn = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.wiki-sidebar');
    if(btn && sidebar) {
        btn.addEventListener('click', () => sidebar.classList.toggle('open'));
    }
}

function initScrollSpy() {
    const sections = document.querySelectorAll('.doc-section');
    const navLinks = document.querySelectorAll('.wiki-sidebar .nav-link');
    if(sections.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) link.classList.add('active');
                });
            }
        });
    }, { rootMargin: '-10% 0px -80% 0px' });
    sections.forEach(section => observer.observe(section));
}

function initCopy() {
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const container = btn.closest('.code-container');
            if(!container) return;
            const code = container.querySelector('pre').textContent;
            navigator.clipboard.writeText(code);
            const oldText = btn.textContent;
            btn.textContent = "✓";
            setTimeout(() => btn.textContent = oldText, 2000);
        });
    });
}

function initStats() {
    const projects = [
        { id: 1303344, type: 'structures' }, 
        { id: 1415948, type: 'cubeui' }
    ];
    projects.forEach(p => fetchStats(p.id, p.type));
}

function fetchStats(id, type) {
    if(!id) return;
    fetch(`https://api.cfwidget.com/${id}`)
        .then(r => r.json())
        .then(data => {
            const card = document.querySelector(`[data-project="${type}"]`);
            if(!card) return;
            const dlEl = card.querySelector('.cf-downloads');
            if(dlEl && data.downloads) dlEl.textContent = formatNumber(data.downloads.total);
            const verEl = card.querySelector('.cf-version');
            if(verEl && data.files && data.files.length > 0) {
                const latestFile = data.files[0].name;
                const match = latestFile.match(/(\d+\.\d+\.\d+)/);
                if(match) verEl.textContent = match[1];
                else verEl.textContent = "Latest";
            }
        })
        .catch(e => console.error('CF Error:', e));
}

function formatNumber(num) {
    return new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short", maximumFractionDigits: 1 }).format(num);
}

function initGradleGen() {
    const loader = document.getElementById('loader-select');
    const ver = document.getElementById('mc-version');
    const out = document.getElementById('gradle-output');
    if(!loader || !ver) return;
    function update() {
        out.textContent = `dependencies {\n    implementation fg.deobf("curse.maven:cubeui-1415948:YOUR_FILE_ID")\n}`;
    }
    loader.addEventListener('change', update);
    ver.addEventListener('change', update);
    update();
}
