// FAQ Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    if (faqQuestions) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const answer = question.nextElementSibling;
                const isActive = question.classList.contains('active');
                
                // Close all other answers
                document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('active'));
                document.querySelectorAll('.faq-question').forEach(q => q.classList.remove('active'));
                
                // Toggle current answer
                if (!isActive) {
                    answer.classList.add('active');
                    question.classList.add('active');
                }
            });
        });
    }

    // Returns Form Handling
    const returnForm = document.getElementById('returnForm');
    if (returnForm) {
        returnForm.addEventListener('submit', handleReturnSubmit);
    }

    // Shipping Calculator
    const calculateShippingBtn = document.getElementById('calculateShipping');
    if (calculateShippingBtn) {
        calculateShippingBtn.addEventListener('click', calculateShippingCost);
    }

    // Initialize tooltips
    initializeTooltips();

    // Initialize checkout section
    const checkoutSection = document.getElementById('checkoutSection');
    if (checkoutSection) {
        checkoutSection.style.display = 'none';
    }

    // Add event listener for checkout button
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('checkout-btn')) {
            showCheckout();
        }
    });
});

// Returns Form Handler
function handleReturnSubmit(event) {
    event.preventDefault();
    const orderNumber = document.getElementById('order-number').value;
    const reason = document.getElementById('return-reason').value;
    const comments = document.getElementById('comments').value;

    // Validate form
    if (!orderNumber || !reason) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    // Simulate API call
    showLoadingSpinner();
    setTimeout(() => {
        hideLoadingSpinner();
        showNotification('Return request submitted successfully!', 'success');
        event.target.reset();
    }, 1500);
}

// Shipping Calculator
function calculateShippingCost() {
    const orderValue = document.getElementById('order-value').value;
    const shippingMethod = document.getElementById('shipping-method').value;
    const resultDiv = document.getElementById('shipping-result');

    if (!orderValue || !shippingMethod) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    let cost = 0;
    const value = parseFloat(orderValue);

    // Calculate shipping cost based on order value and method
    if (value < 50) {
        cost = shippingMethod === 'standard' ? 5.99 : 
               shippingMethod === 'express' ? 20.99 : 30.99;
    } else if (value < 100) {
        cost = shippingMethod === 'standard' ? 0 : 
               shippingMethod === 'express' ? 15.99 : 25.99;
    } else {
        cost = shippingMethod === 'standard' ? 0 : 
               shippingMethod === 'express' ? 10.99 : 20.99;
    }

    resultDiv.innerHTML = `
        <div class="info-box">
            <h4>Shipping Cost Estimate</h4>
            <p>Order Value: $${value.toFixed(2)}</p>
            <p>Shipping Method: ${shippingMethod.charAt(0).toUpperCase() + shippingMethod.slice(1)}</p>
            <p>Shipping Cost: $${cost.toFixed(2)}</p>
            <p>Total: $${(value + cost).toFixed(2)}</p>
        </div>
    `;
    resultDiv.style.display = 'block';
}

// Utility Functions
function showLoadingSpinner() {
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    document.body.appendChild(spinner);
}

