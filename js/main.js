/**
 * Sufra Authentic Yemeni Cuisine - Main JavaScript Script
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Header Scroll effect
    const header = document.querySelector('header');
    
    function checkScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Run once in case page loads scrolled

    // 2. Mobile Navigation Toggle
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // 3. Scroll Reveal Animations (Intersection Observer)
    const animElements = document.querySelectorAll('.fade-in-section');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Animates once
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for older browsers
        animElements.forEach(el => el.classList.add('is-visible'));
    }

    // 4. Menu Filtering Logic (Tabs)
    const tabButtons = document.querySelectorAll('.menu-tab-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    
    if (tabButtons.length > 0 && menuItems.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from other buttons
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const filter = button.getAttribute('data-filter');
                
                menuItems.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.display = 'flex';
                        // Add transition trigger
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(15px)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // 5. Custom Success Modals & Form Validations
    const forms = {
        catering: document.getElementById('catering-form'),
        contact: document.getElementById('contact-form')
    };
    
    const modalOverlay = document.getElementById('success-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    
    // Setup modal close handler
    if (modalCloseBtn && modalOverlay) {
        modalCloseBtn.addEventListener('click', () => {
            modalOverlay.classList.remove('active');
        });
        
        // Close on clicking overlay background
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('active');
            }
        });
    }
    
    function showModal(title, message) {
        if (modalOverlay && modalTitle && modalMessage) {
            modalTitle.textContent = title;
            modalMessage.innerHTML = message;
            modalOverlay.classList.add('active');
        } else {
            alert(`${title}\n\n${message.replace(/<[^>]*>/g, '')}`);
        }
    }



    // Handle Catering Form Submission
    if (forms.catering) {
        forms.catering.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('cat-name').value;
            const email = document.getElementById('cat-email').value;
            const phone = document.getElementById('cat-phone').value;
            const eventType = document.getElementById('cat-event').value;
            const guests = document.getElementById('cat-guests').value;
            const date = document.getElementById('cat-date').value;
            const notes = document.getElementById('cat-notes').value || 'None';
            
            if (!name || !email || !phone || !eventType || !guests || !date) {
                alert('Please fill out all required fields.');
                return;
            }
            
            const formattedDate = new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            showModal(
                'Catering Quote Requested',
                `Thank you for choosing Sufra Catering, <strong>${name}</strong>!<br><br>
                 We are excited to assist with your <strong>${eventType}</strong> for <strong>${guests} guests</strong> on <strong>${formattedDate}</strong>.<br><br>
                 A customized proposal has been sent to <strong>${email}</strong>, and our catering team will follow up via phone at <strong>${phone}</strong> within 24 business hours.`
            );
            
            forms.catering.reset();
        });
    }

    // Handle Contact Form Submission
    if (forms.contact) {
        forms.contact.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('con-name').value;
            const email = document.getElementById('con-email').value;
            const subject = document.getElementById('con-subject').value;
            const message = document.getElementById('con-message').value;
            
            if (!name || !email || !subject || !message) {
                alert('Please fill out all fields.');
                return;
            }
            
            showModal(
                'Message Sent',
                `Thank you, <strong>${name}</strong>!<br><br>
                 Your message regarding <strong>"${subject}"</strong> has been received by our hospitality team.<br><br>
                 We will respond to <strong>${email}</strong> as soon as possible.`
            );
            
            forms.contact.reset();
        });
    }
});
