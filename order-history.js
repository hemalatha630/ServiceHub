/**
 * ServiceHub - Customer Order History Functionality (order-history.js)
 * Supports:
 *  1. Combined mock orders & persistent user orders from localStorage
 *  2. Status filter tabs (All, Confirmed, Completed, Cancelled) with count badges
 *  3. Instant search filtering by Order ID, Service Name, or Merchant
 *  4. Interactive "View Details" modal with full booking & receipt breakdown
 *  5. "Book Again" workflow returning directly to booking.html for that service
 *  6. Auto-opening order details modal when navigated with ?orderId=...
 *  7. Receipt print functionality & responsive mobile menu
 */

document.addEventListener('DOMContentLoaded', () => {
  // Baseline Mock Orders
  const baselineMockOrders = [
    {
      orderId: 'SH-2026-88492',
      serviceId: 's1',
      serviceName: 'Standard Residential Deep Clean & Sanitization',
      serviceCategory: 'Cleaning',
      merchantName: 'SparkleClean Co.',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=400&q=80',
      date: 'Wed, Sep 30, 2026',
      time: '09:00 AM',
      amount: '65.00',
      status: 'Confirmed',
      customerName: 'Jordan Miller',
      customerEmail: 'jordan.miller@example.com',
      customerPhone: '(555) 234-5678',
      paymentMethod: 'Credit Card (Visa •••• 4242)',
      placedDate: 'Sep 29, 2026'
    },
    {
      orderId: 'SH-2026-75120',
      serviceId: 'auto',
      serviceName: 'Mobile Signature Full Auto Detail & Ceramic Seal',
      serviceCategory: 'Automotive',
      merchantName: 'Apex Auto Studio',
      image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=400&q=80',
      date: 'Sat, Sep 19, 2026',
      time: '02:00 PM',
      amount: '120.00',
      status: 'Completed',
      customerName: 'Jordan Miller',
      customerEmail: 'jordan.miller@example.com',
      customerPhone: '(555) 234-5678',
      paymentMethod: 'UPI (Google Pay • jordan@okaxis)',
      placedDate: 'Sep 17, 2026'
    },
    {
      orderId: 'SH-2026-61904',
      serviceId: 'beauty',
      serviceName: 'Bespoke Haircut, Scalp Spa & Conditioning',
      serviceCategory: 'Beauty',
      merchantName: 'Glow Salon & Day Spa',
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80',
      date: 'Tue, Sep 8, 2026',
      time: '11:30 AM',
      amount: '85.00',
      status: 'Completed',
      customerName: 'Jordan Miller',
      customerEmail: 'jordan.miller@example.com',
      customerPhone: '(555) 234-5678',
      paymentMethod: 'Credit Card (Mastercard •••• 8812)',
      placedDate: 'Sep 6, 2026'
    },
    {
      orderId: 'SH-2026-53819',
      serviceId: 'plumb',
      serviceName: 'Drain Clearing & Fiber-Optic Camera Inspection',
      serviceCategory: 'Repair',
      merchantName: 'Precision Plumbing Pro',
      image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=400&q=80',
      date: 'Mon, Aug 24, 2026',
      time: '04:00 PM',
      amount: '95.00',
      status: 'Cancelled',
      customerName: 'Jordan Miller',
      customerEmail: 'jordan.miller@example.com',
      customerPhone: '(555) 234-5678',
      paymentMethod: 'Net Banking (HDFC Bank)',
      placedDate: 'Aug 22, 2026'
    }
  ];

  // Service images lookup dictionary
  const serviceImages = {
    's1': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=400&q=80',
    's2': 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=400&q=80',
    's3': 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80',
    'auto': 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=400&q=80',
    'plumb': 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=400&q=80',
    'beauty': 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80'
  };

  // Combine localStorage orders with baseline mock data
  let allOrders = [];
  try {
    const localRaw = localStorage.getItem('servicehub_orders');
    const localOrders = localRaw ? JSON.parse(localRaw) : [];
    
    // Normalize user orders
    const normalizedLocal = localOrders.map(item => ({
      orderId: item.orderId || 'SH-2026-99999',
      serviceId: item.serviceId || 's1',
      serviceName: item.serviceName || 'Standard Residential Deep Clean',
      serviceCategory: item.serviceCategory || 'Cleaning',
      merchantName: item.merchantName || 'SparkleClean Co.',
      image: serviceImages[item.serviceId] || serviceImages['s1'],
      date: item.date || 'Upcoming',
      time: item.time || '09:00 AM',
      amount: item.amount || '65.00',
      status: item.status || 'Confirmed',
      customerName: item.customerName || 'Jordan Miller',
      customerEmail: item.customerEmail || 'jordan.miller@example.com',
      customerPhone: item.customerPhone || '(555) 234-5678',
      paymentMethod: item.paymentMethod || 'Credit / Debit Card',
      placedDate: item.timestamp ? new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Today'
    }));

    // Prevent duplicate orderId if mock and stored overlap
    const seenIds = new Set(normalizedLocal.map(o => o.orderId));
    const uniqueBaseline = baselineMockOrders.filter(o => !seenIds.has(o.orderId));

    allOrders = [...normalizedLocal, ...uniqueBaseline];
  } catch (e) {
    console.warn('Order history storage read error:', e);
    allOrders = [...baselineMockOrders];
  }

  // DOM Elements
  const ordersListContainer = document.getElementById('orders-list-container');
  const ordersEmptyState = document.getElementById('orders-empty-state');
  const searchInput = document.getElementById('orders-search-input');
  const filterPills = document.querySelectorAll('.order-filter-pill');

  const countAll = document.getElementById('count-all');
  const countConfirmed = document.getElementById('count-confirmed');
  const countCompleted = document.getElementById('count-completed');
  const countCancelled = document.getElementById('count-cancelled');

  // Modal Elements
  const modal = document.getElementById('order-details-modal');
  const modalClose = document.getElementById('modal-order-close');
  const modalStatusBadge = document.getElementById('modal-order-status-badge');
  const modalOrderId = document.getElementById('modal-order-id');
  const modalOrderTitle = document.getElementById('modal-order-title');
  const modalOrderMerchant = document.getElementById('modal-order-merchant');
  const modalSrvImg = document.getElementById('modal-srv-img');
  const modalSrvTitle = document.getElementById('modal-srv-title');
  const modalSrvCat = document.getElementById('modal-srv-cat');
  const modalBookingDate = document.getElementById('modal-booking-date');
  const modalBookingTime = document.getElementById('modal-booking-time');
  const modalCustomerName = document.getElementById('modal-customer-name');
  const modalCustomerEmail = document.getElementById('modal-customer-email');
  const modalPaymentMethod = document.getElementById('modal-payment-method');
  const modalPaymentStatus = document.getElementById('modal-payment-status');
  const modalPaymentAmount = document.getElementById('modal-payment-amount');
  const modalRebookBtn = document.getElementById('modal-order-rebook-btn');
  const modalPrintBtn = document.getElementById('modal-order-print');

  // Current State
  let currentFilter = 'all';
  let searchQuery = '';

  /**
   * Helper: Get status CSS class
   */
  function getStatusClass(status) {
    const s = (status || '').toLowerCase();
    if (s.includes('confirm')) return 'status-confirmed';
    if (s.includes('complete')) return 'status-completed';
    if (s.includes('cancel')) return 'status-cancelled';
    return 'status-confirmed';
  }

  /**
   * Update count badges
   */
  function updateCountBadges() {
    const confirmedCount = allOrders.filter(o => o.status.toLowerCase() === 'confirmed').length;
    const completedCount = allOrders.filter(o => o.status.toLowerCase() === 'completed').length;
    const cancelledCount = allOrders.filter(o => o.status.toLowerCase() === 'cancelled').length;

    if (countAll) countAll.textContent = allOrders.length;
    if (countConfirmed) countConfirmed.textContent = confirmedCount;
    if (countCompleted) countCompleted.textContent = completedCount;
    if (countCancelled) countCancelled.textContent = cancelledCount;
  }

  /**
   * Render Order List
   */
  function renderOrders() {
    if (!ordersListContainer) return;

    // Filter by status & search
    const filtered = allOrders.filter(order => {
      // 1. Status Filter
      if (currentFilter !== 'all' && order.status.toLowerCase() !== currentFilter) {
        return false;
      }
      // 2. Search Query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesId = order.orderId.toLowerCase().includes(q);
        const matchesService = order.serviceName.toLowerCase().includes(q);
        const matchesMerchant = order.merchantName.toLowerCase().includes(q);
        return matchesId || matchesService || matchesMerchant;
      }
      return true;
    });

    if (filtered.length === 0) {
      ordersListContainer.innerHTML = '';
      if (ordersEmptyState) ordersEmptyState.style.display = 'flex';
      return;
    }

    if (ordersEmptyState) ordersEmptyState.style.display = 'none';

    // Build Cards HTML
    ordersListContainer.innerHTML = filtered.map(order => {
      const statusClass = getStatusClass(order.status);
      const isCompleted = order.status.toLowerCase() === 'completed';
      const isConfirmed = order.status.toLowerCase() === 'confirmed';

      return `
        <article class="order-card" data-order-id="${order.orderId}">
          
          <!-- Card Header: Order ID & Status Badge -->
          <div class="order-card-header">
            <div class="order-meta-info">
              <span class="order-id-label">#${order.orderId}</span>
              <span class="order-placed-date">Booked on ${order.placedDate}</span>
            </div>
            <span class="status-badge ${statusClass}">
              ${order.status}
            </span>
          </div>

          <!-- Card Body: Thumbnail, Service & Merchant, Schedule, Price -->
          <div class="order-card-body">
            <div class="order-thumb-wrap">
              <img class="order-thumb-img" src="${order.image}" alt="${order.serviceName}" loading="lazy">
            </div>

            <div class="order-details-col">
              <h3 class="order-service-name">${order.serviceName}</h3>
              <div class="order-merchant-name">
                <span>By ${order.merchantName}</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>

              <div class="order-schedule-tags">
                <span class="order-schedule-tag">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <span>${order.date}</span>
                </span>
                <span class="order-schedule-tag">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 14 14"/>
                  </svg>
                  <span>${order.time}</span>
                </span>
              </div>
            </div>

            <div class="order-price-col">
              <div class="order-price-label">Amount Paid</div>
              <div class="order-price-value">$${parseFloat(order.amount).toFixed(2)}</div>
            </div>
          </div>

          <!-- Card Footer: Payment note & Action buttons -->
          <div class="order-card-footer">
            <div class="order-payment-method-note">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
              </svg>
              <span>${order.paymentMethod}</span>
            </div>

            <div class="order-actions-row">
              <button type="button" class="btn-order-view" data-action="details" data-id="${order.orderId}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <span>View Details</span>
              </button>

              ${isCompleted || isConfirmed ? `
                <a href="booking.html?id=${encodeURIComponent(order.serviceId)}" class="btn-order-rebook" data-action="rebook" data-service-id="${order.serviceId}">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                    <path d="M21 3v5h-5"/>
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                    <path d="M8 16H3v5"/>
                  </svg>
                  <span>Book Again</span>
                </a>
              ` : ''}
            </div>
          </div>

        </article>
      `;
    }).join('');

    // Attach Click Handlers to View Details buttons
    const detailBtns = ordersListContainer.querySelectorAll('button[data-action="details"]');
    detailBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const orderId = btn.getAttribute('data-id');
        openOrderModal(orderId);
      });
    });
  }

  /**
   * 3. Open Order Details Modal
   */
  function openOrderModal(orderId) {
    const order = allOrders.find(o => o.orderId === orderId);
    if (!order || !modal) return;

    const statusClass = getStatusClass(order.status);

    if (modalStatusBadge) {
      modalStatusBadge.textContent = order.status;
      modalStatusBadge.className = `status-badge ${statusClass}`;
    }
    if (modalOrderId) modalOrderId.textContent = `#${order.orderId}`;
    if (modalOrderTitle) modalOrderTitle.textContent = order.serviceName;
    if (modalOrderMerchant) modalOrderMerchant.textContent = order.merchantName;

    if (modalSrvImg) {
      modalSrvImg.src = order.image;
      modalSrvImg.alt = order.serviceName;
    }
    if (modalSrvTitle) modalSrvTitle.textContent = order.serviceName;
    if (modalSrvCat) modalSrvCat.textContent = `Category: ${order.serviceCategory}`;

    if (modalBookingDate) modalBookingDate.textContent = order.date;
    if (modalBookingTime) modalBookingTime.textContent = order.time;
    if (modalCustomerName) modalCustomerName.textContent = order.customerName;
    if (modalCustomerEmail) modalCustomerEmail.textContent = order.customerEmail;

    if (modalPaymentMethod) modalPaymentMethod.textContent = order.paymentMethod;
    if (modalPaymentStatus) {
      if (order.status.toLowerCase() === 'cancelled') {
        modalPaymentStatus.textContent = 'Cancelled • Refund Issued';
        modalPaymentStatus.style.color = 'var(--color-error)';
      } else {
        modalPaymentStatus.textContent = 'Payment Verified • Confirmed';
        modalPaymentStatus.style.color = '#059669';
      }
    }
    if (modalPaymentAmount) {
      modalPaymentAmount.textContent = `$${parseFloat(order.amount).toFixed(2)}`;
    }

    if (modalRebookBtn) {
      modalRebookBtn.href = `booking.html?id=${encodeURIComponent(order.serviceId)}`;
    }

    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeOrderModal() {
    if (!modal) return;
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  if (modalClose) modalClose.addEventListener('click', closeOrderModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeOrderModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.hasAttribute('hidden')) {
      closeOrderModal();
    }
  });

  if (modalPrintBtn) {
    modalPrintBtn.addEventListener('click', () => {
      window.print();
    });
  }

  /**
   * Filter Pill Click Handlers
   */
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentFilter = pill.getAttribute('data-filter');
      renderOrders();
    });
  });

  /**
   * Realtime Search Input Handler
   */
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      renderOrders();
    });
  }

  /**
   * URL Param Checker: if ?orderId=... is passed from payment.html, show it
   */
  const urlParams = new URLSearchParams(window.location.search);
  const targetOrderId = urlParams.get('orderId');

  // Mobile menu toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('nav-open');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('nav-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Initialize
  updateCountBadges();
  renderOrders();

  if (targetOrderId) {
    // Open targeted order details if found
    const match = allOrders.find(o => o.orderId.toLowerCase() === targetOrderId.toLowerCase() || o.orderId.toLowerCase().includes(targetOrderId.toLowerCase()));
    if (match) {
      setTimeout(() => openOrderModal(match.orderId), 150);
    }
  }
});
