// ============================================
// LOAD SIDEBAR - Single source of truth
// ============================================

async function loadSidebar() {
    try {
        // Check if sidebar already exists
        if (document.querySelector('.desktop-sidebar')) {
            console.log('Sidebar already exists');
            if (typeof initSidebar === 'function') {
                initSidebar();
            }
            return;
        }
        
        // Try multiple possible file paths
        let sidebarHtml = null;
        let paths = ['/sidebar-content.js', '/sidebar-content', '/sidebar-content.html', '/sidebar.html'];
        
        for (const path of paths) {
            try {
                const response = await fetch(path);
                if (response.ok) {
                    sidebarHtml = await response.text();
                    console.log(`Sidebar loaded from: ${path}`);
                    break;
                }
            } catch(e) {}
        }
        
        if (!sidebarHtml) {
            console.error('Could not load sidebar from any path');
            return;
        }
        
        // Insert sidebar at the beginning of body
        document.body.insertAdjacentHTML('afterbegin', sidebarHtml);
        
        // Initialize sidebar functionality after DOM is updated
        setTimeout(() => {
            if (typeof initSidebar === 'function') {
                initSidebar();
            } else {
                import('./sidebar.js').then(module => {
                    if (module.initSidebar) module.initSidebar();
                }).catch(e => console.error('Failed to load sidebar.js:', e));
            }
        }, 100);
        
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