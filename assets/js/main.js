document.addEventListener('DOMContentLoaded', () => {
    // ЗАЩИТА ОТ СБОЕВ: Если что-то пошло не так, раскомментируй эту строку один раз, запушь, зайди на сайт, потом закомментируй обратно.
    // localStorage.clear(); 

    try { initTheme(); } catch(e) {}
    try { initLanguage(); } catch(e) {}
    initSidebar();
    if(document.getElementById('gradle-output')) initGradleGen();
    initCopy();
    initStats();
});

function initTheme() {
    const btn = document.getElementById('theme-toggle');
    // По умолчанию ставим DARK, чтобы не слепило белым экраном при ошибке
    let stored = localStorage.getItem('theme') || 'dark';
    
    // Если вдруг сохранился мусор, сбрасываем на dark
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
    
    // Защита от кривых значений
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

function initStats() {
    // Твой ID проекта Create: Structures
    const projectId = 1303344; 
    
    if(projectId === 0) return;

    fetch(`https://api.cfwidget.com/${projectId}`)
        .then(r => r.json())
        .then(data => {
            const dlEl = document.querySelector('.cf-downloads');
            if(dlEl) dlEl.textContent = formatNumber(data.downloads.total);

            // Ищем файл Forge 1.20.1
            const file = data.files.find(f => f.versions.includes("1.20.1") && f.versions.includes("Forge"));
            
            if(file) {
                const vEl = document.querySelector('.cf-version');
                // Берем название файла (обычно там есть версия)
                if(vEl) vEl.textContent = file.display_name.replace('.jar', '');

                const logBtn = document.querySelector('.open-changelog');
                if(logBtn) {
                    logBtn.style.display = 'inline-flex';
                    logBtn.onclick = (e) => {
                        e.preventDefault();
                        showChangelog(file, data.urls.curseforge);
                    };
                }
            }
        })
        .catch(e => console.log('CF Error:', e));
}

function formatNumber(num) {
    return new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(num);
}

function showChangelog(file, url) {
    const modal = document.getElementById('changelog-modal');
    const body = modal.querySelector('.modal-body');
    
    body.innerHTML = `
        <div class="changelog-item" style="border:none;">
            <span class="changelog-ver" style="font-size:1.1rem;">${file.display_name}</span>
            <span class="changelog-date">Type: ${file.type}</span>
            <p style="margin-top:15px; color:var(--text-muted); font-size:0.9rem;">
                CurseForge API does not provide full changelog text remotely. 
                Please view it on the official page.
            </p>
            <a href="${url}/files/${file.id}" target="_blank" class="btn primary" style="margin-top:15px; width:100%;">View on CurseForge</a>
        </div>
    `;
    
    modal.style.display = 'flex';
    
    modal.querySelector('.close-btn').onclick = () => modal.style.display = 'none';
    modal.onclick = (e) => {
        if(e.target === modal) modal.style.display = 'none';
    };
}
