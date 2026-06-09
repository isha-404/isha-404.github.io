
/* reveal transitions activate  */
document.body.classList.add('js');

// DYNAMIC NAVBAR

const header = document.getElementById('main-header');

// Scrolled shadow state
function updateNavScroll() {
    if (window.scrollY > 40) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}
window.addEventListener('scroll', updateNavScroll, { passive: true });
updateNavScroll(); // run once on load


// Active section highlighting on nav
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a[data-section]');

function updateActiveNav() {
    let currentSection = '';

    sections.forEach(section => {
        // If the top of the section is within 120px above the viewport midpoint, mark it active
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop <= 120) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === currentSection) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav(); // run once on load


// CONTACT FORM VALIDATION

const contactForm = document.getElementById('contactForm');
const nameInput = document.getElementById('nameInput');
const emailInput = document.getElementById('emailInput');
const msgInput = document.getElementById('msgInput');
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const msgError = document.getElementById('msgError');
const formSuccess = document.getElementById('formSuccess');

// Helper: validate email format with regex
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// Helper: show field error
function showError(input, errorEl, msg) {
    input.classList.add('invalid');
    errorEl.textContent = ''; // clear first
    // Rebuild with icon since textContent clears everything
    errorEl.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${msg}`;
    errorEl.classList.add('show');
}

// Helper: clear field error
function clearError(input, errorEl) {
    input.classList.remove('invalid');
    errorEl.classList.remove('show');
}

// Live validation: clear error once user starts fixing the field
nameInput.addEventListener('input', () => { if (nameInput.value.trim()) clearError(nameInput, nameError); });
emailInput.addEventListener('input', () => { if (isValidEmail(emailInput.value)) clearError(emailInput, emailError); });
msgInput.addEventListener('input', () => { if (msgInput.value.trim()) clearError(msgInput, msgError); });

// Form submit
contactForm.addEventListener('submit', function (e) {
    e.preventDefault(); // stop browser default submit

    let valid = true;

    // Validate name
    if (!nameInput.value.trim()) {
        showError(nameInput, nameError, "Name can't be empty!");
        valid = false;
    } else {
        clearError(nameInput, nameError);
    }

    // Validate email
    if (!emailInput.value.trim()) {
        showError(emailInput, emailError, "Email can't be empty!");
        valid = false;
    } else if (!isValidEmail(emailInput.value)) {
        showError(emailInput, emailError, "Please enter a valid email address.");
        valid = false;
    } else {
        clearError(emailInput, emailError);
    }

    // Validate message
    if (!msgInput.value.trim()) {
        showError(msgInput, msgError, "Message can't be empty!");
        valid = false;
    } else {
        clearError(msgInput, msgError);
    }

    // If all valid, show success state
    if (valid) {
        formSuccess.classList.add('show');
        contactForm.reset();
        // Hide success message after 5 seconds
        setTimeout(() => formSuccess.classList.remove('show'), 5000);
    }
});


// DARK MODE TOGGLE

const darkToggle = document.getElementById('darkToggle');
const darkIcon = document.getElementById('darkIcon');

// Read saved preference; default to light
const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

darkToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
});

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
        darkIcon.className = 'fa-solid fa-sun';
        darkToggle.title = 'Switch to light mode';
    } else {
        darkIcon.className = 'fa-solid fa-moon';
        darkToggle.title = 'Switch to dark mode';
    }
}


// SCROLL REVEAL (unchanged)

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
            const idx = siblings.indexOf(entry.target);
            entry.target.style.transitionDelay = (idx * 0.08) + 's';
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));