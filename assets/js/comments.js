// --- COMMENTS MODULE ---

window.initCommentsModule = async function() {
    const container = document.getElementById('comments-container');
    if (!container) return;

    const pageSlug = window.getCleanSlug();
    const list = document.getElementById('comments-list');

    const { data: comments, error } = await window.supabase
        .from('comments')
        .select(`*, comment_votes ( user_id, vote_type )`)
        .eq('page_slug', pageSlug)
        .order('created_at', { ascending: true });

    if (error) {
        console.error("Comments Error:", error);
        list.innerHTML = `<div style="text-align:center; color:#d73a49;">Error loading comments. Check DB.</div>`;
        return;
    }

    renderCommentsTree(comments || []);

    const sendBtn = document.getElementById('send-comment');
    if(sendBtn) {
        const newBtn = sendBtn.cloneNode(true);
        if(sendBtn.parentNode) sendBtn.parentNode.replaceChild(newBtn, sendBtn);
        newBtn.onclick = () => window.postComment(null); 
    }
};

window.postComment = async function(parentId) {
    const inputId = parentId ? `reply-input-${parentId}` : 'comment-input';
    const input = document.getElementById(inputId);
    
    if (!input) return console.error("Input not found:", inputId);

    const content = input.value.trim();
    if(!content) return;

    // Бан чек
    if (window.currentUser) {
        const { data: profile } = await window.supabase.from('profiles').select('is_banned').eq('id', window.currentUser.id).maybeSingle();
        if (profile?.is_banned) return alert("You are banned.");
    }

    let authorName = "Guest", authorAvatar = null, userId = null, isGuest = true;
    if(window.currentUser) {
        authorName = window.currentUser.user_metadata.full_name || window.currentUser.email.split('@')[0];
        authorAvatar = window.currentUser.user_metadata.avatar_url;
        userId = window.currentUser.id;
        isGuest = false;
    } else {
        const gName = document.getElementById('guest-name');
        if(gName) authorName = gName.value.trim() || "Guest";
    }

    const { error } = await window.supabase.from('comments').insert({
        page_slug: window.getCleanSlug(),
        content, author_name: authorName, author_avatar: authorAvatar,
        user_id: userId, is_guest: isGuest, parent_id: parentId
    });

    if(!error) {
        input.value = '';
        if (parentId) {
            const area = document.getElementById(`reply-area-${parentId}`);
            if(area) area.style.display = 'none';
        }
        window.initCommentsModule();
    } else {
        alert("Error: " + error.message);
    }
};

function renderCommentsTree(comments) {
    const list = document.getElementById('comments-list');
    list.innerHTML = '';
    if (comments.length === 0) {
        list.innerHTML = `<div style="text-align:center; color:var(--text-muted); padding:30px;">No comments yet.</div>`;
        return;
    }

    const commentMap = {};
    comments.forEach(c => {
        c.children = [];
        c.score = c.comment_votes ? c.comment_votes.reduce((acc, v) => acc + v.vote_type, 0) : 0;
        c.userVote = 0;
        if (window.currentUser && c.comment_votes) {
            const myVote = c.comment_votes.find(v => v.user_id === window.currentUser.id);
            if (myVote) c.userVote = myVote.vote_type;
        }
        commentMap[c.id] = c;
    });

    const rootComments = [];
    comments.forEach(c => {
        if (c.parent_id && commentMap[c.parent_id]) {
            commentMap[c.parent_id].children.push(c);
        } else {
            rootComments.push(c);
        }
    });

    rootComments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    rootComments.forEach(c => list.appendChild(createCommentElement(c)));
}

