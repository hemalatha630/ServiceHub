/**
 * ServiceHub - Professional Merchant Dashboard (merchant-dashboard.js)
 * Supports:
 *  1. Overview metrics calculation (Total Orders, Pending, Completed, Total Revenue)
 *  2. Orders management with live status update (Pending, Confirmed, Completed, Cancelled)
 *  3. Services catalog CRUD (View, Add, Edit, Delete) with modal form & validation
 *  4. Business Profile editor with live preview card & persistent storage
 *  5. Customer Reviews list & rating distribution breakdown
 *  6. Sidebar tab navigation & mobile responsive drawer
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Initial Baseline Datasets
  const defaultProfile = {
    businessName: 'SparkleClean Co.',
    category: 'Cleaning',
    ownerName: 'Elena Rostova',
    phone: '+1 (555) 349-2810',
    email: 'elena@sparklecleanco.com',
    location: '742 Evergreen Blvd, Central City, CA 90210',
    serviceArea: 'Central City and surrounding 25-mile radius',
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=300&q=80',
    shortDesc: 'Residential and commercial deep cleaning specialists with over 8 years of local experience, vetted crews, and eco-friendly supplies.'
  };

  const defaultServices = [
    {
      id: 's1',
      name: 'Standard Residential Deep Clean',
      price: 65,
      duration: '2 hours',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=400&q=80',
      description: 'Comprehensive top-to-bottom sanitize of living areas, kitchen degreasing, bathroom scrubbing, dusting, and floor polishing.'
    },
    {
      id: 's2',
      name: 'Move-In / Move-Out Sanitization Overhaul',
      price: 140,
      duration: '4 hours',
      image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=400&q=80',
      description: 'Deep scrub including inside kitchen cabinets, oven, refrigerator interior, baseboards, and carpet steam extraction.'
    },
    {
      id: 's3',
      name: 'Eco Commercial Office & Studio Maintenance',
      price: 190,
      duration: '3.5 hours',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80',
      description: 'After-hours commercial sanitize for offices, retail storefronts, photo studios, and creative agencies.'
    }
  ];

  const defaultOrders = [
    {
      orderId: 'SH-2026-88492',
      customerName: 'Jordan Miller',
      customerEmail: 'jordan.miller@example.com',
      customerPhone: '(555) 234-5678',
      serviceName: 'Standard Residential Deep Clean',
      date: 'Wed, Sep 30, 2026',
      time: '09:00 AM',
      amount: 65.00,
      status: 'Confirmed'
    },
    {
      orderId: 'SH-2026-91042',
      customerName: 'Sarah Jenkins',
      customerEmail: 'sarah.j@example.com',
      customerPhone: '(555) 891-2345',
      serviceName: 'Move-In / Move-Out Sanitization Overhaul',
      date: 'Fri, Oct 2, 2026',
      time: '10:30 AM',
      amount: 140.00,
      status: 'Pending'
    },
    {
      orderId: 'SH-2026-78421',
      customerName: 'David Rivera',
      customerEmail: 'david.r@example.com',
      customerPhone: '(555) 432-8765',
      serviceName: 'Eco Commercial Office Maintenance',
      date: 'Mon, Sep 28, 2026',
      time: '06:00 PM',
      amount: 190.00,
      status: 'Completed'
    },
    {
      orderId: 'SH-2026-64210',
      customerName: 'Emily Zhang',
      customerEmail: 'emily.z@example.com',
      customerPhone: '(555) 678-1234',
      serviceName: 'Standard Residential Deep Clean',
      date: 'Thu, Sep 24, 2026',
      time: '01:00 PM',
      amount: 65.00,
      status: 'Completed'
    },
    {
      orderId: 'SH-2026-51209',
      customerName: 'Robert Taylor',
      customerEmail: 'robert.t@example.com',
      customerPhone: '(555) 901-7654',
      serviceName: 'Standard Residential Deep Clean',
      date: 'Sun, Sep 20, 2026',
      time: '11:00 AM',
      amount: 65.00,
      status: 'Cancelled'
    }
  ];

  const defaultReviews = [
    {
      name: 'Samantha Vance',
      initials: 'SV',
      rating: 5,
      date: '2 days ago',
      service: 'Standard Residential Deep Clean',
      comment: 'Elena and her team did an absolutely spotless job! My home has never looked or smelled fresher. Extremely professional and courteous.'
    },
    {
      name: 'Michael Chang',
      initials: 'MC',
      rating: 5,
      date: '1 week ago',
      service: 'Move-In / Move-Out Sanitization Overhaul',
      comment: 'Got 100% of my security deposit back thanks to their move-out deep clean. Every appliance and cabinet was immaculate.'
    },
    {
      name: 'Rachel Adams',
      initials: 'RA',
      rating: 5,
      date: '2 weeks ago',
      service: 'Standard Residential Deep Clean',
      comment: 'Love their eco-friendly products! No harsh chemical odors, which is so important with my rescue dog and toddler around.'
    },
    {
      name: 'David Kim',
      initials: 'DK',
      rating: 4,
      date: '3 weeks ago',
      service: 'Eco Commercial Office Maintenance',
      comment: 'Prompt arrival and reliable work for our creative office space. Will be setting up a recurring monthly contract.'
    }
  ];

  // Load state from localStorage or defaults
  let currentProfile = defaultProfile;
  try {
    const savedProf = localStorage.getItem('servicehub_merchant_profile');
    if (savedProf) currentProfile = { ...defaultProfile, ...JSON.parse(savedProf) };
  } catch (e) {
    console.warn('Profile read error:', e);
  }

  let currentServices = defaultServices;
  try {
    const savedSrv = localStorage.getItem('servicehub_merchant_services');
    if (savedSrv) currentServices = JSON.parse(savedSrv);
  } catch (e) {
    console.warn('Services read error:', e);
  }

  let currentOrders = defaultOrders;
  try {
    const savedOrders = localStorage.getItem('servicehub_merchant_orders');
    if (savedOrders) {
      currentOrders = JSON.parse(savedOrders);
    } else {
      // Check customer orders storage from feature 11 / 12
      const customerOrdersRaw = localStorage.getItem('servicehub_orders');
      if (customerOrdersRaw) {
        const custOrders = JSON.parse(customerOrdersRaw);
        // Normalize customer orders
        const mappedCust = custOrders.map(o => ({
          orderId: o.orderId,
          customerName: o.customerName || 'Customer',
          customerEmail: o.customerEmail || 'customer@example.com',
          customerPhone: o.customerPhone || '(555) 000-0000',
          serviceName: o.serviceName || 'Residential Service',
          date: o.date || 'Upcoming',
          time: o.time || '09:00 AM',
          amount: parseFloat(o.amount) || 65.00,
          status: o.status || 'Confirmed'
        }));
        const existingIds = new Set(defaultOrders.map(o => o.orderId));
        const newOnes = mappedCust.filter(o => !existingIds.has(o.orderId));
        currentOrders = [...newOnes, ...defaultOrders];
      }
    }
  } catch (e) {
    console.warn('Orders read error:', e);
  }

  // DOM Elements - Navigation Views
  const navBtns = document.querySelectorAll('.dashboard-nav-item');
  const viewSections = {
    overview: document.getElementById('view-overview'),
    orders: document.getElementById('view-orders'),
    services: document.getElementById('view-services'),
    profile: document.getElementById('view-profile'),
    reviews: document.getElementById('view-reviews')
  };
  const viewTitle = document.getElementById('dashboard-current-view-title');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('dashboard-sidebar');

  // DOM Elements - Overview Metrics
  const metricTotalOrders = document.getElementById('metric-total-orders');
  const metricPendingOrders = document.getElementById('metric-pending-orders');
  const metricCompletedOrders = document.getElementById('metric-completed-orders');
  const metricTotalRevenue = document.getElementById('metric-total-revenue');
  const overviewOrdersBody = document.getElementById('overview-orders-table-body');
  const btnSeeAllOrders = document.getElementById('btn-see-all-orders');

  // DOM Elements - Orders View
  const merchantOrdersBody = document.getElementById('merchant-orders-table-body');
  const merchantOrdersEmpty = document.getElementById('merchant-orders-empty');
  const ordersSearchInput = document.getElementById('merchant-orders-search');
  const ordersFilterPills = document.querySelectorAll('#orders-dashboard-filters .order-filter-pill');
  const ordersCountAll = document.getElementById('orders-count-all');
  const ordersCountPending = document.getElementById('orders-count-pending');
  const ordersCountConfirmed = document.getElementById('orders-count-confirmed');
  const ordersCountCompleted = document.getElementById('orders-count-completed');
  const ordersCountCancelled = document.getElementById('orders-count-cancelled');

  // DOM Elements - Services View
  const servicesContainer = document.getElementById('merchant-services-container');
  const btnOpenAddService = document.getElementById('btn-open-add-service');
  const topbarAddServiceBtn = document.getElementById('topbar-add-service-btn');
  const serviceModal = document.getElementById('service-modal');
  const serviceModalClose = document.getElementById('modal-service-close');
  const serviceModalCancel = document.getElementById('modal-service-cancel');
  const serviceEditForm = document.getElementById('service-edit-form');
  const serviceFormTitle = document.getElementById('modal-service-form-title');
  const formServiceId = document.getElementById('service-form-id');
  const formServiceName = document.getElementById('form-service-name');
  const formServicePrice = document.getElementById('form-service-price');
  const formServiceDuration = document.getElementById('form-service-duration');
  const formServiceImage = document.getElementById('form-service-image');
  const formServiceDesc = document.getElementById('form-service-desc');

  // DOM Elements - Profile View
  const profileForm = document.getElementById('merchant-profile-form');
  const profBizName = document.getElementById('prof-biz-name');
  const profCategory = document.getElementById('prof-category');
  const profOwnerName = document.getElementById('prof-owner-name');
  const profPhone = document.getElementById('prof-phone');
  const profEmail = document.getElementById('prof-email');
  const profLocation = document.getElementById('prof-location');
  const profServiceArea = document.getElementById('prof-service-area');
  const profImageUrl = document.getElementById('prof-image-url');
  const profShortDesc = document.getElementById('prof-short-desc');

  const profPreviewImg = document.getElementById('prof-preview-img');
  const profCardTitle = document.getElementById('prof-card-title');
  const profCardCat = document.getElementById('prof-card-cat');
  const profCardDesc = document.getElementById('prof-card-desc');
  const profCardLocation = document.getElementById('prof-card-location');
  const profCardPhone = document.getElementById('prof-card-phone');
  const sidebarBizName = document.getElementById('sidebar-business-name');

  // DOM Elements - Reviews View
  const reviewsContainer = document.getElementById('merchant-reviews-container');

  // DOM Elements - Order Details Modal
  const orderModal = document.getElementById('merchant-order-modal');
  const orderModalClose = document.getElementById('modal-merchant-order-close');
  const orderModalBtnClose = document.getElementById('modal-m-btn-close');
  const modalMStatus = document.getElementById('modal-m-status');
  const modalMOrderId = document.getElementById('modal-m-order-id');
  const modalMTitle = document.getElementById('modal-merchant-order-title');
  const modalMCustName = document.getElementById('modal-m-cust-name');
  const modalMCustEmail = document.getElementById('modal-m-cust-email');
  const modalMCustPhone = document.getElementById('modal-m-cust-phone');
  const modalMDate = document.getElementById('modal-m-date');
  const modalMTime = document.getElementById('modal-m-time');
  const modalMAmount = document.getElementById('modal-m-amount');

  // Filter & Search State
  let currentOrderStatusFilter = 'all';
  let orderSearchQuery = '';

  /**
   * Helper: Save orders to storage
   */
  function saveOrders() {
    try {
      localStorage.setItem('servicehub_merchant_orders', JSON.stringify(currentOrders));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  }

  /**
   * Helper: Save services to storage
   */
  function saveServices() {
    try {
      localStorage.setItem('servicehub_merchant_services', JSON.stringify(currentServices));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  }

  /**
   * Helper: Save profile to storage
   */
  function saveProfile() {
    try {
      localStorage.setItem('servicehub_merchant_profile', JSON.stringify(currentProfile));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  }

  /**
   * Navigation: Switch active dashboard view
   */
  function switchView(viewName) {
    navBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-view') === viewName);
    });

    Object.keys(viewSections).forEach(key => {
      if (viewSections[key]) {
        viewSections[key].style.display = key === viewName ? 'flex' : 'none';
      }
    });

    // Update Topbar Title
    const titleMap = {
      overview: 'Overview',
      orders: 'Orders & Bookings',
      services: 'Services Catalog',
      profile: 'Business Profile',
      reviews: 'Customer Reviews & Ratings'
    };
    if (viewTitle) viewTitle.textContent = titleMap[viewName] || 'Merchant Dashboard';

    // Close mobile sidebar if open
    if (sidebar) sidebar.classList.remove('sidebar-open');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const v = btn.getAttribute('data-view');
      if (v) switchView(v);
    });
  });

  if (btnSeeAllOrders) {
    btnSeeAllOrders.addEventListener('click', () => switchView('orders'));
  }

  /**
   * 1. Overview Calculations & Render
   */
  function calculateMetrics() {
    const totalCount = currentOrders.length;
    const pendingCount = currentOrders.filter(o => o.status === 'Pending').length;
    const completedCount = currentOrders.filter(o => o.status === 'Completed').length;
    const totalRev = currentOrders
      .filter(o => o.status === 'Completed' || o.status === 'Confirmed')
      .reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);

    if (metricTotalOrders) metricTotalOrders.textContent = totalCount;
    if (metricPendingOrders) metricPendingOrders.textContent = pendingCount;
    if (metricCompletedOrders) metricCompletedOrders.textContent = completedCount;
    if (metricTotalRevenue) metricTotalRevenue.textContent = `$${totalRev.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Update counts on Orders tab
    if (ordersCountAll) ordersCountAll.textContent = totalCount;
    if (ordersCountPending) ordersCountPending.textContent = pendingCount;
    if (ordersCountConfirmed) ordersCountConfirmed.textContent = currentOrders.filter(o => o.status === 'Confirmed').length;
    if (ordersCountCompleted) ordersCountCompleted.textContent = completedCount;
    if (ordersCountCancelled) ordersCountCancelled.textContent = currentOrders.filter(o => o.status === 'Cancelled').length;
  }

  function renderOverviewTable() {
    if (!overviewOrdersBody) return;
    const topRecent = currentOrders.slice(0, 4);

    overviewOrdersBody.innerHTML = topRecent.map(order => `
      <tr>
        <td style="font-family: monospace; font-weight: 700;">#${order.orderId}</td>
        <td><strong>${order.customerName}</strong></td>
        <td>${order.serviceName}</td>
        <td>${order.date} • ${order.time}</td>
        <td><strong>$${parseFloat(order.amount).toFixed(2)}</strong></td>
        <td>
          <span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span>
        </td>
        <td>
          <select class="table-status-select status-opt-${order.status.toLowerCase()}" data-order-id="${order.orderId}">
            <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="Confirmed" ${order.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
            <option value="Completed" ${order.status === 'Completed' ? 'selected' : ''}>Completed</option>
            <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
      </tr>
    `).join('');

    attachStatusDropdownListeners(overviewOrdersBody);
  }

  /**
   * 2. Orders Management Table & Status Updates
   */
  function renderOrdersTable() {
    if (!merchantOrdersBody) return;

    const filtered = currentOrders.filter(order => {
      if (currentOrderStatusFilter !== 'all' && order.status.toLowerCase() !== currentOrderStatusFilter) {
        return false;
      }
      if (orderSearchQuery) {
        const q = orderSearchQuery.toLowerCase();
        return order.orderId.toLowerCase().includes(q) ||
               order.customerName.toLowerCase().includes(q) ||
               order.serviceName.toLowerCase().includes(q);
      }
      return true;
    });

    if (filtered.length === 0) {
      merchantOrdersBody.innerHTML = '';
      if (merchantOrdersEmpty) merchantOrdersEmpty.style.display = 'block';
      return;
    }

    if (merchantOrdersEmpty) merchantOrdersEmpty.style.display = 'none';

    merchantOrdersBody.innerHTML = filtered.map(order => `
      <tr>
        <td style="font-family: monospace; font-weight: 700;">#${order.orderId}</td>
        <td>
          <div style="font-weight: 700;">${order.customerName}</div>
          <div style="font-size: var(--font-size-xs); color: var(--color-text-muted);">${order.customerPhone}</div>
        </td>
        <td>${order.serviceName}</td>
        <td>${order.date}<br><span style="font-size: var(--font-size-xs); color: var(--color-text-muted);">${order.time}</span></td>
        <td><strong style="color: #059669;">$${parseFloat(order.amount).toFixed(2)}</strong></td>
        <td>
          <span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span>
        </td>
        <td>
          <select class="table-status-select status-opt-${order.status.toLowerCase()}" data-order-id="${order.orderId}">
            <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="Confirmed" ${order.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
            <option value="Completed" ${order.status === 'Completed' ? 'selected' : ''}>Completed</option>
            <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
        <td>
          <button type="button" class="btn btn-secondary" style="font-size: var(--font-size-xs); padding: 0.35rem 0.65rem;" data-action="order-details" data-id="${order.orderId}">
            Details
          </button>
        </td>
      </tr>
    `).join('');

    attachStatusDropdownListeners(merchantOrdersBody);

    // Attach Details modal trigger
    const detailBtns = merchantOrdersBody.querySelectorAll('button[data-action="order-details"]');
    detailBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        openOrderModal(id);
      });
    });
  }

  function attachStatusDropdownListeners(parentEl) {
    const selects = parentEl.querySelectorAll('.table-status-select');
    selects.forEach(select => {
      select.addEventListener('change', (e) => {
        const orderId = select.getAttribute('data-order-id');
        const newStatus = e.target.value;
        updateOrderStatus(orderId, newStatus);
      });
    });
  }

  function updateOrderStatus(orderId, newStatus) {
    const order = currentOrders.find(o => o.orderId === orderId);
    if (!order) return;

    order.status = newStatus;
    saveOrders();
    calculateMetrics();
    renderOverviewTable();
    renderOrdersTable();
  }

  // Status Filter Pills in Orders view
  ordersFilterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      ordersFilterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentOrderStatusFilter = pill.getAttribute('data-status');
      renderOrdersTable();
    });
  });

  if (ordersSearchInput) {
    ordersSearchInput.addEventListener('input', (e) => {
      orderSearchQuery = e.target.value.trim();
      renderOrdersTable();
    });
  }

  // Order Details Modal
  function openOrderModal(orderId) {
    const order = currentOrders.find(o => o.orderId === orderId);
    if (!order || !orderModal) return;

    if (modalMStatus) {
      modalMStatus.textContent = order.status;
      modalMStatus.className = `status-badge status-${order.status.toLowerCase()}`;
    }
    if (modalMOrderId) modalMOrderId.textContent = `#${order.orderId}`;
    if (modalMTitle) modalMTitle.textContent = order.serviceName;
    if (modalMCustName) modalMCustName.textContent = order.customerName;
    if (modalMCustEmail) modalMCustEmail.textContent = order.customerEmail;
    if (modalMCustPhone) modalMCustPhone.textContent = order.customerPhone;
    if (modalMDate) modalMDate.textContent = order.date;
    if (modalMTime) modalMTime.textContent = order.time;
    if (modalMAmount) modalMAmount.textContent = `$${parseFloat(order.amount).toFixed(2)}`;

    orderModal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeOrderModal() {
    if (!orderModal) return;
    orderModal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  if (orderModalClose) orderModalClose.addEventListener('click', closeOrderModal);
  if (orderModalBtnClose) orderModalBtnClose.addEventListener('click', closeOrderModal);
  if (orderModal) {
    orderModal.addEventListener('click', (e) => {
      if (e.target === orderModal) closeOrderModal();
    });
  }

  /**
   * 3. Services Catalog (CRUD)
   */
  function renderServices() {
    if (!servicesContainer) return;

    servicesContainer.innerHTML = currentServices.map(srv => `
      <article class="service-manage-card" data-service-id="${srv.id}">
        <div class="service-manage-thumb-wrap">
          <img class="service-manage-thumb" src="${srv.image}" alt="${srv.name}">
          <span class="service-manage-price-tag">$${parseFloat(srv.price).toFixed(2)}</span>
        </div>

        <div class="service-manage-body">
          <h3 class="service-manage-title">${srv.name}</h3>
          <p class="service-manage-desc">${srv.description}</p>
          <div class="service-manage-meta-tags">
            <span class="service-tag-pill" style="font-size: 0.7rem; background-color: #f1f5f9; padding: 0.2rem 0.5rem; border-radius: var(--radius-sm); font-weight: 700; color: var(--color-text-main);">
              ${srv.duration}
            </span>
          </div>
        </div>

        <div class="service-manage-footer">
          <button type="button" class="btn btn-secondary" style="font-size: var(--font-size-xs); padding: 0.35rem 0.75rem;" data-action="edit-service" data-id="${srv.id}">
            Edit
          </button>
          <button type="button" class="btn" style="font-size: var(--font-size-xs); padding: 0.35rem 0.75rem; background-color: #fee2e2; color: #dc2626; border: 1px solid #fca5a5;" data-action="delete-service" data-id="${srv.id}">
            Delete
          </button>
        </div>
      </article>
    `).join('');

    // Attach Edit and Delete handlers
    const editBtns = servicesContainer.querySelectorAll('button[data-action="edit-service"]');
    editBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const srvId = btn.getAttribute('data-id');
        openEditServiceModal(srvId);
      });
    });

    const deleteBtns = servicesContainer.querySelectorAll('button[data-action="delete-service"]');
    deleteBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const srvId = btn.getAttribute('data-id');
        handleDeleteService(srvId);
      });
    });
  }

  function openAddServiceModal() {
    if (!serviceModal) return;
    if (serviceFormTitle) serviceFormTitle.textContent = 'Add New Service';
    if (formServiceId) formServiceId.value = '';
    if (formServiceName) formServiceName.value = '';
    if (formServicePrice) formServicePrice.value = '';
    if (formServiceDuration) formServiceDuration.value = '2 hours';
    if (formServiceImage) formServiceImage.value = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=400&q=80';
    if (formServiceDesc) formServiceDesc.value = '';

    serviceModal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    if (formServiceName) formServiceName.focus();
  }

  function openEditServiceModal(srvId) {
    const srv = currentServices.find(s => s.id === srvId);
    if (!srv || !serviceModal) return;

    if (serviceFormTitle) serviceFormTitle.textContent = 'Edit Service';
    if (formServiceId) formServiceId.value = srv.id;
    if (formServiceName) formServiceName.value = srv.name;
    if (formServicePrice) formServicePrice.value = srv.price;
    if (formServiceDuration) formServiceDuration.value = srv.duration;
    if (formServiceImage) formServiceImage.value = srv.image;
    if (formServiceDesc) formServiceDesc.value = srv.description;

    serviceModal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeServiceModal() {
    if (!serviceModal) return;
    serviceModal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  if (serviceModalClose) serviceModalClose.addEventListener('click', closeServiceModal);
  if (serviceModalCancel) serviceModalCancel.addEventListener('click', closeServiceModal);
  if (serviceModal) {
    serviceModal.addEventListener('click', (e) => {
      if (e.target === serviceModal) closeServiceModal();
    });
  }

  if (btnOpenAddService) btnOpenAddService.addEventListener('click', openAddServiceModal);
  if (topbarAddServiceBtn) {
    topbarAddServiceBtn.addEventListener('click', () => {
      switchView('services');
      openAddServiceModal();
    });
  }

  // Handle Add/Edit Form Submit
  if (serviceEditForm) {
    serviceEditForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameVal = formServiceName ? formServiceName.value.trim() : '';
      const priceVal = formServicePrice ? parseFloat(formServicePrice.value) : 0;
      const durationVal = formServiceDuration ? formServiceDuration.value.trim() : '';
      const imageVal = formServiceImage ? formServiceImage.value.trim() : '';
      const descVal = formServiceDesc ? formServiceDesc.value.trim() : '';
      const targetId = formServiceId ? formServiceId.value : '';

      if (!nameVal || !priceVal || !durationVal || !descVal) {
        alert('Please fill in all required service fields.');
        return;
      }

      if (targetId) {
        // Edit existing
        const existing = currentServices.find(s => s.id === targetId);
        if (existing) {
          existing.name = nameVal;
          existing.price = priceVal;
          existing.duration = durationVal;
          existing.image = imageVal || existing.image;
          existing.description = descVal;
        }
      } else {
        // Create new
        const newId = `srv_${Date.now()}`;
        currentServices.push({
          id: newId,
          name: nameVal,
          price: priceVal,
          duration: durationVal,
          image: imageVal || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=400&q=80',
          description: descVal
        });
      }

      saveServices();
      renderServices();
      closeServiceModal();
    });
  }

  // Delete Service
  function handleDeleteService(srvId) {
    const srv = currentServices.find(s => s.id === srvId);
    if (!srv) return;

    if (confirm(`Are you sure you want to remove "${srv.name}" from your services?`)) {
      currentServices = currentServices.filter(s => s.id !== srvId);
      saveServices();
      renderServices();
    }
  }

  /**
   * 4. Business Profile Editor & Live Card Preview
   */
  function populateProfileForm() {
    if (profBizName) profBizName.value = currentProfile.businessName || '';
    if (profCategory) profCategory.value = currentProfile.category || 'Cleaning';
    if (profOwnerName) profOwnerName.value = currentProfile.ownerName || '';
    if (profPhone) profPhone.value = currentProfile.phone || '';
    if (profEmail) profEmail.value = currentProfile.email || '';
    if (profLocation) profLocation.value = currentProfile.location || '';
    if (profServiceArea) profServiceArea.value = currentProfile.serviceArea || '';
    if (profImageUrl) profImageUrl.value = currentProfile.imageUrl || '';
    if (profShortDesc) profShortDesc.value = currentProfile.shortDesc || '';

    updateLiveProfileCard();
  }

  function updateLiveProfileCard() {
    const name = profBizName ? profBizName.value.trim() : currentProfile.businessName;
    const cat = profCategory ? profCategory.value : currentProfile.category;
    const desc = profShortDesc ? profShortDesc.value.trim() : currentProfile.shortDesc;
    const loc = profLocation ? profLocation.value.trim() : currentProfile.location;
    const phone = profPhone ? profPhone.value.trim() : currentProfile.phone;
    const img = profImageUrl ? profImageUrl.value.trim() : currentProfile.imageUrl;

    if (profCardTitle) profCardTitle.textContent = name || 'Business Name';
    if (profCardCat) profCardCat.textContent = cat || 'Services';
    if (profCardDesc) profCardDesc.textContent = desc || 'Short description of your services.';
    if (profCardLocation) profCardLocation.textContent = loc || 'City, State';
    if (profCardPhone) profCardPhone.textContent = phone || 'Contact Phone';
    if (profPreviewImg && img) profPreviewImg.src = img;

    if (sidebarBizName) sidebarBizName.textContent = name;
  }

  // Live preview input listeners
  [profBizName, profCategory, profShortDesc, profLocation, profPhone, profImageUrl].forEach(inp => {
    if (inp) inp.addEventListener('input', updateLiveProfileCard);
  });

  // Profile Form Submit
  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();

      currentProfile.businessName = profBizName.value.trim();
      currentProfile.category = profCategory.value;
      currentProfile.ownerName = profOwnerName.value.trim();
      currentProfile.phone = profPhone.value.trim();
      currentProfile.email = profEmail.value.trim();
      currentProfile.location = profLocation.value.trim();
      currentProfile.serviceArea = profServiceArea.value.trim();
      currentProfile.imageUrl = profImageUrl.value.trim() || currentProfile.imageUrl;
      currentProfile.shortDesc = profShortDesc.value.trim();

      saveProfile();
      updateLiveProfileCard();

      alert('Business Profile updated successfully!');
    });
  }

  /**
   * 5. Customer Reviews Rendering
   */
  function renderReviews() {
    if (!reviewsContainer) return;

    reviewsContainer.innerHTML = defaultReviews.map(rev => {
      const starsHtml = Array.from({ length: 5 }, (_, i) => `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="${i < rev.rating ? '#f59e0b' : '#cbd5e1'}" style="color: ${i < rev.rating ? '#f59e0b' : '#cbd5e1'};">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      `).join('');

      return `
        <div class="dashboard-review-card">
          <div class="dashboard-review-header">
            <div class="reviewer-meta">
              <div class="reviewer-avatar-badge">${rev.initials}</div>
              <div>
                <strong style="font-size: var(--font-size-sm); color: var(--color-text-main);">${rev.name}</strong>
                <div style="font-size: var(--font-size-xs); color: var(--color-text-muted);">${rev.date} • Verified Customer</div>
              </div>
            </div>
            <div style="display: flex; gap: 0.15rem;">
              ${starsHtml}
            </div>
          </div>

          <div style="font-size: var(--font-size-xs); color: var(--color-primary); font-weight: 600;">
            Booked: ${rev.service}
          </div>

          <p style="font-size: var(--font-size-sm); color: var(--color-text-main); line-height: 1.5; margin: 0;">
            "${rev.comment}"
          </p>
        </div>
      `;
    }).join('');
  }

  // Mobile sidebar toggle
  if (sidebarToggle && sidebar) {
    sidebarToggle.style.display = 'inline-flex';
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('sidebar-open');
    });

    document.addEventListener('click', (e) => {
      if (sidebar.classList.contains('sidebar-open') && !sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
        sidebar.classList.remove('sidebar-open');
      }
    });
  }

  // Initialize
  calculateMetrics();
  renderOverviewTable();
  renderOrdersTable();
  renderServices();
  populateProfileForm();
  renderReviews();
});
