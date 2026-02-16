// Global Initialization
(function init() {
    emailjs.init('OPN5hE-C-lvjyDHr9'); //
    if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark'); //
})();

// Ensure DOM is ready before attaching listeners
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount(); //
    
    // 1. ADD TO CART LOGIC
    const addToCartBtn = document.getElementById('addToCartBtn');
    if (addToCartBtn) {
        addToCartBtn.onclick = () => {
            const transmission = document.getElementById('transmission').value; //
            
            if (!transmission) {
                alert("Please select a transmission type.");
                return;
            }

            const vehicle = { 
                name: 'Toyota Rumion', 
                details: '7 Seaters',
                rates: '18/km (Interstate) | 25/km (Intercountry)', //
                transmission: transmission 
            };

            // Save as array to localStorage
            localStorage.setItem('cart', JSON.stringify([vehicle]));
            alert('🚐 Toyota Rumion added to your booking!');
            updateCartCount();
        };
    }

    // 2. RENDER PREVIEW (on cart.html)
    if (document.getElementById('orderPreview')) {
        renderPreview();
    }
});

// Helper Functions
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    document.querySelectorAll('#cartCount').forEach(el => {
        el.textContent = cart.length;
    });
}

function renderPreview() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const container = document.getElementById('orderPreview');
    if (container && cart.length > 0) {
        container.innerHTML = `
            <div class="preview-box" style="border-left: 4px solid #2563eb; padding: 10px; background: rgba(37,99,235,0.05);">
                <strong>Vehicle:</strong> ${cart[0].name}<br>
                <strong>Gear:</strong> ${cart[0].transmission}<br>
                <strong>Price:</strong> ${cart[0].rates}
            </div>`;
    }
}

// 3. ORDER SUBMISSION (Name & ID Proof Required)
document.getElementById('orderForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) return alert('Please select a vehicle first.');

    //
    emailjs.send('service_tnwffbk', 'template_zlt8o59', {
        to_email: 'shaik2vali678@gmail.com', //
        from_name: document.getElementById('userName').value,
        id_info: document.getElementById('idProof').value,
        item: `${cart[0].name} (${cart[0].transmission})`,
        pickup: document.getElementById('pickup').value,
        drop: document.getElementById('drop').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value
    }).then(() => {
        alert('Booking order sent successfully!');
        localStorage.removeItem('cart');
        window.location.href = 'index.html';
    });
});