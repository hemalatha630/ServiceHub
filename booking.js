/**
 * ServiceHub - Booking & Cart Page Functionality (booking.js)
 * Supports:
 *  1. Dynamic service loading via URL query (?id=s1, ?id=auto, etc.)
 *  2. Date & Time slot selection with validation
 *  3. Dynamic quantity calculation (Unit Price, Subtotal, Total Amount)
 *  4. Item removal with graceful Empty Cart state and Undo restore
 *  5. Form validation and Checkout preview modal workflow
 *  6. Mobile navigation toggle
 */

document.addEventListener('DOMContentLoaded', () => {
  // Service dataset
  const servicesCatalog = {
    's1': {
      id: 's1',
      name: 'Standard Residential Deep Clean & Sanitization',
      category: 'Cleaning',
      categoryTheme: 'theme-cleaning',
      merchantId: '1',
      merchantName: 'SparkleClean Co.',
      price: 65,
      duration: '2 hours duration',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=300&q=80'
    },
    's2': {
      id: 's2',
      name: 'Move-In / Move-Out Sanitization Overhaul',
      category: 'Cleaning',
      categoryTheme: 'theme-cleaning',
      merchantId: '1',
      merchantName: 'SparkleClean Co.',
      price: 140,
      duration: '3.5 hours duration',
      image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=300&q=80'
    },
    's3': {
      id: 's3',
      name: 'Eco Commercial Office & Studio Maintenance',
      category: 'Cleaning',
      categoryTheme: 'theme-cleaning',
      merchantId: '1',
      merchantName: 'SparkleClean Co.',
      price: 190,
      duration: '4 hours duration',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=300&q=80'
    },
    'auto': {
      id: 'auto',
      name: 'Mobile Signature Full Auto Detail & Ceramic Seal',
      category: 'Automotive',
      categoryTheme: 'theme-automotive',
      merchantId: '2',
      merchantName: 'Apex Auto Studio',
      price: 120,
      duration: '3 hours duration',
      image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=300&q=80'
    },
    'plumb': {
      id: 'plumb',
      name: 'Drain Clearing & Fiber-Optic Camera Inspection',
      category: 'Repair',
      categoryTheme: 'theme-repair',
      merchantId: '3',
      merchantName: 'Precision Plumbing Pro',
      price: 95,
      duration: '1.5 hours duration',
      image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=300&q=80'
    },
    'beauty': {
      id: 'beauty',
      name: 'Bespoke Haircut, Scalp Spa & Conditioning',
      category: 'Beauty',
      categoryTheme: 'theme-beauty',
      merchantId: '4',
      merchantName: 'Glow Salon & Day Spa',
      price: 85,
      duration: '1.25 hours duration',
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=300&q=80'
    }
  };

  // 1. Identify Service from URL or default
  const params = new URLSearchParams(window.location.search);
  const serviceKey = params.get('id') || params.get('serviceId') || 's1';
  let currentService = servicesCatalog[serviceKey] || servicesCatalog['s1'];
  let quantity = 1;

  // DOM Elements - Service Card
  const cartServiceImg = document.getElementById('cart-service-img');
  const cartCatPill = document.getElementById('cart-cat-pill');
  const cartServiceName = document.getElementById('cart-service-name');
  const cartMerchantName = document.getElementById('cart-merchant-name');
  const cartServiceDuration = document.getElementById('cart-service-duration');
  const cartServicePrice = document.getElementById('cart-service-price');
  const linkBackService = document.getElementById('link-back-service');

  // DOM Elements - Booking Details Form
  const bookingDateInput = document.getElementById('booking-date');
  const timeBtns = Array.from(document.querySelectorAll('.booking-time-btn'));
  const selectedTimeInput = document.getElementById('selected-time-val');
  const customerNameInput = document.getElementById('customer-name');
  const customerPhoneInput = document.getElementById('customer-phone');
  const customerNotesInput = document.getElementById('customer-notes');
  const nameError = document.getElementById('name-error');
  const phoneError = document.getElementById('phone-error');

  // DOM Elements - Cart Summary
  const qtyVal = document.getElementById('qty-val');
  const btnQtyMinus = document.getElementById('btn-qty-minus');
  const btnQtyPlus = document.getElementById('btn-qty-plus');
  const summaryUnitPrice = document.getElementById('summary-unit-price');
  const summarySubtotal = document.getElementById('summary-subtotal');
  const summaryTotalPrice = document.getElementById('summary-total-price');
  const btnRemoveService = document.getElementById('btn-remove-service');

  // DOM Elements - Containers & States
  const bookingLayout = document.getElementById('booking-layout');
  const emptyCartCard = document.getElementById('empty-cart-card');
  const btnRestoreItem = document.getElementById('btn-restore-item');
  const btnContinueCheckout = document.getElementById('btn-continue-checkout');

  // DOM Elements - Modal
  const checkoutModal = document.getElementById('checkout-modal');
  const modalClose = document.getElementById('modal-checkout-close');
  const modalEdit = document.getElementById('modal-checkout-edit');
  const modalProceed = document.getElementById('modal-checkout-proceed');
  const checkoutModalCat = document.getElementById('checkout-modal-cat');
  const modalSummarySrvName = document.getElementById('modal-summary-srv-name');
  const modalSummaryMchName = document.getElementById('modal-summary-mch-name');
  const modalSummaryDate = document.getElementById('modal-summary-date');
  const modalSummaryTime = document.getElementById('modal-summary-time');
  const modalSummaryClient = document.getElementById('modal-summary-client');
  const modalSummaryPhone = document.getElementById('modal-summary-phone');
  const modalSummaryTotalVal = document.getElementById('modal-summary-total-val');

  /**
   * Render Selected Service Details in Cart
   */
  function renderService() {
    if (!currentService) return;
    if (cartServiceImg) {
      cartServiceImg.src = currentService.image;
      cartServiceImg.alt = currentService.name;
    }
    if (cartCatPill) {
      cartCatPill.textContent = currentService.category;
      cartCatPill.className = `merchant-cat-pill ${currentService.categoryTheme}`;
    }
    if (cartServiceName) cartServiceName.textContent = currentService.name;
    if (cartMerchantName) cartMerchantName.textContent = currentService.merchantName;
    if (cartServiceDuration) cartServiceDuration.textContent = currentService.duration;
    if (cartServicePrice) cartServicePrice.textContent = `$${currentService.price.toFixed(2)}`;
    if (linkBackService) linkBackService.href = `service-details.html?id=${currentService.id}`;

    calculateTotals();
  }

  /**
   * Recalculates cart amounts dynamically
   */
  function calculateTotals() {
    if (!currentService) return;
    const unit = currentService.price;
    const subtotal = unit * quantity;
    const total = subtotal; // Free service fee

    if (qtyVal) qtyVal.textContent = quantity;
    if (summaryUnitPrice) summaryUnitPrice.textContent = `$${unit.toFixed(2)}`;
    if (summarySubtotal) summarySubtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (summaryTotalPrice) summaryTotalPrice.textContent = `$${total.toFixed(2)}`;
  }

  // Quantity adjustments
  if (btnQtyMinus) {
    btnQtyMinus.addEventListener('click', () => {
      if (quantity > 1) {
        quantity--;
        calculateTotals();
      }
    });
  }

  if (btnQtyPlus) {
    btnQtyPlus.addEventListener('click', () => {
      quantity++;
      calculateTotals();
    });
  }

  // 2. Date Initialization: Tomorrow minimum
  if (bookingDateInput) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Format YYYY-MM-DD
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    const minDateStr = `${yyyy}-${mm}-${dd}`;
    
    bookingDateInput.min = minDateStr;
    bookingDateInput.value = minDateStr;
  }

  // 2. Time Slot Button Selection
  timeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      timeBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');
      const timeVal = btn.getAttribute('data-time');
      if (selectedTimeInput) selectedTimeInput.value = timeVal;
    });
  });

  // 4. Remove Service from Cart
  if (btnRemoveService) {
    btnRemoveService.addEventListener('click', () => {
      if (bookingLayout) bookingLayout.style.display = 'none';
      if (emptyCartCard) emptyCartCard.removeAttribute('hidden');
    });
  }

  // Restore Service Item (Undo)
  if (btnRestoreItem) {
    btnRestoreItem.addEventListener('click', () => {
      if (emptyCartCard) emptyCartCard.setAttribute('hidden', '');
      if (bookingLayout) bookingLayout.style.display = 'grid';
    });
  }

  // 4. Form Validation & Continue to Checkout
  function validateAndProceed() {
    let isValid = true;

    // Validate Customer Name
    const nameVal = customerNameInput ? customerNameInput.value.trim() : '';
    if (!nameVal || nameVal.length < 2) {
      if (nameError) nameError.style.display = 'block';
      if (customerNameInput) customerNameInput.style.borderColor = 'var(--color-error)';
      isValid = false;
    } else {
      if (nameError) nameError.style.display = 'none';
      if (customerNameInput) customerNameInput.style.borderColor = '';
    }

    // Validate Phone Number
    const phoneVal = customerPhoneInput ? customerPhoneInput.value.trim() : '';
    const digitsOnly = phoneVal.replace(/[^0-9]/g, '');
    if (!phoneVal || digitsOnly.length < 7) {
      if (phoneError) phoneError.style.display = 'block';
      if (customerPhoneInput) customerPhoneInput.style.borderColor = 'var(--color-error)';
      isValid = false;
    } else {
      if (phoneError) phoneError.style.display = 'none';
      if (customerPhoneInput) customerPhoneInput.style.borderColor = '';
    }

    // Validate Date
    if (!bookingDateInput || !bookingDateInput.value) {
      if (bookingDateInput) bookingDateInput.focus();
      return;
    }

    if (!isValid) {
      if (nameVal.length < 2 && customerNameInput) {
        customerNameInput.focus();
      } else if (customerPhoneInput) {
        customerPhoneInput.focus();
      }
      return;
    }

    // Populate Checkout Review Modal
    if (checkoutModalCat) {
      checkoutModalCat.textContent = currentService.category;
      checkoutModalCat.className = `merchant-cat-pill ${currentService.categoryTheme}`;
    }
    if (modalSummarySrvName) modalSummarySrvName.textContent = currentService.name;
    if (modalSummaryMchName) modalSummaryMchName.textContent = currentService.merchantName;
    
    // Format human-friendly date
    const dateParts = bookingDateInput.value.split('-');
    const formattedDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    const selectedTime = selectedTimeInput ? selectedTimeInput.value : '09:00 AM';

    if (modalSummaryDate) modalSummaryDate.textContent = formattedDate;
    if (modalSummaryTime) modalSummaryTime.textContent = selectedTime;
    if (modalSummaryClient) modalSummaryClient.textContent = nameVal;
    if (modalSummaryPhone) modalSummaryPhone.textContent = phoneVal;
    if (modalSummaryTotalVal) {
      const totalAmount = currentService.price * quantity;
      modalSummaryTotalVal.textContent = `$${totalAmount.toFixed(2)}`;
    }

    // Open Modal
    if (checkoutModal) {
      checkoutModal.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';
      if (modalProceed) modalProceed.focus();
    }
  }

  function closeCheckoutModal() {
    if (!checkoutModal) return;
    checkoutModal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  if (btnContinueCheckout) {
    btnContinueCheckout.addEventListener('click', validateAndProceed);
  }

  if (modalClose) modalClose.addEventListener('click', closeCheckoutModal);
  if (modalEdit) modalEdit.addEventListener('click', closeCheckoutModal);

  if (modalProceed) {
    modalProceed.addEventListener('click', () => {
      modalProceed.textContent = 'Booking Verified!';
      modalProceed.style.backgroundColor = '#059669';
      setTimeout(() => {
        closeCheckoutModal();
        modalProceed.textContent = 'Proceed to Checkout';
        modalProceed.style.backgroundColor = '';
        alert('Booking details verified! Ready for Checkout feature.');
      }, 700);
    });
  }

  if (checkoutModal) {
    checkoutModal.addEventListener('click', (e) => {
      if (e.target === checkoutModal) closeCheckoutModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && checkoutModal && !checkoutModal.hasAttribute('hidden')) {
      closeCheckoutModal();
    }
  });

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

  // Initial render
  renderService();
});
