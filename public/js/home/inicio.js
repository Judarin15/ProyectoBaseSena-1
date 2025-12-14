/* ===================================
   FREELAND - INICIO JS COMPLETO
   Funcionalidades implementadas:
   - Sistema de usuarios y autenticación
   - Publicaciones con likes, comentarios, compartir
   - Chat en tiempo real
   - Notificaciones
   - Búsqueda avanzada
   - Gestión de contactos
   - Elementos guardados
   - Tema claro/oscuro
   - Sidebar móvil
   - Persistencia con localStorage
   - Perfil editable completo
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // ===================================
    // CONFIGURACIÓN Y ESTADO GLOBAL
    // ===================================
    const APP_STATE = {
        currentUser: {
            id: 'user_001',
            name: 'Usuario Freeland',
            role: 'Freelancer',
            profession: 'Desarrollador Web',
            location: 'Colombia',
            status: 'available', // available, busy, unavailable
            statusText: 'Disponible',
            forums: 3,
            avatar: 'https://ui-avatars.com/api/?name=Usuario+Freeland&background=ededed&color=7c3aed',
            contacts: 44,
            // Valores por defecto añadidos para evitar errores al abrir el modal de perfil
            bio: '',
            website: '',
            email: '',
            phone: '',
            banner: '',
            joinDate: Date.now(),
            projects: 0,
            views: 0,
            skills: []
        },
        posts: [],
        notifications: [],
        messages: [], // Notificaciones de mensajes
        savedItems: [],
        contacts: []
    };

    // Cargar estado desde localStorage
    function loadState() {
        const saved = localStorage.getItem('freeland-state');
        if (saved) {
            const parsed = JSON.parse(saved);
            Object.assign(APP_STATE, parsed);
        }
        
        // Cargar posts iniciales si no hay ninguno
        if (APP_STATE.posts.length === 0) {
            APP_STATE.posts = getInitialPosts();
        }
        
        // Cargar notificaciones iniciales
        if (APP_STATE.notifications.length === 0) {
            APP_STATE.notifications = getInitialNotifications();
        }

        // Cargar contactos iniciales
        if (APP_STATE.contacts.length === 0) {
            APP_STATE.contacts = getInitialContacts();
        }

        // Cargar mensajes iniciales
        if (APP_STATE.messages.length === 0) {
            APP_STATE.messages = getInitialMessages();
        }
    }

    function saveState() {
        localStorage.setItem('freeland-state', JSON.stringify(APP_STATE));
    }

    function getInitialPosts() {
        return [
            {
                id: 'post_001',
                author: { name: 'María García', avatar: 'https://ui-avatars.com/api/?name=Maria+Garcia&background=a78bfa&color=fff', role: 'Diseñadora UX' },
                content: '¡Acabo de completar mi primer proyecto de diseño UX! 🎉 Fue un reto increíble trabajar con un equipo tan talentoso. Gracias a todos los que hicieron esto posible.',
                image: null,
                type: 'logro',
                likes: 24,
                liked: false,
                comments: [
                    { id: 'c1', author: 'Carlos López', content: '¡Felicidades María! 👏', time: 'Hace 1 hora' }
                ],
                shares: 5,
                shared: false,
                saved: false,
                time: 'Hace 2 horas',
                timestamp: Date.now() - 7200000
            },
            {
                id: 'post_002',
                author: { name: 'Carlos López', avatar: 'https://ui-avatars.com/api/?name=Carlos+Lopez&background=5b21b6&color=fff', role: 'Desarrollador Full Stack' },
                content: 'Buscando colaboradores para un proyecto de desarrollo web. Si tienes experiencia en React y Node.js, ¡contáctame! 💻',
                image: null,
                type: 'colaboracion',
                likes: 18,
                liked: false,
                comments: [],
                shares: 12,
                shared: false,
                saved: false,
                time: 'Hace 5 horas',
                timestamp: Date.now() - 18000000
            },
            {
                id: 'post_003',
                author: { name: 'Ana Martínez', avatar: 'https://ui-avatars.com/api/?name=Ana+Martinez&background=10b981&color=fff', role: 'Project Manager' },
                content: '📢 Nuevo proyecto disponible: Rediseño de plataforma e-commerce para startup de moda sostenible. Buscamos diseñadores UI/UX y desarrolladores frontend. Duración: 3 meses. ¡Interesados envíen portafolio!',
                image: null,
                type: 'proyecto',
                likes: 45,
                liked: false,
                comments: [
                    { id: 'c2', author: 'Laura Sánchez', content: '¡Me interesa! Te envío mi portafolio por DM', time: 'Hace 30 min' },
                    { id: 'c3', author: 'Pedro Ruiz', content: 'Excelente oportunidad 🚀', time: 'Hace 20 min' }
                ],
                shares: 28,
                shared: false,
                saved: false,
                time: 'Hace 1 día',
                timestamp: Date.now() - 86400000
            }
        ];
    }

    function getInitialNotifications() {
        return [
            { id: 'n1', type: 'like', message: 'María García le dio like a tu publicación', time: 'Hace 5 min', read: false },
            { id: 'n2', type: 'comment', message: 'Carlos López comentó en tu publicación', time: 'Hace 15 min', read: false },
            { id: 'n3', type: 'follow', message: 'Ana Martínez comenzó a seguirte', time: 'Hace 1 hora', read: false },
            { id: 'n4', type: 'project', message: 'Nuevo proyecto disponible en tu área', time: 'Hace 2 horas', read: true }
        ];
    }

    function getInitialContacts() {
        return [
            { id: 'u1', name: 'María García', role: 'Diseñadora UX', avatar: 'https://ui-avatars.com/api/?name=Maria+Garcia&background=a78bfa&color=fff', connected: true },
            { id: 'u2', name: 'Carlos López', role: 'Desarrollador Full Stack', avatar: 'https://ui-avatars.com/api/?name=Carlos+Lopez&background=5b21b6&color=fff', connected: true },
            { id: 'u3', name: 'Ana Martínez', role: 'Project Manager', avatar: 'https://ui-avatars.com/api/?name=Ana+Martinez&background=10b981&color=fff', connected: true },
            { id: 'u4', name: 'Pedro Sánchez', role: 'Marketing Digital', avatar: 'https://ui-avatars.com/api/?name=Pedro+Sanchez&background=f59e0b&color=fff', connected: false },
            { id: 'u5', name: 'Laura Díaz', role: 'Diseñadora Gráfica', avatar: 'https://ui-avatars.com/api/?name=Laura+Diaz&background=ec4899&color=fff', connected: true },
            { id: 'u6', name: 'Roberto Fernández', role: 'Backend Developer', avatar: 'https://ui-avatars.com/api/?name=Roberto+Fernandez&background=3b82f6&color=fff', connected: false }
        ];
    }

    function getInitialMessages() {
        return [
            { 
                id: 'm1', 
                sender: 'María García',
                avatar: 'https://ui-avatars.com/api/?name=Maria+Garcia&background=a78bfa&color=fff',
                message: '¡Hola! Vi tu portafolio y me encantaría hablar sobre una colaboración',
                time: 'Hace 5 min',
                timestamp: Date.now() - 300000,
                read: false 
            },
            { 
                id: 'm2', 
                sender: 'Carlos López',
                avatar: 'https://ui-avatars.com/api/?name=Carlos+Lopez&background=5b21b6&color=fff',
                message: '¿Estás disponible para una videollamada esta tarde?',
                time: 'Hace 15 min',
                timestamp: Date.now() - 900000,
                read: false 
            },
            { 
                id: 'm3', 
                sender: 'Ana Martínez',
                avatar: 'https://ui-avatars.com/api/?name=Ana+Martinez&background=10b981&color=fff',
                message: 'Gracias por tu ayuda en el proyecto. ¡Quedó increíble!',
                time: 'Hace 1 hora',
                timestamp: Date.now() - 3600000,
                read: false 
            },
            { 
                id: 'm4', 
                sender: 'Pedro Sánchez',
                avatar: 'https://ui-avatars.com/api/?name=Pedro+Sanchez&background=f59e0b&color=fff',
                message: 'Te envié los archivos del diseño',
                time: 'Hace 2 horas',
                timestamp: Date.now() - 7200000,
                read: true 
            }
        ];
    }

    // ===================================
    // ELEMENTOS DEL DOM
    // ===================================
    const elements = {
        // Chat
        chatBtn: document.getElementById('chat-floating-btn'),
        chatWindow: document.getElementById('chat-floating-window'),
        chatClose: document.getElementById('chat-close'),
        chatInput: document.getElementById('chatInput'),
        chatSend: document.getElementById('chatSend'),
        chatMessages: document.getElementById('chatMessages'),
        openChat: document.getElementById('openChat'),
        messagesBtn: document.getElementById('openChat'),
        messagesBadge: null, // Se creará dinámicamente
        
        // Tema
        themeToggle: document.getElementById('themeToggle'),
        
        // Publicaciones
        textarea: document.getElementById('post-text'),
        publishBtn: document.getElementById('publish-btn'),
        feed: document.getElementById('feed'),
        
        // Imagen
        fotoBtn: document.querySelector('[data-type="foto"]'),
        fileInput: document.getElementById('post-image'),
        imagePreview: document.getElementById('imagePreview'),
        previewImage: document.getElementById('previewImage'),
        removePreview: document.getElementById('removePreview'),
        
        // Búsqueda
        searchForm: document.getElementById('search-form'),
        searchInput: document.getElementById('search-input'),
        searchResults: document.getElementById('searchResults'),
        searchQuery: document.getElementById('searchQuery'),
        searchUsers: document.getElementById('searchUsers'),
        
        // Notificaciones
        notifBtn: document.getElementById('notifBtn'),
        notifBadge: document.getElementById('notifBadge'),
        
        // Perfil - Elementos del aside izquierdo
        profileCard: document.getElementById('profileCard'),
        profileLink: document.getElementById('profileLink'), // nuevo
        profileAvatar: document.getElementById('profileAvatar'),
        profileName: document.getElementById('profileName'),
        profileRole: document.getElementById('profileRole'),
        profileProfession: document.getElementById('profileProfession'),
        profileStatus: document.getElementById('profileStatus'),
        profileForums: document.getElementById('profileForums'),
        
        // Perfil - Header
        userAvatar: document.getElementById('userAvatar'),
        userName: document.getElementById('userName'),
        userDropdown: document.getElementById('userDropdown'),
        logoutBtn: document.getElementById('logoutBtn'),
        
        // Share card avatars
        shareAvatar: document.getElementById('shareAvatar'),
        shareUserLabel: document.getElementById('shareUserLabel'),
        
        // Sidebar
        sidebar: document.querySelector('.sidebar'),
        
        // Foro
        forumBtn: document.getElementById('forumBtn')
    };

    // ===================================
    // INICIALIZACIÓN
    // ===================================
    function init() {
        loadState();
        initTheme();
        updateProfileUI(); // Actualizar UI del perfil
        renderPosts();
        updateNotificationBadge();
        updateMessagesBadge();
        setupEventListeners();
        addDynamicStyles();
    }

    // ===================================
    // ACTUALIZAR UI DEL PERFIL
    // ===================================
    function updateProfileUI() {
        const user = APP_STATE.currentUser;
        
        // Actualizar nombre en todos los lugares
        if (elements.profileName) elements.profileName.textContent = user.name;
        if (elements.userName) elements.userName.textContent = user.name;
        if (elements.shareUserLabel) elements.shareUserLabel.textContent = user.name;
        
        // Actualizar avatares
        const avatarUrl = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=ededed&color=7c3aed`;
        if (elements.profileAvatar) elements.profileAvatar.src = avatarUrl;
        if (elements.userAvatar) elements.userAvatar.src = avatarUrl;
        if (elements.shareAvatar) elements.shareAvatar.src = avatarUrl;
        
        // Actualizar rol
        if (elements.profileRole) elements.profileRole.textContent = user.role;
        
        // Actualizar profesión
        if (elements.profileProfession) {
            elements.profileProfession.innerHTML = `<i class="ri-briefcase-line"></i><span>${escapeHTML(user.profession || 'Sin especificar')}</span>`;
        }
        
        // Actualizar estado con data-status para estilos dinámicos
        if (elements.profileStatus) {
            const statusTexts = {
                available: 'Disponible',
                busy: 'Ocupado',
                unavailable: 'No disponible'
            };
            elements.profileStatus.setAttribute('data-status', user.status);
            elements.profileStatus.innerHTML = `
                <span class="status-dot"></span>
                <span class="status-text">${statusTexts[user.status] || 'Disponible'}</span>
            `;
        }
        
        // Actualizar foros inscritos
        if (elements.profileForums) {
            const forumCount = user.forums || 0;
            const forumText = forumCount === 1 ? 'foro activo' : 'foros activos';
            elements.profileForums.innerHTML = `<i class="ri-group-line"></i><span><strong>${forumCount}</strong> ${forumText}</span>`;
        }
    }

    function updateContactCount() {
        // Ya no se usa contador visible
    }

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
    // RENDERIZADO DE POSTS
    // ===================================
    function renderPosts() {
        if (!elements.feed) return;
        
        elements.feed.innerHTML = APP_STATE.posts
            .sort((a, b) => b.timestamp - a.timestamp)
            .map(post => createPostHTML(post))
            .join('');
    }

    function createPostHTML(post) {
        const typeIcons = {
            proyecto: '<span class="post-type-badge proyecto"><i class="ri-briefcase-line"></i> Proyecto</span>',
            logro: '<span class="post-type-badge logro"><i class="ri-trophy-line"></i> Logro</span>',
            colaboracion: '<span class="post-type-badge colaboracion"><i class="ri-team-line"></i> Colaboración</span>',
            foto: ''
        };

        const commentsHTML = post.comments.length > 0 ? `
            <div class="post-comments" id="comments-${post.id}">
                ${post.comments.map(c => `
                    <div class="comment">
                        <strong>${escapeHTML(c.author)}</strong>
                        <span>${escapeHTML(c.content)}</span>
                        <small>${c.time}</small>
                    </div>
                `).join('')}
            </div>
        ` : '';

        return `
            <article class="post-card" data-post-id="${post.id}">
                <div class="post-header">
                    <img src="${post.author.avatar}" class="avatar" alt="${escapeHTML(post.author.name)}">
                    <div class="post-info">
                        <div class="post-author">${escapeHTML(post.author.name)}</div>
                        <div class="post-meta">
                            <span class="post-time">${post.time}</span>
                            ${post.author.role ? `<span class="post-role">• ${escapeHTML(post.author.role)}</span>` : ''}
                        </div>
                    </div>
                    <button class="post-menu-btn" data-post-id="${post.id}">
                        <i class="ri-more-2-fill"></i>
                    </button>
                </div>
                
                ${post.type && typeIcons[post.type] ? `<div class="post-type">${typeIcons[post.type]}</div>` : ''}
                
                <div class="post-content">${escapeHTML(post.content)}</div>
                
                ${post.image ? `<img src="${post.image}" class="post-image" alt="Imagen del post">` : ''}
                
                <div class="post-stats">
                    <span class="stat-item"><i class="ri-heart-fill"></i> ${post.likes}</span>
                    <span class="stat-item">${post.comments.length} comentarios</span>
                    <span class="stat-item">${post.shares} compartidos</span>
                </div>
                
                <div class="post-actions">
                    <button class="post-action ${post.liked ? 'liked' : ''}" data-action="like" data-post-id="${post.id}">
                        <i class="${post.liked ? 'ri-heart-fill' : 'ri-heart-line'}"></i>
                        <span>Me gusta</span>
                    </button>
                    <button class="post-action" data-action="comment" data-post-id="${post.id}">
                        <i class="ri-chat-3-line"></i>
                        <span>Comentar</span>
                    </button>
                    <button class="post-action ${post.shared ? 'shared' : ''}" data-action="share" data-post-id="${post.id}">
                        <i class="ri-share-forward-line"></i>
                        <span>Compartir</span>
                    </button>
                    
                </div>
                
                ${commentsHTML}
                
                <div class="comment-input-area" id="comment-input-${post.id}" style="display: none;">
                    <img src="${APP_STATE.currentUser.avatar}" class="comment-avatar" alt="Tu avatar">
                    <input type="text" class="comment-input" placeholder="Escribe un comentario..." data-post-id="${post.id}">
                    <button class="comment-send" data-post-id="${post.id}"><i class="ri-send-plane-fill"></i></button>
                </div>
            </article>
        `;
    }

    // ===================================
    // CREAR NUEVA PUBLICACIÓN
    // ===================================
    let currentPostType = null;

    function createNewPost() {
        const content = elements.textarea?.value.trim();
        const hasImage = elements.imagePreview?.classList.contains('active');
        const imageSrc = hasImage ? elements.previewImage?.src : null;

        if (!content && !hasImage) {
            showToast('⚠️ Escribe algo o añade una imagen para publicar', 'warning');
            return;
        }

        const newPost = {
            id: 'post_' + Date.now(),
            author: {
                name: APP_STATE.currentUser.name,
                avatar: APP_STATE.currentUser.avatar,
                role: APP_STATE.currentUser.role
            },
            content: content,
            image: imageSrc,
            type: currentPostType,
            likes: 0,
            liked: false,
            comments: [],
            shares: 0,
            shared: false,
            saved: false,
            time: 'Ahora mismo',
            timestamp: Date.now()
        };

        APP_STATE.posts.unshift(newPost);
        saveState();
        renderPosts();

        // Limpiar formulario
        if (elements.textarea) {
            elements.textarea.value = '';
            elements.textarea.style.height = 'auto';
            elements.textarea.placeholder = '¿Qué quieres compartir?';
        }
        elements.imagePreview?.classList.remove('active');
        if (elements.previewImage) elements.previewImage.src = '';
        if (elements.fileInput) elements.fileInput.value = '';
        currentPostType = null;

        showToast('✅ Publicación creada exitosamente');
    }

    // ===================================
    // ACCIONES DE POSTS
    // ===================================
    function handlePostAction(action, postId) {
        const post = APP_STATE.posts.find(p => p.id === postId);
        if (!post) return;

        switch (action) {
            case 'like':
                post.liked = !post.liked;
                post.likes += post.liked ? 1 : -1;
                showToast(post.liked ? '❤️ Te gusta esta publicación' : 'Like removido');
                break;
                
            case 'comment':
                toggleCommentInput(postId);
                return; // No guardar estado aquí
                
            case 'share':
                post.shared = !post.shared;
                post.shares += post.shared ? 1 : -1;
                if (post.shared) {
                    showShareModal(post);
                }
                break;
                
            case 'save':
                post.saved = !post.saved;
                if (post.saved) {
                    APP_STATE.savedItems.push(postId);
                    showToast('🔖 Publicación guardada');
                } else {
                    APP_STATE.savedItems = APP_STATE.savedItems.filter(id => id !== postId);
                    showToast('Publicación removida de guardados');
                }
                break;
        }

        saveState();
        renderPosts();
    }

    function toggleCommentInput(postId) {
        const commentArea = document.getElementById(`comment-input-${postId}`);
        if (commentArea) {
            const isVisible = commentArea.style.display !== 'none';
            commentArea.style.display = isVisible ? 'none' : 'flex';
            if (!isVisible) {
                commentArea.querySelector('.comment-input')?.focus();
            }
        }
    }

    function addComment(postId, content) {
        const post = APP_STATE.posts.find(p => p.id === postId);
        if (!post || !content.trim()) return;

        post.comments.push({
            id: 'c_' + Date.now(),
            author: APP_STATE.currentUser.name,
            content: content.trim(),
            time: 'Ahora'
        });

        saveState();
        renderPosts();
        showToast('💬 Comentario añadido');
    }

    function showShareModal(post) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content share-modal">
                <div class="modal-header">
                    <h3>Compartir publicación</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Compartir publicación de <strong>${escapeHTML(post.author.name)}</strong></p>
                    <div class="share-options-modal">
                        <button class="share-option" data-share="copy">
                            <i class="ri-link"></i>
                            <span>Copiar enlace</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        modal.querySelectorAll('.share-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.dataset.share;
                if (type === 'copy') {
                    navigator.clipboard?.writeText(`https://freeland.com/post/${post.id}`);
                    showToast('🔗 Enlace copiado al portapapeles');
                } else {
                    showToast('✅ Publicación compartida');
                }
                modal.remove();
            });
        });
    }

    // ===================================
    // MENÚ DE POST (3 puntos)
    // ===================================
    function showPostMenu(postId, button) {
        // Remover menú existente
        document.querySelectorAll('.post-dropdown-menu').forEach(m => m.remove());

        const post = APP_STATE.posts.find(p => p.id === postId);
        const isOwner = post?.author.name === APP_STATE.currentUser.name;

        const menu = document.createElement('div');
        menu.className = 'post-dropdown-menu';
        menu.innerHTML = `
            <button data-action="save-post"><i class="ri-bookmark-line"></i> ${post?.saved ? 'Quitar de guardados' : 'Guardar'}</button>
            <button data-action="copy-link"><i class="ri-link"></i> Copiar enlace</button>
            <button data-action="report"><i class="ri-flag-line"></i> Reportar</button>
            ${isOwner ? '<button data-action="delete" class="danger"><i class="ri-delete-bin-line"></i> Eliminar</button>' : ''}
        `;

        button.parentElement.appendChild(menu);

        menu.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                switch (action) {
                    case 'save-post':
                        handlePostAction('save', postId);
                        break;
                    case 'copy-link':
                        navigator.clipboard?.writeText(`https://freeland.com/post/${postId}`);
                        showToast('🔗 Enlace copiado');
                        break;
                    case 'report':
                        showToast('🚩 Publicación reportada');
                        break;
                    case 'delete':
                        if (confirm('¿Estás seguro de eliminar esta publicación?')) {
                            APP_STATE.posts = APP_STATE.posts.filter(p => p.id !== postId);
                            saveState();
                            renderPosts();
                            showToast('🗑️ Publicación eliminada');
                        }
                        break;
                }
                menu.remove();
            });
        });

        // Cerrar al hacer clic fuera
        setTimeout(() => {
            document.addEventListener('click', function closeMenu(e) {
                if (!menu.contains(e.target) && e.target !== button) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            });
        }, 0);
    }

    // ===================================
    // CHAT FLOTANTE
    // ===================================
    function toggleChat() {
        elements.chatWindow?.classList.toggle('active');
        if (elements.chatWindow?.classList.contains('active')) {
            elements.chatInput?.focus();
        }
    }

    function sendChatMessage() {
        const message = elements.chatInput?.value.trim();
        if (!message) return;

        const time = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

        const messageHTML = `
            <div class="chat-message sent">
                <img src="${APP_STATE.currentUser.avatar}" class="chat-avatar">
                <div class="chat-bubble">
                    <p>${escapeHTML(message)}</p>
                    <span class="chat-time">${time}</span>
                </div>
            </div>
        `;

        elements.chatMessages?.insertAdjacentHTML('beforeend', messageHTML);
        elements.chatInput.value = '';
        elements.chatMessages?.scrollTo({ top: elements.chatMessages.scrollHeight, behavior: 'smooth' });

        // Respuesta automática
        setTimeout(() => {
            const responses = [
                '¡Gracias por tu mensaje! Un agente te responderá pronto.',
                '¡Hola! ¿En qué más puedo ayudarte?',
                'Recibido. Estamos procesando tu solicitud.',
                '¡Excelente pregunta! Déjame verificar eso.',
                'Entendido. ¿Hay algo más en lo que pueda ayudarte?'
            ];
            const response = responses[Math.floor(Math.random() * responses.length)];
            
            const responseHTML = `
                <div class="chat-message received">
                    <img src="https://ui-avatars.com/api/?name=Soporte&background=7c3aed&color=fff" class="chat-avatar">
                    <div class="chat-bubble">
                        <p>${response}</p>
                        <span class="chat-time">${new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>
            `;
            elements.chatMessages?.insertAdjacentHTML('beforeend', responseHTML);
            elements.chatMessages?.scrollTo({ top: elements.chatMessages.scrollHeight, behavior: 'smooth' });
        }, 1000 + Math.random() * 1000);
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
        return; // Si ya estaba abierto, solo cerrarlo
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

    function handleConnect(userId) {
        const user = APP_STATE.contacts.find(u => u.id === userId);
        if (user) {
            user.connected = !user.connected;
            if (user.connected) {
                APP_STATE.currentUser.contacts++;
                showToast(`✅ Conectado con ${user.name}`);
            } else {
                APP_STATE.currentUser.contacts--;
                showToast(`Desconectado de ${user.name}`);
            }
            saveState();
            updateContactCount();
            // Re-render search if visible
            if (elements.searchInput?.value) {
                performSearch(elements.searchInput.value);
            }
        }
    }

    function updateContactCount() {
        if (elements.contactCount) {
            elements.contactCount.textContent = APP_STATE.currentUser.contacts;
        }
    }

    // ===================================
    // ELEMENTOS GUARDADOS
    // ===================================
    function showSavedItems() {
        const savedPosts = APP_STATE.posts.filter(p => p.saved);
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content saved-modal">
                <div class="modal-header">
                    <h3><i class="ri-bookmark-fill"></i> Elementos guardados</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    ${savedPosts.length > 0 ? savedPosts.map(post => `
                        <div class="saved-item" data-post-id="${post.id}">
                            <img src="${post.author.avatar}" alt="${escapeHTML(post.author.name)}">
                            <div class="saved-info">
                                <strong>${escapeHTML(post.author.name)}</strong>
                                <p>${escapeHTML(post.content.substring(0, 100))}...</p>
                                <small>${post.time}</small>
                            </div>
                            <button class="remove-saved" data-post-id="${post.id}">
                                <i class="ri-close-line"></i>
                            </button>
                        </div>
                    `).join('') : '<p class="no-saved">No tienes elementos guardados</p>'}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        modal.querySelectorAll('.remove-saved').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const postId = btn.dataset.postId;
                handlePostAction('save', postId);
                modal.remove();
                showSavedItems(); // Reabrir con lista actualizada
            });
        });
    }

    // ===================================
    // AMPLIAR RED (Sugerencias)
    // ===================================
    function showNetworkSuggestions() {
        const suggestions = APP_STATE.contacts.filter(u => !u.connected);
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content network-modal">
                <div class="modal-header">
                    <h3><i class="ri-user-add-line"></i> Amplía tu red</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p class="modal-subtitle">Personas que quizás conozcas</p>
                    ${suggestions.length > 0 ? suggestions.map(user => `
                        <div class="suggestion-item">
                            <img src="${user.avatar}" alt="${escapeHTML(user.name)}">
                            <div class="suggestion-info">
                                <strong>${escapeHTML(user.name)}</strong>
                                <span>${escapeHTML(user.role)}</span>
                            </div>
                            <button class="connect-btn-modal" data-user-id="${user.id}">
                                <i class="ri-user-add-line"></i> Conectar
                            </button>
                        </div>
                    `).join('') : '<p class="no-suggestions">¡Ya estás conectado con todos!</p>'}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        modal.querySelectorAll('.connect-btn-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                handleConnect(btn.dataset.userId);
                modal.remove();
                showNetworkSuggestions(); // Reabrir con lista actualizada
            });
        });
    }

    // ===================================
    // PERFIL COMPLETO - VER Y EDITAR
    // ===================================
    function showProfileModal() {
        const user = APP_STATE.currentUser;
        const joinDate = new Date(user.joinDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content profile-modal">
                <div class="profile-modal-banner" style="${user.banner ? `background: url(${user.banner}) center/cover` : ''}">
                    <button class="modal-close">&times;</button>
                </div>
                <div class="profile-modal-header">
                    <div class="profile-modal-avatar">
                        <img src="${user.avatar}" alt="${escapeHTML(user.name)}">
                    </div>
                    <button class="edit-profile-btn" id="editProfileBtn">
                        <i class="ri-edit-line"></i> Editar perfil
                    </button>
                </div>
                <div class="profile-modal-body">
                    <h2>${escapeHTML(user.name)}</h2>
                    <p class="profile-modal-role">${escapeHTML(user.role)}</p>
                    <p class="profile-modal-bio">${escapeHTML(user.bio)}</p>
                    
                    <div class="profile-modal-info">
                        <div class="info-item">
                            <i class="ri-map-pin-line"></i>
                            <span>${escapeHTML(user.location)}</span>
                        </div>
                        <div class="info-item">
                            <i class="ri-link"></i>
                            <a href="https://${user.website}" target="_blank">${escapeHTML(user.website)}</a>
                        </div>
                        <div class="info-item">
                            <i class="ri-mail-line"></i>
                            <span>${escapeHTML(user.email)}</span>
                        </div>
                        <div class="info-item">
                            <i class="ri-calendar-line"></i>
                            <span>Se unió en ${joinDate}</span>
                        </div>
                    </div>
                    
                    <div class="profile-modal-stats">
                        <div class="modal-stat">
                            <strong>${user.contacts}</strong>
                            <span>Contactos</span>
                        </div>
                        <div class="modal-stat">
                            <strong>${user.projects}</strong>
                            <span>Proyectos</span>
                        </div>
                        <div class="modal-stat">
                            <strong>${formatNumber(user.views)}</strong>
                            <span>Vistas</span>
                        </div>
                    </div>
                    
                    <div class="profile-modal-skills">
                        <h4>Habilidades</h4>
                        <div class="skills-list">
                            ${user.skills.map(skill => `<span class="skill-tag-large">${escapeHTML(skill)}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        modal.querySelector('#editProfileBtn').addEventListener('click', () => {
            modal.remove();
            showEditProfileModal();
        });
    }

    function showEditProfileModal() {
        const user = APP_STATE.currentUser;
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content edit-profile-modal">
                <div class="modal-header">
                    <h3><i class="ri-user-settings-line"></i> Editar perfil</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="editProfileForm" class="edit-profile-form">
                        <div class="form-group">
                            <label for="editName">Nombre completo</label>
                            <input type="text" id="editName" value="${escapeHTML(user.name)}" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="editRole">Rol / Profesión</label>
                            <input type="text" id="editRole" value="${escapeHTML(user.role)}">
                        </div>
                        
                        <div class="form-group">
                            <label for="editBio">Biografía</label>
                            <textarea id="editBio" rows="3">${escapeHTML(user.bio)}</textarea>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="editLocation">Ubicación</label>
                                <input type="text" id="editLocation" value="${escapeHTML(user.location)}">
                            </div>
                            <div class="form-group">
                                <label for="editWebsite">Sitio web</label>
                                <input type="text" id="editWebsite" value="${escapeHTML(user.website)}">
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="editEmail">Email</label>
                                <input type="email" id="editEmail" value="${escapeHTML(user.email)}">
                            </div>
                            <div class="form-group">
                                <label for="editPhone">Teléfono</label>
                                <input type="tel" id="editPhone" value="${escapeHTML(user.phone || '')}">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="editSkills">Habilidades (separadas por coma)</label>
                            <input type="text" id="editSkills" value="${user.skills.join(', ')}">
                        </div>
                        
                        <div class="form-group">
                            <label>Foto de perfil</label>
                            <div class="avatar-upload">
                                <img src="${user.avatar}" alt="Avatar" id="previewAvatar">
                                <button type="button" class="upload-btn" id="uploadAvatarBtn">
                                    <i class="ri-camera-line"></i> Cambiar foto
                                </button>
                                <input type="file" id="avatarInput" accept="image/*" style="display: none;">
                            </div>
                        </div>
                        
                        <div class="form-actions">
                            <button type="button" class="btn-cancel" id="cancelEditBtn">Cancelar</button>
                            <button type="submit" class="btn-save">Guardar cambios</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const form = modal.querySelector('#editProfileForm');
        const avatarInput = modal.querySelector('#avatarInput');
        const previewAvatar = modal.querySelector('#previewAvatar');
        const uploadAvatarBtn = modal.querySelector('#uploadAvatarBtn');

        // Cerrar modal
        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
        modal.querySelector('#cancelEditBtn').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        // Subir avatar
        uploadAvatarBtn.addEventListener('click', () => avatarInput.click());
        avatarInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    previewAvatar.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });

        // Guardar cambios
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Actualizar estado
            APP_STATE.currentUser.name = modal.querySelector('#editName').value.trim();
            APP_STATE.currentUser.role = modal.querySelector('#editRole').value.trim();
            APP_STATE.currentUser.bio = modal.querySelector('#editBio').value.trim();
            APP_STATE.currentUser.location = modal.querySelector('#editLocation').value.trim();
            APP_STATE.currentUser.website = modal.querySelector('#editWebsite').value.trim();
            APP_STATE.currentUser.email = modal.querySelector('#editEmail').value.trim();
            APP_STATE.currentUser.phone = modal.querySelector('#editPhone').value.trim();
            
            // Procesar skills
            const skillsInput = modal.querySelector('#editSkills').value;
            APP_STATE.currentUser.skills = skillsInput.split(',').map(s => s.trim()).filter(s => s);
            
            // Avatar
            if (previewAvatar.src !== user.avatar) {
                APP_STATE.currentUser.avatar = previewAvatar.src;
            }
            
            // Guardar y actualizar UI
            saveState();
            updateProfileUI();
            
            modal.remove();
            showToast('✅ Perfil actualizado correctamente');
        });
    }

    function showMyProjects() {
        const userPosts = APP_STATE.posts.filter(p => 
            p.author.name === APP_STATE.currentUser.name && p.type === 'proyecto'
        );
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content projects-modal">
                <div class="modal-header">
                    <h3><i class="ri-folder-line"></i> Mis proyectos</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    ${userPosts.length > 0 ? userPosts.map(post => `
                        <div class="project-item">
                            <div class="project-icon">
                                <i class="ri-briefcase-line"></i>
                            </div>
                            <div class="project-info">
                                <p>${escapeHTML(post.content.substring(0, 100))}...</p>
                                <small>${post.time} • ${post.likes} likes • ${post.comments.length} comentarios</small>
                            </div>
                        </div>
                    `).join('') : `
                        <div class="no-projects">
                            <i class="ri-folder-add-line"></i>
                            <p>No has publicado proyectos aún</p>
                            <button class="create-project-btn">Crear proyecto</button>
                        </div>
                    `}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        const createBtn = modal.querySelector('.create-project-btn');
        if (createBtn) {
            createBtn.addEventListener('click', () => {
                modal.remove();
                if (elements.textarea) {
                    elements.textarea.placeholder = '¿Qué proyecto quieres compartir?';
                    elements.textarea.focus();
                }
            });
        }
    }

    function handleAvatarUpload() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    APP_STATE.currentUser.avatar = e.target.result;
                    saveState();
                    updateProfileUI();
                    showToast('✅ Foto de perfil actualizada');
                };
                reader.readAsDataURL(file);
            }
        });
        
        input.click();
    }

    function handleBannerUpload() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    APP_STATE.currentUser.banner = e.target.result;
                    if (elements.profileBanner) {
                        elements.profileBanner.style.background = `url(${e.target.result}) center/cover`;
                    }
                    saveState();
                    showToast('✅ Banner actualizado');
                };
                reader.readAsDataURL(file);
            }
        });
        
        input.click();
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
            showToast('🔜 Foro completo próximamente');
            modal.remove();
        });
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
    // TOAST NOTIFICATIONS
    // ===================================
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
    // UTILIDADES
    // ===================================
    function escapeHTML(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // ===================================
    // EVENT LISTENERS
    // ===================================

    // ===================================
    // PANEL DE NOTIFICACIONES DE MENSAJES
    // ===================================
        function toggleMessagesPanel() {
        // Cerrar panel de notificaciones si está abierto
        document.querySelector('.notifications-panel')?.remove();
        
        // Remover panel existente
        const existingPanel = document.querySelector('.messages-panel');
        if (existingPanel) {
            existingPanel.remove();
            return; // Si ya estaba abierto, solo cerrarlo
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

    function setupEventListeners() {
        // Tema
        elements.themeToggle?.addEventListener('click', toggleTheme);

        // Chat
        elements.chatBtn?.addEventListener('click', toggleChat);
        elements.messagesBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMessagesPanel();
        });
        elements.chatClose?.addEventListener('click', () => elements.chatWindow?.classList.remove('active'));
        elements.chatSend?.addEventListener('click', sendChatMessage);
        elements.chatInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendChatMessage();
            }
        });

        // Publicar
        elements.publishBtn?.addEventListener('click', createNewPost);
        elements.textarea?.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 150) + 'px';
        });

        // Tipos de publicación
        document.querySelectorAll('.share-action').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.dataset.type;
                currentPostType = type;
                
                const placeholders = {
                    proyecto: '¿Qué proyecto quieres compartir?',
                    logro: '¡Cuéntanos tu logro! 🎉',
                    colaboracion: '¿Qué tipo de colaboración buscas?',
                    foto: '¿Qué quieres compartir?'
                };

                if (elements.textarea) {
                    elements.textarea.placeholder = placeholders[type] || '¿Qué quieres compartir?';
                    if (type !== 'foto') elements.textarea.focus();
                }

                if (type === 'foto') {
                    elements.fileInput?.click();
                }
            });
        });

        // Imagen
        elements.fileInput?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                if (!file.type.startsWith('image/')) {
                    showToast('⚠️ Por favor selecciona una imagen válida', 'warning');
                    return;
                }
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (elements.previewImage && elements.imagePreview) {
                        elements.previewImage.src = e.target.result;
                        elements.imagePreview.classList.add('active');
                    }
                };
                reader.readAsDataURL(file);
            }
        });

        elements.removePreview?.addEventListener('click', () => {
            elements.imagePreview?.classList.remove('active');
            if (elements.previewImage) elements.previewImage.src = '';
            if (elements.fileInput) elements.fileInput.value = '';
        });

        // Feed - acciones de posts
        elements.feed?.addEventListener('click', (e) => {
            const actionBtn = e.target.closest('.post-action');
            const menuBtn = e.target.closest('.post-menu-btn');
            const commentSend = e.target.closest('.comment-send');

            if (actionBtn) {
                const action = actionBtn.dataset.action;
                const postId = actionBtn.dataset.postId;
                handlePostAction(action, postId);
            }

            if (menuBtn) {
                showPostMenu(menuBtn.dataset.postId, menuBtn);
            }

            if (commentSend) {
                const postId = commentSend.dataset.postId;
                const input = document.querySelector(`.comment-input[data-post-id="${postId}"]`);
                if (input) {
                    addComment(postId, input.value);
                    input.value = '';
                }
            }
        });

        // Enter para enviar comentario
        elements.feed?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.classList.contains('comment-input')) {
                const postId = e.target.dataset.postId;
                addComment(postId, e.target.value);
                e.target.value = '';
            }
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

        // Click en resultados de búsqueda
        elements.searchUsers?.addEventListener('click', (e) => {
            const connectBtn = e.target.closest('.connect-btn');
            if (connectBtn) {
                e.stopPropagation();
                handleConnect(connectBtn.dataset.userId);
            }
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

        // Links del sidebar izquierdo
        document.querySelector('a[href="#guardados"]')?.addEventListener('click', (e) => {
            e.preventDefault();
            showSavedItems();
        });

        document.querySelector('a[href="#ampliar-red"]')?.addEventListener('click', (e) => {
            e.preventDefault();
            showNetworkSuggestions();
        });

        document.querySelector('a[href="#ayuda"]')?.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('📚 Centro de ayuda próximamente');
        });

        // Mis proyectos
        document.querySelector('a[href="#mis-proyectos"]')?.addEventListener('click', (e) => {
            e.preventDefault();
            showMyProjects();
        });

        // Dropdown del perfil en header - ver perfil
        // Abrir modal de perfil desde cualquier link a "#perfil"
        document.querySelectorAll('a[href="#perfil"]').forEach(a => {
            a.addEventListener('click', (e) => {
                e.preventDefault();
                showProfileModal();
            });
        });

        // Cerrar búsqueda al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!elements.searchForm?.contains(e.target) && !elements.searchResults?.contains(e.target)) {
                if (elements.searchResults) elements.searchResults.style.display = 'none';
            }
        });

        // Sidebar móvil
        const menuToggle = document.createElement('button');
        menuToggle.className = 'mobile-menu-toggle';
        menuToggle.innerHTML = '<i class="ri-menu-line"></i>';
        document.querySelector('.header-inner')?.prepend(menuToggle);

        menuToggle.addEventListener('click', () => {
            elements.sidebar?.classList.toggle('open');
        });

        // Cerrar sidebar al hacer clic en un link (móvil)
        elements.sidebar?.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 900) {
                    elements.sidebar.classList.remove('open');
                }
            });
        });
    }

    // ===================================
    // ESTILOS DINÁMICOS
    // ===================================
    function addDynamicStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Animaciones */
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes slideIn {
                from { opacity: 0; transform: translateX(20px); }
                to { opacity: 1; transform: translateX(0); }
            }

            /* Toast */
            .toast {
                position: fixed;
                bottom: 2rem;
                left: 50%;
                transform: translateX(-50%) translateY(100px);
                background: var(--bg-card);
                color: var(--text);
                padding: 0.875rem 1.5rem;
                border-radius: 50px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                z-index: 10000;
                transition: transform 0.3s ease;
                font-size: 0.9rem;
                border: 1px solid var(--border);
            }
            .toast.show { transform: translateX(-50%) translateY(0); }
            .toast-warning { border-color: #f59e0b; }
            .toast-error { border-color: #ef4444; }

            /* Modal */
            .modal-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                animation: fadeIn 0.2s ease;
            }
            .modal-content {
                background: var(--bg-card);
                border-radius: var(--radius);
                width: 90%;
                max-width: 480px;
                max-height: 80vh;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem 1.25rem;
                border-bottom: 1px solid var(--border);
            }
            .modal-header h3 {
                font-size: 1.1rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            .modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: var(--text-muted);
                line-height: 1;
            }
            .modal-body {
                padding: 1.25rem;
                overflow-y: auto;
            }
            .modal-subtitle {
                color: var(--text-muted);
                font-size: 0.9rem;
                margin-bottom: 1rem;
            }

            /* Share Modal */
            .share-options-modal {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                margin-top: 1rem;
            }
            .share-option {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.875rem 1rem;
                background: var(--bg);
                border: 1px solid var(--border);
                border-radius: var(--radius-sm);
                cursor: pointer;
                transition: all 0.2s;
                font-size: 0.9rem;
                color: var(--text);
            }
            .share-option:hover {
                border-color: var(--primary);
                color: var(--primary);
            }
            .share-option i { font-size: 1.25rem; }

            /* Post Type Badge */
            .post-type { padding: 0 1.25rem; margin-bottom: 0.5rem; }
            .post-type-badge {
                display: inline-flex;
                align-items: center;
                gap: 0.25rem;
                font-size: 0.75rem;
                padding: 0.25rem 0.625rem;
                border-radius: 50px;
                font-weight: 500;
            }
            .post-type-badge.proyecto { background: #dbeafe; color: #1d4ed8; }
            .post-type-badge.logro { background: #fef3c7; color: #b45309; }
            .post-type-badge.colaboracion { background: #d1fae5; color: #047857; }
            [data-theme="dark"] .post-type-badge.proyecto { background: #1e3a5f; color: #60a5fa; }
            [data-theme="dark"] .post-type-badge.logro { background: #422006; color: #fbbf24; }
            [data-theme="dark"] .post-type-badge.colaboracion { background: #064e3b; color: #34d399; }

            /* Post Stats */
            .post-stats {
                display: flex;
                gap: 1rem;
                padding: 0.5rem 1.25rem;
                font-size: 0.8rem;
                color: var(--text-muted);
            }
            .stat-item { display: flex; align-items: center; gap: 0.25rem; }
            .stat-item i { color: #ef4444; font-size: 0.9rem; }

            /* Post Actions States */
            .post-action.liked { color: #ef4444 !important; }
            .post-action.shared { color: var(--primary) !important; }
            .post-action.saved { color: #f59e0b !important; }

            /* Post Menu */
            .post-menu-btn {
                background: none;
                border: none;
                color: var(--text-muted);
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 50%;
                transition: background 0.2s;
            }
            .post-menu-btn:hover { background: var(--bg); }
            .post-dropdown-menu {
                position: absolute;
                right: 1rem;
                top: 3rem;
                background: var(--bg-card);
                border: 1px solid var(--border);
                border-radius: var(--radius-sm);
                box-shadow: var(--shadow-lg);
                min-width: 180px;
                z-index: 100;
                animation: fadeIn 0.2s ease;
            }
            .post-dropdown-menu button {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                width: 100%;
                padding: 0.75rem 1rem;
                background: none;
                border: none;
                color: var(--text);
                font-size: 0.875rem;
                cursor: pointer;
                transition: background 0.2s;
            }
            .post-dropdown-menu button:hover { background: var(--bg); }
            .post-dropdown-menu button.danger { color: #ef4444; }
            .post-header { position: relative; }

            /* Comments */
            .post-comments {
                padding: 0 1.25rem 1rem;
                border-top: 1px solid var(--border);
                margin-top: 0.5rem;
                padding-top: 0.75rem;
            }
            .comment {
                display: flex;
                flex-wrap: wrap;
                gap: 0.25rem 0.5rem;
                font-size: 0.85rem;
                padding: 0.5rem 0;
            }
            .comment strong { color: var(--text); }
            .comment span { color: var(--text); }
            .comment small { color: var(--text-muted); width: 100%; }
            
            .comment-input-area {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.75rem 1.25rem;
                border-top: 1px solid var(--border);
            }
            .comment-avatar {
                width: 32px;
                height: 32px;
                border-radius: 50%;
            }
            .comment-input {
                flex: 1;
                padding: 0.5rem 1rem;
                border: 1px solid var(--border);
                border-radius: 50px;
                background: var(--bg);
                color: var(--text);
                font-size: 0.85rem;
            }
            .comment-input:focus { outline: none; border-color: var(--primary); }
            .comment-send {
                background: var(--primary);
                color: white;
                border: none;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            /* Notifications Panel */
            .notifications-panel {
                position: fixed;
                background: var(--bg-card);
                border: 1px solid var(--border);
                border-radius: var(--radius);
                box-shadow: var(--shadow-lg);
                width: 340px;
                max-height: 400px;
                z-index: 9999;
                animation: slideIn 0.2s ease;
                overflow: hidden;
            }
            .notif-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem;
                border-bottom: 1px solid var(--border);
            }
            .notif-header h4 { margin: 0; font-size: 1rem; }
            .mark-all-read {
                background: none;
                border: none;
                color: var(--primary);
                font-size: 0.8rem;
                cursor: pointer;
            }
            .notif-list { max-height: 300px; overflow-y: auto; }
            .notif-item {
                display: flex;
                align-items: flex-start;
                gap: 0.75rem;
                padding: 0.875rem 1rem;
                border-bottom: 1px solid var(--border);
                transition: background 0.2s;
            }
            .notif-item:hover { background: var(--bg); }
            .notif-item.read { opacity: 0.6; }
            .notif-icon {
                width: 36px;
                height: 36px;
                background: var(--bg);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--primary);
            }
            .notif-content p { margin: 0; font-size: 0.85rem; }
            .notif-content small { color: var(--text-muted); }
            .no-notifs { text-align: center; padding: 2rem; color: var(--text-muted); }

            /* Search Results */
            .search-section-title {
                font-size: 0.8rem;
                color: var(--text-muted);
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin: 1rem 0 0.5rem;
            }
            .search-section-title:first-child { margin-top: 0; }
            .search-user-item, .search-post-item {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.75rem;
                border-radius: var(--radius-sm);
                cursor: pointer;
                transition: background 0.2s;
            }
            .search-user-item:hover, .search-post-item:hover { background: var(--bg); }
            .search-user-item img, .search-post-item img {
                width: 40px;
                height: 40px;
                border-radius: 50%;
            }
            .search-user-info, .search-post-info { flex: 1; min-width: 0; }
            .search-user-name, .search-post-author { font-weight: 600; font-size: 0.9rem; }
            .search-user-role { font-size: 0.8rem; color: var(--text-muted); }
            .search-post-preview {
                font-size: 0.8rem;
                color: var(--text-muted);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .connect-btn {
                padding: 0.375rem 0.75rem;
                background: var(--primary);
                color: white;
                border: none;
                border-radius: 50px;
                font-size: 0.75rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 0.25rem;
                transition: all 0.2s;
            }
            .connect-btn:hover { background: var(--primary-dark); }
            .connect-btn.connected {
                background: var(--bg);
                color: var(--text-muted);
                border: 1px solid var(--border);
            }
            .no-results { text-align: center; padding: 1.5rem; color: var(--text-muted); }

            /* Saved Items Modal */
            .saved-item {
                display: flex;
                align-items: flex-start;
                gap: 0.75rem;
                padding: 0.875rem;
                border-bottom: 1px solid var(--border);
            }
            .saved-item img { width: 44px; height: 44px; border-radius: 50%; }
            .saved-info { flex: 1; }
            .saved-info strong { display: block; margin-bottom: 0.25rem; }
            .saved-info p { font-size: 0.85rem; color: var(--text-muted); margin: 0; }
            .saved-info small { color: var(--text-muted); }
            .remove-saved {
                background: none;
                border: none;
                color: var(--text-muted);
                cursor: pointer;
                padding: 0.25rem;
            }
            .remove-saved:hover { color: #ef4444; }
            .no-saved { text-align: center; color: var(--text-muted); padding: 2rem; }

            /* Network Modal */
            .suggestion-item {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.875rem;
                border-bottom: 1px solid var(--border);
            }
            .suggestion-item img { width: 48px; height: 48px; border-radius: 50%; }
            .suggestion-info { flex: 1; }
            .suggestion-info strong { display: block; }
            .suggestion-info span { font-size: 0.85rem; color: var(--text-muted); }
            .connect-btn-modal {
                padding: 0.5rem 1rem;
                background: var(--primary);
                color: white;
                border: none;
                border-radius: 50px;
                font-size: 0.85rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 0.375rem;
            }
            .connect-btn-modal:hover { background: var(--primary-dark); }
            .no-suggestions { text-align: center; color: var(--text-muted); padding: 2rem; }

            /* Forum Modal */
            .forum-categories { display: flex; flex-direction: column; gap: 0.5rem; }
            .forum-category {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                background: var(--bg);
                border-radius: var(--radius-sm);
                cursor: pointer;
                transition: all 0.2s;
            }
            .forum-category:hover { background: var(--border); }
            .forum-category i { font-size: 1.5rem; color: var(--primary); }
            .forum-category h4 { margin: 0 0 0.25rem; font-size: 0.95rem; }
            .forum-category p { margin: 0; font-size: 0.8rem; color: var(--text-muted); }
            .forum-cta {
                width: 100%;
                margin-top: 1rem;
                padding: 0.75rem;
                background: var(--primary);
                color: white;
                border: none;
                border-radius: var(--radius-sm);
                font-size: 0.9rem;
                cursor: pointer;
            }
            .forum-cta:hover { background: var(--primary-dark); }

            /* Profile Modal */
            .profile-modal { max-width: 500px; padding: 0; }
            .profile-modal-banner {
                height: 120px;
                background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
                position: relative;
            }
            .profile-modal-banner .modal-close {
                position: absolute;
                top: 0.75rem;
                right: 0.75rem;
                background: rgba(0,0,0,0.4);
                color: white;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .profile-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                padding: 0 1.5rem;
                margin-top: -50px;
            }
            .profile-modal-avatar {
                width: 100px;
                height: 100px;
                border-radius: 50%;
                border: 4px solid var(--bg-card);
                overflow: hidden;
                background: var(--bg-card);
            }
            .profile-modal-avatar img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            .edit-profile-btn {
                margin-top: 60px;
                padding: 0.5rem 1rem;
                background: transparent;
                color: var(--primary);
                border: 1px solid var(--primary);
                border-radius: 50px;
                font-size: 0.85rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 0.375rem;
                transition: all 0.2s;
            }
            .edit-profile-btn:hover {
                background: var(--primary);
                color: white;
            }
            .profile-modal-body {
                padding: 1rem 1.5rem 1.5rem;
            }
            .profile-modal-body h2 {
                font-size: 1.25rem;
                margin-bottom: 0.125rem;
            }
            .profile-modal-role {
                color: var(--primary);
                font-weight: 500;
                margin-bottom: 0.5rem;
            }
            .profile-modal-bio {
                color: var(--text-muted);
                font-size: 0.9rem;
                margin-bottom: 1rem;
            }
            .profile-modal-info {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                margin-bottom: 1rem;
            }
            .info-item {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 0.85rem;
                color: var(--text-muted);
            }
            .info-item i { color: var(--text-muted); }
            .info-item a { color: var(--primary); }
            .profile-modal-stats {
                display: flex;
                justify-content: space-around;
                padding: 1rem 0;
                border-top: 1px solid var(--border);
                border-bottom: 1px solid var(--border);
                margin-bottom: 1rem;
            }
            .modal-stat {
                text-align: center;
            }
            .modal-stat strong {
                display: block;
                font-size: 1.25rem;
                color: var(--text);
            }
            .modal-stat span {
                font-size: 0.8rem;
                color: var(--text-muted);
            }
            .profile-modal-skills h4 {
                font-size: 0.9rem;
                margin-bottom: 0.75rem;
            }
            .skills-list {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
            }
            .skill-tag-large {
                padding: 0.375rem 0.875rem;
                background: var(--bg);
                border: 1px solid var(--border);
                border-radius: 50px;
                font-size: 0.8rem;
                color: var(--text);
            }

            /* Edit Profile Modal */
            .edit-profile-modal { max-width: 520px; }
            .edit-profile-form {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            .form-group {
                display: flex;
                flex-direction: column;
                gap: 0.375rem;
            }
            .form-group label {
                font-size: 0.85rem;
                font-weight: 500;
                color: var(--text);
            }
            .form-group input,
            .form-group textarea {
                padding: 0.625rem 0.875rem;
                border: 1px solid var(--border);
                border-radius: var(--radius-sm);
                background: var(--bg);
                color: var(--text);
                font-size: 0.9rem;
                font-family: inherit;
            }
            .form-group input:focus,
            .form-group textarea:focus {
                outline: none;
                border-color: var(--primary);
            }
            .form-group textarea {
                resize: vertical;
                min-height: 80px;
            }
            .form-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
            }
            .avatar-upload {
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            .avatar-upload img {
                width: 64px;
                height: 64px;
                border-radius: 50%;
                object-fit: cover;
            }
            .upload-btn {
                padding: 0.5rem 1rem;
                background: var(--bg);
                border: 1px solid var(--border);
                border-radius: var(--radius-sm);
                color: var(--text);
                font-size: 0.85rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 0.375rem;
            }
            .upload-btn:hover {
                border-color: var(--primary);
                color: var(--primary);
            }
            .form-actions {
                display: flex;
                justify-content: flex-end;
                gap: 0.75rem;
                margin-top: 0.5rem;
                padding-top: 1rem;
                border-top: 1px solid var(--border);
            }
            .btn-cancel {
                padding: 0.625rem 1.25rem;
                background: transparent;
                border: 1px solid var(--border);
                border-radius: var(--radius-sm);
                color: var(--text-muted);
                font-size: 0.9rem;
                cursor: pointer;
            }
            .btn-cancel:hover {
                background: var(--bg);
            }
            .btn-save {
                padding: 0.625rem 1.25rem;
                background: var(--primary);
                border: none;
                border-radius: var(--radius-sm);
                color: white;
                font-size: 0.9rem;
                cursor: pointer;
            }
            .btn-save:hover {
                background: var(--primary-dark);
            }

            /* Projects Modal */
            .projects-modal { max-width: 480px; }
            .project-item {
                display: flex;
                align-items: flex-start;
                gap: 0.75rem;
                padding: 1rem;
                border-bottom: 1px solid var(--border);
            }
            .project-icon {
                width: 40px;
                height: 40px;
                background: var(--bg);
                border-radius: var(--radius-sm);
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--primary);
                flex-shrink: 0;
            }
            .project-info { flex: 1; }
            .project-info p {
                margin: 0 0 0.25rem;
                font-size: 0.9rem;
            }
            .project-info small {
                color: var(--text-muted);
                font-size: 0.8rem;
            }
            .no-projects {
                text-align: center;
                padding: 2rem;
            }
            .no-projects i {
                font-size: 3rem;
                color: var(--text-muted);
                margin-bottom: 1rem;
            }
            .no-projects p {
                color: var(--text-muted);
                margin-bottom: 1rem;
            }
            .create-project-btn {
                padding: 0.625rem 1.25rem;
                background: var(--primary);
                color: white;
                border: none;
                border-radius: var(--radius-sm);
                cursor: pointer;
            }

            /* Mobile Menu Toggle */
            .mobile-menu-toggle {
                display: none;
                background: none;
                border: none;
                color: var(--text);
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0.25rem;
            }
            @media (max-width: 900px) {
                .mobile-menu-toggle { display: flex; }
                .form-row { grid-template-columns: 1fr; }
            }

            /* Post Meta */
            .post-meta {
                display: flex;
                align-items: center;
                gap: 0.375rem;
                flex-wrap: wrap;
            }
            .post-role {
                font-size: 0.75rem;
                color: var(--text-muted);
            }
        `;
        document.head.appendChild(style);
    }

    // ===================================
    // INICIAR APLICACIÓN
    // ===================================
    init();
});