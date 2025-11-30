let cart = []; // Global array para sa Cart items

/**
 * Nagre-render ng Cart items sa HTML.
 */
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');
    const emptyMessage = document.getElementById('empty-cart-message');
    const contentWrapper = document.getElementById('cart-content-wrapper');
    const cartView = document.getElementById('cart-view');
    const checkoutView = document.getElementById('checkout-view');

    // Tiyakin na Cart View ang nakikita, at Checkout View ay nakatago
    cartView.style.display = 'block';
    checkoutView.style.display = 'none';

    // Display/Hide Cart Content
    if (cart.length === 0) {
        emptyMessage.style.display = 'block';
        contentWrapper.style.display = 'none';
        cartTotalSpan.textContent = '0';
        return;
    }

    emptyMessage.style.display = 'none';
    contentWrapper.style.display = 'block';

    let total = 0;
    // Header for cart items (using CSS Grid)
    let itemsHtml = '<div style="display: grid; grid-template-columns: 1fr 100px 100px; gap: 10px; padding-bottom: 10px; border-bottom: 1px dashed var(--border-color); font-weight: 700; color: var(--primary-color);"><span>Product</span><span style="text-align: center;">Qty</span><span style="text-align: right;">Subtotal</span></div>';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        // Item row (using CSS Grid)
        itemsHtml += `
            <div style="display: grid; grid-template-columns: 1fr 100px 100px; gap: 10px; padding: 10px 0; border-bottom: 1px solid #f0f0f0; align-items: center;">
                <p style="font-weight: 500; color: var(--text-color-dark); margin: 0;">${item.name}</p>
                
                <div style="display: flex; align-items: center; justify-content: center;">
                    <button class="cart-qty-btn" data-id="${item.id}" data-action="decrease" style="padding: 5px 8px; border: 1px solid var(--border-color); background-color: #f8f8f8; cursor: pointer; border-radius: 4px 0 0 4px; font-size: 1em;">-</button>
                    <span style="padding: 0 10px; font-weight: 700; color: var(--text-color-dark); border: 1px solid var(--border-color); border-left: none; border-right: none;">${item.quantity}</span>
                    <button class="cart-qty-btn" data-id="${item.id}" data-action="increase" style="padding: 5px 8px; border: 1px solid var(--border-color); background-color: #f8f8f8; cursor: pointer; border-radius: 0 4px 4px 0; font-size: 1em;">+</button>
                </div>
                
                <p style="font-weight: 700; color: var(--primary-color); text-align: right; margin: 0;">${itemTotal.toLocaleString('en-PH')}</p>
            </div>
        `;
    });

    cartItemsContainer.innerHTML = itemsHtml;
    // Format the total price with commas
    cartTotalSpan.textContent = total.toLocaleString('en-PH');

    // Re-attach listeners for dynamically generated quantity buttons
    document.querySelectorAll('.cart-qty-btn').forEach(button => {
        button.addEventListener('click', handleCartQuantityChange);
    });
}

/**
 * Hine-handle ang pagbabago ng quantity sa Cart.
 */
function handleCartQuantityChange(e) {
    const id = parseInt(e.currentTarget.getAttribute('data-id'));
    const action = e.currentTarget.getAttribute('data-action');
    const itemIndex = cart.findIndex(item => item.id === id);

    if (itemIndex > -1) {
        if (action === 'increase') {
            cart[itemIndex].quantity++;
        } else if (action === 'decrease') {
            cart[itemIndex].quantity--;
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1); // Tanggalin ang item kung 0 na ang quantity
            }
        }
        renderCart();
    }
}

/**
 * Nagdaragdag ng produkto sa Cart.
 */
