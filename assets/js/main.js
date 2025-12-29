document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initLanguage();
    initSidebar();
    
    // Запускаем генератор только если элемент существует на странице
    if(document.getElementById('gradle-output')) {
        initGradleGen();
    }
    
    initCopy();
});

function initTheme() {
    const btn = document.getElementById('theme-toggle');
    const stored = localStorage.getItem('theme') || 'dark';
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
    const stored = localStorage.getItem('lang') || 'en';
    
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
            sidebar.classList.toggle('collapsed'); // Desktop
            sidebar.classList.toggle('active'); // Mobile
        });
    }
}

function initGradleGen() {
    const loader = document.getElementById('loader-select');
    const ver = document.getElementById('mc-version');
    const out = document.getElementById('gradle-output');

    function update() {
        const lVal = loader.value;
        const vVal = ver.value;
        const id = "cubeui"; 
        
        // Простая конкатенация, чтобы избежать ошибок парсера
        let text = "dependencies {\n";
        
        if(lVal === 'forge') {
            let fileId = (vVal === '1.20.1') ? '5991001' : '5882002'; // Пример ID
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
            const code = btn.closest('.code-container').querySelector('pre').textContent;
            navigator.clipboard.writeText(code);
            const oldText = btn.textContent;
            btn.textContent = "✓";
            setTimeout(() => btn.textContent = oldText, 2000);
        });
    });
}
