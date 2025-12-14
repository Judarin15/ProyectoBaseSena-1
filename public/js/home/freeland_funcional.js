// ===================================
// HEADER - ELEMENTOS DEL DOM
// ===================================
const elements = {
    // Tema
    themeToggle: document.getElementById('themeToggle'),
    
    // Notificaciones
    notifBtn: document.getElementById('notifBtn'),
    notifBadge: document.getElementById('notifBadge'),
    
    // Mensajes
    openChat: document.getElementById('openChat'),
    messagesBtn: document.getElementById('openChat'),
    messagesBadge: null, // Se creará dinámicamente
    
    // Búsqueda
    searchForm: document.getElementById('search-form'),
    searchInput: document.getElementById('search-input'),
    searchResults: document.getElementById('searchResults'),
    searchQuery: document.getElementById('searchQuery'),
    searchUsers: document.getElementById('searchUsers'),
    
    // Perfil - Header
    userAvatar: document.getElementById('userAvatar'),
    userName: document.getElementById('userName'),
    userDropdown: document.getElementById('userDropdown'),
    logoutBtn: document.getElementById('logoutBtn'),
    
    // Foro
    forumBtn: document.getElementById('forumBtn')
};

// ===================================
// TEMA CLARO/OSCURO
// ===================================
function initTheme() {
    const savedTheme = localStorage.getItem('freeland-theme');
    if (savedTheme) {
        document.body.dataset.theme = savedTheme;
    }
    updateThemeIcon();
}

function toggleTheme() {
    const newTheme = document.body.dataset.theme === 'dark' ? '' : 'dark';
    document.body.dataset.theme = newTheme;
    localStorage.setItem('freeland-theme', newTheme);
    updateThemeIcon();
    showToast(newTheme === 'dark' ? '🌙 Modo oscuro activado' : '☀️ Modo claro activado');
}

function updateThemeIcon() {
    const icon = elements.themeToggle?.querySelector('i');
    if (icon) {
        icon.className = document.body.dataset.theme === 'dark' ? 'ri-moon-line' : 'ri-sun-line';
    }
}

// ===================================
// BÚSQUEDA
// ===================================
let searchTimeout;

function performSearch(query) {
    if (!query.trim()) {
        if (elements.searchResults) elements.searchResults.style.display = 'none';
        return;
    }

    const queryLower = query.toLowerCase();

    // Buscar en contactos
    const userResults = APP_STATE.contacts.filter(u => 
        u.name.toLowerCase().includes(queryLower) ||
        u.role.toLowerCase().includes(queryLower)
    );

    // Buscar en posts
    const postResults = APP_STATE.posts.filter(p =>
        p.content.toLowerCase().includes(queryLower) ||
        p.author.name.toLowerCase().includes(queryLower)
    );

    if (elements.searchQuery) elements.searchQuery.textContent = query;

    if (elements.searchUsers) {
        let html = '';

        if (userResults.length > 0) {
            html += '<h4 class="search-section-title">Personas</h4>';
            html += userResults.map(user => `
                <div class="search-user-item" data-user-id="${user.id}">
                    <img src="${user.avatar}" alt="${escapeHTML(user.name)}">
                    <div class="search-user-info">
                        <div class="search-user-name">${escapeHTML(user.name)}</div>
                        <div class="search-user-role">${escapeHTML(user.role)}</div>
                    </div>
                    <button class="connect-btn ${user.connected ? 'connected' : ''}" data-user-id="${user.id}">
                        ${user.connected ? '<i class="ri-check-line"></i> Conectado' : '<i class="ri-user-add-line"></i> Conectar'}
                    </button>
                </div>
            `).join('');
        }

        if (postResults.length > 0) {
            html += '<h4 class="search-section-title">Publicaciones</h4>';
            html += postResults.slice(0, 3).map(post => `
                <div class="search-post-item" data-post-id="${post.id}">
                    <img src="${post.author.avatar}" alt="${escapeHTML(post.author.name)}">
                    <div class="search-post-info">
                        <div class="search-post-author">${escapeHTML(post.author.name)}</div>
                        <div class="search-post-preview">${escapeHTML(post.content.substring(0, 80))}...</div>
                    </div>
                </div>
            `).join('');
        }

        if (!html) {
            html = '<p class="no-results">No se encontraron resultados para "' + escapeHTML(query) + '"</p>';
        }

        elements.searchUsers.innerHTML = html;
    }

    if (elements.searchResults) elements.searchResults.style.display = 'block';
}

