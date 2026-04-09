// ============================================
// PERMISSIONS & ROLES - Marketplace Pro
// ============================================

// Role definitions
export const ROLES = {
    ADMIN: 'admin',
    MANAGER: 'manager',
    SELLER: 'seller'
};

// Permission definitions - what each role can do
export const PERMISSIONS = {
    // User Management (Admin only)
    MANAGE_USERS: [ROLES.ADMIN],
    VIEW_USERS: [ROLES.ADMIN, ROLES.MANAGER],
    CHANGE_USER_ROLES: [ROLES.ADMIN],
    SUSPEND_USERS: [ROLES.ADMIN],
    APPROVE_SELLERS: [ROLES.ADMIN],
    
    // Product Management
    MANAGE_ALL_PRODUCTS: [ROLES.ADMIN, ROLES.MANAGER],
    VIEW_ALL_PRODUCTS: [ROLES.ADMIN, ROLES.MANAGER],
    VIEW_PRODUCTS: [ROLES.ADMIN, ROLES.MANAGER, ROLES.SELLER],
    CREATE_PRODUCT: [ROLES.ADMIN, ROLES.MANAGER],
    EDIT_PRODUCT: [ROLES.ADMIN, ROLES.MANAGER],
    DELETE_PRODUCT: [ROLES.ADMIN, ROLES.MANAGER],
    
    // Order Management
    VIEW_ALL_ORDERS: [ROLES.ADMIN, ROLES.MANAGER],
    VIEW_OWN_ORDERS: [ROLES.ADMIN, ROLES.MANAGER, ROLES.SELLER],
    UPDATE_ORDER_STATUS: [ROLES.ADMIN, ROLES.MANAGER],
    CREATE_ORDER: [ROLES.ADMIN, ROLES.MANAGER, ROLES.SELLER],
    RECORD_PAYMENTS: [ROLES.ADMIN, ROLES.MANAGER],
    
    // Seller Management
    VIEW_ALL_SELLERS: [ROLES.ADMIN, ROLES.MANAGER],
    VIEW_SELLER_BANK_DETAILS: [ROLES.ADMIN, ROLES.MANAGER],
    EDIT_SELLER_BANK_DETAILS: [ROLES.ADMIN],
    
    // Supplier Management
    MANAGE_SUPPLIERS: [ROLES.ADMIN],
    VIEW_SUPPLIERS: [ROLES.ADMIN],
    
    // Payout Management
    MANAGE_PAYOUTS: [ROLES.ADMIN],
    VIEW_PAYOUTS: [ROLES.ADMIN],
    REQUEST_PAYOUT: [ROLES.ADMIN, ROLES.MANAGER, ROLES.SELLER],
    VIEW_OWN_PAYOUTS: [ROLES.ADMIN, ROLES.MANAGER, ROLES.SELLER],
    
    // Announcements
    MANAGE_ANNOUNCEMENTS: [ROLES.ADMIN, ROLES.MANAGER],
    VIEW_ANNOUNCEMENTS: [ROLES.ADMIN, ROLES.MANAGER, ROLES.SELLER],
    
    // Reports
    VIEW_FULL_REPORTS: [ROLES.ADMIN],
    VIEW_LIMITED_REPORTS: [ROLES.ADMIN, ROLES.MANAGER],
    VIEW_OWN_REPORTS: [ROLES.ADMIN, ROLES.MANAGER, ROLES.SELLER],
    
    // Settings
    MANAGE_SETTINGS: [ROLES.ADMIN],
    VIEW_SETTINGS: [ROLES.ADMIN, ROLES.MANAGER],
    EDIT_PROFILE: [ROLES.ADMIN, ROLES.MANAGER, ROLES.SELLER],
    
    // Activity Log
    VIEW_ACTIVITY_LOG: [ROLES.ADMIN],
    
    // Support Tickets
    MANAGE_TICKETS: [ROLES.ADMIN, ROLES.MANAGER],
    CREATE_TICKET: [ROLES.ADMIN, ROLES.MANAGER, ROLES.SELLER],
    VIEW_OWN_TICKETS: [ROLES.ADMIN, ROLES.MANAGER, ROLES.SELLER],
    
    // Chat
    CHAT_WITH_ADMIN: [ROLES.ADMIN, ROLES.MANAGER, ROLES.SELLER],
    CHAT_WITH_SELLERS: [ROLES.ADMIN, ROLES.MANAGER],
    
    // Bank Details
    VIEW_OWN_BANK_DETAILS: [ROLES.ADMIN, ROLES.MANAGER, ROLES.SELLER],
    REQUEST_BANK_CHANGE: [ROLES.ADMIN, ROLES.MANAGER, ROLES.SELLER],
    APPROVE_BANK_CHANGE: [ROLES.ADMIN]
};

