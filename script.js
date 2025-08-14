// Simple E-commerce Cart Functionality
let cart = [];
let cartCount = 0;

// Load cart from localStorage
function loadCart() {
    cart = JSON.parse(localStorage.getItem('techgear_cart') || '[]'); // READ
    cartCount = cart.length;
    updateCartDisplay();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('techgear_cart', JSON.stringify(cart));
}

// Update cart display
function updateCartDisplay() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
    
    // Update cart panel
    updateCartPanel();
}

// Update cart panel
function updateCartPanel() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    
    if (!cartItemsContainer || !cartTotalElement) return;
    
    // Clear current items
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: #6b7280;">السلة فارغة</p>';
        cartTotalElement.textContent = '$0';
        return;
    }
    
    // Add each item
    let total = 0;
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        // Extract price number (remove $)
        const priceNumber = parseFloat(item.price.replace('$', '').replace(',', ''));
        total += priceNumber;
        
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <span class="cart-item-price">${item.price}</span>
            </div>
            <button class="remove-item" onclick="removeFromCart(${index})">حذف</button>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    cartTotalElement.textContent = '$' + total.toFixed(2);
}

// Add to cart function
function addToCart(productName, price) {
    cart.push({
        name: productName,
        price: price,
        id: Date.now()
    });
    
    cartCount++;
    updateCartDisplay();
    saveCart();
    
    // Show success message
    showNotification(productName + ' تم إضافته للسلة!', 'success');
}

// Remove from cart function
function removeFromCart(index) {
    cart.splice(index, 1);                                    // remove from Array
    cartCount--;                                              // update length
    updateCartDisplay();                                      
    localStorage.setItem('techgear_cart', JSON.stringify(cart)); // STORE
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification notification-' + type;
    notification.textContent = message;
    
    // Style the notification
    // تحديد اللون حسب النوع
    let backgroundColor;
    if (type === 'success') {
        backgroundColor = '#10b981';
    } else {
        backgroundColor = '#3b82f6';
    }
    
    // إضافة CSS properties
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.background = backgroundColor;
    notification.style.color = 'white';
    notification.style.padding = '16px 20px';
    notification.style.borderRadius = '8px';
    notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    notification.style.zIndex = '10000';
    notification.style.animation = 'slideInRight 0.3s ease-out';
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add event listeners to all add-to-cart buttons
document.addEventListener('DOMContentLoaded', function() {
    // Load cart
    loadCart();
    
    // Add click events to all add-to-cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.price').textContent;
            
            addToCart(productName, productPrice);
        });
    });
    
    // Add click event to CTA button
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            document.getElementById('products').scrollIntoView({ 
                behavior: 'smooth' 
            });
        });
    }
    
        // Add smooth scrolling to navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add cart functionality
    const cartIcon = document.getElementById('cartIcon');
    const cartPanel = document.getElementById('cartPanel');
    const closeCart = document.getElementById('closeCart');
    
    // Open cart
    if (cartIcon) {
        cartIcon.addEventListener('click', function() {
            cartPanel.classList.add('open');
        });
    }
    
    // Close cart
    if (closeCart) {
        closeCart.addEventListener('click', function() {
            cartPanel.classList.remove('open');
        });
    }
    
    // Close cart when clicking outside
    document.addEventListener('click', function(e) {
        // لا تغلق السلة إذا كان الضغط على زر الحذف
        if (e.target.classList.contains('remove-item')) {
            return; // توقف هنا، لا تغلق السلة
        }
        
        // أغلق السلة فقط إذا كان الضغط خارج السلة وخارج أيقونة السلة
        if (!cartPanel.contains(e.target) && !cartIcon.contains(e.target)) {
            cartPanel.classList.remove('open');
        }
    });
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .notification {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-weight: 500;
    }
`;
document.head.appendChild(style);
