// ============================================
// MARKETPLACE PRO - HELPER FUNCTIONS
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
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// FIX: sanitize status value to prevent XSS injection
function getStatusBadge(status) {
    const allowed = ['pending', 'approved', 'completed', 'paid'];
    const safeStatus = allowed.includes(status) ? status : 'pending';
    const statusMap = {
        'pending':   { class: 'status-pending',   text: 'Pending Approval' },
        'approved':  { class: 'status-approved',  text: 'Approved' },
        'completed': { class: 'status-completed', text: 'Completed' },
        'paid':      { class: 'status-paid',      text: 'Paid' }
    };
    const s = statusMap[safeStatus];
    return `<span class="status-badge ${s.class}">${s.text}</span>`;
}

// Show loading spinner
function showLoading(elementId) {
    const el = document.getElementById(elementId);
    if (el) el.innerHTML = '<div class="loading mx-auto"></div>';
}

// Hide loading spinner
function hideLoading(elementId, content) {
    const el = document.getElementById(elementId);
    if (el && content !== undefined) el.innerHTML = content;
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
    // FIX: use textContent (not innerHTML) — prevents XSS from message strings
    toast.textContent = message;
    toast.onclick = () => toast.remove();
    container.appendChild(toast);
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 3000);
}

// Inject slideIn animation only once
if (!document.getElementById('toast-anim-style')) {
    const s = document.createElement('style');
    s.id = 'toast-anim-style';
    s.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to   { transform: translateX(0);    opacity: 1; }
        }
    `;
    document.head.appendChild(s);
}

// Debounce function (for search inputs)
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
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

// Export data as CSV
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
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
    showNotification('Export complete!', 'success');
}

// FIX: guard sellerEarnings against going negative
function calculateCommission(amount, type, value) {
    if (type === 'percentage') {
        const commission = (amount * value) / 100;
        return {
            commissionAmount: commission,
            sellerEarnings: Math.max(0, amount - commission),
            type: 'percentage', value
        };
    } else {
        return {
            commissionAmount: value,
            sellerEarnings: Math.max(0, amount - value),
            type: 'fixed', value
        };
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^(\+971|0)?5[0-9]{8}$/.test(phone);
}

// FIX: previous logic set foundCurrent AFTER the map check,
// meaning steps BEFORE current were never marked completed.
// Now we find the current index first, then mark everything up to it.
function getOrderSteps(currentStatus) {
    const steps = [
        { key: 'pending',   label: 'Order Placed',        icon: 'fa-shopping-cart' },
        { key: 'approved',  label: 'Commission Approved', icon: 'fa-check-circle' },
        { key: 'completed', label: 'Order Completed',     icon: 'fa-truck' },
        { key: 'paid',      label: 'Payout Sent',         icon: 'fa-money-bill-wave' }
    ];
    const currentIndex = steps.findIndex(s => s.key === currentStatus);
    return steps.map((step, i) => ({
        ...step,
        completed: i <= currentIndex,
        active: step.key === currentStatus
    }));
}

function renderTimeline(currentStatus) {
    const steps = getOrderSteps(currentStatus);
    return `
        <div class="timeline">
            ${steps.map(step => `
                <div class="timeline-item ${step.completed ? 'completed' : ''}">
                    <i class="fas ${step.icon}"></i>
                    <div class="font-medium">${step.label}</div>
                    ${step.active ? '<span class="text-xs text-purple-500">Current</span>' : ''}
                </div>
            `).join('')}
        </div>
    `;
}

// Pagination helper
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
        if (this.currentPage < this.totalPages) { this.currentPage++; return true; }
        return false;
    }
    prevPage() {
        if (this.currentPage > 1) { this.currentPage--; return true; }
        return false;
    }
    renderPaginationControls(onPageChange) {
        const container = document.createElement('div');
        container.className = 'flex justify-center gap-2 mt-4';
        const prevBtn = document.createElement('button');
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.className = 'px-3 py-1 rounded border';
        prevBtn.onclick = () => { if (this.prevPage()) onPageChange(); };
        const pageSpan = document.createElement('span');
        pageSpan.className = 'px-3 py-1';
        pageSpan.textContent = `Page ${this.currentPage} of ${this.totalPages}`;
        const nextBtn = document.createElement('button');
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.className = 'px-3 py-1 rounded border';
        nextBtn.onclick = () => { if (this.nextPage()) onPageChange(); };
        container.appendChild(prevBtn);
        container.appendChild(pageSpan);
        container.appendChild(nextBtn);
        return container;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatCurrency, formatDate, getStatusBadge,
        showNotification, copyToClipboard, exportToCSV,
        calculateCommission, isValidEmail, isValidPhone,
        renderTimeline, Pagination, debounce
    };
}