function hideLoadingSpinner() {
    const spinner = document.querySelector('.loading-spinner');
    if (spinner) {
        spinner.remove();
    }
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Add icon based on notification type
    const icon = document.createElement('i');
    switch(type) {
        case 'success':
            icon.className = 'fas fa-check-circle';
            break;
        case 'error':
            icon.className = 'fas fa-exclamation-circle';
            break;
        case 'info':
            icon.className = 'fas fa-info-circle';
            break;
        default:
            icon.className = 'fas fa-bell';
    }
    
    notification.appendChild(icon);
    notification.appendChild(document.createTextNode(' ' + message));
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

function initializeTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', e => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = e.target.dataset.tooltip;
            document.body.appendChild(tooltip);

            const rect = e.target.getBoundingClientRect();
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
            tooltip.style.left = `${rect.left + (rect.width - tooltip.offsetWidth) / 2}px`;
        });

        element.addEventListener('mouseleave', () => {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
}

// Add smooth scrolling to all links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Category Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all category buttons and product sections
    const categoryBtns = document.querySelectorAll('.category-btn');
    const productSections = document.querySelectorAll('.products-section');

    // Add click event listeners to category buttons
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');
            
            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show/hide appropriate sections
            productSections.forEach(section => {
                if (section.getAttribute('data-category') === category) {
                    section.classList.remove('hidden');
                    section.classList.add('active');
                    
                    // Scroll to the section
                    section.scrollIntoView({ behavior: 'smooth' });
                } else {
                    section.classList.add('hidden');
                    section.classList.remove('active');
                }
            });
        });
    });

    // Handle filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all filter buttons in the same category
            const parentSection = btn.closest('.products-section');
            parentSection.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('active');
            });
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Here you can add product filtering logic based on the selected filter
        });
    });

    // Add to Cart functionality
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const productCard = btn.closest('.product-card');
            const productTitle = productCard.querySelector('.product-title').textContent;
            
            // Show added to cart feedback
            const originalText = btn.textContent;
            btn.textContent = 'Added to Cart!';
            btn.style.backgroundColor = '#4CAF50';
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.backgroundColor = '';
            }, 2000);
            
            // Here you can add logic to actually add the item to the cart
            console.log(`Added ${productTitle} to cart`);
        });
    });

    // Search functionality
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            handleSearch();
        });
    }
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }

    // Product card hover effects
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
        });
    });

    // Initialize existing functionality
    initializeExistingFunctionality();
});

function handleSearch() {
    const searchTerm = document.querySelector('.search-input').value.trim();
    if (searchTerm) {
        showNotification('Searching for: ' + searchTerm, 'info');
        // Here you would typically handle the search
        // For demo purposes, we'll just show a notification
    }
}

function initializeExistingFunctionality() {
    // FAQ Accordion (existing code)
    const faqQuestions = document.querySelectorAll('.faq-question');
    if (faqQuestions) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const answer = question.nextElementSibling;
                const isActive = question.classList.contains('active');
                
                // Close all other answers
                document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('active'));
                document.querySelectorAll('.faq-question').forEach(q => q.classList.remove('active'));
                
                // Toggle current answer
                if (!isActive) {
                    answer.classList.add('active');
                    question.classList.add('active');
                }
            });
        });
    }

    // Returns Form Handling (existing code)
    const returnForm = document.getElementById('returnForm');
    if (returnForm) {
        returnForm.addEventListener('submit', handleReturnSubmit);
    }

    // Shipping Calculator (existing code)
    const calculateShippingBtn = document.getElementById('calculateShipping');
    if (calculateShippingBtn) {
        calculateShippingBtn.addEventListener('click', calculateShippingCost);
    }

    // Initialize tooltips (existing code)
    initializeTooltips();
}

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeSearch();
    initializeProductFilters();
    initializeCart();
    initializeFAQ();
    initializeContactForm();
    initializeAnimations();
});

// Navigation and Header Functionality
function initializeNavigation() {
    // Add scroll effect to header
    const header = document.querySelector('.top-header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        lastScroll = currentScroll;
    });

    // Add active state to current page in navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// Search Functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');

    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

function performSearch() {
    const searchTerm = document.querySelector('.search-input').value.trim().toLowerCase();
    const productCards = document.querySelectorAll('.product-card');

    if (productCards.length > 0) {
        productCards.forEach(card => {
            const title = card.querySelector('.product-title').textContent.toLowerCase();
            if (title.includes(searchTerm) || searchTerm === '') {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease';
            } else {
                card.style.display = 'none';
            }
        });
    } else {
        showNotification('Searching for: ' + searchTerm, 'info');
    }
}

// Product Filters Functionality
function initializeProductFilters() {
    // Category Navigation
    const categoryBtns = document.querySelectorAll('.category-btn');
    const productSections = document.querySelectorAll('.products-section');

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');
            
            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show/hide sections with animation
            productSections.forEach(section => {
                if (section.getAttribute('data-category') === category) {
                    section.classList.remove('hidden');
                    section.classList.add('active');
                    section.style.animation = 'fadeIn 0.5s ease';
                    
                    // Smooth scroll to section
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    section.classList.add('hidden');
                    section.classList.remove('active');
                }
            });
        });
    });

    // Filter Buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const parentSection = btn.closest('.products-section');
            const category = btn.textContent.toLowerCase();
            
            // Update active state
            parentSection.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter products
            const products = parentSection.querySelectorAll('.product-card');
            products.forEach(product => {
                if (category === 'all' || product.getAttribute('data-category') === category) {
                    product.style.display = 'block';
                    product.style.animation = 'fadeIn 0.5s ease';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    });
}

