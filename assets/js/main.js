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

    const projectId = 1303344; 
    
    if(projectId === 0) return;

    fetch(`https://api.cfwidget.com/${projectId}`)
        .then(r => r.json())
        .then(data => {
            const dlEl = document.querySelector('.cf-downloads');
            if(dlEl) dlEl.textContent = formatNumber(data.downloads.total);

            const file = data.files.find(f => f.versions.includes("1.20.1") && f.versions.includes("Forge"));
            
            if(file) {
                const vEl = document.querySelector('.cf-version');
                if(vEl) vEl.textContent = file.display_name;

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
    
    // CFWidget не отдает полный текст, только имя файла
    // Мы показываем имя файла и ссылку
    body.innerHTML = `
        <div class="changelog-item">
            <span class="changelog-ver">${file.display_name}</span>
            <span class="changelog-date">Type: ${file.type}</span>
            <p style="margin-top:10px; color:var(--text-muted)">
                View full changelog on CurseForge:
            </p>
            <a href="${url}/files/${file.id}" target="_blank" style="margin-top:5px; display:inline-block;">Open File Page</a>
        </div>
    `;
    
    modal.style.display = 'flex';
    
    modal.querySelector('.close-btn').onclick = () => modal.style.display = 'none';
    modal.onclick = (e) => {
        if(e.target === modal) modal.style.display = 'none';
    };
}
