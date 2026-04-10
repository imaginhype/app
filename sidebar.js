// ============================================
// SIDEBAR CONTROLLER - Marketplace Pro
// ============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { firebaseConfig } from './firebase-config.js';
import { getNavigationMenu, ROLES } from './permissions.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUserRole = null;
let currentUserData = null;

export function initSidebar() {
    const sidebar = document.querySelector('.desktop-sidebar');
    const toggleBtn = document.getElementById('sidebarToggleBtn');
    
    if (sidebar && toggleBtn) {
        const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        if (isCollapsed) {
            sidebar.classList.add('collapsed');
            toggleBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        } else {
            toggleBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        }
        
        // Remove existing listener to avoid duplicates
        const newToggleBtn = toggleBtn.cloneNode(true);
        toggleBtn.parentNode.replaceChild(newToggleBtn, toggleBtn);
        
        newToggleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const sidebarEl = document.querySelector('.desktop-sidebar');
            if (sidebarEl) {
                sidebarEl.classList.toggle('collapsed');
                const collapsed = sidebarEl.classList.contains('collapsed');
                localStorage.setItem('sidebarCollapsed', collapsed);
                this.innerHTML = collapsed ? '<i class="fas fa-chevron-right"></i>' : '<i class="fas fa-chevron-left"></i>';
            }
        });
    }
    
    // Load role-based menu
    loadRoleBasedMenu();
}

async function loadRoleBasedMenu() {
    // Wait for auth to be ready
    const user = await getCurrentUser();
    if (!user) {
        console.log('No user logged in, waiting for auth');
        setTimeout(() => loadRoleBasedMenu(), 500);
        return;
    }
    
    try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
            console.log('User document not found');
            return;
        }
        
        currentUserData = userDoc.data();
        currentUserRole = currentUserData.role;
        
        console.log('User role detected:', currentUserRole);
        
        // Update panel labels
        const mobileLabel = document.getElementById('mobile-panel-label');
        const desktopLabel = document.getElementById('desktop-panel-label');
        
        let panelText = 'Panel';
        if (currentUserRole === ROLES.ADMIN) panelText = 'Admin Panel';
        else if (currentUserRole === ROLES.MANAGER) panelText = 'Manager Panel';
        else if (currentUserRole === ROLES.SELLER) panelText = 'Seller Panel';
        
        if (mobileLabel) mobileLabel.textContent = panelText;
        if (desktopLabel) desktopLabel.textContent = panelText;
        
        updateMobileMenu();
        updateDesktopMenu();
        
    } catch (error) {
        console.error('Error loading user role:', error);
    }
}

function getCurrentUser() {
    return new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            unsubscribe();
            resolve(user);
        });
    });
}

function updateMobileMenu() {
    const mobileNav = document.getElementById('mobile-nav');
    if (!mobileNav) {
        console.log('mobile-nav element not found, will retry');
        setTimeout(() => updateMobileMenu(), 200);
        return;
    }
    
    const menus = getNavigationMenu(currentUserRole);
    const currentPage = window.location.pathname.split('/').pop();
    
    if (menus.length === 0) {
        console.log('No menus found for role:', currentUserRole);
        return;
    }
    
    mobileNav.innerHTML = menus.map(menu => {
        const isActive = menu.link === currentPage;
        return `<a href="${menu.link}" class="nav-item ${isActive ? 'active' : ''}">
                    <i class="fas fa-${menu.icon} w-5"></i>
                    <span>${menu.name}</span>
                </a>`;
    }).join('');
}

function updateDesktopMenu() {
    const desktopNav = document.getElementById('desktop-nav');
    if (!desktopNav) {
        console.log('desktop-nav element not found, will retry');
        setTimeout(() => updateDesktopMenu(), 200);
        return;
    }
    
    const menus = getNavigationMenu(currentUserRole);
    const currentPage = window.location.pathname.split('/').pop();
    
    if (menus.length === 0) {
        console.log('No menus found for role:', currentUserRole);
        return;
    }
    
    desktopNav.innerHTML = menus.map(menu => {
        const isActive = menu.link === currentPage;
        return `<a href="${menu.link}" class="nav-item ${isActive ? 'active' : ''}">
                    <i class="fas fa-${menu.icon} w-5"></i>
                    <span>${menu.name}</span>
                </a>`;
    }).join('');
}

// ============================================
// MOBILE MENU FUNCTIONS
// ============================================

window.toggleMobileMenu = function() {
    const sidebar = document.getElementById('mobile-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) {
        sidebar.classList.toggle('show');
    }
    if (overlay) {
        overlay.classList.toggle('show');
    }
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
    if (overlay && overlay.classList.contains('show') && event.target === overlay) {
        window.closeMobileMenu();
    }
});

// ============================================
// USER MENU FUNCTIONS
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
    if (dropdown && !dropdown.classList.contains('hidden')) {
        if (userButton && !userButton.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.classList.add('hidden');
            const chevron = document.getElementById('user-chevron');
            if (chevron) {
                chevron.style.transform = 'rotate(0deg)';
            }
        }
    }
});

// ============================================
// THEME FUNCTIONS
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

// Apply saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

// ============================================
// SIDEBAR COLLAPSED STATE
// ============================================

const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
if (isCollapsed) {
    document.documentElement.classList.add('sidebar-collapsed');
}

// ============================================
// LOGOUT FUNCTION
// ============================================

window.logout = async () => {
    await signOut(auth);
    window.location.href = '/';
};

// ============================================
// AUTO INITIALIZE
// ============================================

// Initialize sidebar when DOM is ready and sidebar exists
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.querySelector('.desktop-sidebar')) {
            initSidebar();
        }
    });
} else {
    if (document.querySelector('.desktop-sidebar')) {
        initSidebar();
    }
}