// ===================================
// NOTIFICACIONES
// ===================================
function updateNotificationBadge() {
    const unread = APP_STATE.notifications.filter(n => !n.read).length;
    if (elements.notifBadge) {
        elements.notifBadge.textContent = unread;
        elements.notifBadge.style.display = unread > 0 ? 'block' : 'none';
    }
}

function showNotificationsPanel() {
    // Cerrar panel de mensajes si está abierto
    document.querySelector('.messages-panel')?.remove();
    
    // Remover panel existente
    const existingPanel = document.querySelector('.notifications-panel');
    if (existingPanel) {
        existingPanel.remove();
        return;
    }

    const panel = document.createElement('div');
    panel.className = 'notifications-panel';
    panel.innerHTML = `
        <div class="notif-header">
            <h4>Notificaciones</h4>
            <button class="mark-all-read">Marcar todo como leído</button>
        </div>
        <div class="notif-list">
            ${APP_STATE.notifications.length > 0 ? APP_STATE.notifications.map(n => `
                <div class="notif-item ${n.read ? 'read' : ''}" data-notif-id="${n.id}">
                    <div class="notif-icon">
                        <i class="${getNotifIcon(n.type)}"></i>
                    </div>
                    <div class="notif-content">
                        <p>${escapeHTML(n.message)}</p>
                        <small>${n.time}</small>
                    </div>
                </div>
            `).join('') : '<p class="no-notifs">No tienes notificaciones</p>'}
        </div>
    `;

    document.body.appendChild(panel);

    // Posicionar cerca del botón
    const btnRect = elements.notifBtn.getBoundingClientRect();
    panel.style.top = (btnRect.bottom + 10) + 'px';
    panel.style.right = (window.innerWidth - btnRect.right) + 'px';

    // Marcar todo como leído
    panel.querySelector('.mark-all-read')?.addEventListener('click', () => {
        APP_STATE.notifications.forEach(n => n.read = true);
        saveState();
        updateNotificationBadge();
        panel.remove();
        showToast('✅ Notificaciones marcadas como leídas');
    });

    // Cerrar al hacer clic fuera
    setTimeout(() => {
        document.addEventListener('click', function closePanel(e) {
            if (!panel.contains(e.target) && e.target !== elements.notifBtn) {
                panel.remove();
                document.removeEventListener('click', closePanel);
            }
        });
    }, 0);
}

function getNotifIcon(type) {
    const icons = {
        like: 'ri-heart-fill',
        comment: 'ri-chat-3-fill',
        follow: 'ri-user-add-fill',
        project: 'ri-briefcase-fill',
        message: 'ri-message-3-fill'
    };
    return icons[type] || 'ri-notification-3-fill';
}

// ===================================
// MENSAJES
// ===================================
function toggleMessagesPanel() {
    // Cerrar panel de notificaciones si está abierto
    document.querySelector('.notifications-panel')?.remove();
    
    // Remover panel existente
    const existingPanel = document.querySelector('.messages-panel');
    if (existingPanel) {
        existingPanel.remove();
        return;
    }

    const panel = document.createElement('div');
    panel.className = 'messages-panel';
    panel.innerHTML = `
        <div class="notif-header">
            <h4>Mensajes</h4>
            <button class="mark-all-read">Marcar todo como leído</button>
        </div>
        <div class="notif-list">
            ${APP_STATE.messages.length > 0 ? APP_STATE.messages.map(msg => `
                <div class="notif-item ${msg.read ? 'read' : ''}" data-msg-id="${msg.id}">
                    <div class="notif-icon" style="background: none; padding: 0;">
                        <img src="${msg.avatar}" style="width: 36px; height: 36px; border-radius: 50%;" alt="${escapeHTML(msg.sender)}">
                    </div>
                    <div class="notif-content">
                        <p><strong>${escapeHTML(msg.sender)}</strong><br>${escapeHTML(msg.message)}</p>
                        <small>${msg.time}</small>
                    </div>
                </div>
            `).join('') : '<p class="no-notifs">No tienes mensajes</p>'}
        </div>
    `;

    document.body.appendChild(panel);

    // Posicionar cerca del botón
    const btnRect = elements.messagesBtn.getBoundingClientRect();
    panel.style.top = (btnRect.bottom + 10) + 'px';
    panel.style.right = (window.innerWidth - btnRect.right) + 'px';

    // Marcar todo como leído
    panel.querySelector('.mark-all-read')?.addEventListener('click', () => {
        APP_STATE.messages.forEach(m => m.read = true);
        saveState();
        updateMessagesBadge();
        panel.remove();
        showToast('✅ Mensajes marcados como leídos');
    });

    // Cerrar al hacer clic fuera
    setTimeout(() => {
        document.addEventListener('click', function closePanel(e) {
            if (!panel.contains(e.target) && e.target !== elements.messagesBtn) {
                panel.remove();
                document.removeEventListener('click', closePanel);
            }
        });
    }, 0);
}

