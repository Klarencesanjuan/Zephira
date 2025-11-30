document.addEventListener('DOMContentLoaded', () => {

    // 1. Universal Smooth Scroll for all internal anchor links (e.g., href="#section")
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Prevent the default jump behavior
                    e.preventDefault();
                    
                    // Smooth scroll to the target section
                    targetSection.scrollIntoView({
                         behavior: 'smooth' 
                    });

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
                    // OPEN: Set 'open' attribute for accessibility/marker
        
                     accordion.setAttribute('open', '');
                    
                    // Set max-height to the actual scroll height
                    // We add a slight buffer (+20px) for reliable animation
                    wrapper.style.maxHeight = wrapper.scrollHeight + 20 + 'px';

                } else {
                    // CLOSE: Set max-height back to its current height, then to 0 
               
  
                   // 1. Ensure max-height is set to current scroll height
                    wrapper.style.maxHeight = wrapper.scrollHeight + 'px';
                    // 2. Use requestAnimationFrame for immediate re-draw before setting to 0
                    requestAnimationFrame(() => {
                        accordion.removeAttribute('open');
                        wrapper.style.maxHeight = '0';
                  
                    });
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
});