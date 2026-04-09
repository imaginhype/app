// ============================================
// SIDEBAR CONTROLLER - Marketplace Pro
// ============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { firebaseConfig } from './firebase-config.js';
import { getNavigationMenu, ROLES } from './permissions.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Global variables
let currentUserRole = null;
let currentUserData = null;

// Initialize sidebar toggle after sidebar is loaded
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
        
        toggleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            sidebar.classList.toggle('collapsed');
            const collapsed = sidebar.classList.contains('collapsed');
            localStorage.setItem('sidebarCollapsed', collapsed);
            toggleBtn.innerHTML = collapsed ? '<i class="fas fa-chevron-right"></i>' : '<i class="fas fa-chevron-left"></i>';
        });
    }
    
    // Load role-based menu after user is authenticated
    loadRoleBasedMenu();
}

async function loadRoleBasedMenu() {
    const user = await getCurrentUser();
    if (!user) return;
    
    const userDoc = await getUserDoc(user.uid);
    if (!userDoc) return;
    
    currentUserRole = userDoc.role;
    currentUserData = userDoc;
    
    // Update panel labels based on role
    const panelLabel = document.getElementById('mobile-panel-label');
    const desktopLabel = document.getElementById('desktop-panel-label');
    
    if (currentUserRole === ROLES.ADMIN) {
        if (panelLabel) panelLabel.textContent = 'Admin Panel';
        if (desktopLabel) desktopLabel.textContent = 'Admin Panel';
    } else if (currentUserRole === ROLES.MANAGER) {
        if (panelLabel) panelLabel.textContent = 'Manager Panel';
        if (desktopLabel) desktopLabel.textContent = 'Manager Panel';
    } else {
        if (panelLabel) panelLabel.textContent = 'Seller Panel';
        if (desktopLabel) desktopLabel.textContent = 'Seller Panel';
    }
    
    updateMobileMenu();
    updateDesktopMenu();
}

function updateMobileMenu() {
    const mobileNav = document.querySelector('#mobile-nav');
    if (!mobileNav) return;
    
    const menus = getNavigationMenu(currentUserRole);
    const currentPage = window.location.pathname.split('/').pop();
    
    mobileNav.innerHTML = menus.map(menu => {
        const isActive = menu.link === currentPage;
        return `<a href="${menu.link}" class="nav-item ${isActive ? 'active' : ''}">
                    <i class="fas fa-${menu.icon} w-5"></i>
                    <span>${menu.name}</span>
                </a>`;
    }).join('');
}

function updateDesktopMenu() {
    const desktopNav = document.querySelector('#desktop-nav');
    if (!desktopNav) return;
    
    const menus = getNavigationMenu(currentUserRole);
    const currentPage = window.location.pathname.split('/').pop();
    
    desktopNav.innerHTML = menus.map(menu => {
        const isActive = menu.link === currentPage;
        return `<a href="${menu.link}" class="nav-item ${isActive ? 'active' : ''}">
                    <i class="fas fa-${menu.icon} w-5"></i>
                    <span>${menu.name}</span>
                </a>`;
    }).join('');
}

async function getCurrentUser() {
    return new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            unsubscribe();
            resolve(user);
        });
    });
}

async function getUserDoc(uid) {
    try {
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        }
        return null;
    } catch (error) {
        console.error('Error getting user doc:', error);
        return null;
    }
}

// ============================================
// MOBILE MENU FUNCTIONS
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
    if (overlay && overlay.classList.contains('show') && event.target === overlay) {
        closeMobileMenu();
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

const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

// ============================================
// LOGOUT FUNCTION
// ============================================

window.logout = async () => {
    await signOut(auth);
    window.location.href = '/';
};
