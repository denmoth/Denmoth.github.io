const params = new URLSearchParams(window.location.search);
const ref = params.get('ref') ? params.get('ref').toLowerCase() : null;

if (ref === 'denmoth') {
    localStorage.setItem('analytics_disabled', 'true');
    console.log('Analytics disabled via URL parameter.');
}

if (!localStorage.getItem('analytics_disabled')) {
    
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-BK5VTFSFL4';
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    let gaConfig = {};

    if (ref) {
        if (ref === 'discord') {
            gaConfig.campaign_source = 'discord';
            gaConfig.campaign_medium = 'social';
        } else if (ref.includes('_')) {
            const parts = ref.split('_');
            gaConfig.campaign_source = parts[0];
            gaConfig.campaign_medium = 'referral';
            gaConfig.campaign_name = parts[1];
        }
    }

    gtag('config', 'G-BK5VTFSFL4', gaConfig);
} else {
    console.log('Analytics is disabled for this user.');
}
