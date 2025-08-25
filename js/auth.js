
// Sistema de autenticação
class AuthSystem {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('boost_lives_current_user')) || null;
        this.users = JSON.parse(localStorage.getItem('boost_lives_users')) || [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateUI();
        this.setupPasswordStrength();
        this.checkRedirect();
    }

    checkRedirect() {
        // Se o usuário está logado e está na página inicial, redirecionar para o perfil
        if (this.currentUser && window.location.pathname.endsWith('index.html')) {
            setTimeout(() => {
                window.location.href = 'perfil.html';
            }, 500);
        }
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Register form
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }

        // Logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }

        // Login link
        const loginLink = document.getElementById('login-link');
        if (loginLink) {
            loginLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLoginModal();
            });
        }
    }

    setupPasswordStrength() {
        const passwordInput = document.getElementById('password');
        const strengthBar = document.querySelector('.strength-bar');
        const requirements = document.querySelectorAll('.requirement');

        if (passwordInput && strengthBar) {
            passwordInput.addEventListener('input', () => {
                const password = passwordInput.value;
                this.checkPasswordStrength(password, strengthBar, requirements);
            });
        }
    }

    checkPasswordStrength(password, strengthBar, requirements) {
        let strength = 0;
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[^A-Za-z0-9]/.test(password)
        };

        // Atualizar requisitos
        requirements.forEach(req => {
            const type = req.dataset.type;
            if (checks[type]) {
                req.classList.add('met');
                req.classList.remove('unmet');
                strength++;
            } else {
                req.classList.remove('met');
                req.classList.add('unmet');
            }
        });

        // Atualizar barra de força
        const percentage = (strength / 5) * 100;
        strengthBar.style.width = percentage + '%';

        if (strength <= 2) {
            strengthBar.className = 'strength-bar strength-weak';
        } else if (strength <= 4) {
            strengthBar.className = 'strength-bar strength-medium';
        } else {
            strengthBar.className = 'strength-bar strength-strong';
        }
    }

    handleLogin() {
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        if (!username || !password) {
            this.showNotification('Por favor, preencha todos os campos', 'error');
            return;
        }

        // Simular verificação (em produção seria uma API)
        const user = this.users.find(u => 
            (u.username === username || u.email === username) && u.password === password
        );

        if (user) {
            this.currentUser = {
                id: user.id,
                username: user.username,
                email: user.email,
                balance: user.balance || 0
            };
            
            localStorage.setItem('boost_lives_current_user', JSON.stringify(this.currentUser));
            
            this.showNotification('Login realizado com sucesso!', 'success');
            this.closeModals();
            this.updateUI();
            
            // Redirecionar para o perfil após breve delay
            setTimeout(() => {
                window.location.href = 'perfil.html';
            }, 1000);
        } else {
            this.showNotification('Usuário ou senha incorretos', 'error');
        }
    }

    handleRegister() {
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validações
        if (!username || !email || !password || !confirmPassword) {
            this.showNotification('Por favor, preencha todos os campos', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showNotification('As senhas não coincidem', 'error');
            return;
        }

        if (password.length < 6) {
            this.showNotification('A senha deve ter pelo menos 6 caracteres', 'error');
            return;
        }

        // Verificar se usuário já existe
        if (this.users.some(u => u.username === username)) {
            this.showNotification('Este nome de usuário já está em uso', 'error');
            return;
        }

        if (this.users.some(u => u.email === email)) {
            this.showNotification('Este e-mail já está cadastrado', 'error');
            return;
        }

        // Criar novo usuário
        const newUser = {
            id: Date.now(),
            username,
            email,
            password,
            balance: 0,
            joinDate: new Date().toISOString(),
            orders: []
        };

        this.users.push(newUser);
        localStorage.setItem('boost_lives_users', JSON.stringify(this.users));

        this.showNotification('Conta criada com sucesso! Redirecionando...', 'success');
        
        // Auto-login e redirecionamento
        setTimeout(() => {
            this.currentUser = {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                balance: newUser.balance
            };
            
            localStorage.setItem('boost_lives_current_user', JSON.stringify(this.currentUser));
            window.location.href = 'perfil.html';
        }, 1500);
    }

    handleLogout() {
        this.currentUser = null;
        localStorage.removeItem('boost_lives_current_user');
        this.showNotification('Logout realizado com sucesso', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }

    showLoginModal() {
        const modal = document.getElementById('login-modal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    closeModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }

    updateUI() {
        const currentUser = this.currentUser;
        const loginLink = document.getElementById('login-link');
        
        if (currentUser && loginLink) {
            loginLink.textContent = currentUser.username;
            loginLink.href = 'perfil.html';
            loginLink.onclick = null; // Remove o evento de abrir modal
        }
        
        // Atualizar user info se estiver na página de perfil
        const userNameElement = document.getElementById('user-name');
        const userAvatarElement = document.getElementById('user-avatar');
        
        if (currentUser && userNameElement) {
            userNameElement.textContent = currentUser.username;
        }
        
        if (currentUser && userAvatarElement) {
            userAvatarElement.textContent = currentUser.username.charAt(0).toUpperCase();
        }
    }

    showNotification(message, type = 'success') {
        if (window.boostLives && window.boostLives.showNotification) {
            window.boostLives.showNotification(message, type);
        } else {
            alert(message);
        }
    }

    getCurrentUser() {
        return this.currentUser;
    }

    updateUserBalance(amount) {
        if (!this.currentUser) return false;

        const users = JSON.parse(localStorage.getItem('boost_lives_users')) || [];
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        
        if (userIndex !== -1) {
            users[userIndex].balance += amount;
            this.currentUser.balance = users[userIndex].balance;
            
            localStorage.setItem('boost_lives_users', JSON.stringify(users));
            localStorage.setItem('boost_lives_current_user', JSON.stringify(this.currentUser));
            
            this.updateUI();
            return true;
        }
        
        return false;
    }
}

// Inicializar sistema de autenticação
document.addEventListener('DOMContentLoaded', () => {
    window.authSystem = new AuthSystem();
});