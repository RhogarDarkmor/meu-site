// Serviços disponíveis focados em lives na Twitch
const services = [
    {
        id: 1,
    name: "Viewers para Lives na Twitch",
        category: "Twitch",
        icon: "🎬",
        rate: 2.50,
        min: 10,
        max: 5000,
        description: "Aumente o número de espectadores simultâneos em sua live na Twitch de forma segura e realista.",
        speed: "Instantâneo"
    },
    {
        id: 2,
        name: "Seguidores para Twitch",
        category: "Twitch",
        icon: "👥",
        rate: 1.80,
        min: 10,
        max: 10000,
        description: "Ganhe seguidores reais e aumente sua base de fãs na Twitch.",
        speed: "Rápido"
    },
    {
        id: 3,
    name: "Engajamento no Chat da Twitch",
        category: "Twitch",
        icon: "💬",
        rate: 3.00,
        min: 5,
        max: 500,
        description: "Receba mensagens e interação no chat para lives mais animadas e engajadas.",
        speed: "Durante a live"
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