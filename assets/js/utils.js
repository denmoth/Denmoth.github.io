(function() {
    window.getCleanSlug = function() {
        let path = window.location.pathname;
        if (path.startsWith('/ru')) path = path.substring(3);
        if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
        if (path === '') path = '/';
        return path;
    };

    window.escapeHtml = function(text) {
        if(!text) return "";
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    };

    window.initTheme = function() {
        const btn = document.getElementById('theme-toggle');
        if(!btn) return;
        
        // Читаем тему
        let current = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', current);
        
        btn.onclick = () => {
            current = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', current);
            localStorage.setItem('theme', current);
            // Анимация работает через CSS селектор [data-theme="dark"]
        };
    };

    window.initLangSwitcher = function() {
        const select = document.getElementById('lang-select');
        if(!select) return;
        const newSelect = select.cloneNode(true);
        if(select.parentNode) select.parentNode.replaceChild(newSelect, select);
        newSelect.addEventListener('change', (e) => {
            const path = window.location.pathname;
            if (e.target.value === 'ru' && !path.startsWith('/ru')) {
                window.location.href = path === '/' ? '/ru/' : '/ru' + path;
            } else if (e.target.value === 'en' && path.startsWith('/ru')) {
                window.location.href = path.replace('/ru', '') || '/';
            }
        });
    };

    window.initCopyButtons = function() {
        document.querySelectorAll('.result-group, .code-container').forEach(group => {
            if(group.querySelector('.copy-icon-btn, .copy-btn')) return;
            let target = group.querySelector('input, textarea') || group.querySelector('pre, code');
            const btn = document.createElement('button');
            if (group.classList.contains('code-container')) {
                btn.className = 'copy-btn btn'; btn.innerHTML = 'Copy'; btn.style.cssText = 'position:absolute; right:10px; top:8px;';
                const head = group.querySelector('.code-head'); head ? head.appendChild(btn) : group.appendChild(btn);
            } else {
                btn.className = 'copy-icon-btn'; btn.innerHTML = '<i class="fa-regular fa-copy"></i>'; group.appendChild(btn);
            }
            btn.onclick = () => {
                const txt = target && (target.value || target.innerText) || "";
                navigator.clipboard.writeText(txt);
                const originalHtml = btn.innerHTML;
                btn.innerHTML = group.classList.contains('code-container') ? 'Copied!' : '<i class="fa-solid fa-check"></i>';
                setTimeout(() => btn.innerHTML = originalHtml, 1500);
            };
        });
    };

    window.initModalHandlers = function() {
        window.openAuthModal = () => { const m = document.getElementById('auth-modal'); if(m) m.style.display = 'flex'; };
        window.closeAuthModal = () => { const m = document.getElementById('auth-modal'); if(m) m.style.display = 'none'; };
        const m = document.getElementById('auth-modal');
        if(m) m.addEventListener('click', (e) => { if(e.target === m) window.closeAuthModal(); });
    };

    // FIX: Логика поиска по инструментам
    window.initToolSearch = function() {
        const input = document.getElementById('tool-search');
        if (!input) return;

        input.addEventListener('input', (e) => {
            const filter = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.card-grid .card');
            
            cards.forEach(card => {
                // Ищем в заголовке и описании
                const text = (card.querySelector('h3')?.innerText + " " + card.querySelector('p')?.innerText).toLowerCase();
                card.style.display = text.includes(filter) ? 'flex' : 'none';
            });
        });
    };

    window.switchTab = function(tabName) {
        document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.settings-section').forEach(s => s.classList.remove('active'));
        if(window.event && window.event.currentTarget) window.event.currentTarget.classList.add('active');
        document.getElementById('tab-' + tabName).classList.add('active');
    };
})();
