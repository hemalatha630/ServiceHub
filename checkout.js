/**
 * ServiceHub - Checkout Page Functionality (checkout.js)
 * Supports:
 *  1. Receiving booking state from URL params or sessionStorage
 *  2. Customer Contact Information validation (Name, Email, Phone)
 *  3. Payment method preference selection
 *  4. Final totals calculation & billing summary
 *  5. "Proceed to Payment" redirection & modal workflow
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
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=300&q=80'
    }
  };

  // Parse incoming data from URL parameters
  const params = new URLSearchParams(window.location.search);
  const serviceKey = params.get('id') || params.get('serviceId') || 's1';
  const service = servicesCatalog[serviceKey] || servicesCatalog['s1'];
  
  const incomingDate = params.get('date');
  const incomingTime = params.get('time') || '09:00 AM';
  const incomingName = params.get('name') || '';
  const incomingPhone = params.get('phone') || '';
  const incomingEmail = params.get('email') || '';
  const incomingQty = parseInt(params.get('qty'), 10) || 1;

  // DOM Elements - Customer Form
  const checkoutNameInput = document.getElementById('checkout-name');
  const checkoutPhoneInput = document.getElementById('checkout-phone');
  const checkoutEmailInput = document.getElementById('checkout-email');
  const nameError = document.getElementById('checkout-name-error');
  const phoneError = document.getElementById('checkout-phone-error');
  const emailError = document.getElementById('checkout-email-error');

  // DOM Elements - Booking Summary
  const srvImg = document.getElementById('checkout-srv-img');
  const srvCat = document.getElementById('checkout-srv-cat');
  const srvTitle = document.getElementById('checkout-srv-title');
  const mchName = document.getElementById('checkout-mch-name');
  const srvRateLabel = document.getElementById('checkout-srv-rate-label');
  const dateVal = document.getElementById('checkout-date-val');
  const timeVal = document.getElementById('checkout-time-val');
  const qtyVal = document.getElementById('checkout-qty-val');

  // DOM Elements - Billing Summary
  const subtotalVal = document.getElementById('billing-subtotal-val');
  const feeVal = document.getElementById('billing-fee-val');
  const totalVal = document.getElementById('billing-total-val');

  // DOM Elements - Actions
  const btnProceedPayment = document.getElementById('btn-proceed-payment');
  const linkBackCart = document.getElementById('link-back-cart');

  // DOM Elements - Modal
  const paymentModal = document.getElementById('payment-nav-modal');
  const modalClose = document.getElementById('modal-payment-close');
  const modalCancel = document.getElementById('modal-payment-cancel');
  const modalConfirm = document.getElementById('modal-payment-confirm');
  const modalCustomer = document.getElementById('modal-pay-customer');
  const modalEmail = document.getElementById('modal-pay-email');
  const modalPhone = document.getElementById('modal-pay-phone');
  const modalMethod = document.getElementById('modal-pay-method');
  const modalTotal = document.getElementById('modal-pay-total');
  const modalCat = document.getElementById('modal-payment-cat');

  // Selected payment method state
  let selectedMethodName = 'Credit or Debit Card';

  /**
   * Initialize Data into Form & Summary Card
   */
  function initializeCheckout() {
    // Populate Service Information
    if (srvImg) {
      srvImg.src = service.image;
      srvImg.alt = service.name;
    }
    if (srvCat) {
      srvCat.textContent = service.category;
      srvCat.className = `merchant-cat-pill ${service.categoryTheme}`;
    }
    if (srvTitle) srvTitle.textContent = service.name;
    if (mchName) mchName.textContent = service.merchantName;
    if (srvRateLabel) srvRateLabel.textContent = `Rate: $${service.price.toFixed(2)} / visit`;

    // Populate Schedule
    if (dateVal) {
      if (incomingDate) {
        const parts = incomingDate.split('-');
        if (parts.length === 3) {
          const formatted = new Date(parts[0], parts[1] - 1, parts[2]).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });
          dateVal.textContent = formatted;
        } else {
          dateVal.textContent = incomingDate;
        }
      } else {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateVal.textContent = tomorrow.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      }
    }

    if (timeVal) timeVal.textContent = incomingTime;
    if (qtyVal) qtyVal.textContent = `${incomingQty} visit${incomingQty > 1 ? 's' : ''}`;

    // Calculate Billing Totals
    const subtotal = service.price * incomingQty;
    const fee = 0;
    const total = subtotal + fee;

    if (subtotalVal) subtotalVal.textContent = `$${subtotal.toFixed(2)}`;
    if (feeVal) feeVal.textContent = 'FREE ($0.00)';
    if (totalVal) totalVal.textContent = `$${total.toFixed(2)}`;

    // Pre-fill Customer Inputs if available
    if (checkoutNameInput && incomingName) checkoutNameInput.value = incomingName;
    if (checkoutPhoneInput && incomingPhone) checkoutPhoneInput.value = incomingPhone;
    if (checkoutEmailInput && incomingEmail) checkoutEmailInput.value = incomingEmail;

    // Back to cart link preservation
    if (linkBackCart) {
      linkBackCart.href = `booking.html?id=${encodeURIComponent(service.id)}`;
    }
  }

  // Payment Method Selection Logic
  const paymentOptions = document.querySelectorAll('.payment-method-option');
  paymentOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      paymentOptions.forEach(o => {
        o.classList.remove('selected');
        o.setAttribute('aria-checked', 'false');
      });
      opt.classList.add('selected');
      opt.setAttribute('aria-checked', 'true');
      const titleEl = opt.querySelector('.payment-option-title');
      if (titleEl) selectedMethodName = titleEl.textContent.trim();
    });

    opt.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        opt.click();
      }
    });
  });

  /**
   * Validate Customer Information Form
   */
  function validateCustomerInfo() {
    let isValid = true;

    // 1. Full Name
    const nameVal = checkoutNameInput ? checkoutNameInput.value.trim() : '';
    if (!nameVal || nameVal.length < 2) {
      if (nameError) nameError.style.display = 'block';
      if (checkoutNameInput) checkoutNameInput.style.borderColor = 'var(--color-error)';
      isValid = false;
    } else {
      if (nameError) nameError.style.display = 'none';
      if (checkoutNameInput) checkoutNameInput.style.borderColor = '';
    }

    // 2. Phone Number
    const phoneVal = checkoutPhoneInput ? checkoutPhoneInput.value.trim() : '';
    const digitsOnly = phoneVal.replace(/[^0-9]/g, '');
    if (!phoneVal || digitsOnly.length < 7) {
      if (phoneError) phoneError.style.display = 'block';
      if (checkoutPhoneInput) checkoutPhoneInput.style.borderColor = 'var(--color-error)';
      isValid = false;
    } else {
      if (phoneError) phoneError.style.display = 'none';
      if (checkoutPhoneInput) checkoutPhoneInput.style.borderColor = '';
    }

    // 3. Email
    const emailVal = checkoutEmailInput ? checkoutEmailInput.value.trim() : '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal || !emailRegex.test(emailVal)) {
      if (emailError) emailError.style.display = 'block';
      if (checkoutEmailInput) checkoutEmailInput.style.borderColor = 'var(--color-error)';
      isValid = false;
    } else {
      if (emailError) emailError.style.display = 'none';
      if (checkoutEmailInput) checkoutEmailInput.style.borderColor = '';
    }

    if (!isValid) {
      if (nameVal.length < 2 && checkoutNameInput) {
        checkoutNameInput.focus();
      } else if (digitsOnly.length < 7 && checkoutPhoneInput) {
        checkoutPhoneInput.focus();
      } else if (checkoutEmailInput) {
        checkoutEmailInput.focus();
      }
      return false;
    }

    return {
      name: nameVal,
      phone: phoneVal,
      email: emailVal
    };
  }

  /**
   * Open Proceed to Payment confirmation dialog
   */
  function handleProceedToPayment() {
    const customerData = validateCustomerInfo();
    if (!customerData) return;

    const totalAmount = service.price * incomingQty;

    if (modalCustomer) modalCustomer.textContent = customerData.name;
    if (modalEmail) modalEmail.textContent = customerData.email;
    if (modalPhone) modalPhone.textContent = customerData.phone;
    if (modalMethod) modalMethod.textContent = selectedMethodName;
    if (modalTotal) modalTotal.textContent = `$${totalAmount.toFixed(2)}`;
    if (modalCat) {
      modalCat.textContent = service.category;
      modalCat.className = `merchant-cat-pill ${service.categoryTheme}`;
    }

    if (paymentModal) {
      paymentModal.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';
      if (modalConfirm) modalConfirm.focus();
    }
  }

  function closePaymentModal() {
    if (!paymentModal) return;
    paymentModal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  if (btnProceedPayment) {
    btnProceedPayment.addEventListener('click', handleProceedToPayment);
  }

  if (modalClose) modalClose.addEventListener('click', closePaymentModal);
  if (modalCancel) modalCancel.addEventListener('click', closePaymentModal);

  if (modalConfirm) {
    modalConfirm.addEventListener('click', () => {
      const customerData = validateCustomerInfo();
      if (!customerData) return;

      const totalAmount = (service.price * incomingQty).toFixed(2);
      const qParams = new URLSearchParams({
        id: service.id,
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        date: incomingDate || '',
        time: incomingTime || '',
        qty: incomingQty,
        subtotal: totalAmount,
        fee: '0.00',
        total: totalAmount,
        method: selectedMethodName
      });

      // Persist in sessionStorage for Feature 11 Payment Page
      try {
        sessionStorage.setItem('servicehub_checkout', JSON.stringify({
          serviceId: service.id,
          serviceName: service.name,
          merchantName: service.merchantName,
          category: service.category,
          price: service.price,
          customerName: customerData.name,
          customerEmail: customerData.email,
          customerPhone: customerData.phone,
          date: incomingDate || '',
          time: incomingTime || '',
          qty: incomingQty,
          subtotal: totalAmount,
          fee: 0,
          total: totalAmount,
          method: selectedMethodName
        }));
      } catch (e) {
        console.warn('SessionStorage write error:', e);
      }

      modalConfirm.textContent = 'Redirecting to Payment...';
      modalConfirm.style.backgroundColor = '#059669';

      setTimeout(() => {
        window.location.href = `payment.html?${qParams.toString()}`;
      }, 500);
    });
  }

  if (paymentModal) {
    paymentModal.addEventListener('click', (e) => {
      if (e.target === paymentModal) closePaymentModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && paymentModal && !paymentModal.hasAttribute('hidden')) {
      closePaymentModal();
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

  // Initialize
  initializeCheckout();
});
