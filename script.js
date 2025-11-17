// Shopping Cart
let cart = [];

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add active class to navigation based on scroll position
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Display current day in hours section
function highlightCurrentDay() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];

    document.querySelectorAll('.hours-row').forEach(row => {
        const dayElement = row.querySelector('.day');
        if (dayElement && dayElement.textContent === today) {
            row.style.background = 'rgba(244, 196, 48, 0.2)';
            row.style.borderRadius = '8px';
        }
    });
}

// Add "Add to Cart" buttons to menu items
function addCartButtons() {
    const menuItems = document.querySelectorAll('.menu-item');

    menuItems.forEach(item => {
        // Skip if it's just an add-on option (like "add $4.00")
        const priceText = item.querySelector('.item-price').textContent;
        if (priceText.toLowerCase().includes('add')) {
            return;
        }

        // Check if button already exists
        if (item.querySelector('.add-to-cart-btn')) {
            return;
        }

        const button = document.createElement('button');
        button.className = 'add-to-cart-btn';
        button.textContent = 'Add to Order';
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            addToCart(item);
        });

        item.appendChild(button);
    });
}

// Add item to cart
function addToCart(itemElement) {
    const name = itemElement.querySelector('.item-name').textContent;
    const priceText = itemElement.querySelector('.item-price').textContent;
    const price = parseFloat(priceText.replace('$', ''));

    const cartItem = {
        id: Date.now(),
        name: name,
        price: price
    };

    cart.push(cartItem);
    updateCart();

    // Visual feedback
    const button = itemElement.querySelector('.add-to-cart-btn');
    const originalText = button.textContent;
    button.textContent = 'Added!';
    button.style.background = '#4caf50';

    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
    }, 1000);
}

