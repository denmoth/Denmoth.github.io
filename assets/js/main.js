document.addEventListener('DOMContentLoaded', () => {
    try { initTheme(); } catch(e) {}
    try { initLanguage(); } catch(e) {}
    initSidebar();
    if(document.getElementById('gradle-output')) initGradleGen();
    initCopy();
    initStats();
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

function initSidebar() {
    const btn = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    if(btn && sidebar) {
        btn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
}

function initGradleGen() {
    const loader = document.getElementById('loader-select');
    const ver = document.getElementById('mc-version');
    const out = document.getElementById('gradle-output');

    function update() {
        if(!loader || !ver || !out) return;
        const lVal = loader.value;
        const vVal = ver.value;
        
        const projectId = "12345"; 
        const projectSlug = "cubeui"; 
        
        let fileId = (vVal === '1.20.1') ? '0000001' : '0000002'; 

        let text = "dependencies {\n";
        
        if(lVal === 'forge') {
            text += `    implementation fg.deobf("cursemaven:${projectSlug}-${projectId}:${fileId}")\n`;
        } else {
            text += `    modImplementation "maven.modrinth:${projectSlug}:1.0.0+${vVal}"\n`;
        }
        text += "}";
        out.textContent = text;
    }

    if(loader && ver) {
        loader.addEventListener('change', update);
        ver.addEventListener('change', update);
        update();
    }
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
    const cubeUiId = 0; 

    fetchStats(structuresId, 'structures');
    fetchStats(cubeUiId, 'cubeui');
}

function fetchStats(id, type) {
    if(!id || id === 0) return;

    fetch(`https://api.cfwidget.com/${id}`)
        .then(r => r.json())
        .then(data => {
            const card = document.querySelector(`[data-project="${type}"]`);
            if(!card) return;

            const dlEl = card.querySelector('.cf-downloads');
            if(dlEl && data.downloads) dlEl.textContent = formatNumber(data.downloads.total);

            const file = data.files.find(f => f.versions.includes("1.20.1") && f.versions.includes("Forge"));
            
            if(file) {
                const badge = card.querySelector('.badge');
                if(badge) {
                    const fName = file.display_name || file.name || "Version";
                    badge.textContent = fName.replace('.jar', '');
                    badge.style.color = "#58a6ff";
                    badge.style.borderColor = "#58a6ff";
                }
            }
        })
        .catch(e => console.log('CF Error:', e));
}

function formatNumber(num) {
    return new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(num);
}