function updateMessagesBadge() {
    const unreadCount = APP_STATE.messages.filter(m => !m.read).length;
    
    if (!elements.messagesBadge && elements.messagesBtn) {
        elements.messagesBadge = document.createElement('span');
        elements.messagesBadge.className = 'badge';
        elements.messagesBtn.appendChild(elements.messagesBadge);
    }
    
    if (elements.messagesBadge) {
        if (unreadCount > 0) {
            elements.messagesBadge.textContent = unreadCount;
            elements.messagesBadge.style.display = 'block';
        } else {
            elements.messagesBadge.style.display = 'none';
        }
    }
}

// ===================================
// FORO
// ===================================
function showForumModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content forum-modal">
            <div class="modal-header">
                <h3><i class="ri-group-line"></i> Foro de la comunidad</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="forum-categories">
                    <div class="forum-category">
                        <i class="ri-code-s-slash-line"></i>
                        <div>
                            <h4>Desarrollo</h4>
                            <p>156 temas • 1.2k respuestas</p>
                        </div>
                    </div>
                    <div class="forum-category">
                        <i class="ri-palette-line"></i>
                        <div>
                            <h4>Diseño</h4>
                            <p>98 temas • 845 respuestas</p>
                        </div>
                    </div>
                    <div class="forum-category">
                        <i class="ri-megaphone-line"></i>
                        <div>
                            <h4>Marketing</h4>
                            <p>67 temas • 523 respuestas</p>
                        </div>
                    </div>
                    <div class="forum-category">
                        <i class="ri-question-line"></i>
                        <div>
                            <h4>Ayuda General</h4>
                            <p>234 temas • 1.8k respuestas</p>
                        </div>
                    </div>
                </div>
                <button class="forum-cta">Ver todos los temas</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });

    modal.querySelector('.forum-cta').addEventListener('click', () => {
        showToast('📜 Foro completo próximamente');
        modal.remove();
    });
}

// ===================================
// PERFIL DROPDOWN
// ===================================
function updateProfileUI() {
    const user = APP_STATE.currentUser;
    
    // Actualizar nombre en header
    if (elements.userName) elements.userName.textContent = user.name;
    
    // Actualizar avatar en header
    const avatarUrl = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=ededed&color=7c3aed`;
    if (elements.userAvatar) elements.userAvatar.src = avatarUrl;
}

// ===================================
// LOGOUT
// ===================================
function handleLogout() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        localStorage.removeItem('freeland-state');
        showToast('👋 Sesión cerrada. ¡Hasta pronto!');
        setTimeout(() => {
            location.reload();
        }, 1500);
    }
}

// ===================================
// EVENT LISTENERS DEL HEADER
// ===================================
function setupHeaderListeners() {
    // Tema
    elements.themeToggle?.addEventListener('click', toggleTheme);

    // Mensajes
    elements.messagesBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMessagesPanel();
    });

    // Búsqueda
    elements.searchForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        performSearch(elements.searchInput?.value || '');
    });

    elements.searchInput?.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(e.target.value);
        }, 300);
    });

    // Notificaciones
    elements.notifBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        showNotificationsPanel();
    });

    // Logout
    elements.logoutBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        handleLogout();
    });

    // Foro
    elements.forumBtn?.addEventListener('click', showForumModal);

    // Cerrar búsqueda al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!elements.searchForm?.contains(e.target) && !elements.searchResults?.contains(e.target)) {
            if (elements.searchResults) elements.searchResults.style.display = 'none';
        }
    });
}

// ===================================
// UTILIDADES
// ===================================
function escapeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ===================================
// INICIALIZACIÓN DEL HEADER
// ===================================
function initHeader() {
    initTheme();
    updateProfileUI();
    updateNotificationBadge();
    updateMessagesBadge();
    setupHeaderListeners();
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initHeader);