// Check if user has permission
export function hasPermission(userRole, permission) {
    const allowedRoles = PERMISSIONS[permission];
    if (!allowedRoles) return false;
    return allowedRoles.includes(userRole);
}

// Get navigation menu based on role
export function getNavigationMenu(role) {
    // Common menu items for all roles
    const commonMenus = [
        { name: 'Dashboard', icon: 'tachometer-alt', link: getDashboardLink(role), permission: null }
    ];
    
    // ADMIN MENUS - FULL ACCESS TO EVERYTHING
    const adminMenus = [
        { name: 'Products', icon: 'box', link: 'products.html', permission: null },
        { name: 'Add Product', icon: 'plus-circle', link: 'add-product.html', permission: null },
        { name: 'Product View', icon: 'eye', link: 'product-view.html', permission: null },
        { name: 'Orders', icon: 'shopping-cart', link: 'orders.html', permission: null },
        { name: 'Seller Orders', icon: 'list', link: 'seller-orders.html', permission: null },
        { name: 'Create Order', icon: 'plus', link: 'create-order.html', permission: null },
        { name: 'Sellers', icon: 'users', link: 'sellers.html', permission: null },
        { name: 'Suppliers', icon: 'truck', link: 'suppliers.html', permission: null },
        { name: 'Payouts', icon: 'money-bill-wave', link: 'payouts.html', permission: null },
        { name: 'Seller Payouts', icon: 'money-bill', link: 'seller-payouts.html', permission: null },
        { name: 'Bank Details', icon: 'university', link: 'bank-details.html', permission: null },
        { name: 'Announcements', icon: 'bullhorn', link: 'announcements.html', permission: null },
        { name: 'Reports', icon: 'chart-line', link: 'reports.html', permission: null },
        { name: 'Activity Log', icon: 'history', link: 'activity-log.html', permission: null },
        { name: 'Support Tickets', icon: 'ticket-alt', link: 'tickets.html', permission: null },
        { name: 'Seller Tickets', icon: 'ticket', link: 'seller-tickets.html', permission: null },
        { name: 'Chat', icon: 'comments', link: 'chat.html', permission: null },
        { name: 'Notifications', icon: 'bell', link: 'notifications.html', permission: null },
        { name: 'Profile', icon: 'user', link: 'profile.html', permission: null },
        { name: 'Account Settings', icon: 'cog', link: 'account-settings.html', permission: null }
    ];
    
    // MANAGER MENUS - Limited access
    const managerMenus = [
        { name: 'Products', icon: 'box', link: 'products.html', permission: null },
        { name: 'Add Product', icon: 'plus-circle', link: 'add-product.html', permission: null },
        { name: 'Orders', icon: 'shopping-cart', link: 'orders.html', permission: null },
        { name: 'Sellers', icon: 'users', link: 'sellers.html', permission: null },
        { name: 'Announcements', icon: 'bullhorn', link: 'announcements.html', permission: null },
        { name: 'Reports', icon: 'chart-line', link: 'reports.html', permission: null },
        { name: 'Support Tickets', icon: 'ticket-alt', link: 'tickets.html', permission: null },
        { name: 'Notifications', icon: 'bell', link: 'notifications.html', permission: null },
        { name: 'Profile', icon: 'user', link: 'profile.html', permission: null },
        { name: 'Account Settings', icon: 'cog', link: 'account-settings.html', permission: null }
    ];
    
    // SELLER MENUS - Own data only
    const sellerMenus = [
        { name: 'Products', icon: 'box', link: 'products.html', permission: null },
        { name: 'My Orders', icon: 'shopping-cart', link: 'seller-orders.html', permission: null },
        { name: 'Create Order', icon: 'plus-circle', link: 'create-order.html', permission: null },
        { name: 'My Payouts', icon: 'money-bill-wave', link: 'seller-payouts.html', permission: null },
        { name: 'Bank Details', icon: 'university', link: 'bank-details.html', permission: null },
        { name: 'Support', icon: 'headset', link: 'seller-tickets.html', permission: null },
        { name: 'Chat', icon: 'comments', link: 'chat.html', permission: null },
        { name: 'Announcements', icon: 'bullhorn', link: 'announcements.html', permission: null },
        { name: 'Notifications', icon: 'bell', link: 'notifications.html', permission: null },
        { name: 'Profile', icon: 'user', link: 'profile.html', permission: null },
        { name: 'Account Settings', icon: 'cog', link: 'account-settings.html', permission: null }
    ];
    
    if (role === ROLES.ADMIN) return [...commonMenus, ...adminMenus];
    if (role === ROLES.MANAGER) return [...commonMenus, ...managerMenus];
    if (role === ROLES.SELLER) return [...commonMenus, ...sellerMenus];
    
    return commonMenus;
}