// Update cart display
function updateCart() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const orderForm = document.getElementById('orderForm');
    const subtotalAmount = document.getElementById('subtotalAmount');
    const taxAmount = document.getElementById('taxAmount');
    const totalAmount = document.getElementById('totalAmount');

    cartCount.textContent = cart.length;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your order is empty</p>';
        cartTotal.style.display = 'none';
        orderForm.style.display = 'none';
    } else {
        let subtotal = 0;
        let itemsHTML = '';

        cart.forEach(item => {
            subtotal += item.price;
            itemsHTML += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    </div>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            `;
        });

        const tax = subtotal * 0.09;
        const total = subtotal + tax;

        cartItems.innerHTML = itemsHTML;
        subtotalAmount.textContent = subtotal.toFixed(2);
        taxAmount.textContent = tax.toFixed(2);
        totalAmount.textContent = total.toFixed(2);
        cartTotal.style.display = 'block';
        orderForm.style.display = 'block';
    }
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCart();
}

// Cart modal controls
const cartButton = document.getElementById('cartButton');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');

cartButton.addEventListener('click', () => {
    cartModal.classList.add('active');
});

closeCart.addEventListener('click', () => {
    cartModal.classList.remove('active');
});

cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.classList.remove('active');
    }
});

// Submit order
const submitOrder = document.getElementById('submitOrder');
submitOrder.addEventListener('click', () => {
    const customerName = document.getElementById('customerName').value.trim();
    const customerPhone = document.getElementById('customerPhone').value.trim();

    if (!customerName) {
        alert('Please enter your name');
        return;
    }

    if (!customerPhone) {
        alert('Please enter your phone number');
        return;
    }

    // Create order message
    let orderMessage = `NEW ORDER from ${customerName} (${customerPhone})\n\n`;
    orderMessage += `Order Details:\n`;
    orderMessage += `─────────────────\n`;

    let subtotal = 0;
    cart.forEach((item, index) => {
        orderMessage += `${index + 1}. ${item.name} - $${item.price.toFixed(2)}\n`;
        subtotal += item.price;
    });

    const tax = subtotal * 0.09;
    const total = subtotal + tax;

    orderMessage += `─────────────────\n`;
    orderMessage += `Subtotal: $${subtotal.toFixed(2)}\n`;
    orderMessage += `Tax (9%): $${tax.toFixed(2)}\n`;
    orderMessage += `TOTAL: $${total.toFixed(2)}\n\n`;
    orderMessage += `Customer: ${customerName}\n`;
    orderMessage += `Phone: ${customerPhone}\n`;
    orderMessage += `Order Time: ${new Date().toLocaleString()}`;

    // Log to console (this is where SMS would be sent in production)
    console.log('═══════════════════════════════════════');
    console.log('ORDER SUBMITTED - READY FOR SMS SENDING');
    console.log('═══════════════════════════════════════');
    console.log(orderMessage);
    console.log('═══════════════════════════════════════');
    console.log('SMS API Integration Points:');
    console.log('• Twilio: https://www.twilio.com/sms');
    console.log('• Vonage (Nexmo): https://www.vonage.com/communications-apis/sms/');
    console.log('• AWS SNS: https://aws.amazon.com/sns/');
    console.log('• Plivo: https://www.plivo.com/sms/');
    console.log('═══════════════════════════════════════');

    // Show success message
    alert(`Thank you, ${customerName}! Your order has been received. We'll contact you at ${customerPhone} to confirm.`);

    // Clear cart and close modal
    cart = [];
    updateCart();
    document.getElementById('customerName').value = '';
    document.getElementById('customerPhone').value = '';
    cartModal.classList.remove('active');
});

// Make removeFromCart globally available
window.removeFromCart = removeFromCart;

// 8-bit Character Runner System
class PixelRunner {
    constructor() {
        this.container = document.getElementById('pixelRunner');
        this.characters = ['🌮', '🌯', '🥙', '🫔', '🫘', '🌭', '🥗', '🥑', '🥤', '🌶️', '🎮', '🌵', '⭐', '🧀'];
        this.hunters = ['👾']; // Characters that behave like brothers
        this.activeRunners = new Map();
        this.brothers = new Map();
        this.nextId = 0;

        this.initBrothers();
        this.startSpawning();
        this.startCollisionDetection();
    }

    initBrothers() {
        const brother1 = document.getElementById('brother1');
        const brother2 = document.getElementById('brother2');

        this.animateBrother(brother1, 20000, 0);
        this.animateBrother(brother2, 28000, 8000);

        this.brothers.set('brother1', brother1);
        this.brothers.set('brother2', brother2);
    }

    animateBrother(element, baseDuration, initialDelay) {
        const animate = () => {
            element.style.left = '-50px';
            element.style.transition = 'none';

            setTimeout(() => {
                element.style.transition = `left ${baseDuration}ms linear`;
                element.style.left = '100%';
            }, 50);

            // Random delay between 5-15 seconds before next run
            const randomDelay = 5000 + Math.random() * 10000;
            setTimeout(animate, baseDuration + randomDelay);
        };

        setTimeout(animate, initialDelay);
    }

    spawnCharacter() {
        // Randomly decide if we spawn a hunter or regular character
        const isHunter = Math.random() < 0.15; // 15% chance of hunter
        const character = isHunter
            ? this.hunters[Math.floor(Math.random() * this.hunters.length)]
            : this.characters[Math.floor(Math.random() * this.characters.length)];

        const runner = document.createElement('div');
        runner.className = isHunter ? 'runner hunter' : 'runner';
        runner.textContent = character;
        runner.style.left = '-50px';

        const duration = 12000 + Math.random() * 16000;
        const id = `runner-${this.nextId++}`;
        runner.id = id;

        this.container.appendChild(runner);
        this.activeRunners.set(id, {
            element: runner,
            startTime: Date.now(),
            duration: duration,
            isHunter: isHunter
        });

        setTimeout(() => {
            runner.style.transition = `left ${duration}ms linear`;
            runner.style.left = '100%';
        }, 50);

        setTimeout(() => {
            if (this.activeRunners.has(id)) {
                this.removeRunner(id);
            }
        }, duration + 100);
    }

    removeRunner(id) {
        const runner = this.activeRunners.get(id);
        if (runner && runner.element) {
            runner.element.style.opacity = '0';
            setTimeout(() => {
                if (runner.element && runner.element.parentNode) {
                    runner.element.parentNode.removeChild(runner.element);
                }
            }, 300);
        }
        this.activeRunners.delete(id);
    }

    checkCollision(element1, element2) {
        const rect1 = element1.getBoundingClientRect();
        const rect2 = element2.getBoundingClientRect();

        return !(rect1.right < rect2.left ||
                rect1.left > rect2.right ||
                rect1.bottom < rect2.top ||
                rect1.top > rect2.bottom);
    }

    detectCollisions() {
        // Brothers eat regular characters
        this.brothers.forEach((brother) => {
            this.activeRunners.forEach((runner, id) => {
                if (this.checkCollision(brother, runner.element)) {
                    this.removeRunner(id);
                }
            });
        });

        // Hunters eat other characters (but not brothers or other hunters)
        this.activeRunners.forEach((hunter, hunterId) => {
            if (hunter.isHunter) {
                this.activeRunners.forEach((prey, preyId) => {
                    if (hunterId !== preyId && !prey.isHunter) {
                        if (this.checkCollision(hunter.element, prey.element)) {
                            this.removeRunner(preyId);
                        }
                    }
                });
            }
        });
    }

    startSpawning() {
        setInterval(() => {
            if (this.activeRunners.size < 5) {
                this.spawnCharacter();
            }
        }, 2000);
    }

    startCollisionDetection() {
        setInterval(() => {
            this.detectCollisions();
        }, 100);
    }
}

let pixelRunnerSystem;

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
    highlightCurrentDay();
    addCartButtons();
    pixelRunnerSystem = new PixelRunner();
});