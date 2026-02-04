class AnalyticsEngine {
    constructor() {
        this.pingInterval = 10000;
        this.currentToolId = this.detectPageId();
        this.init();
    }
    detectPageId() {
        const path = window.location.pathname;
        return path.split('/').filter(p => p && p !== 'ru').pop() || 'home';
    }
    init() {
        // Твой ID Google Analytics
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=G-BK5VTFSFL4';
        document.head.appendChild(script);
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-BK5VTFSFL4');
        
        this.startHeartbeat();
    }
    async startHeartbeat() {
        setInterval(async () => {
            if (window.supabase) {
                await window.supabase.rpc('ping_tool', { t_id: this.currentToolId, time_delta: 10 });
            }
        }, this.pingInterval);
    }
}
window.DenmothAnalytics = new AnalyticsEngine();