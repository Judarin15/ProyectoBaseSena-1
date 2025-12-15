@php
    $user = Auth::user();
    $avatarFolder = config('chatify.user_avatar.folder', 'users-avatar');

    $avatarUrl = $user && $user->avatar
        ? asset('storage/' . $avatarFolder . '/' . $user->avatar)
        : 'https://ui-avatars.com/api/?name=' . urlencode($user->name ?? 'Freeland User') . '&background=ededed&color=7c3aed';
@endphp

<header class="header">
    <div class="header-inner">
        {{-- Marca / Logo (opciones específicas para Workspace Cliente) --}}
        @hasSection('menu-workspace-cliente')
            <div class="logo">
                <a href="{{ route('workspace.cliente') }}" class="logo-text">Workspace Cliente</a>
            </div>
        @endif

        {{-- Título para workspace freelancer --}}
        @hasSection('menu-workspace-freelancer')
            <div class="logo">
                <a href="{{ route('workspace.freelancer') }}" class="logo-text">Workspace Freelancer</a>
            </div>
        @endif

        {{-- Título para Eventos & Retos --}}
        @hasSection('menu-eventos')
            <div class="logo">
                <div class="logo-icon" aria-hidden="true" style="width:40px;height:40px;overflow:hidden;display:flex;align-items:center;justify-content:center;">
                    <svg width="20" height="20" style="width:20px;height:20px;display:block;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="m15 12-8.373 8.373a1 1 0 1 1-3-3L12 9"/>
                        <path d="m18 15 4-4"/>
                        <path d="m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172V7l-2.26-2.26a6 6 0 0 0-4.202-1.756L9 2.96l.92.82A6.18 6.18 0 0 1 12 8.4V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5"/>
                    </svg>
                </div>
                <a href="{{ route('eventos.y.retos') }}" class="logo-text">Eventos & Retos</a>
            </div>
        @endif

        {{-- Título para Ajustes --}}
        @hasSection('menu-ajustes')
            <div class="logo">
                <div class="logo-icon" aria-hidden="true" style="width:40px;height:40px;overflow:hidden;display:flex;align-items:center;justify-content:center;">
                    <svg width="20" height="20" style="width:20px;height:20px;display:block;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"></path>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09c0-.58-.37-1.11-.94-1.34a1.65 1.65 0 0 0-1.82.33l-.06.06A2 2 0 1 1 2.27 18.9l.06-.06c.43-.43.53-1.06.26-1.58A1.65 1.65 0 0 0 2.2 15H2a2 2 0 1 1 0-4h.2c.58 0 1.11-.37 1.34-.94a1.65 1.65 0 0 0-.33-1.82L3.4 7.27A2 2 0 1 1 6.23 4.44l.06.06c.43.43 1.06.53 1.58.26.47-.24 1.02-.24 1.49 0 .52.27.68.9.31 1.37l-.06.06c-.43.43-.53 1.06-.26 1.58.24.47.24 1.02 0 1.49-.27.52-.9.68-1.37.31l-.06-.06A1.65 1.65 0 0 0 9 10.8V11a2 2 0 1 1 4 0v-.2c.58 0 1.11.37 1.34.94.24.52.1 1.15-.33 1.58l-.06.06c-.43.43-.53 1.06-.26 1.58.24.47.24 1.02 0 1.49-.27.52-.9.68-1.37.31l-.06-.06c-.43-.43-1.06-.53-1.58-.26-.47.24-1.02.24-1.49 0-.52-.27-.68-.9-.31-1.37l.06-.06c.43-.43.53-1.06.26-1.58-.24-.47-.24-1.02 0-1.49.27-.52.9-.68 1.37-.31l.06.06c.43.43 1.06.53 1.58.26.47-.24 1.02-.24 1.49 0 .52.27.68.9.31 1.37l-.06.06c-.43.43-.53 1.06-.26 1.58.24.47.24 1.02 0 1.49.27.52.9.68 1.37.31l.06-.06c.43-.43 1.06-.53 1.58-.26.47.24 1.02.24 1.49 0z"></path>
                    </svg>
                </div>
                @if(Route::has('ajustes'))
                    <a href="{{ route('ajustes') }}" class="logo-text">Ajustes</a>
                @else
                    <span class="logo-text">Ajustes</span>
                @endif
            </div>
        @endif

        {{-- Buscador (siempre visible, justo después del nombre) --}}
        <form action="{{ route('inicio') }}" method="GET" class="search-form">
            <div class="search-group">
                <i class="ri-search-line" aria-hidden="true"></i>
                <input
                    type="text"
                    name="texto"
                    class="search"
                    placeholder="Buscar proyectos, personas, publicaciones..."
                    value="{{ $texto ?? '' }}"
                    autocomplete="off"
                />
            </div>
        </form>

        {{-- Opciones de cliente (colocadas después del buscador) --}}
        @hasSection('menu-workspace-cliente')
            <!-- Navigation Desktop (cliente) -->
            <nav class="nav-desktop">
                <button class="nav-btn active" data-tab="my-jobs">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                    Mis Trabajos
                </button>
                <button class="nav-btn" data-tab="proposals">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="8.5" cy="7" r="4"></circle>
                        <polyline points="17 11 19 13 23 9"></polyline>
                    </svg>
                    Solicitudes
                </button>
                <button class="nav-btn" data-tab="freelancers">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    Buscar Freelancers
                </button>
                <button class="nav-btn" data-tab="messages">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    Mensajes
                </button>
            </nav>

            <!-- Navigation Mobile (cliente) -->
            <nav class="nav-mobile">
                <button class="nav-btn-mobile active" data-tab="my-jobs">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                    Trabajos
                </button>
                <button class="nav-btn-mobile" data-tab="proposals">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="8.5" cy="7" r="4"></circle>
                        <polyline points="17 11 19 13 23 9"></polyline>
                    </svg>
                    Solicitudes
                </button>
                <button class="nav-btn-mobile" data-tab="freelancers">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    Freelancers
                </button>
                <button class="nav-btn-mobile" data-tab="messages">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    Mensajes
                </button>
            </nav>
        @endif

        {{-- Opciones de freelancer (colocadas después del buscador) --}}
        @hasSection('menu-workspace-freelancer')
            <!-- Navigation Desktop (freelancer) -->
            <nav class="nav-desktop">
                <button class="nav-btn active" data-tab="explore">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    Explorar Trabajos
                </button>
                <button class="nav-btn" data-tab="proposals">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="8.5" cy="7" r="4"></circle>
                        <polyline points="17 11 19 13 23 9"></polyline>
                    </svg>
                    Solicitudes
                </button>
                <button class="nav-btn" data-tab="my-jobs">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                    Mis Trabajos
                </button>
                <button class="nav-btn" data-tab="history">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    Historial
                </button>
                <button class="nav-btn" data-tab="messages">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    Mensajes
                </button>
            </nav>

            <!-- Navigation Mobile (freelancer) -->
            <nav class="nav-mobile">
                <button class="nav-btn-mobile active" data-tab="explore">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    Explorar
                </button>
                <button class="nav-btn-mobile" data-tab="proposals">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="8.5" cy="7" r="4"></circle>
                        <polyline points="17 11 19 13 23 9"></polyline>
                    </svg>
                    Solicitudes
                </button>
                <button class="nav-btn-mobile" data-tab="my-jobs">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                    Trabajos
                </button>
                <button class="nav-btn-mobile" data-tab="history">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    Historial
                </button>
                <button class="nav-btn-mobile" data-tab="messages">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    Mensajes
                </button>
            </nav>
        @endif

        {{-- Acciones + Perfil --}}
        <nav class="top-actions" aria-label="Acciones principales">
            {{-- Cambiar tema --}}
            <button class="icon-btn" id="themeToggle" type="button" aria-label="Cambiar tema">
                <i class="ri-sun-line"></i>
            </button>

            {{-- Foro --}}
            <button class="icon-btn" id="forumBtn" type="button" aria-label="Foro">
                <i class="ri-group-line"></i>
            </button>

            {{-- Mensajes --}}
            <button class="icon-btn" id="openChat" type="button" aria-label="Mensajes">
                <i class="ri-message-3-line"></i>
            </button>

            {{-- Notificaciones --}}
            <button class="icon-btn" id="notifBtn" type="button" aria-label="Notificaciones" style="position:relative">
                <i class="ri-notification-3-line"></i>
                <span id="notifBadge" class="badge" style="display:none">0</span>
            </button>

            {{-- Perfil --}}
            @auth
            <div class="profile">

                <div class="user-dropdown">
                    <img
                        src="{{ $avatarUrl }}"
                        class="avatar"
                        alt="{{ $user->name }}"
                    />

                    <div class="profile-info">
                        <span class="profile-name">{{ $user->name }}</span>
                        <span class="chevron">▾</span>
                    </div>

                    <div class="dropdown-menu">
                        <a href="{{ route('perfil.edit') }}" class="dropdown-item">Perfil</a>
                        <a href="#"
                           class="dropdown-item"
                           onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
                            Cerrar sesión
                        </a>
                        <form action="{{ route('logout') }}" method="POST" id="logout-form" class="d-none">
                            @csrf
                        </form>
                    </div>
                </div>
            </div>
            @endauth
        </nav>
    </div>
</header>