// Cart Functionality
function initializeCart() {
    // Load cart items from localStorage
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    updateCartCount(cartItems.length);
    
    // Initialize cart page if we're on it
    if (window.location.pathname.includes('cart.html')) {
        displayCartItems(cartItems);
    }

    // Add to cart button functionality
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            if (!productCard) return;

            // Get product details
            const title = productCard.querySelector('.product-title')?.textContent;
            const price = productCard.querySelector('.product-price')?.textContent;
            const image = productCard.querySelector('img')?.src;

            if (!title || !price || !image) {
                showNotification('Error adding product to cart', 'error');
                return;
            }

            // Create product object with unique ID
            const product = {
                id: Date.now(), // Ensure unique ID
                title: title,
                price: price,
                image: image,
                quantity: 1
            };

            // Get existing cart items
            let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            
            // Add new item
            cartItems.push(product);
            
            // Save to localStorage
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            
            // Update cart count
            updateCartCount(cartItems.length);
            
            // Show success feedback
            this.textContent = 'Added to Cart!';
            this.style.backgroundColor = '#4CAF50';
            this.style.animation = 'buttonPop 0.3s ease';
            
            showNotification('Item added to cart!', 'success');
            
            // Reset button after delay
            setTimeout(() => {
                this.textContent = 'Add to Cart';
                this.style.backgroundColor = '';
                this.style.animation = '';
            }, 2000);
        });
    });
}

function updateCartCount(count) {
    const cartCount = document.createElement('span');
    cartCount.className = 'cart-count';
    cartCount.textContent = count;
    
    const existingCount = document.querySelector('.cart-count');
    if (existingCount) {
        existingCount.textContent = count;
    } else {
        const cartIcon = document.querySelector('.action-btn i.fa-shopping-cart');
        if (cartIcon) {
            cartIcon.parentElement.appendChild(cartCount);
        }
    }
}

function displayCartItems(cartItems) {
    const cartItemsContainer = document.querySelector('.cart-items');
    const emptyCart = document.querySelector('.empty-cart');
    const cartSummary = document.querySelector('.cart-summary');
    
    if (!cartItemsContainer) return;

    if (!cartItems || cartItems.length === 0) {
        if (emptyCart) emptyCart.style.display = 'block';
        if (cartSummary) {
            updateCartSummary(0);
            const checkoutButton = document.querySelector('.checkout-button');
            if (checkoutButton) checkoutButton.disabled = true;
        }
        cartItemsContainer.innerHTML = '';
        return;
    }

    if (emptyCart) emptyCart.style.display = 'none';
    
    let total = 0;
    cartItemsContainer.innerHTML = `
        <div class="cart-header">
            <h3>Shopping Cart (${cartItems.length} items)</h3>
        </div>
        <div class="cart-items-list"></div>
    `;

    const cartItemsList = cartItemsContainer.querySelector('.cart-items-list');
    
    cartItems.forEach(item => {
        const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ''));
        total += price * item.quantity;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.dataset.itemId = item.id; // Add data attribute for item ID
        itemElement.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="cart-item-details">
                <h4>${item.title}</h4>
                <div class="cart-item-price">$${(price * item.quantity).toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-item-id="${item.id}">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn plus" data-item-id="${item.id}">+</button>
                </div>
            </div>
            <button class="remove-item" data-item-id="${item.id}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        cartItemsList.appendChild(itemElement);

        // Add event listeners for this item's buttons
        const minusBtn = itemElement.querySelector('.minus');
        const plusBtn = itemElement.querySelector('.plus');
        const removeBtn = itemElement.querySelector('.remove-item');

        minusBtn.addEventListener('click', () => updateItemQuantity(item.id, -1));
        plusBtn.addEventListener('click', () => updateItemQuantity(item.id, 1));
        removeBtn.addEventListener('click', () => removeCartItem(item.id));
    });

    updateCartSummary(total);
}

