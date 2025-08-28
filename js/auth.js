// Firebase Auth
// Certifique-se de que o Firebase foi inicializado no HTML antes deste script

function showNotification(message, type = 'success') {
    if (window.showToast) {
        window.showToast(message, type);
    } else if (window.boostLives && window.boostLives.showNotification) {
        window.boostLives.showNotification(message, type);
    } else {
        alert(message);
    }
}

function updateUI(user) {
    const loginLink = document.getElementById('login-link');
    if (user && loginLink) {
        loginLink.textContent = user.email;
        loginLink.href = 'perfil.html';
        loginLink.onclick = null;
    }
    const userNameElement = document.getElementById('user-name');
    const userAvatarElement = document.getElementById('user-avatar');
    if (user && userNameElement) {
        userNameElement.textContent = user.email.split('@')[0];
    }
    if (user && userAvatarElement) {
        userAvatarElement.textContent = user.email.charAt(0).toUpperCase();
    }
}

function closeModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

function showLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function setupPasswordStrength() {
    const passwordInput = document.getElementById('password');
    const strengthBar = document.querySelector('.strength-bar');
    const requirements = document.querySelectorAll('.requirement');
    if (passwordInput && strengthBar) {
        passwordInput.addEventListener('input', () => {
            const password = passwordInput.value;
            let strength = 0;
            const checks = {
                length: password.length >= 8,
                uppercase: /[A-Z]/.test(password),
                lowercase: /[a-z]/.test(password),
                number: /[0-9]/.test(password),
                special: /[^A-Za-z0-9]/.test(password)
            };
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
            const percentage = (strength / 5) * 100;
            strengthBar.style.width = percentage + '%';
            if (strength <= 2) {
                strengthBar.className = 'strength-bar strength-weak';
            } else if (strength <= 4) {
                strengthBar.className = 'strength-bar strength-medium';
            } else {
                strengthBar.className = 'strength-bar strength-strong';
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            if (!email || !password) {
                showNotification('Por favor, preencha todos os campos', 'error');
                return;
            }
            try {
                await firebase.auth().signInWithEmailAndPassword(email, password);
                showNotification('Login realizado com sucesso!', 'success');
                closeModals();
                setTimeout(() => {
                    window.location.href = 'perfil.html';
                }, 1000);
            } catch (error) {
                showNotification('Usuário ou senha incorretos', 'error');
            }
        });
    }

    // Cadastro
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            if (!email || !password || !confirmPassword) {
                showNotification('Por favor, preencha todos os campos', 'error');
                return;
            }
            if (password !== confirmPassword) {
                showNotification('As senhas não coincidem', 'error');
                return;
            }
            if (password.length < 6) {
                showNotification('A senha deve ter pelo menos 6 caracteres', 'error');
                return;
            }
            try {
                await firebase.auth().createUserWithEmailAndPassword(email, password);
                showNotification('Conta criada com sucesso! Redirecionando...', 'success');
                setTimeout(() => {
                    window.location.href = 'perfil.html';
                }, 1500);
            } catch (error) {
                if (error.code === 'auth/email-already-in-use') {
                    showNotification('Este e-mail já está cadastrado', 'error');
                } else {
                    showNotification('Erro ao criar conta', 'error');
                }
            }
        });
    }

    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await firebase.auth().signOut();
                showNotification('Logout realizado com sucesso', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } catch (error) {
                showNotification('Erro ao sair', 'error');
            }
        });
    }

    // Login link (abre modal)
    const loginLink = document.getElementById('login-link');
    if (loginLink) {
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            showLoginModal();
        });
    }

    setupPasswordStrength();

    // Atualiza UI com usuário logado
    firebase.auth().onAuthStateChanged((user) => {
    updateUI(user);
    // Removido redirecionamento automático para evitar loop de logout/login
    });
});