// Verificação de autenticação imediata
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('boost_lives_current_user'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
});
// Pedido functionality
class Pedido {
    constructor() {
        this.authSystem = window.authSystem || new AuthSystem();
        this.currentUser = this.authSystem.getCurrentUser();
        this.init();
    }

    init() {
        if (!this.currentUser) {
            window.location.href = 'index.html';
            return;
        }

        this.setupEventListeners();
        this.loadOrderData();
        this.setupRealTimeUpdates();
    }

    setupEventListeners() {
        // Logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.authSystem.handleLogout();
            });
        }

        // Quantity input validation
        const quantityInput = document.getElementById('order-quantity');
        if (quantityInput) {
            quantityInput.addEventListener('input', () => {
                this.validateQuantity();
                this.calculatePrice();
            });
        }

        // Link validation
        const linkInput = document.getElementById('order-link');
        if (linkInput) {
            linkInput.addEventListener('input', () => {
                this.validateLink();
            });
        }

        // Search functionality
        const searchBtn = document.querySelector('.search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.searchCategory();
            });
        }

        const searchInput = document.getElementById('category-search');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchCategory();
                }
            });
        }
    }

    loadOrderData() {
        // Load user data
        document.getElementById('order-client').textContent = this.currentUser.username;
        
        // Generate random order ID
        const orderId = '#' + Math.floor(100000 + Math.random() * 900000);
        document.getElementById('order-id').textContent = orderId;
        document.getElementById('modal-order-id').textContent = orderId;
        
        // Set current date and time
        const now = new Date();
        const formattedDate = now.toLocaleDateString('pt-BR') + ' às ' + now.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
        document.getElementById('order-date').textContent = formattedDate;
        
        // Set initial quantity and price
        this.calculatePrice();
    }

    validateQuantity() {
        const quantityInput = document.getElementById('order-quantity');
        const quantity = parseInt(quantityInput.value) || 0;
        
        if (quantity < 30) {
            quantityInput.setCustomValidity('Quantidade mínima: 30 minutos');
        } else if (quantity > 60) {
            quantityInput.setCustomValidity('Quantidade máxima: 60 minutos');
        } else {
            quantityInput.setCustomValidity('');
        }
    }

    validateLink() {
        const linkInput = document.getElementById('order-link');
        const link = linkInput.value;
        
        if (link && !link.includes('twitch.tv')) {
            linkInput.setCustomValidity('Por favor, insira um link válido da Twitch');
        } else {
            linkInput.setCustomValidity('');
        }
    }

    calculatePrice() {
        const quantityInput = document.getElementById('order-quantity');
        const quantity = parseInt(quantityInput.value) || 30;
        const pricePerMinute = 3.33; // R$ 100,00 / 30 minutos
        
        const totalPrice = quantity * pricePerMinute;
        const formattedPrice = 'R$ ' + totalPrice.toFixed(2).replace('.', ',');
        
        document.getElementById('order-value').textContent = formattedPrice;
        document.getElementById('order-value-input').value = formattedPrice;
        document.getElementById('modal-value').textContent = formattedPrice;
        document.getElementById('modal-quantity').textContent = quantity + ' minutos';
    }

    searchCategory() {
        const searchInput = document.getElementById('category-search');
        const searchTerm = searchInput.value.toLowerCase();
        
        if (searchTerm) {
            this.showNotification(`Buscando por: ${searchTerm}`, 'info');
            // Simulate search delay
            setTimeout(() => {
                this.showNotification('Categoria encontrada: TWITCH Live BR', 'success');
            }, 1000);
        }
    }

    processOrder() {
        const linkInput = document.getElementById('order-link');
        const quantityInput = document.getElementById('order-quantity');
        
        if (!linkInput.value) {
            this.showNotification('Por favor, insira o link da Twitch', 'error');
            linkInput.focus();
            return;
        }
        
        if (!linkInput.value.includes('twitch.tv')) {
            this.showNotification('Por favor, insira um link válido da Twitch', 'error');
            linkInput.focus();
            return;
        }
        
        const quantity = parseInt(quantityInput.value) || 30;
        if (quantity < 30 || quantity > 60) {
            this.showNotification('Quantidade deve ser entre 30 e 60 minutos', 'error');
            quantityInput.focus();
            return;
        }
        
        // Simulate order processing
        this.showNotification('Processando seu pedido...', 'info');
        
        setTimeout(() => {
            this.showModal('confirmation-modal');
            this.saveOrderToHistory();
        }, 2000);
    }

    saveOrderToHistory() {
        // Get existing orders or initialize empty array
        const orders = JSON.parse(localStorage.getItem('boost_lives_orders')) || [];
        
        const newOrder = {
            id: document.getElementById('order-id').textContent.replace('#', ''),
            userId: this.currentUser.id,
            service: 'Live BR (Pontos BR 100% Live)',
            link: document.getElementById('order-link').value,
            quantity: parseInt(document.getElementById('order-quantity').value),
            cost: parseFloat(document.getElementById('order-value-input').value.replace('R$ ', '').replace(',', '.')),
            status: 'processing',
            createdAt: new Date().toISOString(),
            category: 'TWITCH Live BR (Pontos BR 100% Qualidade)'
        };
        
        orders.push(newOrder);
        localStorage.setItem('boost_lives_orders', JSON.stringify(orders));
        
        // Update user balance
        const cost = newOrder.cost;
        if (this.currentUser.balance >= cost) {
            this.authSystem.updateUserBalance(-cost);
        } else {
            this.showNotification('Saldo insuficiente! Por favor, adicione créditos.', 'error');
        }
    }

    setupRealTimeUpdates() {
        // Simulate real-time updates for demonstration
        setInterval(() => {
            this.updateOrderStatus();
        }, 30000); // Update every 30 seconds
    }

    updateOrderStatus() {
        // This would connect to a real API in production
        console.log('Verificando atualizações do pedido...');
    }

    showModal(modalId) {
        document.getElementById(modalId).style.display = 'flex';
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    showNotification(message, type = 'success') {
        if (window.boostLives && window.boostLives.showNotification) {
            window.boostLives.showNotification(message, type);
        } else {
            alert(message);
        }
    }
}

// Global functions for HTML onclick attributes
function processOrder() {
    if (window.pedido) {
        window.pedido.processOrder();
    }
}

function closeModal(modalId) {
    if (window.pedido) {
        window.pedido.closeModal(modalId);
    }
}

function shareOrder() {
    const orderId = document.getElementById('order-id').textContent;
    const orderDetails = `Confira meu pedido ${orderId} no Boost Lives!`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Meu Pedido - Boost Lives',
            text: orderDetails,
            url: window.location.href
        }).catch(() => {
            alert('Pedido copiado para a área de transferência!');
        });
    } else {
        navigator.clipboard.writeText(orderDetails);
        alert('Pedido copiado para a área de transferência!');
    }
}

// Initialize pedido when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.pedido = new Pedido();
});