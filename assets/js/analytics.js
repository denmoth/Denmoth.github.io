/* --- Denmoth Analytics Engine --- */
/* Handles Stats, Live Users, and Time Tracking via Supabase */

class AnalyticsEngine {
    constructor() {
        // Конфигурация
        this.pingInterval = 10000; // 10 сек (пинг сервера)
        this.idleTimeout = 30000;  // 30 сек (время до "AFK")
        
        // Состояние
        this.currentToolId = this.detectToolId();
        this.lastActivity = Date.now();
        this.timeAccumulator = 0; // Накопленные секунды для отправки
        this.isIdle = false;

        this.init();
    }

    detectToolId() {
        // Определяем ID инструмента по URL (например, /tools/uuid/ -> uuid)
        const path = window.location.pathname;
        if (path.includes('/tools/')) {
            const parts = path.split('/').filter(p => p);
            // Если путь /tools/uuid/, то parts = ['tools', 'uuid']
            if (parts.length >= 2 && parts[0] === 'tools') {
                return parts[1];
            }
        }
        return null;
    }

    init() {
        // Игнорируем, если аналитика отключена юзером
        if (localStorage.getItem('analytics_disabled')) {
            console.log("Analytics disabled by user.");
            return;
        }

        // Запускаем старый Google Analytics (оставляем для совместимости)
        this.loadGoogleAnalytics();

        // Если мы на странице инструмента, запускаем расширенную статистику
        if (this.currentToolId) {
            console.log(`[Analytics] Tracking tool: ${this.currentToolId}`);
            this.startHeartbeat();
            this.setupIdleListeners();
        }
    }

    loadGoogleAnalytics() {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=G-BK5VTFSFL4';
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag; // Экспорт для использования извне
        gtag('js', new Date());
        gtag('config', 'G-BK5VTFSFL4');
    }

    setupIdleListeners() {
        const resetIdle = () => {
            this.lastActivity = Date.now();
            this.isIdle = false;
        };
        window.addEventListener('mousemove', resetIdle);
        window.addEventListener('keydown', resetIdle);
        window.addEventListener('click', resetIdle);
        window.addEventListener('scroll', resetIdle);
    }

    startHeartbeat() {
        // Пинг каждые 10 секунд
        setInterval(() => {
            const now = Date.now();
            // Если прошло меньше 30 сек с активности, добавляем время
            if (now - this.lastActivity < this.idleTimeout) {
                // Добавляем интервал пинга (в секундах)
                this.sendPing(this.pingInterval / 1000); 
            } else {
                // Юзер AFK, шлем пинг, но время не добавляем (0 сек)
                // Чтобы он оставался в списке "Live", но время не тикало? 
                // Нет, для Live Users ему нужно обновлять last_seen.
                this.sendPing(0);
            }
        }, this.pingInterval);
    }

    async sendPing(timeDeltaSeconds) {
        if (!window.supabase) return;

        try {
            // Вызываем RPC функцию в базе
            await window.supabase.rpc('ping_tool', { 
                t_id: this.currentToolId, 
                time_delta: Math.floor(timeDeltaSeconds) 
            });
            
            if (localStorage.getItem('dev_mode')) {
                console.log(`[Dev] Ping sent for ${this.currentToolId}. Time added: ${timeDeltaSeconds}s`);
            }
        } catch (e) {
            console.warn("Ping failed", e);
        }
    }

    // Метод для вызова по нажатию кнопки "Generate"
    async trackUsage() {
        if (!window.supabase || !this.currentToolId) return;
        
        try {
            await window.supabase.rpc('track_tool_use', { t_id: this.currentToolId });
            
            if (localStorage.getItem('dev_mode')) {
                console.log(`[Dev] Usage tracked for ${this.currentToolId}`);
            }
        } catch (e) {
            console.error("Track usage failed", e);
        }
    }
}

// Запуск
window.DenmothAnalytics = new AnalyticsEngine();

// Глобальная функция для кнопок
window.trackToolUsage = () => window.DenmothAnalytics.trackUsage();
