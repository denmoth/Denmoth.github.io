document.addEventListener('DOMContentLoaded', () => {
    // Безопасный запуск функций
    try { initTheme(); } catch(e) { console.warn('Theme init failed', e); }
    try { initLanguage(); } catch(e) { console.warn('Lang init failed', e); }
    
    initSidebar();
    
    if(document.getElementById('gradle-output')) {
        initGradleGen();
    }
    
    initCopy();
});

function initTheme() {
    const btn = document.getElementById('theme-toggle');
    // Безопасное чтение
    let stored = 'dark';
    try { stored = localStorage.getItem('theme') || 'dark'; } catch(e) {}
    
    document.documentElement.setAttribute('data-theme', stored);
    if(btn) btn.textContent = stored === 'dark' ? '☀️' : '🌙';

    if(btn) btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        try { localStorage.setItem('theme', next); } catch(e) {}
        btn.textContent = next === 'dark' ? '☀️' : '🌙';
    });
}

function initLanguage() {
    const sel = document.getElementById('lang-select');
    let stored = 'en';
    try { stored = localStorage.getItem('lang') || 'en'; } catch(e) {}
    
    // Ставим класс на боди
    document.body.classList.remove('lang-en', 'lang-ru');
    document.body.classList.add('lang-' + stored);
    
    if(sel) {
        sel.value = stored;
        sel.addEventListener('change', (e) => {
            const val = e.target.value;
            try { localStorage.setItem('lang', val); } catch(e) {}
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
        const id = "cubeui"; 
        
        let text = "dependencies {\n";
        
        if(lVal === 'forge') {
            let fileId = (vVal === '1.20.1') ? '5991001' : '5882002';
            text += '    implementation fg.deobf("cursemaven:com.denmoth:' + id + '-12345:' + fileId + '")\n';
        } else {
            text += '    modImplementation "maven.modrinth:' + id + ':1.0.0+' + vVal + '"\n';
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
