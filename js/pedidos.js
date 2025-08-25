// No início do arquivo
class Pedidos {
    constructor() {
        this.authSystem = window.authSystem || new AuthSystem();
        this.currentUser = this.authSystem.getCurrentUser();
        
        // Verificação de autenticação
        if (!this.currentUser) {
            window.location.href = 'index.html';
            return;
        }
        
        this.services = {
            'live-points': { price: 0.80, min: 100, max: 10000 },
            // ... outros serviços
        };
        this.init();
    }
    // ... resto do código
}
// Verificação de autenticação
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('boost_lives_current_user'));
    if (!currentUser) {
        alert('Você precisa estar logado para acessar esta página!');
        window.location.href = 'index.html';
        return;
    }
});
// Verificação de autenticação
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('boost_lives_current_user'));
    if (!currentUser) {
        alert('Você precisa estar logado para acessar esta página!');
        window.location.href = 'index.html';
        return;
    }
});
// Pedidos functionality
class Pedidos {
    constructor() {
        this.authSystem = window.authSystem || new AuthSystem();
        this.currentUser = this.authSystem.getCurrentUser();
        this.services = {
            'live-points': { price: 0.80, min: 100, max: 10000 },
            'followers': { price: 1.50, min: 50, max: 5000 },
            'viewers': { price: 0.20, min: 1000, max: 50000 },
            'chat-points': { price: 0.80, min: 100, max: 10000 },
            'subscribers': { price: 2.00, min: 10, max: 1000 }
        };
        this.init();
    }

