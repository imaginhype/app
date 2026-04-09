// ============================================
// HELPER FUNCTIONS - Marketplace Pro
// ============================================

// Format currency (AED)
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-AE', {
        style: 'currency',
        currency: 'AED',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(amount);
}

// Format date
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Format date and time
function formatDateTime(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-AE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Get status badge HTML
function getStatusBadge(status) {
    const statusMap = {
        'pending': { class: 'status-pending', text: 'Pending' },
        'approved': { class: 'status-approved', text: 'Approved' },
        'completed': { class: 'status-completed', text: 'Completed' },
        'paid': { class: 'status-paid', text: 'Paid' },
        'confirmed': { class: 'status-approved', text: 'Confirmed' },
        'delivered': { class: 'status-completed', text: 'Delivered' },
        'cancelled': { class: 'status-cancelled', text: 'Cancelled' },
        'active': { class: 'status-active', text: 'Active' },
        'suspended': { class: 'status-suspended', text: 'Suspended' },
        'pending_approval': { class: 'status-pending', text: 'Pending Approval' }
    };
    
    const s = statusMap[status] || { class: 'status-pending', text: status };
    return `<span class="status-badge ${s.class}">${s.text}</span>`;
}

// Show notification toast
function showNotification(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = `
            position: fixed; bottom: 20px; right: 20px;
            z-index: 9999; display: flex; flex-direction: column; gap: 10px;
        `;
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const bgColor = type === 'success' ? '#10b981' : (type === 'error' ? '#ef4444' : '#3b82f6');
    toast.style.cssText = `
        background: ${bgColor}; color: white; padding: 12px 20px;
        border-radius: 8px; font-size: 14px; font-weight: 500;
        box-shadow: 0 4px 6px rgba(0,0,0,0.15); animation: slideIn 0.3s ease;
        cursor: pointer; max-width: 320px;
    `;
    toast.textContent = message;
    toast.onclick = () => toast.remove();
    container.appendChild(toast);
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 3000);
}

// Show loading spinner
function showLoading(elementId) {
    const el = document.getElementById(elementId);
    if (el) {
        el.innerHTML = '<div class="flex justify-center items-center py-8"><i class="fas fa-spinner fa-spin text-2xl text-purple-500"></i></div>';
    }
}

// Hide loading spinner
function hideLoading(elementId, content) {
    const el = document.getElementById(elementId);
    if (el && content !== undefined) {
        el.innerHTML = content;
    }
}

// Copy to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showNotification('Copied to clipboard!', 'success');
        return true;
    } catch (err) {
        showNotification('Failed to copy', 'error');
        return false;
    }
}

// Export to CSV
function exportToCSV(data, filename = 'export.csv') {
    if (!data || data.length === 0) {
        showNotification('No data to export', 'error');
        return;
    }
    
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    
    for (const row of data) {
        const values = headers.map(h => `"${String(row[h] ?? '').replace(/"/g, '""')}"`);
        csvRows.push(values.join(','));
    }
    
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('Export complete!', 'success');
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

// Escape HTML to prevent XSS
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Validate email
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Validate phone (UAE format)
function isValidPhone(phone) {
    return /^(\+971|0)?5[0-9]{8}$/.test(phone);
}

// Pagination helper class
class Pagination {
    constructor(items, pageSize = 10) {
        this.items = items;
        this.pageSize = pageSize;
        this.currentPage = 1;
        this.totalPages = Math.ceil(items.length / pageSize);
    }
    
    getCurrentPageItems() {
        const start = (this.currentPage - 1) * this.pageSize;
        return this.items.slice(start, start + this.pageSize);
    }
    
    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            return true;
        }
        return false;
    }
    
    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            return true;
        }
        return false;
    }
    
    goToPage(page) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            return true;
        }
        return false;
    }
    
    renderPaginationControls(onPageChange) {
        const container = document.createElement('div');
        container.className = 'flex justify-center gap-2 mt-4';
        
        const prevBtn = document.createElement('button');
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.className = 'pagination-btn';
        prevBtn.onclick = () => {
            if (this.prevPage()) onPageChange();
        };
        
        const pageSpan = document.createElement('span');
        pageSpan.className = 'px-3 py-1 text-sm';
        pageSpan.textContent = `Page ${this.currentPage} of ${this.totalPages}`;
        
        const nextBtn = document.createElement('button');
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.className = 'pagination-btn';
        nextBtn.onclick = () => {
            if (this.nextPage()) onPageChange();
        };
        
        container.appendChild(prevBtn);
        container.appendChild(pageSpan);
        container.appendChild(nextBtn);
        return container;
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatCurrency,
        formatDate,
        formatDateTime,
        getStatusBadge,
        showNotification,
        showLoading,
        hideLoading,
        copyToClipboard,
        exportToCSV,
        debounce,
        escapeHtml,
        isValidEmail,
        isValidPhone,
        Pagination
    };
}
