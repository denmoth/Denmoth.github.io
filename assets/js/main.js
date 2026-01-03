{
type: file_content_fetcher:fetch
contentFetchId: uploaded:denmoth/denmoth.github.io/Denmoth.github.io-44d0bb1a9416821315e49d2dd205b89ffd69b8f2/assets/js/main.js
}
document.addEventListener('DOMContentLoaded', () => {
    try { initTheme(); } catch(e) {}
    try { initLanguage(); } catch(e) {}
    try { initAuth(); } catch(e) {}
    
    initSidebar();
    if(document.getElementById('gradle-output')) initGradleGen();
    initCopy();
    initStats();
    try { initScrollSpy(); } catch(e) {}
    
    // Init Search only on tools page
    const searchInput = document.getElementById('tool-search');
    if(searchInput) {
        searchInput.addEventListener('input', (e) => filterTools(e.target.value));
    }
});

function initTheme() {
    const btn = document.getElementById('theme-toggle');
    let stored = localStorage.getItem('theme') || 'dark';
    if(stored !== 'dark' && stored !== 'light') stored = 'dark';
    document.documentElement.setAttribute('data-theme', stored);
    if(btn) btn.textContent = stored === 'dark' ? '☀️' : '🌙';

    if(btn) btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        btn.textContent = next === 'dark' ? '☀️' : '🌙';
    });
}

function initLanguage() {
    const sel = document.getElementById('lang-select');
    let stored = localStorage.getItem('lang') || 'en';
    if(stored !== 'en' && stored !== 'ru') stored = 'en';
    document.body.classList.remove('lang-en', 'lang-ru');
    document.body.classList.add('lang-' + stored);
    if(sel) {
        sel.value = stored;
        sel.addEventListener('change', (e) => {
            const val = e.target.value;
            localStorage.setItem('lang', val);
            document.body.classList.remove('lang-en', 'lang-ru');
            document.body.classList.add('lang-' + val);
        });
    }
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
    if(!document.getElementById('adsense-script')) {
        const script = document.createElement('script');
        script.id = 'adsense-script';
        script.async = true;
        // REPLACE WITH REAL CLIENT ID
        script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX";
        script.crossOrigin = "anonymous";
        document.head.appendChild(script);
        
        setTimeout(() => {
            document.querySelectorAll('.ad-placeholder').forEach(el => {
                el.style.backgroundImage = "url('https://placehold.co/160x600/222/444?text=Google+Ad')";
                el.innerHTML = "";
                el.style.border = "none";
            });
        }, 1000);
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
    const sidebar = document.querySelector('.sidebar');
    if(btn && sidebar) {
        btn.addEventListener('click', () => sidebar.classList.toggle('active'));
    }
}

function initScrollSpy() {
    const sections = document.querySelectorAll('.doc-section');
    const navLinks = document.querySelectorAll('.sidebar li a');
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
    }, { rootMargin: '-20% 0px -60% 0px' });
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

// --- STATS & SUMMARY LOGIC ---

function initStats() {
    // Project IDs from CurseForge
    const projects = [
        { id: 1303344, type: 'structures' }, // Create: Structures Overhaul
        { id: 1415948, type: 'cubeui' }      // CubeUI
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

            // Update Downloads
            const dlEl = card.querySelector('.cf-downloads');
            if(dlEl && data.downloads) {
                dlEl.textContent = formatNumber(data.downloads.total);
            }

            // Update Summary (English only)
            const sumEl = card.querySelector('.cf-summary');
            if(sumEl && data.summary) {
                sumEl.textContent = data.summary;
            }
        })
        .catch(e => console.log('CF Error:', e));
}

function formatNumber(num) {
    // Returns 22.6K, 1.5M etc.
    return new Intl.NumberFormat('en-US', { 
        notation: "compact", 
        compactDisplay: "short",
        maximumFractionDigits: 1 
    }).format(num);
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
