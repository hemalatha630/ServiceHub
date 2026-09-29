/**
 * ServiceHub - Professional Admin Dashboard (admin-dashboard.js)
 * Supports:
 *  1. Platform overview metrics (Total Customers, Total Merchants, Total Orders, Total Services)
 *  2. Merchant management (View details, Approve, Suspend/Re-activate)
 *  3. Customer management (View details, Suspend/Re-activate)
 *  4. Category management (Full CRUD: View, Add, Edit, Delete)
 *  5. Order management (Filtered listing, Search, Status viewing)
 *  6. Review moderation (Inspect reviews, Remove inappropriate reviews)
 *  7. Platform settings & responsive sidebar navigation
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Initial Mock Datasets
  const defaultMerchants = [
    {
      id: 'm1',
      name: 'Elena Rostova',
      businessName: 'SparkleClean Co.',
      category: 'Cleaning',
      email: 'elena@sparklecleanco.com',
      phone: '+1 (555) 349-2810',
      location: 'Central City, CA',
      status: 'Approved'
    },
    {
      id: 'm2',
      name: 'Marcus Chen',
      businessName: 'Apex Auto Studio',
      category: 'Automotive',
      email: 'marcus@apexautostudio.com',
      phone: '+1 (555) 892-1049',
      location: 'Central City, CA',
      status: 'Approved'
    },
    {
      id: 'm3',
      name: 'Thomas Miller',
      businessName: 'Precision Plumbing Pro',
      category: 'Repair',
      email: 'thomas@precisionplumb.com',
      phone: '+1 (555) 234-9012',
      location: 'Central City, CA',
      status: 'Approved'
    },
    {
      id: 'm4',
      name: 'Maya Lin',
      businessName: 'Glow Salon & Day Spa',
      category: 'Beauty',
      email: 'maya@glowspa.com',
      phone: '+1 (555) 781-4560',
      location: 'Central City, CA',
      status: 'Approved'
    },
    {
      id: 'm5',
      name: 'Jason Vance',
      businessName: 'Vance Home Renovations',
      category: 'Home',
      email: 'jason@vancehome.com',
      phone: '+1 (555) 678-9012',
      location: 'Eastwood, CA',
      status: 'Pending'
    },
    {
      id: 'm6',
      name: 'Chloe Martin',
      businessName: 'Paws & Claws Pet Spa',
      category: 'Pet',
      email: 'chloe@pawsclaws.com',
      phone: '+1 (555) 456-7890',
      location: 'North Hills, CA',
      status: 'Pending'
    },
    {
      id: 'm7',
      name: 'Derek Wright',
      businessName: 'Rapid Appliance Repair',
      category: 'Repair',
      email: 'derek@rapidrepair.com',
      phone: '+1 (555) 321-6549',
      location: 'South Bay, CA',
      status: 'Suspended'
    }
  ];

  const defaultCustomers = [
    {
      id: 'c1',
      name: 'Jordan Miller',
      email: 'jordan.miller@example.com',
      phone: '(555) 234-5678',
      regDate: 'Sep 12, 2026',
      status: 'Active',
      ordersCount: 4
    },
    {
      id: 'c2',
      name: 'Sarah Jenkins',
      email: 'sarah.j@example.com',
      phone: '(555) 891-2345',
      regDate: 'Sep 15, 2026',
      status: 'Active',
      ordersCount: 2
    },
    {
      id: 'c3',
      name: 'David Rivera',
      email: 'david.r@example.com',
      phone: '(555) 432-8765',
      regDate: 'Aug 28, 2026',
      status: 'Active',
      ordersCount: 1
    },
    {
      id: 'c4',
      name: 'Emily Zhang',
      email: 'emily.z@example.com',
      phone: '(555) 678-1234',
      regDate: 'Aug 10, 2026',
      status: 'Active',
      ordersCount: 3
    },
    {
      id: 'c5',
      name: 'Robert Taylor',
      email: 'robert.t@example.com',
      phone: '(555) 901-7654',
      regDate: 'Jul 04, 2026',
      status: 'Suspended',
      ordersCount: 1
    }
  ];

  const defaultCategories = [
    {
      id: 'cat_1',
      name: 'Home Services',
      icon: '🏠',
      desc: 'Plumbing, electrical, handyman repairs, interior renovation, and HVAC maintenance.',
      servicesCount: 28
    },
    {
      id: 'cat_2',
      name: 'Cleaning',
      icon: '🧹',
      desc: 'Residential deep cleaning, move-in/out sanitization, and eco commercial office care.',
      servicesCount: 22
    },
    {
      id: 'cat_3',
      name: 'Automotive',
      icon: '🚗',
      desc: 'Mobile paint correction, ceramic sealants, interior steam detailing, and routine tune-ups.',
      servicesCount: 18
    },
    {
      id: 'cat_4',
      name: 'Beauty & Wellness',
      icon: '💇',
      desc: 'Bespoke hair styling, scalp therapies, massage therapy, and wellness day packages.',
      servicesCount: 16
    },
    {
      id: 'cat_5',
      name: 'Repair & Appliances',
      icon: '🔧',
      desc: 'Major appliance repair, drain camera scoping, fixture repair, and electrical troubleshooting.',
      servicesCount: 24
    },
    {
      id: 'cat_6',
      name: 'Pet Care',
      icon: '🐾',
      desc: 'Mobile canine grooming, hydro-bath treatments, behavioral training, and daily walking.',
      servicesCount: 14
    },
    {
      id: 'cat_7',
      name: 'Education & Lessons',
      icon: '📚',
      desc: 'Private music tutoring, foreign language coaching, and academic test prep.',
      servicesCount: 19
    },
    {
      id: 'cat_8',
      name: 'Other Services',
      icon: '⭐',
      desc: 'Commercial photography, specialty tailoring, event logistics, and custom lifestyle services.',
      servicesCount: 15
    }
  ];

  const defaultOrders = [
    {
      orderId: 'SH-2026-88492',
      customer: 'Jordan Miller',
      merchant: 'SparkleClean Co.',
      service: 'Standard Residential Deep Clean',
      amount: '$65.00',
      date: 'Sep 30, 2026',
      status: 'Confirmed'
    },
    {
      orderId: 'SH-2026-91042',
      customer: 'Sarah Jenkins',
      merchant: 'SparkleClean Co.',
      service: 'Move-In Overhaul',
      amount: '$140.00',
      date: 'Oct 2, 2026',
      status: 'Pending'
    },
    {
      orderId: 'SH-2026-78421',
      customer: 'David Rivera',
      merchant: 'Apex Auto Studio',
      service: 'Signature Auto Detail',
      amount: '$120.00',
      date: 'Sep 28, 2026',
      status: 'Completed'
    },
    {
      orderId: 'SH-2026-64210',
      customer: 'Emily Zhang',
      merchant: 'Glow Salon & Day Spa',
      service: 'Bespoke Haircut & Spa',
      amount: '$85.00',
      date: 'Sep 24, 2026',
      status: 'Completed'
    },
    {
      orderId: 'SH-2026-51209',
      customer: 'Robert Taylor',
      merchant: 'Precision Plumbing Pro',
      service: 'Drain Clearing',
      amount: '$95.00',
      date: 'Aug 24, 2026',
      status: 'Cancelled'
    }
  ];

  const defaultReviews = [
    {
      id: 'rev_1',
      customer: 'Samantha Vance',
      merchant: 'SparkleClean Co.',
      rating: 5,
      date: 'Sep 27, 2026',
      review: 'Elena and her team did an absolutely spotless job! My home has never looked or smelled fresher. Extremely professional and courteous.'
    },
    {
      id: 'rev_2',
      customer: 'Michael Chang',
      merchant: 'SparkleClean Co.',
      rating: 5,
      date: 'Sep 22, 2026',
      review: 'Got 100% of my security deposit back thanks to their move-out deep clean. Every appliance and cabinet was immaculate.'
    },
    {
      id: 'rev_3',
      customer: 'Carlos Mendez',
      merchant: 'Apex Auto Studio',
      rating: 5,
      date: 'Sep 18, 2026',
      review: 'Marcus came right to my office driveway. The ceramic coating on my car looks like a mirror. 10/10 recommend!'
    },
    {
      id: 'rev_4',
      customer: 'SpamUser99',
      merchant: 'Precision Plumbing Pro',
      rating: 1,
      date: 'Sep 10, 2026',
      review: '[Flagged Spam] Check out free crypto cash bonus visit promotional-rewards.xyz now for rewards!'
    },
    {
      id: 'rev_5',
      customer: 'David Kim',
      merchant: 'Glow Salon & Day Spa',
      rating: 4,
      date: 'Sep 05, 2026',
      review: 'Great scalp massage and clean haircut. Staff is welcoming and booking was super easy.'
    }
  ];

  // Load from LocalStorage with fallbacks
  let merchants = defaultMerchants;
  try {
    const raw = localStorage.getItem('servicehub_admin_merchants');
    if (raw) merchants = JSON.parse(raw);
  } catch (e) { console.warn(e); }

  let customers = defaultCustomers;
  try {
    const raw = localStorage.getItem('servicehub_admin_customers');
    if (raw) customers = JSON.parse(raw);
  } catch (e) { console.warn(e); }

  let categories = defaultCategories;
  try {
    const raw = localStorage.getItem('servicehub_admin_categories');
    if (raw) categories = JSON.parse(raw);
  } catch (e) { console.warn(e); }

  let orders = defaultOrders;
  try {
    const rawOrders = localStorage.getItem('servicehub_orders');
    if (rawOrders) {
      const parsed = JSON.parse(rawOrders);
      const normalized = parsed.map(o => ({
        orderId: o.orderId,
        customer: o.customerName || 'Customer',
        merchant: o.merchantName || 'SparkleClean Co.',
        service: o.serviceName || 'Service',
        amount: `$${parseFloat(o.amount || 65).toFixed(2)}`,
        date: o.date || 'Sep 30, 2026',
        status: o.status || 'Confirmed'
      }));
      const seen = new Set(defaultOrders.map(o => o.orderId));
      const extras = normalized.filter(o => !seen.has(o.orderId));
      orders = [...extras, ...defaultOrders];
    }
  } catch (e) { console.warn(e); }

  let reviews = defaultReviews;
  try {
    const raw = localStorage.getItem('servicehub_admin_reviews');
    if (raw) reviews = JSON.parse(raw);
  } catch (e) { console.warn(e); }

  // DOM Elements - Navigation Views
  const navBtns = document.querySelectorAll('.dashboard-nav-item');
  const viewSections = {
    overview: document.getElementById('admin-view-overview'),
    merchants: document.getElementById('admin-view-merchants'),
    customers: document.getElementById('admin-view-customers'),
    categories: document.getElementById('admin-view-categories'),
    orders: document.getElementById('admin-view-orders'),
    reviews: document.getElementById('admin-view-reviews'),
    settings: document.getElementById('admin-view-settings')
  };
  const adminViewTitle = document.getElementById('admin-current-view-title');
  const sidebarToggle = document.getElementById('admin-sidebar-toggle');
  const sidebar = document.getElementById('admin-sidebar');

  // DOM Elements - Overview Summary
  const metricTotalCustomers = document.getElementById('metric-total-customers');
  const metricTotalMerchants = document.getElementById('metric-total-merchants');
  const metricTotalOrders = document.getElementById('metric-admin-total-orders');
  const metricTotalServices = document.getElementById('metric-total-services');
  const metricMerchantsSub = document.getElementById('metric-merchants-sub');
  const overviewOrdersTbody = document.getElementById('admin-overview-orders-tbody');
  const btnAdminViewAllOrders = document.getElementById('btn-admin-view-all-orders');

  // DOM Elements - Merchants View
  const merchantsTbody = document.getElementById('admin-merchants-tbody');
  const merchantsSearch = document.getElementById('admin-merchants-search');
  const merchantFilterPills = document.querySelectorAll('#admin-merchant-filters .order-filter-pill');
  const mCountAll = document.getElementById('m-count-all');
  const mCountApproved = document.getElementById('m-count-approved');
  const mCountPending = document.getElementById('m-count-pending');
  const mCountSuspended = document.getElementById('m-count-suspended');

  // DOM Elements - Customers View
  const customersTbody = document.getElementById('admin-customers-tbody');
  const customersSearch = document.getElementById('admin-customers-search');
  const customerFilterPills = document.querySelectorAll('#admin-customer-filters .order-filter-pill');
  const cCountAll = document.getElementById('c-count-all');
  const cCountActive = document.getElementById('c-count-active');
  const cCountSuspended = document.getElementById('c-count-suspended');

  // DOM Elements - Categories View
  const categoriesContainer = document.getElementById('admin-categories-container');
  const btnAdminAddCategory = document.getElementById('btn-admin-add-category');
  const categoryModal = document.getElementById('admin-category-modal');
  const categoryModalClose = document.getElementById('modal-cat-close');
  const categoryModalCancel = document.getElementById('modal-cat-cancel');
  const categoryForm = document.getElementById('admin-category-form');
  const categoryFormTitle = document.getElementById('modal-cat-form-title');
  const catFormId = document.getElementById('cat-form-id');
  const catNameInput = document.getElementById('cat-name-input');
  const catIconInput = document.getElementById('cat-icon-input');
  const catDescInput = document.getElementById('cat-desc-input');

  // DOM Elements - Orders View
  const ordersTbody = document.getElementById('admin-orders-tbody');
  const ordersSearch = document.getElementById('admin-orders-search');
  const orderFilterPills = document.querySelectorAll('#admin-order-filters .order-filter-pill');
  const oCountAll = document.getElementById('o-count-all');
  const oCountConfirmed = document.getElementById('o-count-confirmed');
  const oCountCompleted = document.getElementById('o-count-completed');
  const oCountCancelled = document.getElementById('o-count-cancelled');

  // DOM Elements - Reviews View
  const reviewsContainer = document.getElementById('admin-reviews-container');

  // DOM Elements - Settings View
  const settingsForm = document.getElementById('admin-settings-form');

  // DOM Elements - Modals
  const merchantModal = document.getElementById('admin-merchant-modal');
  const merchantModalClose = document.getElementById('modal-m-close');
  const merchantModalDone = document.getElementById('modal-m-btn-done');
  const modalMBizname = document.getElementById('modal-m-bizname');
  const modalMStatusPill = document.getElementById('modal-m-status-pill');
  const modalMCategory = document.getElementById('modal-m-category');
  const modalMOwner = document.getElementById('modal-m-owner');
  const modalMEmail = document.getElementById('modal-m-email');
  const modalMPhone = document.getElementById('modal-m-phone');
  const modalMLocation = document.getElementById('modal-m-location');

  const customerModal = document.getElementById('admin-customer-modal');
  const customerModalClose = document.getElementById('modal-c-close');
  const customerModalDone = document.getElementById('modal-c-btn-done');
  const modalCName = document.getElementById('modal-c-name');
  const modalCStatusPill = document.getElementById('modal-c-status-pill');
  const modalCRegdate = document.getElementById('modal-c-regdate');
  const modalCEmail = document.getElementById('modal-c-email');
  const modalCPhone = document.getElementById('modal-c-phone');
  const modalCOrdersCount = document.getElementById('modal-c-orders-count');

  // State Filters
  let merchantFilter = 'all';
  let merchantQuery = '';
  let customerFilter = 'all';
  let customerQuery = '';
  let orderFilter = 'all';
  let orderQuery = '';

  /**
   * Save Helpers
   */
  function saveMerchants() {
    try { localStorage.setItem('servicehub_admin_merchants', JSON.stringify(merchants)); } catch(e){}
  }
  function saveCustomers() {
    try { localStorage.setItem('servicehub_admin_customers', JSON.stringify(customers)); } catch(e){}
  }
  function saveCategories() {
    try { localStorage.setItem('servicehub_admin_categories', JSON.stringify(categories)); } catch(e){}
  }
  function saveReviews() {
    try { localStorage.setItem('servicehub_admin_reviews', JSON.stringify(reviews)); } catch(e){}
  }

  /**
   * Navigation: Switch Admin View
   */
  function switchAdminView(viewName) {
    navBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-view') === viewName);
    });

    Object.keys(viewSections).forEach(key => {
      if (viewSections[key]) {
        viewSections[key].style.display = key === viewName ? 'flex' : 'none';
      }
    });

    const titles = {
      overview: 'Platform Overview',
      merchants: 'Merchant Management',
      customers: 'Customer Management',
      categories: 'Category Management',
      orders: 'Order Management',
      reviews: 'Review Moderation',
      settings: 'Platform Settings'
    };
    if (adminViewTitle) adminViewTitle.textContent = titles[viewName] || 'Admin Dashboard';

    if (sidebar) sidebar.classList.remove('sidebar-open');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const v = btn.getAttribute('data-view');
      if (v) switchAdminView(v);
    });
  });

  if (btnAdminViewAllOrders) {
    btnAdminViewAllOrders.addEventListener('click', () => switchAdminView('orders'));
  }

  /**
   * 1. Overview Calculations & Render
   */
  function renderOverview() {
    const totalCust = customers.length + 1275;
    const totalMch = merchants.length;
    const pendingMch = merchants.filter(m => m.status === 'Pending').length;
    const totalOrd = orders.length + 3415;
    const totalSrv = categories.reduce((sum, c) => sum + (c.servicesCount || 10), 0);

    if (metricTotalCustomers) metricTotalCustomers.textContent = totalCust.toLocaleString();
    if (metricTotalMerchants) metricTotalMerchants.textContent = totalMch;
    if (metricTotalOrders) metricTotalOrders.textContent = totalOrd.toLocaleString();
    if (metricTotalServices) metricTotalServices.textContent = totalSrv;

    if (metricMerchantsSub) {
      metricMerchantsSub.textContent = `${pendingMch} pending approvals`;
      metricMerchantsSub.style.color = pendingMch > 0 ? '#b45309' : '#059669';
    }

    // Render Overview Recent Orders Table
    if (overviewOrdersTbody) {
      overviewOrdersTbody.innerHTML = orders.slice(0, 4).map(o => `
        <tr>
          <td style="font-family: monospace; font-weight: 700;">#${o.orderId}</td>
          <td><strong>${o.customer}</strong></td>
          <td>${o.merchant}</td>
          <td>${o.service}</td>
          <td><strong style="color: #059669;">${o.amount}</strong></td>
          <td><span class="status-badge status-${o.status.toLowerCase()}">${o.status}</span></td>
        </tr>
      `).join('');
    }
  }

  /**
   * 2. Merchant Management
   */
  function renderMerchants() {
    if (!merchantsTbody) return;

    // Counts
    const approvedCount = merchants.filter(m => m.status === 'Approved').length;
    const pendingCount = merchants.filter(m => m.status === 'Pending').length;
    const suspendedCount = merchants.filter(m => m.status === 'Suspended').length;

    if (mCountAll) mCountAll.textContent = merchants.length;
    if (mCountApproved) mCountApproved.textContent = approvedCount;
    if (mCountPending) mCountPending.textContent = pendingCount;
    if (mCountSuspended) mCountSuspended.textContent = suspendedCount;

    const filtered = merchants.filter(m => {
      if (merchantFilter !== 'all' && m.status.toLowerCase() !== merchantFilter) return false;
      if (merchantQuery) {
        const q = merchantQuery.toLowerCase();
        return m.name.toLowerCase().includes(q) ||
               m.businessName.toLowerCase().includes(q) ||
               m.email.toLowerCase().includes(q) ||
               m.category.toLowerCase().includes(q);
      }
      return true;
    });

    merchantsTbody.innerHTML = filtered.map(m => `
      <tr>
        <td><strong>${m.name}</strong></td>
        <td>${m.businessName}</td>
        <td><span class="merchant-cat-pill theme-cleaning" style="font-size: 0.75rem;">${m.category}</span></td>
        <td style="color: var(--color-text-muted);">${m.email}</td>
        <td>
          <span class="status-badge status-${m.status.toLowerCase()}">${m.status}</span>
        </td>
        <td>
          <div class="table-actions-cell">
            <button type="button" class="btn-table-action btn-action-view" data-action="view-m" data-id="${m.id}">
              View
            </button>
            ${m.status !== 'Approved' ? `
              <button type="button" class="btn-table-action btn-action-approve" data-action="approve-m" data-id="${m.id}">
                Approve
              </button>
            ` : ''}
            ${m.status !== 'Suspended' ? `
              <button type="button" class="btn-table-action btn-action-suspend" data-action="suspend-m" data-id="${m.id}">
                Suspend
              </button>
            ` : `
              <button type="button" class="btn-table-action btn-action-activate" data-action="activate-m" data-id="${m.id}">
                Re-activate
              </button>
            `}
          </div>
        </td>
      </tr>
    `).join('');

    // Attach Action Listeners
    merchantsTbody.querySelectorAll('button[data-action="view-m"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const m = merchants.find(item => item.id === btn.getAttribute('data-id'));
        if (m) openMerchantModal(m);
      });
    });

    merchantsTbody.querySelectorAll('button[data-action="approve-m"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const m = merchants.find(item => item.id === btn.getAttribute('data-id'));
        if (m) {
          m.status = 'Approved';
          saveMerchants();
          renderMerchants();
          renderOverview();
        }
      });
    });

    merchantsTbody.querySelectorAll('button[data-action="suspend-m"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const m = merchants.find(item => item.id === btn.getAttribute('data-id'));
        if (m && confirm(`Are you sure you want to suspend merchant "${m.businessName}"?`)) {
          m.status = 'Suspended';
          saveMerchants();
          renderMerchants();
          renderOverview();
        }
      });
    });

    merchantsTbody.querySelectorAll('button[data-action="activate-m"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const m = merchants.find(item => item.id === btn.getAttribute('data-id'));
        if (m) {
          m.status = 'Approved';
          saveMerchants();
          renderMerchants();
          renderOverview();
        }
      });
    });
  }

  function openMerchantModal(m) {
    if (!merchantModal) return;
    if (modalMBizname) modalMBizname.textContent = m.businessName;
    if (modalMStatusPill) {
      modalMStatusPill.textContent = m.status;
      modalMStatusPill.className = `status-badge status-${m.status.toLowerCase()}`;
    }
    if (modalMCategory) modalMCategory.textContent = m.category;
    if (modalMOwner) modalMOwner.textContent = m.name;
    if (modalMEmail) modalMEmail.textContent = m.email;
    if (modalMPhone) modalMPhone.textContent = m.phone;
    if (modalMLocation) modalMLocation.textContent = m.location;

    merchantModal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeMerchantModal() {
    if (!merchantModal) return;
    merchantModal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  if (merchantModalClose) merchantModalClose.addEventListener('click', closeMerchantModal);
  if (merchantModalDone) merchantModalDone.addEventListener('click', closeMerchantModal);
  if (merchantModal) {
    merchantModal.addEventListener('click', (e) => {
      if (e.target === merchantModal) closeMerchantModal();
    });
  }

  merchantFilterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      merchantFilterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      merchantFilter = pill.getAttribute('data-filter');
      renderMerchants();
    });
  });

  if (merchantsSearch) {
    merchantsSearch.addEventListener('input', (e) => {
      merchantQuery = e.target.value.trim();
      renderMerchants();
    });
  }

  /**
   * 3. Customer Management
   */
  function renderCustomers() {
    if (!customersTbody) return;

    const activeCount = customers.filter(c => c.status === 'Active').length;
    const suspendedCount = customers.filter(c => c.status === 'Suspended').length;

    if (cCountAll) cCountAll.textContent = customers.length;
    if (cCountActive) cCountActive.textContent = activeCount;
    if (cCountSuspended) cCountSuspended.textContent = suspendedCount;

    const filtered = customers.filter(c => {
      if (customerFilter !== 'all' && c.status.toLowerCase() !== customerFilter) return false;
      if (customerQuery) {
        const q = customerQuery.toLowerCase();
        return c.name.toLowerCase().includes(q) ||
               c.email.toLowerCase().includes(q) ||
               c.phone.toLowerCase().includes(q);
      }
      return true;
    });

    customersTbody.innerHTML = filtered.map(c => `
      <tr>
        <td><strong>${c.name}</strong></td>
        <td style="color: var(--color-text-muted);">${c.email}</td>
        <td>${c.phone}</td>
        <td>${c.regDate}</td>
        <td>
          <span class="status-badge status-${c.status.toLowerCase()}">${c.status}</span>
        </td>
        <td>
          <div class="table-actions-cell">
            <button type="button" class="btn-table-action btn-action-view" data-action="view-c" data-id="${c.id}">
              View
            </button>
            ${c.status === 'Active' ? `
              <button type="button" class="btn-table-action btn-action-suspend" data-action="suspend-c" data-id="${c.id}">
                Suspend
              </button>
            ` : `
              <button type="button" class="btn-table-action btn-action-activate" data-action="activate-c" data-id="${c.id}">
                Re-activate
              </button>
            `}
          </div>
        </td>
      </tr>
    `).join('');

    customersTbody.querySelectorAll('button[data-action="view-c"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const c = customers.find(item => item.id === btn.getAttribute('data-id'));
        if (c) openCustomerModal(c);
      });
    });

    customersTbody.querySelectorAll('button[data-action="suspend-c"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const c = customers.find(item => item.id === btn.getAttribute('data-id'));
        if (c && confirm(`Are you sure you want to suspend customer "${c.name}"?`)) {
          c.status = 'Suspended';
          saveCustomers();
          renderCustomers();
        }
      });
    });

    customersTbody.querySelectorAll('button[data-action="activate-c"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const c = customers.find(item => item.id === btn.getAttribute('data-id'));
        if (c) {
          c.status = 'Active';
          saveCustomers();
          renderCustomers();
        }
      });
    });
  }

  function openCustomerModal(c) {
    if (!customerModal) return;
    if (modalCName) modalCName.textContent = c.name;
    if (modalCStatusPill) {
      modalCStatusPill.textContent = c.status;
      modalCStatusPill.className = `status-badge status-${c.status.toLowerCase()}`;
    }
    if (modalCRegdate) modalCRegdate.textContent = `Registered: ${c.regDate}`;
    if (modalCEmail) modalCEmail.textContent = c.email;
    if (modalCPhone) modalCPhone.textContent = c.phone;
    if (modalCOrdersCount) modalCOrdersCount.textContent = `${c.ordersCount || 1} bookings`;

    customerModal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeCustomerModal() {
    if (!customerModal) return;
    customerModal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  if (customerModalClose) customerModalClose.addEventListener('click', closeCustomerModal);
  if (customerModalDone) customerModalDone.addEventListener('click', closeCustomerModal);
  if (customerModal) {
    customerModal.addEventListener('click', (e) => {
      if (e.target === customerModal) closeCustomerModal();
    });
  }

  customerFilterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      customerFilterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      customerFilter = pill.getAttribute('data-filter');
      renderCustomers();
    });
  });

  if (customersSearch) {
    customersSearch.addEventListener('input', (e) => {
      customerQuery = e.target.value.trim();
      renderCustomers();
    });
  }

  /**
   * 4. Category Management (CRUD)
   */
  function renderCategories() {
    if (!categoriesContainer) return;

    categoriesContainer.innerHTML = categories.map(cat => `
      <article class="admin-category-card" data-cat-id="${cat.id}">
        <div class="admin-category-top">
          <div class="admin-category-icon-wrap" aria-hidden="true">${cat.icon || '⭐'}</div>
          <span style="font-size: var(--font-size-xs); font-weight: 700; color: #2563eb; background-color: #eff6ff; padding: 0.2rem 0.5rem; border-radius: var(--radius-sm);">
            ${cat.servicesCount || 12} Services
          </span>
        </div>

        <h3 class="admin-category-title">${cat.name}</h3>
        <p class="admin-category-desc">${cat.desc}</p>

        <div class="admin-category-footer">
          <button type="button" class="btn btn-secondary" style="font-size: var(--font-size-xs); padding: 0.35rem 0.65rem;" data-action="edit-cat" data-id="${cat.id}">
            Edit
          </button>
          <button type="button" class="btn" style="font-size: var(--font-size-xs); padding: 0.35rem 0.65rem; background-color: #fee2e2; color: #dc2626; border: 1px solid #fca5a5;" data-action="delete-cat" data-id="${cat.id}">
            Delete
          </button>
        </div>
      </article>
    `).join('');

    categoriesContainer.querySelectorAll('button[data-action="edit-cat"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = categories.find(c => c.id === btn.getAttribute('data-id'));
        if (cat) openCategoryModal(cat);
      });
    });

    categoriesContainer.querySelectorAll('button[data-action="delete-cat"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const catId = btn.getAttribute('data-id');
        const cat = categories.find(c => c.id === catId);
        if (cat && confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
          categories = categories.filter(c => c.id !== catId);
          saveCategories();
          renderCategories();
          renderOverview();
        }
      });
    });
  }

  function openCategoryModal(cat = null) {
    if (!categoryModal) return;
    if (categoryFormTitle) categoryFormTitle.textContent = cat ? 'Edit Category' : 'Add Category';
    if (catFormId) catFormId.value = cat ? cat.id : '';
    if (catNameInput) catNameInput.value = cat ? cat.name : '';
    if (catIconInput) catIconInput.value = cat ? cat.icon : '✨';
    if (catDescInput) catDescInput.value = cat ? cat.desc : '';

    categoryModal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    if (catNameInput) catNameInput.focus();
  }

  function closeCategoryModal() {
    if (!categoryModal) return;
    categoryModal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  if (btnAdminAddCategory) btnAdminAddCategory.addEventListener('click', () => openCategoryModal(null));
  if (categoryModalClose) categoryModalClose.addEventListener('click', closeCategoryModal);
  if (categoryModalCancel) categoryModalCancel.addEventListener('click', closeCategoryModal);
  if (categoryModal) {
    categoryModal.addEventListener('click', (e) => {
      if (e.target === categoryModal) closeCategoryModal();
    });
  }

  if (categoryForm) {
    categoryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameVal = catNameInput ? catNameInput.value.trim() : '';
      const iconVal = catIconInput ? catIconInput.value.trim() : '⭐';
      const descVal = catDescInput ? catDescInput.value.trim() : '';
      const targetId = catFormId ? catFormId.value : '';

      if (!nameVal || !descVal) {
        alert('Please fill in category name and description.');
        return;
      }

      if (targetId) {
        const existing = categories.find(c => c.id === targetId);
        if (existing) {
          existing.name = nameVal;
          existing.icon = iconVal;
          existing.desc = descVal;
        }
      } else {
        categories.push({
          id: `cat_${Date.now()}`,
          name: nameVal,
          icon: iconVal,
          desc: descVal,
          servicesCount: 0
        });
      }

      saveCategories();
      renderCategories();
      renderOverview();
      closeCategoryModal();
    });
  }

  /**
   * 5. Order Management
   */
  function renderOrders() {
    if (!ordersTbody) return;

    const confirmedCount = orders.filter(o => o.status.toLowerCase() === 'confirmed').length;
    const completedCount = orders.filter(o => o.status.toLowerCase() === 'completed').length;
    const cancelledCount = orders.filter(o => o.status.toLowerCase() === 'cancelled').length;

    if (oCountAll) oCountAll.textContent = orders.length;
    if (oCountConfirmed) oCountConfirmed.textContent = confirmedCount;
    if (oCountCompleted) oCountCompleted.textContent = completedCount;
    if (oCountCancelled) oCountCancelled.textContent = cancelledCount;

    const filtered = orders.filter(o => {
      if (orderFilter !== 'all' && o.status.toLowerCase() !== orderFilter) return false;
      if (orderQuery) {
        const q = orderQuery.toLowerCase();
        return o.orderId.toLowerCase().includes(q) ||
               o.customer.toLowerCase().includes(q) ||
               o.merchant.toLowerCase().includes(q) ||
               o.service.toLowerCase().includes(q);
      }
      return true;
    });

    ordersTbody.innerHTML = filtered.map(o => `
      <tr>
        <td style="font-family: monospace; font-weight: 700;">#${o.orderId}</td>
        <td><strong>${o.customer}</strong></td>
        <td>${o.merchant}</td>
        <td>${o.service}</td>
        <td><strong style="color: #059669;">${o.amount}</strong></td>
        <td>${o.date}</td>
        <td><span class="status-badge status-${o.status.toLowerCase()}">${o.status}</span></td>
        <td>
          <button type="button" class="btn-table-action btn-action-view" onclick="alert('Order #${o.orderId}\\nCustomer: ${o.customer}\\nMerchant: ${o.merchant}\\nService: ${o.service}\\nAmount: ${o.amount}\\nStatus: ${o.status}')">
            Details
          </button>
        </td>
      </tr>
    `).join('');
  }

  orderFilterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      orderFilterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      orderFilter = pill.getAttribute('data-filter');
      renderOrders();
    });
  });

  if (ordersSearch) {
    ordersSearch.addEventListener('input', (e) => {
      orderQuery = e.target.value.trim();
      renderOrders();
    });
  }

  /**
   * 6. Review Moderation
   */
  function renderReviews() {
    if (!reviewsContainer) return;

    reviewsContainer.innerHTML = reviews.map(rev => {
      const stars = Array.from({ length: 5 }, (_, i) => `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="${i < rev.rating ? '#f59e0b' : '#cbd5e1'}" style="color: ${i < rev.rating ? '#f59e0b' : '#cbd5e1'};">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      `).join('');

      return `
        <div class="admin-review-card" data-review-id="${rev.id}">
          <div class="admin-review-header">
            <div>
              <strong>${rev.customer}</strong>
              <span style="font-size: var(--font-size-xs); color: var(--color-text-muted);">reviewed</span>
              <strong style="color: var(--color-primary);">${rev.merchant}</strong>
              <span style="font-size: var(--font-size-xs); color: var(--color-text-subtle); margin-left: 0.5rem;">${rev.date}</span>
            </div>

            <div style="display: flex; align-items: center; gap: 1rem;">
              <div style="display: flex; gap: 0.15rem;">
                ${stars}
              </div>
              <button type="button" class="btn-table-action btn-action-delete" data-action="remove-review" data-id="${rev.id}">
                Remove Review
              </button>
            </div>
          </div>

          <p style="font-size: var(--font-size-sm); color: var(--color-text-main); margin: 0; line-height: 1.5;">
            "${rev.review}"
          </p>
        </div>
      `;
    }).join('');

    reviewsContainer.querySelectorAll('button[data-action="remove-review"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const revId = btn.getAttribute('data-id');
        if (confirm('Are you sure you want to remove this review as inappropriate?')) {
          reviews = reviews.filter(r => r.id !== revId);
          saveReviews();
          renderReviews();
        }
      });
    });
  }

  /**
   * 7. Settings Form
   */
  if (settingsForm) {
    settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Platform settings saved successfully.');
    });
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

  // Initialize all sections
  renderOverview();
  renderMerchants();
  renderCustomers();
  renderCategories();
  renderOrders();
  renderReviews();
});