function addToCart(productName, productPrice) {
    // Tinitingnan kung nandoon na ang item
    const existingItem = cart.find(item => item.name === productName && item.price === productPrice);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        // Nagdaragdag ng bagong item (gumagamit ng Date.now() para sa simple ID)
        cart.push({
            id: Date.now(), 
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }

    renderCart();

    // Smooth scroll papunta sa cart pagkatapos mag-add ng item
    const cartSection = document.getElementById('cart');
    if (cartSection) {
        cartSection.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Nagpapakita ng Checkout Form at Order Summary.
 */
function showCheckoutForm() {
    const cartView = document.getElementById('cart-view');
    const checkoutView = document.getElementById('checkout-view');
    const orderSummaryContainer = document.getElementById('checkout-order-summary');
    
    // 1. View Switching
    cartView.style.display = 'none';
    checkoutView.style.display = 'block';

    // 2. Build Order Summary
    let total = 0;
    let summaryHtml = '';

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        summaryHtml += `
            <div class="summary-item">
                <span>${item.name} x ${item.quantity}</span>
                <span>₱${itemTotal.toLocaleString('en-PH')}</span>
            </div>
        `;
    });
    
    // Add Total Line
    summaryHtml += `
        <div class="summary-total">
            Total Price: ₱${total.toLocaleString('en-PH')}
        </div>
    `;

    orderSummaryContainer.innerHTML = summaryHtml;

    // Scroll up to the checkout form
    checkoutView.scrollIntoView({ behavior: 'smooth' });
}


document.addEventListener('DOMContentLoaded', () => {
    // 1. Universal Smooth Scroll for all internal anchor links (e.g., href="#section")
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            if (targetId && targetId !== '#') {
              
              const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Prevent the default jump behavior ONLY IF the target is NOT the cart/checkout button, 
                    // to allow the 'add to cart' logic to run first.
                    if (!this.classList.contains('add-to-cart')) {
                        e.preventDefault();
                        targetSection.scrollIntoView({ behavior: 'smooth' });
                    }

                    // For mobile menu, close it after clicking a link
                    const mainNav = document.querySelector('.main-nav');
               
                    if (mainNav && mainNav.classList.contains('active')) {
                        mainNav.classList.remove('active');
                    }
                }
            }
        });
    });

    // 2. Smooth Accordion Animation (Uses Dynamic Height for reliable transition)
    const accordions = document.querySelectorAll('details.accordion');
    accordions.forEach(accordion => {
        accordion.addEventListener('click', (e) => {
            if (e.target.tagName === 'SUMMARY') {
                e.preventDefault();
                const wrapper = accordion.querySelector('.accordion-content-wrapper');

                // Toggle the custom class responsible for animation
             
                accordion.classList.toggle('is-open');

                if (accordion.classList.contains('is-open')) {
                    // OPEN: Set 'open'
                    accordion.setAttribute('open', '');

                    // Calculate the natural height of the content to set max-height
     
                    const contentHeight = wrapper.scrollHeight;
                    wrapper.style.maxHeight = contentHeight + 'px';
                } else {
                    // CLOSE: 
                  
                    // Set max-height to its current computed value before resetting to 0
                    wrapper.style.maxHeight = wrapper.scrollHeight + 'px';
                    // Force reflow to ensure CSS registers the starting max-height before transition
                    requestAnimationFrame(() => {
                        wrapper.style.maxHeight = '0';
                    });
                    // Remove 'open' after transition ends to allow the summary default behavior 
                    // (and to ensure the arrow icon stays consistent)
                    const handler = () => {
                        accordion.removeAttribute('open');
                        wrapper.removeEventListener('transitionend', handler);
                    };
                    wrapper.addEventListener('transitionend', handler, { once: true });
                }
            }
        });
    });

    // 3. Smooth Storage Guide Toggle (Uses CSS max-height transition via 'active' class)
    const storageToggle = document.getElementById('storage-toggle');
    const storageDetails = document.getElementById('storage-details');

    if (storageToggle && storageDetails) {
        // Toggle 'active' class to trigger CSS animation
        storageToggle.addEventListener('click', () => {
            storageDetails.classList.toggle('active');
            
            if (storageDetails.classList.contains('active')) {
                storageToggle.textContent = 'Hide Full Storage Guide';
            } else {
                storageToggle.textContent = 'View Full Storage Guide';
            }
        });
    }

    // 4. Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
 
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            // CSS now handles the max-height transition for smooth animation
            mainNav.classList.toggle('active');
        });
    }

    // 5. Add to Cart Listener
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault(); 
            
            const name = this.getAttribute('data-name');
            const price = parseInt(this.getAttribute('data-price'));
            
            addToCart(name, price);
        });
    });
    
    // 6. Proceed to Checkout Listener
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (cart.length > 0) {
                showCheckoutForm();
            } else {
                alert('Walang laman ang cart mo. Pumili muna ng produkto!');
            }
        });
    }
    
    // 7. Finalize Order Listener (UPDATED LOGIC with API Simulation for Email Notification)
    const shippingForm = document.getElementById('shipping-form');
    if (shippingForm) {
        shippingForm.addEventListener('submit', function(e) {
            e.preventDefault(); 
            
            const name = document.getElementById('checkout-name').value;
            const email = document.getElementById('checkout-email').value;
            const mobile = document.getElementById('checkout-mobile').value;
            const address = document.getElementById('checkout-address').value;
            
            // Generate order message
            const orderDetails = cart.map(item => `${item.name} (x${item.quantity})`).join(', ');
            const total = document.getElementById('cart-total').textContent;
            
            // Full message for backup/manual send
            const message = `Hello, gusto ko pong umorder. Narito ang aking details:\n\n` +
                            `Name: ${name}\n` +
                            `Email: ${email}\n` +
                            `Mobile: ${mobile}\n` +
                            `Address: ${address}\n\n` +
                            `Order: ${orderDetails}\n` +
                            `Total: ₱${total} php\n\n` +
                            `Salamat po!`;
            
            // !!! PALITAN ITO NG IYONG ACTUAL GMAIL AT FORMSPREE/API ENDPOINT !!!
            const apiEndpoint = 'https://formspree.io/f/mvgeovvd'; 
            const sellerEmail = 'Klarencegraphics@gmail.com'; 

            // Data object to send to the server/email service
            const emailData = {
                _replyto: email, // Ito ang magiging reply-to email, yung sa customer
                subject: `NEW ORDER: Tirzepatide from ${name}`, // Subject ng email na matatanggap mo
                Customer_Name: name, // Ang mga keys na ito ang magiging labels sa email
                Customer_Mobile: mobile,
                Customer_Address: address,
                Order_Details: orderDetails,
                Total_Price: `₱${total} php`,
                Full_Message: message // Ipadala ang buong formatted message
            };

            fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(emailData)
            })
            .then(response => {
                if (response.ok) {
                    alert(`Order Successfully Finalized! We have successfully sent the order details to your email. (${sellerEmail}).\n\nThank you, ${name}!`);
                } else {
                    // Mag-a-alert kung nag-fail ang submission (network o server error)
                    alert(`ORDER SUBMISSION FAILED (Code: ${response.status}). Please copy the details below and send them manually to ${sellerEmail}:\n\n` + message);
                }
            })
            .catch(error => {
                console.error('Network or Fetch Error:', error);
                alert('ORDER SUBMISSION FAILED DUE TO NETWORK ERROR. Please copy the details below and send them manually:\n\n' + message);
            })
            .finally(() => {
                // Clear the cart, reset form, and switch views regardless of success/fail
                cart = [];
                shippingForm.reset();
                document.getElementById('checkout-view').style.display = 'none';
                document.getElementById('cart-view').style.display = 'block';
                renderCart();
                document.getElementById('cart').scrollIntoView({ behavior: 'smooth' });
            });
        });
    }
    
    // Initial render ng cart kapag nag-load ang page (Existing Logic)
    renderCart();
});