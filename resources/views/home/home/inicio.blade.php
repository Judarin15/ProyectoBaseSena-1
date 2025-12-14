@extends('home.layouts.app')

@section('title', 'Inicio | Freeland')
@section('menu-inicio', 'active')

@push('styles')
<link href="{{ asset('css/home/inicio.css') }}" rel="stylesheet">
<link href="{{ asset('css/home/postcard.css') }}" rel="stylesheet">
@endpush

@push('scripts')
<script src="{{ asset('js/home/postcard.js') }}"></script>
<script src="{{ asset('js/home/inicio.js') }}"></script>
@endpush

@section('content')

@php
    // Evitamos errores si el controlador todavía no manda estas variables
    $texto = $texto ?? '';
    $users = $users ?? collect();

    $currentUser    = Auth::user();
    $avatarFolder   = config('chatify.user_avatar.folder', 'users-avatar');
    $currentName    = $currentUser->name ?? 'Freeland User';

    // Avatar principal del usuario logueado (mismo que usa Chatify)
    $currentAvatarUrl = $currentUser && $currentUser->avatar
        ? asset('storage/' . $avatarFolder . '/' . $currentUser->avatar)
        : 'https://ui-avatars.com/api/?name=' . urlencode($currentName) . '&background=ededed&color=363636';
@endphp

