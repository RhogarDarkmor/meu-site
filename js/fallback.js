// Fallback para redirecionamento
function checkAuthStatus() {
    const currentUser = JSON.parse(localStorage.getItem('boost_lives_current_user'));
    
    if (currentUser) {
        // Se está logado e na página inicial, redirecionar para perfil
        if (window.location.pathname.endsWith('index.html') || 
            window.location.pathname === '/') {
            window.location.href = 'perfil.html';
        }
    } else {
        // Se não está logado e está tentando acessar páginas protegidas
        const protectedPages = ['perfil.html', 'dashboard.html'];
        const currentPage = window.location.pathname.split('/').pop();
        
        if (protectedPages.includes(currentPage)) {
            window.location.href = 'index.html';
        }
    }
}

// Verificar a cada segundo (fallback)
setInterval(checkAuthStatus, 1000);

// Verificar imediatamente ao carregar
document.addEventListener('DOMContentLoaded', checkAuthStatus);