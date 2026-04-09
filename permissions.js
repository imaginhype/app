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
    VIEW_PRODUCTS: [ROLES.SELLER],
    CREATE_PRODUCT: [ROLES.ADMIN, ROLES.MANAGER],
    EDIT_PRODUCT: [ROLES.ADMIN, ROLES.MANAGER],
    DELETE_PRODUCT: [ROLES.ADMIN, ROLES.MANAGER],
    
    // Order Management
    VIEW_ALL_ORDERS: [ROLES.ADMIN, ROLES.MANAGER],
    VIEW_OWN_ORDERS: [ROLES.SELLER],
    UPDATE_ORDER_STATUS: [ROLES.ADMIN, ROLES.MANAGER],
    CREATE_ORDER: [ROLES.SELLER],
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
    REQUEST_PAYOUT: [ROLES.SELLER],
    VIEW_OWN_PAYOUTS: [ROLES.SELLER],
    
    // Announcements
    MANAGE_ANNOUNCEMENTS: [ROLES.ADMIN, ROLES.MANAGER],
    VIEW_ANNOUNCEMENTS: [ROLES.ADMIN, ROLES.MANAGER, ROLES.SELLER],
    
    // Reports
    VIEW_FULL_REPORTS: [ROLES.ADMIN],
    VIEW_LIMITED_REPORTS: [ROLES.ADMIN, ROLES.MANAGER],
    VIEW_OWN_REPORTS: [ROLES.SELLER],
    
    // Settings
    MANAGE_SETTINGS: [ROLES.ADMIN],
    VIEW_SETTINGS: [ROLES.ADMIN, ROLES.MANAGER],
    EDIT_PROFILE: [ROLES.ADMIN, ROLES.MANAGER, ROLES.SELLER],
    
    // Activity Log
    VIEW_ACTIVITY_LOG: [ROLES.ADMIN],
    
    // Support Tickets
    MANAGE_TICKETS: [ROLES.ADMIN, ROLES.MANAGER],
    CREATE_TICKET: [ROLES.SELLER],
    VIEW_OWN_TICKETS: [ROLES.SELLER],
    
    // Chat
    CHAT_WITH_ADMIN: [ROLES.SELLER],
    CHAT_WITH_SELLERS: [ROLES.ADMIN, ROLES.MANAGER],
    
    // Bank Details
    VIEW_OWN_BANK_DETAILS: [ROLES.SELLER],
    REQUEST_BANK_CHANGE: [ROLES.SELLER],
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
    
    const adminMenus = [
        { name: 'Products', icon: 'box', link: 'products.html', permission: 'MANAGE_ALL_PRODUCTS' },
        { name: 'Orders', icon: 'shopping-cart', link: 'orders.html', permission: 'VIEW_ALL_ORDERS' },
        { name: 'Sellers', icon: 'users', link: 'sellers.html', permission: 'VIEW_ALL_SELLERS' },
        { name: 'Suppliers', icon: 'truck', link: 'suppliers.html', permission: 'MANAGE_SUPPLIERS' },
        { name: 'Payouts', icon: 'money-bill-wave', link: 'payouts.html', permission: 'MANAGE_PAYOUTS' },
        { name: 'Announcements', icon: 'bullhorn', link: 'announcements.html', permission: 'MANAGE_ANNOUNCEMENTS' },
        { name: 'Reports', icon: 'chart-line', link: 'reports.html', permission: 'VIEW_FULL_REPORTS' },
        { name: 'Activity Log', icon: 'history', link: 'activity-log.html', permission: 'VIEW_ACTIVITY_LOG' },
        { name: 'Support', icon: 'headset', link: 'tickets.html', permission: 'MANAGE_TICKETS' },
        { name: 'Settings', icon: 'cog', link: 'account-settings.html', permission: 'MANAGE_SETTINGS' }
    ];
    
    const managerMenus = [
        { name: 'Products', icon: 'box', link: 'products.html', permission: 'MANAGE_ALL_PRODUCTS' },
        { name: 'Orders', icon: 'shopping-cart', link: 'orders.html', permission: 'VIEW_ALL_ORDERS' },
        { name: 'Sellers', icon: 'users', link: 'sellers.html', permission: 'VIEW_ALL_SELLERS' },
        { name: 'Announcements', icon: 'bullhorn', link: 'announcements.html', permission: 'MANAGE_ANNOUNCEMENTS' },
        { name: 'Reports', icon: 'chart-line', link: 'reports.html', permission: 'VIEW_LIMITED_REPORTS' },
        { name: 'Support', icon: 'headset', link: 'tickets.html', permission: 'MANAGE_TICKETS' },
        { name: 'Settings', icon: 'cog', link: 'account-settings.html', permission: 'VIEW_SETTINGS' }
    ];
    
    const sellerMenus = [
        { name: 'Products', icon: 'box', link: 'products.html', permission: 'VIEW_PRODUCTS' },
        { name: 'My Orders', icon: 'shopping-cart', link: 'seller-orders.html', permission: 'VIEW_OWN_ORDERS' },
        { name: 'Create Order', icon: 'plus-circle', link: 'create-order.html', permission: 'CREATE_ORDER' },
        { name: 'My Payouts', icon: 'money-bill-wave', link: 'seller-payouts.html', permission: 'VIEW_OWN_PAYOUTS' },
        { name: 'Bank Details', icon: 'university', link: 'bank-details.html', permission: 'VIEW_OWN_BANK_DETAILS' },
        { name: 'Support', icon: 'headset', link: 'seller-tickets.html', permission: 'VIEW_OWN_TICKETS' },
        { name: 'Chat', icon: 'comments', link: 'chat.html', permission: 'CHAT_WITH_ADMIN' },
        { name: 'Announcements', icon: 'bullhorn', link: 'announcements.html', permission: 'VIEW_ANNOUNCEMENTS' },
        { name: 'Settings', icon: 'cog', link: 'account-settings.html', permission: 'EDIT_PROFILE' }
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
    const pagePermissions = {
        'admin-dashboard.html': [ROLES.ADMIN],
        'manager-dashboard.html': [ROLES.ADMIN, ROLES.MANAGER],
        'seller-dashboard.html': [ROLES.ADMIN, ROLES.MANAGER, ROLES.SELLER],
        'products.html': [ROLES.ADMIN, ROLES.MANAGER, ROLES.SELLER],
        'add-product.html': [ROLES.ADMIN, ROLES.MANAGER],
        'orders.html': [ROLES.ADMIN, ROLES.MANAGER],
        'sellers.html': [ROLES.ADMIN, ROLES.MANAGER],
        'suppliers.html': [ROLES.ADMIN],
        'payouts.html': [ROLES.ADMIN],
        'reports.html': [ROLES.ADMIN, ROLES.MANAGER],
        'activity-log.html': [ROLES.ADMIN],
        'tickets.html': [ROLES.ADMIN, ROLES.MANAGER],
        'seller-tickets.html': [ROLES.SELLER],
        'seller-payouts.html': [ROLES.SELLER],
        'seller-orders.html': [ROLES.SELLER],
        'create-order.html': [ROLES.SELLER],
        'bank-details.html': [ROLES.SELLER],
        'chat.html': [ROLES.SELLER],
        'announcements.html': [ROLES.ADMIN, ROLES.MANAGER, ROLES.SELLER],
        'profile.html': [ROLES.ADMIN, ROLES.MANAGER, ROLES.SELLER],
        'account-settings.html': [ROLES.ADMIN, ROLES.MANAGER, ROLES.SELLER],
        'notifications.html': [ROLES.ADMIN, ROLES.MANAGER, ROLES.SELLER]
    };
    
    const allowedRoles = pagePermissions[pageName];
    if (!allowedRoles) return false;
    return allowedRoles.includes(userRole);
}
