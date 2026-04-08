// ============================================
// SIDEBAR CONTROLLER - Shared across all pages
// ============================================

(function() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSidebar);
    } else {
        initSidebar();
    }

    function initSidebar() {
        const sidebar = document.querySelector('.desktop-sidebar');
        const toggleBtn = document.getElementById('sidebarToggleBtn');
        
        if (!sidebar || !toggleBtn) return;
        
        // Load saved state from localStorage
        const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        
        // Apply saved state immediately - NO ANIMATION on page load
        if (isCollapsed) {
            sidebar.classList.add('collapsed');
            toggleBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        } else {
            sidebar.classList.remove('collapsed');
            toggleBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        }
        
        // Toggle sidebar when button is clicked
        toggleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            sidebar.classList.toggle('collapsed');
            const collapsed = sidebar.classList.contains('collapsed');
            localStorage.setItem('sidebarCollapsed', collapsed);
            toggleBtn.innerHTML = collapsed ? '<i class="fas fa-chevron-right"></i>' : '<i class="fas fa-chevron-left"></i>';
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

// Close mobile menu when clicking overlay
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

// Close user menu when clicking outside
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
    
    // Update moon/sun icons if present
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

// Initialize theme on page load - NO FLASH
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
