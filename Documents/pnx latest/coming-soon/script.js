// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Wait for DOM and config to load
document.addEventListener('DOMContentLoaded', function () {
    // Force scroll to top
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    initializeWaitlist();

    // Initialize countdown timer with a small delay to ensure DOM is ready
    setTimeout(() => {
        initCountdown();
    }, 100);
});

function initializeWaitlist() {
    // Waitlist Form Handler
    const form = document.getElementById('waitlist-form');
    if (!form) return;

    const emailInput = document.getElementById('email-input');
    const formMessage = document.getElementById('form-message');
    const submitBtn = form.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');

    // Form submission handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();

        // Validate email
        if (!email) {
            showMessage('Please enter your email address', 'error');
            return;
        }

        if (!emailRegex.test(email)) {
            showMessage('Please enter a valid email address', 'error');
            return;
        }

        // Show loading state
        setLoadingState(true);
        showMessage('', '');

        try {
            const result = await submitEmail(email);

            // Show congratulations popup
            showCongratulationsPopup(result.already_registered);

            // Success message
            const message = result.already_registered
                ? '✅ You\'re already on the waitlist! We\'ll notify you when we launch.'
                : '🎉 Successfully joined! Check your email for confirmation. We\'ll notify you the moment we launch.';

            showMessage(message, 'success');
            emailInput.value = '';

            // Track conversion
            if (typeof gtag !== 'undefined') {
                gtag('event', 'waitlist_signup', {
                    'event_category': 'engagement',
                    'event_label': 'coming_soon_page'
                });
            }

        } catch (error) {
            // Production: Don't log sensitive errors to console
            // Show user-friendly error message
            const errorMessage = error.message || 'Something went wrong. Please try again later.';
            showMessage(`❌ ${errorMessage}`, 'error');

            // Only log in development
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.error('Form submission error:', error);
            }
        } finally {
            setLoadingState(false);
        }
    });

    // Set loading state function (scoped to form)
    function setLoadingState(loading) {
        if (loading) {
            submitBtn.disabled = true;
            btnText.innerHTML = '<span class="loading"></span>';
            submitBtn.querySelector('.btn-icon').style.display = 'none';
        } else {
            submitBtn.disabled = false;
            btnText.textContent = 'Get Early Access';
            submitBtn.querySelector('.btn-icon').style.display = 'block';
        }
    }

    // Show message function (scoped to form)
    function showMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = 'form-message ' + (type || '');

        if (message) {
            formMessage.style.opacity = '1';
        } else {
            formMessage.style.opacity = '0';
        }
    }

    // Focus logic removed to prevent auto-scroll
    // if (emailInput) {
    //     setTimeout(() => emailInput.focus(), 100);
    // }
}

// Supabase Configuration (from config.js)
// Wait for config to load if needed
function getSupabaseConfig() {
    // Try to get from window object (loaded from config.js)
    if (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.url && window.SUPABASE_CONFIG.anonKey) {
        return {
            url: window.SUPABASE_CONFIG.url.trim(),
            anonKey: window.SUPABASE_CONFIG.anonKey.trim()
        };
    }

    // Fallback to direct values if config.js not loaded
    return {
        url: 'https://gzixgybxsqnbmecwlrat.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6aXhneWJ4c3FuYm1lY3dscmF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MDA4NDUsImV4cCI6MjA4MTI3Njg0NX0.Catgom4hNSrvNhfy8hbppiHAwQLDh73IB0ueTA-1cjg'
    };
}

// Submit email function - Supabase Integration
async function submitEmail(email) {
    // Get configuration
    const config = getSupabaseConfig();
    const SUPABASE_URL = config.url;
    const SUPABASE_ANON_KEY = config.anonKey;

    // Validate configuration
    if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY.trim() === '' || SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY_HERE') {
        throw new Error('Service configuration error. Please contact support.');
    }

    if (!SUPABASE_URL || !SUPABASE_URL.includes('supabase.co')) {
        throw new Error('Service configuration error. Please contact support.');
    }

    try {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('Submitting email to waitlist...');
        }

        const requestBody = {
            email: email.toLowerCase().trim()
        };

        // Add optional fields
        const ip = await getClientIP().catch(() => null);
        if (ip) requestBody.ip_address = ip;
        if (navigator.userAgent) requestBody.user_agent = navigator.userAgent;

        const cleanUrl = SUPABASE_URL.replace(/\/$/, '');
        const apiUrl = `${cleanUrl}/rest/v1/waitlist`;
        const cleanAnonKey = SUPABASE_ANON_KEY.trim();

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': cleanAnonKey,
                'Authorization': `Bearer ${cleanAnonKey}`,
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(requestBody),
        });

        if (response.status === 409) {
            return {
                success: true,
                already_registered: true,
                message: 'Email already registered'
            };
        }

        if (!response.ok) {
            let errorData = {};
            try {
                errorData = await response.json();
            } catch (e) {
                errorData = { message: response.statusText };
            }
            throw new Error(errorData.message || 'Something went wrong. Please try again.');
        }

        const data = await response.json();
        return {
            success: true,
            already_registered: false,
            message: 'Successfully added to waitlist',
            data: data[0] || data
        };

    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Helper function to get client IP (optional)
async function getClientIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch {
        return null;
    }
}


// Add smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

// Add intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Add parallax effect to background orbs on scroll
let lastScrollY = 0;
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const orbs = document.querySelectorAll('.gradient-orb');

    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 0.5;
        const yPos = -(scrollY * speed);
        orb.style.transform = `translateY(${yPos}px)`;
    });

    lastScrollY = scrollY;
}, { passive: true });