function updateItemQuantity(itemId, change) {
    console.log('Updating quantity for item:', itemId, 'change:', change); // Debug log
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const itemIndex = cartItems.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        cartItems[itemIndex].quantity += change;
        
        if (cartItems[itemIndex].quantity < 1) {
            removeCartItem(itemId);
            return;
        }
        
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        displayCartItems(cartItems);
        updateCartCount(cartItems.length);
        showNotification('Cart updated', 'success');
    }
}

function removeCartItem(itemId) {
    console.log('Removing item:', itemId); // Debug log
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems = cartItems.filter(item => item.id !== itemId);
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    displayCartItems(cartItems);
    updateCartCount(cartItems.length);
    
    if (cartItems.length === 0) {
        const emptyCart = document.querySelector('.empty-cart');
        if (emptyCart) {
            emptyCart.style.display = 'block';
        }
    }
    
    showNotification('Item removed from cart', 'info');
}

function updateCartSummary(subtotal) {
    const shipping = subtotal > 50 ? 0 : 4.99;
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shipping + tax;

    const summaryElement = document.querySelector('.cart-summary');
    if (summaryElement) {
        summaryElement.innerHTML = `
            <h3>Order Summary</h3>
            <div class="summary-item">
                <span>Subtotal</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-item">
                <span>Shipping</span>
                <span>$${shipping.toFixed(2)}</span>
            </div>
            <div class="summary-item">
                <span>Tax</span>
                <span>$${tax.toFixed(2)}</span>
            </div>
            <div class="summary-total">
                <span>Total</span>
                <span>$${total.toFixed(2)}</span>
            </div>
            <button class="checkout-button" ${subtotal === 0 ? 'disabled' : ''}>
                Proceed to Checkout
            </button>
            <div class="payment-methods">
                <p>We Accept:</p>
                <div class="payment-icons">
                    <i class="fab fa-cc-visa"></i>
                    <i class="fab fa-cc-mastercard"></i>
                    <i class="fab fa-cc-amex"></i>
                    <i class="fab fa-cc-paypal"></i>
                </div>
            </div>
        `;
    }
}

// FAQ Functionality
function initializeFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    const categoryTabs = document.querySelectorAll('.category-tab');

    if (faqQuestions) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const answer = question.nextElementSibling;
                const isActive = question.classList.contains('active');
                
                // Close other answers
                document.querySelectorAll('.faq-answer').forEach(a => {
                    a.style.maxHeight = null;
                    a.classList.remove('active');
                });
                document.querySelectorAll('.faq-question').forEach(q => q.classList.remove('active'));
                
                // Toggle current answer with animation
                if (!isActive) {
                    answer.classList.add('active');
                    question.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        });
    }

    if (categoryTabs) {
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const category = tab.getAttribute('data-category');
                
                // Update active tab
                categoryTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Show relevant FAQ items
                document.querySelectorAll('.faq-group').forEach(group => {
                    if (group.id === category) {
                        group.style.display = 'block';
                        group.style.animation = 'fadeIn 0.5s ease';
                    } else {
                        group.style.display = 'none';
                    }
                });
            });
        });
    }
}

// Contact Form Functionality
function initializeContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simulate form submission
            showLoadingSpinner();
            setTimeout(() => {
                hideLoadingSpinner();
                showNotification('Message sent successfully!', 'success');
                contactForm.reset();
            }, 1500);
        });
    }
}

// Animation Functionality
function initializeAnimations() {
    // Add hover animations to product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
        });
    });

    // Add scroll animations
    const animatedElements = document.querySelectorAll('.section-title, .product-card, .shipping-card, .returns-card, .contact-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.5s ease forwards';
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(element => observer.observe(element));
}

