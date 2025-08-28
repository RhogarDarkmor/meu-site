
window.showAddFundsModal = function() {
    const modal = document.getElementById('add-funds-modal');
    if (modal) modal.style.display = 'flex';
}

window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}