{{-- ============================
     GRID PRINCIPAL (3 COLUMNAS)
============================ --}}
<div class="home-grid">

    {{-- ASIDE IZQUIERDO: info rápida del usuario --}}
    <aside class="home-left sticky">
        <section class="card profile" id="profileCard">
            {{-- Avatar --}}
            <div class="avatar">
                <a href="{{ route('perfil.edit') }}">
                    <img src="{{ $currentAvatarUrl }}" 
                         alt="{{ $currentName }}"
                         id="profileAvatar">
                </a>
            </div>
            
            {{-- Info principal --}}
            <h2 class="m0" id="profileName">{{ $currentName }}</h2>
            <div class="profile-role" id="profileRole">Freelancer</div>
            
            {{-- Estado --}}
            <div class="profile-status" id="profileStatus" data-status="available">
                <span class="status-dot"></span>
                <span class="status-text">Disponible</span>
            </div>

            {{-- Profesión --}}
            <div class="profile-profession" id="profileProfession">
                <i class="ri-briefcase-line"></i>
                <span>{{ $currentUser->profession ?? 'Desarrollador Web' }}</span>
            </div>

            {{-- Foros inscritos --}}
            <div class="profile-forums" id="profileForums">
                <i class="ri-group-line"></i>
                <span><strong>{{ $currentUser->forums_count ?? 3 }}</strong> foros activos</span>
            </div>
        </section>
    </aside>

    {{-- COLUMNA CENTRAL: share-card + búsqueda + publicaciones --}}
    <section class="home-center">

        {{-- SHARE CARD --}}
        <div class="share-card">
            <div class="share-header">
                <div class="share-header-top">
                    <img src="{{ $currentAvatarUrl }}"
                         class="avatar-large"
                         alt="{{ $currentName }}"
                         id="shareAvatar" />

                    <div class="share-input-wrapper">
                        <div class="share-user-label" id="shareUserLabel">{{ $currentName }}</div>
                        <textarea id="post-text"
                               class="share-input"
                               placeholder="¿Qué quieres compartir?"
                               rows="1"></textarea>
                        
                        <div class="share-options">
                            <button id="publish-btn">Publicar</button>
                        </div>
                    </div>
                </div>

                <div class="image-preview" id="imagePreview">
                    <img src="" alt="Preview" id="previewImage">
                    <button type="button" class="image-preview-remove" id="removePreview">×</button>
                </div>

                <input type="file" id="post-image" accept="image/*" style="display: none;">
            </div>

            <div class="share-actions">
                <button class="share-action" data-type="proyecto">
                    <span class="share-icon"><i class="ri-briefcase-line"></i></span>
                    <span>Proyecto</span>
                </button>
                <button class="share-action" data-type="logro">
                    <span class="share-icon"><i class="ri-trophy-line"></i></span>
                    <span>Logro</span>
                </button>
                <button class="share-action" data-type="colaboracion">
                    <span class="share-icon"><i class="ri-team-line"></i></span>
                    <span>Colaboración</span>
                </button>
                <button class="share-action" data-type="foto">
                    <span class="share-icon"><i class="ri-camera-line"></i></span>
                    <span>Foto</span>
                </button>
            </div>
        </div>

        {{-- =============================
            RESULTADOS DE BÚSQUEDA
        ============================= --}}
        @if($texto !== '')
            <section class="search-results" id="searchResults">
                <h2 class="search-title">
                    Resultados para: <span id="searchQuery">{{ $texto }}</span>
                </h2>

                <div class="search-users" id="searchUsers">
                    <h3>Personas</h3>

                    @forelse($users as $user)
                        @php
                            $userName   = $user->name ?? 'Usuario';
                            $userAvatar = $user->avatar
                                ? asset('storage/' . $avatarFolder . '/' . $user->avatar)
                                : 'https://ui-avatars.com/api/?name=' . urlencode($userName) . '&background=ededed&color=363636';
                        @endphp

                        <div class="user-result"
                             style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                            <img src="{{ $userAvatar }}"
                                 class="avatar"
                                 alt="{{ $userName }}">

                            <div class="user-result-info">
                                <p class="user-name" style="margin: 0; font-weight: 600;">
                                    {{ $userName }}
                                </p>
                                <p class="user-email"
                                   style="margin: 0; font-size: 0.85rem; color: #666;">
                                    {{ $user->email }}
                                </p>
                            </div>
                        </div>
                    @empty
                        <p style="margin-top: 8px;">No se encontraron personas que coincidan con la búsqueda.</p>
                    @endforelse
                </div>
            </section>
        @else
            <section class="search-results" id="searchResults" style="display: none;">
                <h2 class="search-title">
                    Resultados para: <span id="searchQuery"></span>
                </h2>
                <div class="search-users" id="searchUsers">
                    {{-- Los resultados se cargarán aquí --}}
                </div>
            </section>
        @endif

        {{-- CONTENEDOR DE POSTS --}}
        <div id="feed">
            @forelse($posts ?? [] as $post)
                @php
                    $postUser      = $post->user;
                    $postUserName  = $postUser->name ?? 'Usuario';
                    $postUserAvatar = $postUser->avatar
                        ? asset('storage/' . $avatarFolder . '/' . $postUser->avatar)
                        : 'https://ui-avatars.com/api/?name=' . urlencode($postUserName) . '&background=ededed&color=363636';
                @endphp

                <article class="post-card">
                    <div class="post-header">
                        <img src="{{ $postUserAvatar }}" 
                             class="avatar" 
                             alt="{{ $postUserName }}">
                        <div class="post-info">
                            <div class="post-author">{{ $postUserName }}</div>
                            <div class="post-time">{{ $post->created_at->diffForHumans() }}</div>
                        </div>
                    </div>

                    <div class="post-content">
                        {{ $post->content }}
                    </div>

                    @if($post->image_path)
                        <div class="post-image">
                            <img src="{{ asset('storage/' . $post->image_path) }}" alt="Imagen publicación">
                        </div>
                    @endif

                    <div class="post-actions">
                        <button class="post-action">
                            <i class="ri-heart-line"></i>
                            <span>Me gusta</span>
                        </button>
                        <button class="post-action">
                            <i class="ri-chat-3-line"></i>
                            <span>Comentar</span>
                        </button>
                        <button class="post-action">
                            <i class="ri-share-forward-line"></i>
                            <span>Compartir</span>
                        </button>
                    </div>
                </article>
            @empty
                {{-- Posts de ejemplo cuando no hay posts en la BD --}}
                <article class="post-card">
                    <div class="post-header">
                        <img src="https://ui-avatars.com/api/?name=Maria+Garcia&background=a78bfa&color=fff" class="avatar" alt="María García">
                        <div class="post-info">
                            <div class="post-author">María García</div>
                            <div class="post-time">Hace 2 horas</div>
                        </div>
                    </div>
                    <div class="post-content">
                        ¡Acabo de completar mi primer proyecto de diseño UX! 🎉 Fue un reto increíble trabajar con un equipo tan talentoso. Gracias a todos los que hicieron esto posible.
                    </div>
                    <div class="post-actions">
                        <button class="post-action">
                            <i class="ri-heart-line"></i>
                            <span>Me gusta</span>
                        </button>
                        <button class="post-action">
                            <i class="ri-chat-3-line"></i>
                            <span>Comentar</span>
                        </button>
                        <button class="post-action">
                            <i class="ri-share-forward-line"></i>
                            <span>Compartir</span>
                        </button>
                    </div>
                </article>

                <article class="post-card">
                    <div class="post-header">
                        <img src="https://ui-avatars.com/api/?name=Carlos+Lopez&background=5b21b6&color=fff" class="avatar" alt="Carlos López">
                        <div class="post-info">
                            <div class="post-author">Carlos López</div>
                            <div class="post-time">Hace 5 horas</div>
                        </div>
                    </div>
                    <div class="post-content">
                        Buscando colaboradores para un proyecto de desarrollo web. Si tienes experiencia en React y Node.js, ¡contáctame! 💻
                    </div>
                    <div class="post-actions">
                        <button class="post-action">
                            <i class="ri-heart-line"></i>
                            <span>Me gusta</span>
                        </button>
                        <button class="post-action">
                            <i class="ri-chat-3-line"></i>
                            <span>Comentar</span>
                        </button>
                        <button class="post-action">
                            <i class="ri-share-forward-line"></i>
                            <span>Compartir</span>
                        </button>
                    </div>
                </article>
            @endforelse

            @if(isset($posts) && method_exists($posts, 'links'))
                <div class="pagination-wrapper" style="margin-top: 15px;">
                    {{ $posts->appends(['texto' => $texto])->links() }}
                </div>
            @endif
        </div>

    </section>

    {{-- ASIDE DERECHO: ofertas recomendadas --}}
    <aside class="home-right sticky">
        <section class="card offers">
            <h3><i class="ri-briefcase-line"></i> Ofertas recomendadas</h3>
            <div class="offers-list">
                <div class="offer-item">
                    <div class="offer-header">
                        <span class="offer-tag design">Diseño</span>
                        <span class="offer-time">Hace 2h</span>
                    </div>
                    <h4 class="offer-title">Diseñador UI/UX para App Móvil</h4>
                    <p class="offer-company">TechStartup Inc.</p>
                    <div class="offer-details">
                        <span><i class="ri-money-dollar-circle-line"></i> $800 - $1,200</span>
                        <span><i class="ri-time-line"></i> 2 semanas</span>
                    </div>
                </div>
                
                <div class="offer-item">
                    <div class="offer-header">
                        <span class="offer-tag dev">Desarrollo</span>
                        <span class="offer-time">Hace 5h</span>
                    </div>
                    <h4 class="offer-title">Desarrollador React Frontend</h4>
                    <p class="offer-company">Digital Agency Co.</p>
                    <div class="offer-details">
                        <span><i class="ri-money-dollar-circle-line"></i> $1,500 - $2,000</span>
                        <span><i class="ri-time-line"></i> 1 mes</span>
                    </div>
                </div>
                
                <div class="offer-item">
                    <div class="offer-header">
                        <span class="offer-tag marketing">Marketing</span>
                        <span class="offer-time">Hace 1d</span>
                    </div>
                    <h4 class="offer-title">Community Manager</h4>
                    <p class="offer-company">Brand Solutions</p>
                    <div class="offer-details">
                        <span><i class="ri-money-dollar-circle-line"></i> $500 - $700</span>
                        <span><i class="ri-time-line"></i> Mensual</span>
                    </div>
                </div>
            </div>
            <a href="#ver-mas" class="see-more-link">Ver todas las ofertas <i class="ri-arrow-right-line"></i></a>
        </section>
    </aside>

</div> {{-- cierre .home-grid --}}

{{-- ============================
      CHAT FLOTANTE FREELAND
============================ --}}
<div id="chat-floating-btn" title="Abrir chat">
    💬
</div>

<div id="chat-floating-window">
    <div class="chat-header">
        <span>Freeland Chat</span>
        <button id="chat-close">×</button>
    </div>
    <div class="chat-body">
        <div class="chat-messages" id="chatMessages">
            <div class="chat-message received">
                <img src="https://ui-avatars.com/api/?name=Soporte&background=7c3aed&color=fff" class="chat-avatar">
                <div class="chat-bubble">
                    <p>¡Hola! Bienvenido a Freeland Chat. ¿En qué puedo ayudarte?</p>
                    <span class="chat-time">10:30 AM</span>
                </div>
            </div>
        </div>
        <div class="chat-input-area">
            <input type="text" id="chatInput" placeholder="Escribe un mensaje...">
            <button id="chatSend"><i class="ri-send-plane-fill"></i></button>
        </div>
    </div>
</div>
@endsection