// CSS Animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes slideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }

    @keyframes fadeOut {
        to { opacity: 0; }
    }

    @keyframes buttonPop {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }

    .loading-spinner {
        border: 3px solid #f3f3f3;
        border-top: 3px solid #FF6A00;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1000;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 4px;
        color: white;
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .notification.success { background-color: #4CAF50; }
    .notification.error { background-color: #f44336; }
    .notification.info { background-color: #2196F3; }

    .cart-header {
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid var(--border-color);
    }

    .cart-item {
        display: flex;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid var(--border-color);
        animation: fadeIn 0.3s ease;
    }

    .cart-item-image {
        width: 100px;
        height: 100px;
        margin-right: 20px;
    }

    .cart-item-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 4px;
    }

    .cart-item-details {
        flex: 1;
    }

    .cart-item-details h4 {
        margin-bottom: 10px;
        color: var(--text-color);
    }

    .cart-item-price {
        color: var(--primary-color);
        font-weight: bold;
        margin-bottom: 10px;
    }

    .cart-item-quantity {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .quantity-btn {
        padding: 5px 10px;
        border: 1px solid var(--border-color);
        background: var(--white);
        cursor: pointer;
        border-radius: 4px;
        transition: all 0.3s ease;
    }

    .quantity-btn:hover {
        background: var(--primary-color);
        color: var(--white);
    }

    .remove-item {
        background: none;
        border: none;
        color: #ff4444;
        cursor: pointer;
        padding: 10px;
        transition: transform 0.3s ease;
    }

    .remove-item:hover {
        transform: scale(1.1);
    }

    .cart-count {
        position: absolute;
        top: -8px;
        right: -8px;
        background: var(--primary-color);
        color: white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
    }
`;

document.head.appendChild(style);

// Example of adding a product to cart
function addToCart(product) {
    cart.addItem(product);
}

// Example of removing a product from cart
function removeFromCart(productId) {
    cart.removeItem(productId);
}

// Function to show checkout section
function showCheckout() {
    const cartContent = document.getElementById('cartContent');
    const checkoutSection = document.getElementById('checkoutSection');
    
    if (cartContent && checkoutSection) {
        cartContent.style.display = 'none';
        checkoutSection.style.display = 'block';
        updateOrderSummary();
    }
}

// Function to show cart section
function showCart() {
    const cartContent = document.getElementById('cartContent');
    const checkoutSection = document.getElementById('checkoutSection');
    
    if (cartContent && checkoutSection) {
        cartContent.style.display = 'block';
        checkoutSection.style.display = 'none';
    }
}

// Function to update order summary in checkout
function updateOrderSummary() {
    const summaryContent = document.getElementById('orderSummaryContent');
    if (!summaryContent) return;

    const subtotal = cart.calculateSubtotal();
    const shipping = cart.calculateShipping().toFixed(2);
    const tax = cart.calculateTax();
    const total = cart.calculateTotal();

    summaryContent.innerHTML = `
        <div class="summary-item">
            <span>Subtotal</span>
            <span>$${subtotal}</span>
        </div>
        <div class="summary-item">
            <span>Shipping</span>
            <span>$${shipping}</span>
        </div>
        <div class="summary-item">
            <span>Tax (10%)</span>
            <span>$${tax}</span>
        </div>
        <div class="summary-item total">
            <span>Total</span>
            <span>$${total}</span>
        </div>
    `;
}

// Function to handle payment method selection
function selectPayment(method) {
    const cardDetails = document.getElementById('cardPaymentDetails');
    const paymentMethods = document.querySelectorAll('.payment-method');
    
    paymentMethods.forEach(el => {
        el.classList.remove('selected');
    });
    
    const selectedMethod = document.querySelector(`.payment-method[data-method="${method}"]`);
    if (selectedMethod) {
        selectedMethod.classList.add('selected');
    }

    if (cardDetails) {
        cardDetails.style.display = method === 'card' ? 'block' : 'none';
    }
}

// Function to handle order placement
function placeOrder(event) {
    event.preventDefault();
    
    // Basic form validation
    const form = document.getElementById('checkoutForm');
    if (!form.checkValidity()) {
        alert('Please fill in all required fields');
        return;
    }

    // Get selected payment method
    const selectedPayment = document.querySelector('.payment-method.selected');
    if (!selectedPayment) {
        alert('Please select a payment method');
        return;
    }

    // Here you would typically send the order to a server
    alert('Order placed successfully!');
    
    // Clear cart and redirect to home
    cart.clearCart();
    window.location.href = 'index.html';
}

// Add these event listeners when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize payment method selection
    const paymentMethods = document.querySelectorAll('.payment-method');
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            const paymentType = this.getAttribute('data-method');
            selectPayment(paymentType);
        });
    });

    // Initialize form submission
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', placeOrder);
    }

    // Initialize back to cart button
    const backToCartBtn = document.querySelector('.back-to-cart-btn');
    if (backToCartBtn) {
        backToCartBtn.addEventListener('click', showCart);
    }
}); 