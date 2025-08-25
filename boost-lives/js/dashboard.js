// Dashboard functionality
class Dashboard {
    constructor() {
        this.authSystem = window.authSystem || new AuthSystem();
        this.currentUser = this.authSystem.getCurrentUser();
        this.orders = JSON.parse(localStorage.getItem('boost_lives_orders')) || [];
        this.services = window.services || [];
        this.init();
    }

    init() {
        if (!this.currentUser) {
            window.location.href = 'index.html';
            return;
        }

        this.setupEventListeners();
        this.loadDashboardData();
        this.loadUserOrders();
        this.setupServiceSelection();
        this.setupPaymentMethods();
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

        // Add funds
        const addFundsBtn = document.getElementById('add-funds-btn');
        if (addFundsBtn) {
            addFundsBtn.addEventListener('click', () => {
                this.showAddFundsModal();
            });
        }

        // New order form
        const orderForm = document.getElementById('new-order-form');
        if (orderForm) {
            orderForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewOrder();
            });
        }

        // PIX payment
        const pixPaymentBtn = document.getElementById('pix-payment-btn');
        if (pixPaymentBtn) {
            pixPaymentBtn.addEventListener('click', () => {
                this.handlePIXPayment();
            });
        }

        // Close modals
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeModals();
            });
        });
    }

    loadDashboardData() {
        this.updateUserInfo();
        this.updateStats();
    }

    updateUserInfo() {
        const userBalance = document.getElementById('user-balance');
        const userName = document.getElementById('user-name');
        const userSince = document.getElementById('user-since');

        if (userBalance) {
            userBalance.textContent = `R$ ${this.currentUser.balance.toFixed(2)}`;
        }

        if (userName) {
            userName.textContent = this.currentUser.username;
        }

        if (userSince) {
            // Data de cadastro fictícia para demonstração
            userSince.textContent = 'Membro desde Jan 2024';
        }
    }

    updateStats() {
        const userOrders = this.orders.filter(order => order.userId === this.currentUser.id);
        
        document.getElementById('total-orders').textContent = userOrders.length;
        document.getElementById('completed-orders').textContent = 
            userOrders.filter(o => o.status === 'completed').length;
        document.getElementById('pending-orders').textContent = 
            userOrders.filter(o => o.status === 'pending').length;
        document.getElementById('total-spent').textContent = 
            `R$ ${userOrders.reduce((total, order) => total + order.cost, 0).toFixed(2)}`;
    }

    loadUserOrders() {
        const ordersContainer = document.getElementById('orders-container');
        const userOrders = this.orders.filter(order => order.userId === this.currentUser.id);
        
        if (userOrders.length === 0) {
            ordersContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📝</div>
                    <div class="empty-state-text">Nenhum pedido encontrado</div>
                    <p>Faça seu primeiro pedido para começar!</p>
                </div>
            `;
            return;
        }

        // Ordenar por data (mais recente primeiro)
        userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        ordersContainer.innerHTML = userOrders.slice(0, 5).map(order => {
            const service = this.services.find(s => s.id === order.serviceId);
            return `
                <tr>
                    <td>#${order.id.toString().slice(-6)}</td>
                    <td>${service ? service.name : 'Serviço não encontrado'}</td>
                    <td>${order.quantity}</td>
                    <td>R$ ${order.cost.toFixed(2)}</td>
                    <td><span class="order-status status-${order.status}">${this.getStatusText(order.status)}</span></td>
                    <td>${new Date(order.createdAt).toLocaleDateString('pt-BR')}</td>
                </tr>
            `;
        }).join('');
    }

    getStatusText(status) {
        const statusMap = {
            'pending': 'Pendente',
            'processing': 'Processando',
            'completed': 'Concluído',
            'cancelled': 'Cancelado'
        };
        return statusMap[status] || status;
    }

    setupServiceSelection() {
        const serviceSelect = document.getElementById('service-select');
        if (!serviceSelect) return;

        serviceSelect.innerHTML = '<option value="">Selecione um serviço</option>' +
            this.services.map(service => `
                <option value="${service.id}" data-rate="${service.rate}" data-min="${service.min}" data-max="${service.max}">
                    ${service.name} - R$ ${service.rate.toFixed(2)}/unidade
                </option>
            `).join('');

        serviceSelect.addEventListener('change', (e) => {
            this.updateOrderCalculation();
        });

        // Listen for quantity changes
        const quantityInput = document.getElementById('order-quantity');
        if (quantityInput) {
            quantityInput.addEventListener('input', () => {
                this.updateOrderCalculation();
            });
        }
    }

    updateOrderCalculation() {
        const serviceSelect = document.getElementById('service-select');
        const quantityInput = document.getElementById('order-quantity');
        const totalCost = document.getElementById('order-total');
        
        if (!serviceSelect || !quantityInput || !totalCost) return;

        const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
        if (!selectedOption.value) return;

        const rate = parseFloat(selectedOption.dataset.rate);
        const min = parseInt(selectedOption.dataset.min);
        const max = parseInt(selectedOption.dataset.max);
        const quantity = parseInt(quantityInput.value) || 0;

        // Validate quantity
        if (quantity < min) {
            quantityInput.setCustomValidity(`Quantidade mínima: ${min}`);
        } else if (quantity > max) {
            quantityInput.setCustomValidity(`Quantidade máxima: ${max}`);
        } else {
            quantityInput.setCustomValidity('');
        }

        // Calculate total
        const total = rate * quantity;
        totalCost.textContent = `R$ ${total.toFixed(2)}`;
    }

    handleNewOrder() {
        const serviceSelect = document.getElementById('service-select');
        const linkInput = document.getElementById('order-link');
        const quantityInput = document.getElementById('order-quantity');
        
        if (!serviceSelect.value || !linkInput.value || !quantityInput.value) {
            this.showNotification('Por favor, preencha todos os campos', 'error');
            return;
        }

        const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
        const rate = parseFloat(selectedOption.dataset.rate);
        const quantity = parseInt(quantityInput.value);
        const totalCost = rate * quantity;

        if (totalCost > this.currentUser.balance) {
            this.showNotification('Saldo insuficiente. Por favor, adicione créditos.', 'error');
            return;
        }

        // Create new order
        const newOrder = {
            id: Date.now(),
            userId: this.currentUser.id,
            serviceId: parseInt(serviceSelect.value),
            link: linkInput.value,
            quantity: quantity,
            cost: totalCost,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Update user balance
        this.authSystem.updateUserBalance(-totalCost);

        // Save order
        this.orders.push(newOrder);
        localStorage.setItem('boost_lives_orders', JSON.stringify(this.orders));

        this.showNotification('Pedido criado com sucesso!', 'success');
        
        // Reset form and update UI
        document.getElementById('new-order-form').reset();
        this.updateStats();
        this.loadUserOrders();
        
        // Simulate order processing
        setTimeout(() => {
            this.simulateOrderProcessing(newOrder.id);
        }, 2000);
    }

    simulateOrderProcessing(orderId) {
        const orderIndex = this.orders.findIndex(o => o.id === orderId);
        if (orderIndex === -1) return;

        // Update to processing
        this.orders[orderIndex].status = 'processing';
        this.orders[orderIndex].updatedAt = new Date().toISOString();
        localStorage.setItem('boost_lives_orders', JSON.stringify(this.orders));
        this.loadUserOrders();

        // Simulate completion
        setTimeout(() => {
            const orderIndex = this.orders.findIndex(o => o.id === orderId);
            if (orderIndex !== -1) {
                this.orders[orderIndex].status = 'completed';
                this.orders[orderIndex].updatedAt = new Date().toISOString();
                localStorage.setItem('boost_lives_orders', JSON.stringify(this.orders));
                this.loadUserOrders();
                this.showNotification(`Pedido #${orderId.toString().slice(-6)} concluído!`, 'success');
            }
        }, 10000);
    }

    showAddFundsModal() {
        const modal = document.getElementById('add-funds-modal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    setupPaymentMethods() {
        const paymentMethods = document.querySelectorAll('.payment-method');
        paymentMethods.forEach(method => {
            method.addEventListener('click', () => {
                paymentMethods.forEach(m => m.classList.remove('selected'));
                method.classList.add('selected');
            });
        });
    }

    handlePIXPayment() {
        const amountInput = document.getElementById('pix-amount');
        const amount = parseFloat(amountInput.value);

        if (!amount || amount < 10) {
            this.showNotification('Valor mínimo: R$ 10,00', 'error');
            return;
        }

        // Simulate PIX payment
        this.showNotification('Processando pagamento PIX...', 'success');
        
        setTimeout(() => {
            this.authSystem.updateUserBalance(amount);
            this.showNotification(`R$ ${amount.toFixed(2)} adicionados à sua conta!`, 'success');
            this.closeModals();
        }, 2000);
    }

    closeModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }

    showNotification(message, type = 'success') {
        if (window.boostLives && window.boostLives.showNotification) {
            window.boostLives.showNotification(message, type);
        } else {
            alert(message);
        }
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Load services first
    if (typeof loadServices === 'function') {
        loadServices();
    }
    
    // Initialize dashboard
    window.dashboard = new Dashboard();
});