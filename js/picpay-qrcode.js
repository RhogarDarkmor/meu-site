// Gera e exibe QR Code PicPay no modal de adicionar saldo
// Substitua 'SEU_USUARIO_PICPAY' pelo seu usuário real do PicPay
const PICPAY_USER = 'SEU_USUARIO_PICPAY';

function showPicPayModal(amount) {
    const picpayUrl = `https://picpay.me/${PICPAY_USER}/${amount}`;
    const qrApi = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(picpayUrl)}`;
    const modal = document.getElementById('picpay-modal');
    if (modal) {
        modal.querySelector('.picpay-amount').textContent = `R$ ${Number(amount).toFixed(2)}`;
        modal.querySelector('.picpay-link').href = picpayUrl;
        modal.querySelector('.picpay-qrcode').src = qrApi;
        modal.style.display = 'flex';
    }
}

function closePicPayModal() {
    const modal = document.getElementById('picpay-modal');
    if (modal) modal.style.display = 'none';
}

// Adiciona evento ao botão PicPay
window.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('btn-picpay');
    if (btn) {
        btn.addEventListener('click', function() {
            const amountInput = document.getElementById('custom-amount');
            let amount = amountInput && amountInput.value ? parseFloat(amountInput.value) : 10;
            if (!amount || amount < 1) amount = 10;
            showPicPayModal(amount);
        });
    }
});
