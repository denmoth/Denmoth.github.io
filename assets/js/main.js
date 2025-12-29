document.addEventListener('DOMContentLoaded', () => {
    try { initTheme(); } catch(e) {}
    try { initLanguage(); } catch(e) {}
    try { initAuth(); } catch(e) {}
    
    initSidebar();
    if(document.getElementById('gradle-output')) initGradleGen();
    initCopy();
    initStats();
    try { initScrollSpy(); } catch(e) {}
    initAdsSim();
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
    if(!loginBtn) return;

    if(typeof supabase === 'undefined') {
        console.warn("Supabase not configured");
        return;
    }

    async function updateUI() {
        const { data: { session } } = await supabase.auth.getSession();
        if(session) {
            loginBtn.innerHTML = `<img src="${session.user.user_metadata.avatar_url || 'https://github.com/identicons/user.png'}" style="width:20px;border-radius:50%"> ${session.user.user_metadata.user_name || 'User'}`;
            loginBtn.onclick = async () => {
                if(confirm("Log out?")) {
                    await supabase.auth.signOut();
                    window.location.reload();
                }
            };
        } else {
            loginBtn.innerHTML = `<i class="fa-brands fa-github"></i> Log In`;
            loginBtn.onclick = async () => {
                await supabase.auth.signInWithOAuth({ provider: 'github' });
            };
        }
    }

    supabase.auth.onAuthStateChange((event, session) => {
        updateUI();
    });
    updateUI();
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

function initStats() {
    const structuresId = 1303344; 
    fetchStats(structuresId, 'structures');
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
        })
        .catch(e => console.log('CF Error:', e));
}

function formatNumber(num) {
    return new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(num);
}

function initAdsSim() {
    document.querySelectorAll('.ad-placeholder').forEach(el => {
        setTimeout(() => {
            el.style.backgroundImage = "url('https://placehold.co/160x600/222/444?text=Ad+Banner')";
            el.innerHTML = "";
            el.style.border = "none";
        }, 1500);
    });
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
