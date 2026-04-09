// ============================================
// LOAD SIDEBAR - Single source of truth
// ============================================

// Load sidebar HTML and inject into page
async function loadSidebar() {
    try {
        const response = await fetch('/sidebar-content.html');
        const sidebarHtml = await response.text();
        
        // Insert sidebar at the beginning of body (after any existing content)
        document.body.insertAdjacentHTML('afterbegin', sidebarHtml);
        
        // Initialize sidebar functionality after DOM is updated
        if (typeof initSidebar === 'function') {
            initSidebar();
        }
    } catch (error) {
        console.error('Error loading sidebar:', error);
    }
}

// Load sidebar when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSidebar);
} else {
    loadSidebar();
}
