// Function to create and update the header cart count
function updateHeaderCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = cart.length;
    });
}

// Update cart count when page loads
document.addEventListener('DOMContentLoaded', updateHeaderCartCount);

// Listen for storage changes (in case cart is updated in another tab)
window.addEventListener('storage', (e) => {
    if (e.key === 'cart') {
        updateHeaderCartCount();
    }
}); 