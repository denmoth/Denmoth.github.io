(function() {
    window.getCleanSlug = function() {
        let path = window.location.pathname;
        if (path.startsWith('/ru')) path = path.substring(3);
        if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
        return path || '/';
    };
    window.escapeHtml = function(text) {
        return text ? text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";
    };
    window.initModalHandlers = function() {
        window.openAuthModal = () => { const m = document.getElementById('auth-modal'); if(m) m.style.display = 'flex'; };
        window.closeAuthModal = () => { const m = document.getElementById('auth-modal'); if(m) m.style.display = 'none'; };
    };
})();