// Get dashboard link based on role
function getDashboardLink(role) {
    if (role === ROLES.ADMIN) return 'admin-dashboard.html';
    if (role === ROLES.MANAGER) return 'manager-dashboard.html';
    return 'seller-dashboard.html';
}

// Check if user can access a specific page
export function canAccessPage(userRole, pageName) {
    // ADMIN has access to ALL pages - FULL ACCESS
    if (userRole === ROLES.ADMIN) {
        return true;
    }
    
    // For non-admin users, check specific permissions
    const pagePermissions = {
        // Admin only pages
        'admin-dashboard.html': [ROLES.ADMIN],
        'suppliers.html': [ROLES.ADMIN],
        'payouts.html': [ROLES.ADMIN],
        'activity-log.html': [ROLES.ADMIN],
        
        // Admin and Manager pages
        'manager-dashboard.html': [ROLES.ADMIN, ROLES.MANAGER],
        'products.html': [ROLES.ADMIN, ROLES.MANAGER, ROLES.SELLER],
        'add-product.html': [ROLES.ADMIN, ROLES.MANAGER],
        'orders.html': [ROLES.ADMIN, ROLES.MANAGER],
        'sellers.html': [ROLES.ADMIN, ROLES.MANAGER],
        'reports.html': [ROLES.ADMIN, ROLES.MANAGER],
        'tickets.html': [ROLES.ADMIN, ROLES.MANAGER],
        'announcements.html': [ROLES.ADMIN, ROLES.MANAGER, ROLES.SELLER],
        
        // Seller pages (accessible by all)
        'seller-dashboard.html': [ROLES.ADMIN, ROLES.MANAGER, ROLES.SELLER],
        'seller-orders.html': [ROLES.ADMIN, ROLES.MANAGER, ROLES.SELLER],
        'seller-payouts.html': [ROLES.ADMIN, ROLES.MANAGER, ROLES.SELLER],
        'create-order.html': [ROLES.ADMIN, ROLES.MANAGER, ROLES.SELLER],
        'bank-details.html': [ROLES.ADMIN, ROLES.MANAGER, ROLES.SELLER],
        'seller-tickets.html': [ROLES.ADMIN, ROLES.MANAGER, ROLES.SELLER],
        'chat.html': [ROLES.ADMIN, ROLES.MANAGER, ROLES.SELLER],
        
        // Everyone pages
        'product-view.html': [ROLES.ADMIN, ROLES.MANAGER, ROLES.SELLER],
        'profile.html': [ROLES.ADMIN, ROLES.MANAGER, ROLES.SELLER],
        'account-settings.html': [ROLES.ADMIN, ROLES.MANAGER, ROLES.SELLER],
        'notifications.html': [ROLES.ADMIN, ROLES.MANAGER, ROLES.SELLER],
        'unauthorized.html': [ROLES.ADMIN, ROLES.MANAGER, ROLES.SELLER]
    };
    
    const allowedRoles = pagePermissions[pageName];
    if (!allowedRoles) return false;
    return allowedRoles.includes(userRole);
}
