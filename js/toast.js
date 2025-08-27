// Toast notification system
(function() {
    function showToast(message, type = 'success', duration = 3500) {
        let toast = document.createElement('div');
        toast.className = 'toast-notification ' + type;
        toast.setAttribute('role', 'alert');
        toast.innerText = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, duration);
    }
    window.showToast = showToast;
})();