function createCommentElement(c) {
    const el = document.createElement('div');
    el.className = 'comment-box';
    el.id = `comment-${c.id}`;
    
    const isOwner = window.currentUser && window.currentUser.id === c.user_id;
    const canDelete = window.isAdmin || isOwner;
    const badge = c.is_guest ? '<span class="guest-tag">Guest</span>' : '';
    const adminControls = (window.isAdmin && c.user_id) ? 
        `<button onclick="banUser('${c.user_id}')" title="Ban User" style="color:#d73a49; border:none; background:none; cursor:pointer; margin-left:5px;"><i class="fa-solid fa-ban"></i></button>` : '';

    let scoreColor = 'var(--text-muted)';
    if(c.score > 0) scoreColor = '#238636';
    if(c.score < 0) scoreColor = '#d73a49';

    el.innerHTML = `
        <div class="comment-inner">
            <div class="comment-header">
                <img src="${c.author_avatar || 'https://www.gravatar.com/avatar/?d=mp'}" class="comment-avatar">
                <span class="comment-author">${window.escapeHtml(c.author_name)}</span>
                ${badge} ${adminControls}
                <span class="comment-date" style="margin-left:auto;">${new Date(c.created_at).toLocaleDateString()}</span>
            </div>
            <div class="comment-body" id="body-${c.id}">${window.escapeHtml(c.content)}</div>
            
            <div class="comment-actions">
                <div class="vote-group">
                    <button onclick="voteComment(${c.id}, 1, ${c.userVote})" class="vote-btn ${c.userVote === 1 ? 'active' : ''}"><i class="fa-solid fa-chevron-up"></i></button>
                    <span style="color:${scoreColor}; font-weight:bold; font-size:0.9rem;">${c.score}</span>
                    <button onclick="voteComment(${c.id}, -1, ${c.userVote})" class="vote-btn ${c.userVote === -1 ? 'active-down' : ''}"><i class="fa-solid fa-chevron-down"></i></button>
                </div>
                <button onclick="toggleReply(${c.id})" class="act-btn"><i class="fa-solid fa-reply"></i> Reply</button>
                ${isOwner ? `<button onclick="editComment(${c.id})" class="act-btn"><i class="fa-solid fa-pen"></i> Edit</button>` : ''}
                ${canDelete ? `<button onclick="deleteComment(${c.id})" class="act-btn del"><i class="fa-solid fa-trash"></i></button>` : ''}
                ${!isOwner && window.currentUser ? `<button onclick="reportComment(${c.id})" class="act-btn" title="Report"><i class="fa-regular fa-flag"></i></button>` : ''}
            </div>
            <div id="reply-area-${c.id}" class="reply-input-area" style="display:none; margin-top:10px;">
                <div style="display:flex; gap:10px;">
                    <input type="text" id="reply-input-${c.id}" class="form-input" placeholder="Write a reply..." style="padding:8px;">
                    <button onclick="postComment(${c.id})" class="btn primary" style="padding:0 15px;"><i class="fa-solid fa-paper-plane"></i></button>
                </div>
            </div>
        </div>
        <div class="comment-children"></div>
    `;

    if (c.children && c.children.length > 0) {
        const childrenContainer = el.querySelector('.comment-children');
        c.children.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        c.children.forEach(child => childrenContainer.appendChild(createCommentElement(child)));
    }
    return el;
}

window.toggleReply = function(id) {
    const area = document.getElementById(`reply-area-${id}`);
    if(area) area.style.display = area.style.display === 'none' ? 'block' : 'none';
};

window.voteComment = async function(id, type, currentVote) {
    if (!window.currentUser) return window.openAuthModal();
    if (currentVote !== 0) await window.supabase.from('comment_votes').delete().match({ user_id: window.currentUser.id, comment_id: id });
    if (currentVote !== type) await window.supabase.from('comment_votes').insert({ user_id: window.currentUser.id, comment_id: id, vote_type: type });
    window.initCommentsModule();
};

window.deleteComment = async function(id) {
    if (confirm('Delete this comment?')) {
        const { error } = await window.supabase.from('comments').delete().eq('id', id);
        if (!error) window.initCommentsModule(); else alert("Error: " + error.message);
    }
};

window.editComment = function(id) {
    const body = document.getElementById(`body-${id}`);
    if (body.querySelector('textarea')) { window.cancelEdit(id); return; }
    const currentText = body.innerText;
    body.dataset.original = body.innerHTML;
    body.innerHTML = `
        <textarea id="edit-txt-${id}" class="form-area" style="min-height:60px; margin-bottom:5px;">${currentText}</textarea>
        <div style="display:flex; gap:5px;">
            <button onclick="saveEdit(${id})" class="btn primary" style="padding:4px 10px; font-size:0.8rem;">Save</button>
            <button onclick="cancelEdit(${id})" class="btn" style="padding:4px 10px; font-size:0.8rem;">Cancel</button>
        </div>
    `;
};

window.saveEdit = async function(id) {
    const text = document.getElementById(`edit-txt-${id}`).value;
    const { error } = await window.supabase.from('comments').update({ content: text }).eq('id', id);
    if(!error) window.initCommentsModule(); else alert(error.message);
};

window.cancelEdit = function(id) {
    const body = document.getElementById(`body-${id}`);
    if(body.dataset.original) body.innerHTML = body.dataset.original;
};

window.reportComment = async (id) => {
    if (!window.currentUser) return window.openAuthModal();
    const reason = prompt("Reason:");
    if (reason) {
        await window.supabase.from('reports').insert({ reporter_id: window.currentUser.id, comment_id: id, reason });
        alert("Report sent.");
    }
};