// Add keyboard navigation
emailInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !submitBtn.disabled) {
        form.dispatchEvent(new Event('submit'));
    }
});


// Countdown Timer
function initCountdown() {
    // Set launch date: January 1st, 2026 at 12:00 AM (midnight of Dec 31st, 2025)
    // Using local timezone - adjust if needed for specific timezone
    const launchDate = new Date('2026-01-01T00:00:00').getTime();

    // Verify launch date is valid
    if (isNaN(launchDate)) {
        console.error('Invalid launch date');
        return;
    }

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    // Check if elements exist
    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) {
        console.warn('Countdown elements not found');
        return;
    }

    let hasNotified = false; // Track if we've already triggered notification

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = launchDate - now;

        // If countdown is over, show "We're Live" message and trigger email notifications
        if (distance < 0) {
            const countdownContainer = document.querySelector('.countdown-container');
            if (countdownContainer) {
                countdownContainer.innerHTML = '<h2 class="countdown-title" style="font-size: 2.5rem; color: var(--success-color); font-weight: 800; animation: pulse 2s ease-in-out infinite;">🎉 We\'re Live!</h2>';
            }

            // Trigger email notification to all waitlist users (only once)
            if (!hasNotified) {
                hasNotified = true;
                triggerLaunchNotifications();
            }
            return;
        }

        // Calculate time units
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update display with leading zeros
        const daysStr = String(days).padStart(2, '0');
        const hoursStr = String(hours).padStart(2, '0');
        const minutesStr = String(minutes).padStart(2, '0');
        const secondsStr = String(seconds).padStart(2, '0');

        // Only update if value changed (prevents unnecessary repaints)
        if (daysEl.textContent !== daysStr) {
            daysEl.textContent = daysStr;
            daysEl.style.animation = 'none';
            setTimeout(() => daysEl.style.animation = '', 10);
        }
        if (hoursEl.textContent !== hoursStr) {
            hoursEl.textContent = hoursStr;
            hoursEl.style.animation = 'none';
            setTimeout(() => hoursEl.style.animation = '', 10);
        }
        if (minutesEl.textContent !== minutesStr) {
            minutesEl.textContent = minutesStr;
            minutesEl.style.animation = 'none';
            setTimeout(() => minutesEl.style.animation = '', 10);
        }
        if (secondsEl.textContent !== secondsStr) {
            secondsEl.textContent = secondsStr;
            // Pulse animation on second change
            secondsEl.style.transform = 'scale(1.15)';
            secondsEl.style.opacity = '0.9';
            setTimeout(() => {
                secondsEl.style.transform = 'scale(1)';
                secondsEl.style.opacity = '1';
            }, 300);
        }
    }

    // Update immediately
    updateCountdown();

    // Update every second
    setInterval(updateCountdown, 1000);
}

// Trigger email notifications when launch happens
async function triggerLaunchNotifications() {
    try {
        const config = getSupabaseConfig();
        if (!config || !config.url || !config.anonKey) {
            console.warn('Supabase config not available for launch notifications');
            return;
        }

        // Call Supabase function to mark all waitlist users as notified
        // Note: Actual email sending should be handled by a backend service/edge function
        const response = await fetch(`${config.url}/rest/v1/rpc/notify_waitlist_launch`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': config.anonKey,
                'Authorization': `Bearer ${config.anonKey}`,
                'Prefer': 'return=representation'
            }
        });

        if (response.ok) {
            console.log('Launch notifications triggered successfully');
        } else {
            console.warn('Failed to trigger launch notifications:', response.status);
        }
    } catch (error) {
        // Silent fail - this is a background operation
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.warn('Error triggering launch notifications:', error);
        }
    }
}

// Initialize countdown when page fully loads (fallback)
window.addEventListener('load', () => {
    // Only initialize if not already initialized
    const daysEl = document.getElementById('days');
    if (daysEl && daysEl.textContent === '00') {
        initCountdown();
    }

    // const emailInput = document.getElementById('email-input');
    // if (emailInput) {
    //     emailInput.focus();
    // }
});

// Congratulations Popup
function showCongratulationsPopup(alreadyRegistered = false) {
    // Create popup overlay
    const overlay = document.createElement('div');
    overlay.className = 'congratulations-overlay';
    overlay.innerHTML = `
        <div class="congratulations-popup">
            <div class="popup-content">
                <div class="popup-icon">${alreadyRegistered ? '✅' : '🎉'}</div>
                <h2 class="popup-title">${alreadyRegistered ? 'Already Registered!' : 'Congratulations!'}</h2>
                <p class="popup-message">
                    ${alreadyRegistered
            ? 'You\'re already on our waitlist. We\'ll notify you when we launch!'
            : 'You\'ve successfully joined the PNX waitlist! We\'ll send you an email confirmation and notify you the moment we launch.'}
                </p>
                <button class="popup-close-btn" onclick="this.closest('.congratulations-overlay').remove()">
                    Awesome!
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // Auto close after 5 seconds
    setTimeout(() => {
        if (overlay.parentNode) {
            overlay.remove();
        }
    }, 5000);

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    });
}

// Add analytics tracking (if needed)
if (typeof gtag !== 'undefined') {
    gtag('event', 'page_view', {
        'page_title': 'Coming Soon',
        'page_location': window.location.href
    });
}

