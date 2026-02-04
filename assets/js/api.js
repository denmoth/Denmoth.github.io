document.addEventListener("DOMContentLoaded", () => {
    const statuses = document.querySelectorAll('.api-status');
    
    statuses.forEach(status => {
        const cfId = status.dataset.cf;
        if (!cfId) return;

        fetch(`https://api.cfwidget.com/${cfId}`)
            .then(res => res.json())
            .then(data => {
                const downloads = new Intl.NumberFormat().format(data.downloads.total);
                status.innerHTML = `<i class="fa-solid fa-download"></i> ${downloads}`;
            })
            .catch(() => status.innerHTML = "Offline");
    });
});