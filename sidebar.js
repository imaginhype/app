// ============================================
// SIDEBAR CONTROLLER - SIMPLE NO-FLICKER VERSION
// ============================================

(function() {
    // Function to get sidebar state from localStorage
    function getSidebarState() {
        return localStorage.getItem('sidebarCollapsed') === 'true';
    }

    // Function to apply sidebar state to HTML class
    function applySidebarStateToHtml() {
        if (getSidebarState()) {
            document.documentElement.classList.add('sidebar-collapsed');
        } else {
            document.documentElement.classList.remove('sidebar-collapsed');
        }
    }

    // Apply state to HTML element IMMEDIATELY
    applySidebarStateToHtml();

    // Wait for DOM to be ready for toggle button
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initToggleButton);
    } else {
        initToggleButton();
    }

    function initToggleButton() {
        const toggleBtn = document.getElementById('sidebarToggleBtn');
        if (!toggleBtn) return;

        // Set button icon based on current state
        const isCollapsed = getSidebarState();
        toggleBtn.innerHTML = isCollapsed ? '<i class="fas fa-chevron-right"></i>' : '<i class="fas fa-chevron-left"></i>';

        // Toggle sidebar when button is clicked
        toggleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const currentState = getSidebarState();
            const newState = !currentState;
            localStorage.setItem('sidebarCollapsed', newState);
            
            if (newState) {
                document.documentElement.classList.add('sidebar-collapsed');
                toggleBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
            } else {
                document.documentElement.classList.remove('sidebar-collapsed');
                toggleBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
            }
        });
    }
})();

// ============================================
// MOBILE MENU FUNCTIONS (Global)
// ============================================

window.toggleMobileMenu = function() {
    const sidebar = document.getElementById('mobile-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) sidebar.classList.toggle('show');
    if (overlay) overlay.classList.toggle('show');
    document.body.style.overflow = sidebar?.classList.contains('show') ? 'hidden' : '';
};

window.closeMobileMenu = function() {
    const sidebar = document.getElementById('mobile-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) sidebar.classList.remove('show');
    if (overlay) overlay.classList.remove('show');
    document.body.style.overflow = '';
};

document.addEventListener('click', function(event) {
    const overlay = document.getElementById('sidebar-overlay');
    const mobileSidebar = document.getElementById('mobile-sidebar');
    if (overlay && overlay.classList.contains('show') && event.target === overlay) {
        closeMobileMenu();
    }
});

// ============================================
// USER MENU FUNCTIONS (Global)
// ============================================

window.toggleUserMenu = function() {
    const dropdown = document.getElementById('user-dropdown');
    const chevron = document.getElementById('user-chevron');
    if (dropdown) {
        const isHidden = dropdown.classList.contains('hidden');
        dropdown.classList.toggle('hidden');
        if (chevron) {
            chevron.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
        }
    }
};

document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('user-dropdown');
    const userButton = document.querySelector('[onclick="toggleUserMenu()"]');
    if (dropdown && userButton && !userButton.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.classList.add('hidden');
        const chevron = document.getElementById('user-chevron');
        if (chevron) {
            chevron.style.transform = 'rotate(0deg)';
        }
    }
});

// ============================================
// THEME FUNCTIONS (Global)
// ============================================

window.toggleTheme = function() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
    
    const moonIcons = document.querySelectorAll('.fa-moon');
    const sunIcons = document.querySelectorAll('.fa-sun');
    if (nextTheme === 'dark') {
        moonIcons.forEach(icon => icon.style.display = 'inline');
        sunIcons.forEach(icon => icon.style.display = 'none');
    } else {
        moonIcons.forEach(icon => icon.style.display = 'none');
        sunIcons.forEach(icon => icon.style.display = 'inline');
    }
};

const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
