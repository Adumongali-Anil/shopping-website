// Cart functionality
let cart = [];
let cartTotal = 0;
let shippingCost = 0;

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
        updateCartCount();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Update cart count in header with animation
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems || '0';
        
        // Add bounce animation
        cartCount.classList.remove('updated');
        void cartCount.offsetWidth; // Trigger reflow
        cartCount.classList.add('updated');
    }
}

// Add item to cart
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    // Add green effect to the clicked button
    const clickedButton = event.target.closest('.add-to-cart-btn');
    if (clickedButton) {
        // Store original background
        const originalBackground = clickedButton.style.backgroundColor;
        
        // Change to green
        clickedButton.style.backgroundColor = '#4CAF50';
        clickedButton.innerHTML = '<i class="fas fa-check"></i> Added';
        
        // Revert back after 1 second
        setTimeout(() => {
            clickedButton.style.backgroundColor = originalBackground;
            clickedButton.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
        }, 1000);
    }
    
    saveCart();
    showAddedMessage();
    updateCartDisplay();
    updateCartCount();
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartDisplay();
    updateCartCount();
}

// Update quantity
function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = parseInt(newQuantity);
            saveCart();
            updateCartDisplay();
            updateCartCount();
        }
    }
}

// Clear cart
function clearCart() {
    cart = [];
    saveCart();
    updateCartDisplay();
    updateCartCount();
}

// Calculate cart total
function calculateTotal() {
    cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    shippingCost = cartTotal > 500 ? 0 : 50; // Free shipping over $500
    const finalTotal = cartTotal + shippingCost;
    
    document.getElementById('subtotal').textContent = '$' + cartTotal.toFixed(2);
    document.getElementById('shipping').textContent = '$' + shippingCost.toFixed(2);
    document.getElementById('total').textContent = '$' + finalTotal.toFixed(2);
}

// Update cart display with animations
function updateCartDisplay() {
    const cartContainer = document.getElementById('cartItems');
    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart-container" style="animation: fadeIn 0.5s ease-out">
                <p class="empty-cart">Your cart is empty</p>
                <a href="products.html" class="continue-shopping-btn">
                    <i class="fas fa-arrow-left"></i>
                    Continue Shopping
                </a>
            </div>
        `;
        document.getElementById('checkoutBtn').style.display = 'none';
        document.getElementById('cartSummary').style.display = 'none';
    } else {
        cartContainer.innerHTML = cart.map((item, index) => `
            <div class="cart-item" style="animation: slideInUp 0.5s ease-out ${index * 0.1}s">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p class="price">$${item.price.toFixed(2)}</p>
                    <div class="quantity-controls">
                        <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
        
        document.getElementById('checkoutBtn').style.display = 'block';
        document.getElementById('cartSummary').style.display = 'block';
        calculateTotal();
    }
}

// Show checkout section
function showCheckout() {
    document.getElementById('cartSection').style.display = 'none';
    document.getElementById('checkoutSection').style.display = 'block';
    updateOrderSummary();
}

// Show cart section
function showCart() {
    document.getElementById('cartSection').style.display = 'block';
    document.getElementById('checkoutSection').style.display = 'none';
}

// Update order summary in checkout
function updateOrderSummary() {
    const summaryContainer = document.getElementById('orderSummary');
    if (!summaryContainer) return;

    summaryContainer.innerHTML = `
        <h3>Order Summary</h3>
        <div class="summary-items">
            ${cart.map(item => `
                <div class="summary-item">
                    <span>${item.name} x${item.quantity}</span>
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `).join('')}
        </div>
        <div class="summary-total">
            <div class="summary-row">
                <span>Subtotal</span>
                <span>$${cartTotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Shipping</span>
                <span>$${shippingCost.toFixed(2)}</span>
            </div>
            <div class="summary-row total">
                <span>Total</span>
                <span>$${(cartTotal + shippingCost).toFixed(2)}</span>
            </div>
        </div>
    `;
}

// Handle payment method selection
function selectPaymentMethod(method) {
    document.querySelectorAll('.payment-method').forEach(el => {
        el.classList.remove('selected');
    });
    document.querySelector(`[data-method="${method}"]`).classList.add('selected');
    
    const cardDetails = document.getElementById('cardDetails');
    if (method === 'card') {
        cardDetails.style.display = 'block';
    } else {
        cardDetails.style.display = 'none';
    }
}

// Place order
function placeOrder(event) {
    event.preventDefault();
    
    // Basic form validation
    const form = document.getElementById('checkoutForm');
    if (!form.checkValidity()) {
        alert('Please fill in all required fields');
        return;
    }

    // Show success message
    alert('Order placed successfully!');
    clearCart();
    window.location.href = 'index.html';
}

// Show "Added to Cart" message with enhanced animation
function showAddedMessage() {
    const message = document.createElement('div');
    message.className = 'cart-message';
    message.innerHTML = `
        <div class="cart-message-content">
            <i class="fas fa-check-circle"></i>
            Item added to cart!
        </div>
    `;
    
    // Add enhanced styles
    const style = document.createElement('style');
    style.textContent = `
        .cart-message {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #4CAF50;
            color: white;
            padding: 15px 25px;
            border-radius: 5px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideInRight 0.5s ease-out, fadeOut 0.5s ease-out 2.5s forwards;
            transform-origin: right center;
        }

        .cart-message-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        @keyframes slideInRight {
            from {
                transform: translateX(100%) scale(0.5);
                opacity: 0;
            }
            to {
                transform: translateX(0) scale(1);
                opacity: 1;
            }
        }

        @keyframes fadeOut {
            from {
                transform: translateX(0) scale(1);
                opacity: 1;
            }
            to {
                transform: translateX(10%) scale(0.9);
                opacity: 0;
            }
        }

        .cart-message i {
            animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        @keyframes bounceIn {
            0% {
                transform: scale(0);
            }
            50% {
                transform: scale(1.2);
            }
            100% {
                transform: scale(1);
            }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(message);

    setTimeout(() => {
        message.remove();
        style.remove();
    }, 3000);
}

// Initialize cart when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    updateCartCount();
    
    // Initialize payment method if on checkout page
    const paymentMethods = document.querySelectorAll('.payment-method');
    if (paymentMethods.length > 0) {
        selectPaymentMethod('card');
    }
}); 