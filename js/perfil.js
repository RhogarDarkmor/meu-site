// Fecha qualquer modal ao pressionar ESC (compatível cross-browser)
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) {
        document.querySelectorAll('.modal').forEach(modal => {
            if (getComputedStyle(modal).display !== 'none') {
                modal.style.display = 'none';
            }
        });
    }
});
// Perfil functionality
// Perfil functionality com Firebase Auth
class Profile {
    constructor(user) {
        // Garante que o usuário sempre tenha um saldo definido
        this.currentUser = {
            ...user,
            balance: typeof user.balance === 'number' ? user.balance : 0
        };
        this.orders = JSON.parse(localStorage.getItem('boost_lives_orders')) || [];
        this.transactions = JSON.parse(localStorage.getItem('boost_lives_transactions')) || [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadProfileData();
        this.loadUserStats();
        this.loadUserOrders();
        this.loadUserTransactions();
        this.setupTabs();
    }

    setupEventListeners() {
        // Logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                try {
                    await firebase.auth().signOut();
                    window.location.href = 'index.html';
                } catch (error) {
                    alert('Erro ao sair da conta!');
                }
            });
        }
        // ...existing code...
        document.querySelectorAll('.payment-method').forEach(method => {
            method.addEventListener('click', () => {
                document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('selected'));
                method.classList.add('selected');
            });
        });
        document.querySelectorAll('.amount-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                document.getElementById('custom-amount').value = btn.dataset.amount;
            });
        });
        const customAmount = document.getElementById('custom-amount');
        if (customAmount) {
            customAmount.addEventListener('input', () => {
                document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('selected'));
            });
        }
        const orderFilter = document.getElementById('order-filter');
        if (orderFilter) {
            orderFilter.addEventListener('change', () => {
                this.loadUserOrders();
            });
        }
        const transactionFilter = document.getElementById('transaction-filter');
        if (transactionFilter) {
            transactionFilter.addEventListener('change', () => {
                this.loadUserTransactions();
            });
        }
    }

    loadProfileData() {
        // Atualiza info do usuário
        const email = this.currentUser.email;
        document.getElementById('profile-username').textContent = email.split('@')[0];
        document.getElementById('profile-email').textContent = email;
        document.getElementById('user-name').textContent = email.split('@')[0];
        // Avatar
        const avatarLetter = email.charAt(0).toUpperCase();
        document.getElementById('user-avatar').textContent = avatarLetter;
        document.getElementById('profile-avatar').textContent = avatarLetter;
        // Data fictícia
        const joinDate = new Date().toLocaleDateString('pt-BR', {
            month: 'long',
            year: 'numeric'
        });
        document.getElementById('profile-join-date').textContent = `Membro desde ${joinDate}`;
    }

    loadUserStats() {
        const userOrders = this.orders.filter(order => order.userId === this.currentUser.id);
        const userTransactions = this.transactions.filter(t => t.userId === this.currentUser.id);
        
        // Calculate totals
        const totalSpent = userOrders.reduce((total, order) => total + order.cost, 0);
        const completedOrders = userOrders.filter(order => order.status === 'completed').length;
        const deposits = userTransactions.filter(t => t.type === 'deposit').reduce((total, t) => total + t.amount, 0);
        
    // Update stats com fallback seguro
    const balance = typeof this.currentUser.balance === 'number' ? this.currentUser.balance : 0;
    document.getElementById('balance-available').textContent = `R$ ${balance.toFixed(2)}`;
    document.getElementById('total-spent').textContent = `R$ ${totalSpent.toFixed(2)}`;
    document.getElementById('total-orders').textContent = userOrders.length;
    document.getElementById('completed-orders').textContent = completedOrders;
    }

    loadUserOrders() {
        const ordersContainer = document.getElementById('orders-list');
        const filter = document.getElementById('order-filter').value;
        
        let userOrders = this.orders.filter(order => order.userId === this.currentUser.id);
        
        // Apply filter
        if (filter !== 'all') {
            userOrders = userOrders.filter(order => order.status === filter);
        }
        
        // Sort by date (newest first)
        userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        if (userOrders.length === 0) {
            ordersContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📦</div>
                    <div class="empty-state-text">Nenhum pedido encontrado</div>
                    <p>${filter !== 'all' ? `Nenhum pedido com status "${filter}"` : 'Faça seu primeiro pedido para começar!'}</p>
                </div>
            `;
            return;
        }
        
        ordersContainer.innerHTML = userOrders.map(order => {
            const service = this.getServiceById(order.serviceId);
            return `
                <div class="order-item">
                    <div class="order-header">
                        <span class="order-id">#${order.id.toString().slice(-6)}</span>
                        <span class="order-date">${new Date(order.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div class="order-details">
                        <div class="order-service">${service ? service.name : 'Serviço não encontrado'}</div>
                        <div class="order-quantity">${order.quantity} unidades</div>
                        <div class="order-cost">R$ ${order.cost.toFixed(2)}</div>
                        <div class="order-status status-${order.status}">${this.getStatusText(order.status)}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    loadUserTransactions() {
        const transactionsContainer = document.getElementById('transactions-list');
        const filter = document.getElementById('transaction-filter').value;
        
        let userTransactions = this.transactions.filter(t => t.userId === this.currentUser.id);
        
        // Apply filter
        if (filter !== 'all') {
            userTransactions = userTransactions.filter(t => t.type === filter);
        }
        
        // Sort by date (newest first)
        userTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (userTransactions.length === 0) {
            transactionsContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">💳</div>
                    <div class="empty-state-text">Nenhuma transação encontrada</div>
                    <p>${filter !== 'all' ? `Nenhuma transação do tipo "${filter}"` : 'Suas transações aparecerão aqui'}</p>
                </div>
            `;
            return;
        }
        
        transactionsContainer.innerHTML = userTransactions.map(transaction => {
            return `
                <div class="transaction-item transaction-${transaction.type}">
                    <div class="transaction-icon">
                        ${transaction.type === 'deposit' ? '📥' : transaction.type === 'purchase' ? '📦' : '↩️'}
                    </div>
                    <div class="transaction-info">
                        <h3>${this.getTransactionDescription(transaction)}</h3>
                        <p>${new Date(transaction.date).toLocaleDateString('pt-BR')} • ${transaction.id.slice(-8)}</p>
                    </div>
                    <div class="transaction-amount">
                        ${transaction.type === 'deposit' ? '+' : '-'}R$ ${transaction.amount.toFixed(2)}
                    </div>
                </div>
            `;
        }).join('');
    }

    getServiceById(serviceId) {
        // This would come from your services data
        const services = [
            { id: 1, name: "Seguidores Instagram" },
            { id: 2, name: "Curtidas Instagram" },
            { id: 3, name: "Visualizações Instagram" },
            { id: 4, name: "Seguidores TikTok" },
            { id: 5, name: "Visualizações TikTok" }
        ];
        return services.find(s => s.id === serviceId);
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

    getTransactionDescription(transaction) {
        const descriptions = {
            'deposit': 'Depósito de saldo',
            'purchase': 'Compra de serviços',
            'refund': 'Reembolso de pedido'
        };
        return transaction.description || descriptions[transaction.type] || 'Transação';
    }

    setupTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons and contents
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked button
                btn.classList.add('active');
                
                // Show corresponding content
                const tabId = btn.dataset.tab + '-tab';
                document.getElementById(tabId).classList.add('active');
            });
        });
    }

    processPayment() {
        const selectedMethod = document.querySelector('.payment-method.selected');
        const amountInput = document.getElementById('custom-amount');
        const amount = parseFloat(amountInput.value);
        
        if (!selectedMethod || !amount || amount < 10) {
            this.showNotification('Selecione um método de pagamento e um valor válido (mínimo R$ 10,00)', 'error');
            return;
        }
        
        const method = selectedMethod.dataset.method;
        
        // Simulate payment processing
        this.showNotification(`Processando pagamento ${method.toUpperCase()}...`, 'success');
        
        setTimeout(() => {
            // Create transaction
            const newTransaction = {
                id: 'tx_' + Date.now(),
                userId: this.currentUser.id,
                type: 'deposit',
                amount: amount,
                method: method,
                description: `Depósito via ${method.toUpperCase()}`,
                date: new Date().toISOString(),
                status: 'completed'
            };
            
            // Save transaction
            this.transactions.push(newTransaction);
            localStorage.setItem('boost_lives_transactions', JSON.stringify(this.transactions));
            
            // Update user balance
            this.authSystem.updateUserBalance(amount);
            this.currentUser = this.authSystem.getCurrentUser();
            
            // Update UI
            this.loadUserStats();
            this.closeModal('add-funds-modal');
            this.showNotification(`R$ ${amount.toFixed(2)} adicionados com sucesso!`, 'success');
        }, 2000);
    }

    showAddFundsModal() {
        this.showModal('add-funds-modal');
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
function showAddFundsModal() {
    if (window.profile && typeof window.profile.showAddFundsModal === 'function') {
        window.profile.showAddFundsModal();
    } else {
        // fallback direto
        const modal = document.getElementById('add-funds-modal');
        if (modal) modal.style.display = 'flex';
    }
}

function closeModal(modalId) {
    if (window.profile) {
        window.profile.closeModal(modalId);
    }
}

function processPayment() {
    if (window.profile) {
        window.profile.processPayment();
    }
}

function editAvatar() {
    alert('Funcionalidade de editar avatar será implementada em breve!');
}

function enableEdit(fieldId) {
    const input = document.getElementById(fieldId);
    input.disabled = false;
    input.focus();
}

function updateProfile() {
    alert('Funcionalidade de atualizar perfil será implementada em breve!');
}

// Inicializa profile com usuário do Firebase
document.addEventListener('DOMContentLoaded', () => {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            window.profile = new Profile(user);
            // Garante que o botão "Adicionar Saldo" funcione mesmo se onclick falhar
            const addFundsBtn = document.querySelector('.btn.btn-secondary');
            if (addFundsBtn) {
                addFundsBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    showAddFundsModal();
                });
            }
        } else {
            window.location.href = 'index.html';
        }
    });
});