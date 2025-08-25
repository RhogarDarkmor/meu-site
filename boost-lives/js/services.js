// Serviços disponíveis
const services = [
    {
        id: 1,
        name: "Seguidores Instagram Brasileiros",
        category: "Instagram",
        icon: "📱",
        rate: 1.50,
        min: 100,
        max: 10000,
        description: "Seguidores reais do Brasil, perfis ativos e engajamento genuíno",
        speed: "500-1000/dia"
    },
    {
        id: 2,
        name: "Curtidas Instagram Post",
        category: "Instagram",
        icon: "❤️",
        rate: 0.80,
        min: 50,
        max: 5000,
        description: "Curtidas reais para suas publicações",
        speed: "Imediato"
    },
    {
        id: 3,
        name: "Visualizações Instagram Reels",
        category: "Instagram",
        icon: "🎬",
        rate: 0.20,
        min: 1000,
        max: 50000,
        description: "Visualizações de alta qualidade para seus Reels",
        speed: "10k/hora"
    },
    {
        id: 4,
        name: "Visualizações YouTube",
        category: "YouTube",
        icon: "📺",
        rate: 0.50,
        min: 1000,
        max: 100000,
        description: "Visualizações reais para seus vídeos",
        speed: "5k/hora"
    },
    {
        id: 5,
        name: "Likes YouTube",
        category: "YouTube",
        icon: "👍",
        rate: 0.90,
        min: 100,
        max: 10000,
        description: "Likes genuínos para seus vídeos",
        speed: "Imediato"
    },
    {
        id: 6,
        name: "Inscritos YouTube",
        category: "YouTube",
        icon: "👥",
        rate: 2.00,
        min: 100,
        max: 5000,
        description: "Inscritos reais para seu canal",
        speed: "100-500/dia"
    },
    {
        id: 7,
        name: "Seguidores TikTok Brasileiros",
        category: "TikTok",
        icon: "🎵",
        rate: 1.20,
        min: 100,
        max: 10000,
        description: "Seguidores reais do Brasil",
        speed: "300-800/dia"
    },
    {
        id: 8,
        name: "Visualizações TikTok",
        category: "TikTok",
        icon: "👀",
        rate: 0.30,
        min: 1000,
        max: 100000,
        description: "Visualizações reais para seus vídeos",
        speed: "10k/hora"
    },
    {
        id: 9,
        name: "Seguidores Twitter",
        category: "Twitter",
        icon: "🐦",
        rate: 1.80,
        min: 100,
        max: 5000,
        description: "Seguidores reais e ativos",
        speed: "200-400/dia"
    },
    {
        id: 10,
        name: "Curtidas Twitter",
        category: "Twitter",
        icon: "💙",
        rate: 0.70,
        min: 100,
        max: 5000,
        description: "Curtidas para seus tweets",
        speed: "Imediato"
    }
];

// Carregar serviços na página inicial
function loadServices() {
    const servicesGrid = document.getElementById('services-grid');
    if (!servicesGrid) return;

    // Mostrar apenas 6 serviços na página inicial
    const featuredServices = services.slice(0, 6);
    
    servicesGrid.innerHTML = featuredServices.map(service => `
        <div class="service-card">
            <div class="service-header">
                <span class="service-icon">${service.icon}</span>
                <h3 class="service-title">${service.name}</h3>
                <span class="service-category">${service.category}</span>
            </div>
            <div class="service-details">
                <div class="service-price">R$ ${service.rate.toFixed(2)}/unidade</div>
                <div class="service-range">${service.min} - ${service.max} unidades</div>
                <p class="service-description">${service.description}</p>
                <div class="service-speed">Velocidade: ${service.speed}</div>
                <button class="service-btn" onclick="redirectToDashboard()">
                    Comprar Agora
                </button>
            </div>
        </div>
    `).join('');
}

// Redirecionar para o dashboard
function redirectToDashboard() {
    const currentUser = JSON.parse(localStorage.getItem('boost_lives_current_user'));
    if (currentUser) {
        window.location.href = 'dashboard.html';
    } else {
        // Mostrar modal de login
        const loginModal = document.getElementById('login-modal');
        if (loginModal) {
            loginModal.style.display = 'flex';
        } else {
            window.location.href = 'cadastro.html';
        }
    }
}

// Carregar serviços quando a página carregar
document.addEventListener('DOMContentLoaded', loadServices);