// Funções principais do site
class BoostLives {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupFAQ();
        this.checkAuthStatus();
        this.setupMobileMenu();
        this.setupAnimations();
    }

    setupEventListeners() {
        // Fechar modal com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModals();
            }
        });

        // Fechar modal clicando fora
        document.addEventListener('click', (e) => {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });
    }

    setupFAQ() {
        const faqQuestions = document.querySelectorAll('.faq-question');
        
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const answer = question.nextElementSibling;
                const toggle = question.querySelector('.faq-toggle');
                
                // Fechar outras respostas
                document.querySelectorAll('.faq-answer').forEach(item => {
                    if (item !== answer && item.classList.contains('active')) {
                        item.classList.remove('active');
                        item.previousElementSibling.querySelector('.faq-toggle').textContent = '+';
                    }
                });
                
                // Alternar resposta atual
                answer.classList.toggle('active');
                toggle.textContent = answer.classList.contains('active') ? '−' : '+';
            });
        });
    }

    setupMobileMenu() {
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        const nav = document.querySelector('.nav');
        
        if (mobileToggle && nav) {
            mobileToggle.addEventListener('click', () => {
                nav.classList.toggle('active');
                mobileToggle.classList.toggle('active');
            });
        }

        // Fechar menu ao clicar em links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                mobileToggle.classList.remove('active');
            });
        });
    }

    checkAuthStatus() {
        const currentUser = JSON.parse(localStorage.getItem('boost_lives_current_user'));
        const loginLink = document.getElementById('login-link');
        
        if (currentUser && loginLink) {
            loginLink.textContent = currentUser.username;
            loginLink.href = 'dashboard.html';
            loginLink.classList.add('user-link');
        }
    }

    setupAnimations() {
        // Animação de entrada para elementos
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observar elementos para animação
        document.querySelectorAll('.feature-card, .service-card, .step').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    closeModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }

    showNotification(message, type = 'success') {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        `;

        // Estilos da notificação
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success)' : 'var(--error)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 1rem;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Animação de entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Fechar notificação
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        });

        // Auto-remover após 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, 5000);
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.boostLives = new BoostLives();
});

// Funções globais
function formatCurrency(amount) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(amount);
}

function formatNumber(number) {
    return new Intl.NumberFormat('pt-BR').format(number);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Smooth scroll para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
// No final do arquivo, adicione:
function setupUserMenu() {
    const currentUser = JSON.parse(localStorage.getItem('boost_lives_current_user'));
    const loginLink = document.getElementById('login-link');
    const userMenu = document.getElementById('user-menu');
    const userAvatar = document.getElementById('user-avatar');
    const userName = document.getElementById('user-name');
    const logoutBtn = document.getElementById('logout-btn');

    if (currentUser) {
        // Usuário está logado
        if (loginLink) loginLink.style.display = 'none';
        if (userMenu) userMenu.style.display = 'flex';
        if (userAvatar) userAvatar.textContent = currentUser.username.charAt(0).toUpperCase();
        if (userName) userName.textContent = currentUser.username;
        
        // Configurar logout
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('boost_lives_current_user');
                window.location.href = 'index.html';
            });
        }
    } else {
        // Usuário não está logado
        if (loginLink) loginLink.style.display = 'block';
        if (userMenu) userMenu.style.display = 'none';
    }
}

// Chame a função quando o DOM carregar
document.addEventListener('DOMContentLoaded', () => {
    window.boostLives = new BoostLives();
    setupUserMenu(); // Adicione esta linha
});