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
    const animElements = document.querySelectorAll('.fade-in-section, .scroll-reveal');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    entry.target.classList.add('active');
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



        // 5. Web3Forms Keys Configuration (Batch 1.5.1 - Triple Key parallel delivery)
    // Replace placeholders with your Web3Forms access keys once generated.
    const web3formsKeys = {
        email1: '086f97f4-6e1d-4839-b4db-ad6e09616855',       // for info@eatsufra.com
        email2: 'bf08b95d-8a64-4362-8000-1196f77c618d',  // for vikram.singh@kamabistro.com
        email3: 'bcf9f1cf-dbf8-4279-9eb1-9c0231ed1fa8'   // for nilesh.bazari@kamabistro.com
    };

    // Helper function to submit form data to Web3Forms (supports multiple parallel keys)
    function submitToWeb3Forms(formElement, additionalData = {}) {
        const promises = [];
        
        const keysToSubmit = [
            web3formsKeys.email1,
            web3formsKeys.email2,
            web3formsKeys.email3
        ];

        keysToSubmit.forEach(key => {
            if (key && key.trim() !== '') {
                const formData = new FormData(formElement);
                formData.append('access_key', key);
                for (let [k, val] of Object.entries(additionalData)) {
                    formData.append(k, val);
                }
                promises.push(
                    fetch('https://api.web3forms.com/submit', {
                        method: 'POST',
                        body: formData
                    }).then(res => res.json())
                );
            }
        });
        
        // If no keys are configured, fallback simulating success
        if (promises.length === 0) {
            console.warn('Web3Forms keys are not configured yet. Simulating success in local workspace.');
            return Promise.resolve({ success: true });
        }
        
        return Promise.all(promises).then(results => {
            const allSuccess = results.every(res => res.success);
            return { success: allSuccess };
        }).catch(err => {
            console.error('Error submitting form to Web3Forms:', err);
            return { success: false };
        });
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
            
            if (!name || !email || !phone || !eventType || !guests || !date) {
                alert('Please fill out all required fields.');
                return;
            }
            
            const submitBtn = document.getElementById('cat-submit-btn') || document.querySelector('#catering-form button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
            }
            
            const formattedDate = new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            // Submit to Web3Forms
            submitToWeb3Forms(forms.catering, {
                subject: `Sufra Catering lead (Website): ${eventType}`,
                from_name: 'Sufra Catering Leads'
            }).then(result => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Request Catering Quote';
                }
                
                if (result.success) {
                    showModal(
                        'Catering Quote Requested',
                        `Thank you for choosing Sufra Catering, <strong>${name}</strong>!<br><br>
                         We are excited to assist with your <strong>${eventType}</strong> for <strong>${guests}</strong> on <strong>${formattedDate}</strong>.<br><br>
                         A customized proposal has been sent to <strong>${email}</strong>, and our catering team will follow up via phone at <strong>${phone}</strong> within 24 business hours.`
                    );
                    forms.catering.reset();
                } else {
                    alert('Submission failed. Please check your internet connection and try again.');
                }
            });
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
            
            const submitBtn = document.getElementById('contact-submit-btn') || document.querySelector('#contact-form button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
            }
            
            // Submit to Web3Forms
            submitToWeb3Forms(forms.contact, {
                subject: `Sufra Website Contact Us : ${subject}`,
                from_name: 'Sufra Contact Messages'
            }).then(result => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Message';
                }
                
                if (result.success) {
                    showModal(
                        'Message Sent',
                        `Thank you, <strong>${name}</strong>!<br><br>
                         Your message regarding <strong>"${subject}"</strong> has been received by our hospitality team.<br><br>
                         We will respond to <strong>${email}</strong> as soon as possible.`
                    );
                    forms.contact.reset();
                } else {
                    alert('Submission failed. Please check your internet connection and try again.');
                }
            });
        });
    }
});