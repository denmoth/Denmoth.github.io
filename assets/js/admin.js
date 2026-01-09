// --- ADMIN MODULE ---

window.banUser = async function(uid) {
    if (!window.Denmoth.State.isAdmin) return;
    if (confirm("Ban user? All their comments will be deleted.")) {
        const { error } = await window.supabase.rpc('admin_ban_user', { target_id: uid });
        if (!error) {
            alert("User banned.");
            location.reload();
        } else {
            alert("Error: " + error.message);
        }
    }
};

window.unbanUser = async function(uid) {
    if (!window.Denmoth.State.isAdmin) return;
    if (confirm("Unban user?")) {
        const { error } = await window.supabase.rpc('admin_unban_user', { target_id: uid });
        if (!error) {
            alert("User unbanned.");
            if (typeof window.loadBannedUsers === 'function') window.loadBannedUsers();
        } else {
            alert("Error: " + error.message);
        }
    }
};

window.loadBannedUsers = async function() {
    const tbody = document.getElementById('ban-list-body');
    if(!tbody) return;
    
    tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; padding:20px;">Loading...</td></tr>';
    
    // Используем глобальное состояние
    const { data, error } = await window.supabase
        .from('profiles')
        .select('*')
        .eq('is_banned', true)
        .order('updated_at', { ascending: false });

    if (data) {
        window.Denmoth.State.bannedUsersCache = data;
        window.renderBanList(data);
    } else {
        console.error("Load Ban List Error:", error);
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; color:#d73a49;">Error loading list. Check console.</td></tr>';
    }
};

window.filterBanList = function() {
    const q = document.getElementById('ban-search').value.toLowerCase();
    const list = window.Denmoth.State.bannedUsersCache || [];
    const filtered = list.filter(u => 
        (u.full_name && u.full_name.toLowerCase().includes(q)) || 
        (u.email && u.email.toLowerCase().includes(q))
    );
    window.renderBanList(filtered);
};

window.renderBanList = function(list) {
    const tbody = document.getElementById('ban-list-body');
    if (!list || list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="padding:15px; text-align:center; color:var(--text-muted);">No banned users found.</td></tr>';
        return;
    }
    
    tbody.innerHTML = list.map(u => `
        <tr style="border-bottom:1px solid var(--border);">
            <td style="padding:10px;">
                <div style="font-weight:600;">${window.escapeHtml(u.full_name||'Unknown')}</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">${window.escapeHtml(u.email||u.id)}</div>
            </td>
            <td style="padding:10px; font-size:0.85rem;">
                ${u.updated_at ? new Date(u.updated_at).toLocaleDateString() : 'N/A'}
            </td>
            <td style="padding:10px;">
                <button onclick="unbanUser('${u.id}')" class="btn" style="padding:4px 8px; font-size:0.8rem; border-color:#238636; color:#238636;">Unban</button>
            </td>
        </tr>
    `).join('');
};