    init() {
        if (!this.currentUser) {
            window.location.href = 'index.html';
            return;
        }

        this.setupEventListeners();
        this.loadUserData();
        this.calculatePrice();
        this.setupCategoryButtons();
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

        // Form submission
        const orderForm = document.getElementById('order-form');
        if (orderForm) {
            orderForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.processOrder();
            });
        }

        // Quantity input
        const quantityInput = document.getElementById('quantity');
        if (quantityInput) {
            quantityInput.addEventListener('input', () => {
                this.validateQuantity();
                this.calculatePrice();
            });
        }

        // Service type change
        const serviceType = document.getElementById('service-type');
        if (serviceType) {
            serviceType.addEventListener('change', () => {
                this.updateServiceDetails();
                this.calculatePrice();
            });
        }

        // Checkbox changes
        const highQuality = document.getElementById('high-quality');
        if (highQuality) {
            highQuality.addEventListener('change', () => {
                this.calculatePrice();
            });
        }

        // Link validation
        const channelLink = document.getElementById('channel-link');
        if (channelLink) {
            channelLink.addEventListener('input', () => {
                this.validateLink();
            });
        }
    }

    loadUserData() {
        // Update user info
        const userAvatar = document.getElementById('user-avatar');
        const userName = document.getElementById('user-name');
        const sidebarBalance = document.getElementById('sidebar-balance');
        const summaryBalance = document.getElementById('summary-balance');

        if (userAvatar) userAvatar.textContent = this.currentUser.username.charAt(0).toUpperCase();
        if (userName) userName.textContent = this.currentUser.username;
        
        const balanceFormatted = `R$ ${this.currentUser.balance.toFixed(2)}`;
        if (sidebarBalance) sidebarBalance.textContent = balanceFormatted;
        if (summaryBalance) summaryBalance.textContent = balanceFormatted;
    }

    setupCategoryButtons() {
        const categoryButtons = document.querySelectorAll('.category-btn');
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const category = button.dataset.category;
                this.filterServicesByCategory(category);
            });
        });
    }

    filterServicesByCategory(category) {
        // Simulate category filtering
        this.showNotification(`Mostrando serviços de ${category}`, 'info');
        
        // Update service list (in a real app, this would filter from an API)
        const serviceType = document.getElementById('service-type');
        if (serviceType) {
            // Simulate loading new services
            setTimeout(() => {
                this.showNotification(`Serviços de ${category} carregados!`, 'success');
            }, 500);
        }
    }

    validateQuantity() {
        const quantityInput = document.getElementById('quantity');
        const serviceType = document.getElementById('service-type').value;
        const quantity = parseInt(quantityInput.value) || 0;
        
        if (!serviceType) {
            quantityInput.setCustomValidity('Selecione um serviço primeiro');
            return;
        }

        const service = this.services[serviceType];
        if (quantity < service.min) {
            quantityInput.setCustomValidity(`Quantidade mínima: ${service.min}`);
        } else if (quantity > service.max) {
            quantityInput.setCustomValidity(`Quantidade máxima: ${service.max}`);
        } else {
            quantityInput.setCustomValidity('');
        }
    }

    validateLink() {
        const linkInput = document.getElementById('channel-link');
        const link = linkInput.value;
        
        if (link && !link.includes('twitch.tv')) {
            linkInput.setCustomValidity('Por favor, insira um link válido da Twitch');
        } else {
            linkInput.setCustomValidity('');
        }
    }

    updateServiceDetails() {
        const serviceType = document.getElementById('service-type');
        const quantityInput = document.getElementById('quantity');
        
        if (!serviceType.value) return;

        const service = this.services[serviceType.value];
        quantityInput.min = service.min;
        quantityInput.max = service.max;
        quantityInput.value = service.min;
        
        // Update quantity range display
        const quantityRange = quantityInput.parentElement.querySelector('.quantity-range');
        if (quantityRange) {
            quantityRange.innerHTML = `<span>Mín: ${service.min}</span><span>Máx: ${service.max}</span>`;
        }
    }

    calculatePrice() {
        const serviceType = document.getElementById('service-type').value;
        const quantityInput = document.getElementById('quantity');
        const highQuality = document.getElementById('high-quality').checked;
        
        if (!serviceType) {
            this.showNotification('Selecione um tipo de serviço', 'error');
            return;
        }

        const quantity = parseInt(quantityInput.value) || this.services[serviceType].min;
        let unitPrice = this.services[serviceType].price;
        
        // Apply quality premium
        if (highQuality) {
            unitPrice *= 1.2; // 20% increase
        }

        const totalPrice = quantity * unitPrice;
        const formattedUnitPrice = `R$ ${unitPrice.toFixed(2).replace('.', ',')}`;
        const formattedTotal = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;

        // Update summary
        document.getElementById('summary-quantity').textContent = quantity.toLocaleString('pt-BR');
        document.getElementById('summary-price').textContent = formattedUnitPrice;
        document.getElementById('summary-total').textContent = formattedTotal;

        return totalPrice;
    }

    processOrder() {
        const linkInput = document.getElementById('channel-link');
        const serviceType = document.getElementById('service-type');
        const quantityInput = document.getElementById('quantity');
        
        // Validate form
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

        if (!serviceType.value) {
            this.showNotification('Por favor, selecione um tipo de serviço', 'error');
            serviceType.focus();
            return;
        }

        const quantity = parseInt(quantityInput.value);
        const service = this.services[serviceType.value];
        
        if (quantity < service.min || quantity > service.max) {
            this.showNotification(`Quantidade deve ser entre ${service.min} e ${service.max}`, 'error');
            quantityInput.focus();
            return;
        }

        const totalPrice = this.calculatePrice();
        
        // Check balance
        if (this.currentUser.balance < totalPrice) {
            this.showNotification('Saldo insuficiente! Por favor, adicione créditos.', 'error');
            return;
        }

        // Simulate order processing
        this.showNotification('Processando seu pedido...', 'info');

        // Generate random order ID
        const orderId = '#' + Math.floor(100000 + Math.random() * 900000);

        setTimeout(() => {
            // Update confirmation modal
            document.getElementById('confirmation-id').textContent = orderId;
            document.getElementById('confirmation-quantity').textContent = 
                quantity.toLocaleString('pt-BR') + ' unidades';
            document.getElementById('confirmation-total').textContent = 
                'R$ ' + totalPrice.toFixed(2).replace('.', ',');

            // Show confirmation modal
            this.showModal('confirmation-modal');

            // Save order to history
            this.saveOrder(orderId, serviceType.value, quantity, totalPrice);

            // Update user balance
            this.authSystem.updateUserBalance(-totalPrice);
            this.loadUserData();

        }, 2000);
    }

    saveOrder(orderId, serviceType, quantity, totalPrice) {
        const orders = JSON.parse(localStorage.getItem('boost_lives_orders')) || [];
        
        const order = {
            id: orderId,
            userId: this.currentUser.id,
            service: serviceType,
            link: document.getElementById('channel-link').value,
            quantity: quantity,
            cost: totalPrice,
            status: 'processing',
            createdAt: new Date().toISOString(),
            category: 'twitch'
        };

        orders.push(order);
        localStorage.setItem('boost_lives_orders', JSON.stringify(orders));
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

// Global functions
function calculatePrice() {
    if (window.pedidos) {
        window.pedidos.calculatePrice();
    }
}

function closeModal(modalId) {
    if (window.pedidos) {
        window.pedidos.closeModal(modalId);
    }
}

// Initialize pedidos when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.pedidos = new Pedidos();
});