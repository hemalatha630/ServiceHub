/**
 * ServiceHub - Professional Payment Page (payment.js)
 * Supports:
 *  1. Order summary data extraction from URL query params or sessionStorage
 *  2. Tabbed payment method switching (Credit/Debit Card, UPI, Net Banking)
 *  3. Interactive virtual card preview & input masking (number spacing, expiry slash)
 *  4. Form validation for each payment method
 *  5. Mock payment processing simulation with loading state
 *  6. Payment result receipt screen (Order ID, Amount, Service, Date/Time)
 *  7. "View Order" navigation to order-history.html and local storage persistence
 */

document.addEventListener('DOMContentLoaded', () => {
  // Service Catalog
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

  // 1. Parse incoming parameters
  const params = new URLSearchParams(window.location.search);
  let sessionData = {};
  try {
    const raw = sessionStorage.getItem('servicehub_checkout');
    if (raw) sessionData = JSON.parse(raw);
  } catch (e) {
    console.warn('Session data read error:', e);
  }

  const serviceKey = params.get('id') || sessionData.serviceId || 's1';
  const service = servicesCatalog[serviceKey] || servicesCatalog['s1'];

  const customerName = params.get('name') || sessionData.customerName || 'Jordan Miller';
  const customerEmail = params.get('email') || sessionData.customerEmail || 'jordan.miller@example.com';
  const customerPhone = params.get('phone') || sessionData.customerPhone || '(555) 234-5678';
  const bookingDate = params.get('date') || sessionData.date || '';
  const bookingTime = params.get('time') || sessionData.time || '09:00 AM';
  const bookingQty = parseInt(params.get('qty') || sessionData.qty, 10) || 1;
  const initialTotal = params.get('total') || sessionData.total || (service.price * bookingQty).toFixed(2);
  const preferredMethod = (params.get('method') || sessionData.method || 'card').toLowerCase();

  // DOM Elements - Views
  const paymentActiveView = document.getElementById('payment-active-view');
  const paymentResultView = document.getElementById('payment-result-view');
  const stepPaymentIndicator = document.getElementById('step-payment-indicator');
  const stepPaymentBadge = document.getElementById('step-payment-badge');

  // DOM Elements - Order Summary
  const srvCat = document.getElementById('pay-srv-cat');
  const srvImg = document.getElementById('pay-srv-img');
  const srvTitle = document.getElementById('pay-srv-title');
  const mchName = document.getElementById('pay-mch-name');
  const dateVal = document.getElementById('pay-date-val');
  const timeVal = document.getElementById('pay-time-val');
  const customerVal = document.getElementById('pay-customer-val');
  const subtotalVal = document.getElementById('pay-subtotal-val');
  const totalVal = document.getElementById('pay-total-val');
  const linkBackCheckout = document.getElementById('link-back-checkout');

  // DOM Elements - Payment Tabs & Panels
  const tabCard = document.getElementById('tab-card');
  const tabUpi = document.getElementById('tab-upi');
  const tabNetbanking = document.getElementById('tab-netbanking');
  const formCardPanel = document.getElementById('form-card-panel');
  const formUpiPanel = document.getElementById('form-upi-panel');
  const formNetbankingPanel = document.getElementById('form-netbanking-panel');

  // DOM Elements - Card Form & Visual
  const cardHolderInput = document.getElementById('card-holder');
  const cardNumberInput = document.getElementById('card-number');
  const cardExpiryInput = document.getElementById('card-expiry');
  const cardCvvInput = document.getElementById('card-cvv');
  const cardHolderError = document.getElementById('card-holder-error');
  const cardNumberError = document.getElementById('card-number-error');
  const cardExpiryError = document.getElementById('card-expiry-error');
  const cardCvvError = document.getElementById('card-cvv-error');
  const cardBrandIcon = document.getElementById('card-brand-icon');

  const cardPreviewBrand = document.getElementById('card-preview-brand');
  const cardPreviewNumber = document.getElementById('card-preview-number');
  const cardPreviewHolder = document.getElementById('card-preview-holder');
  const cardPreviewExpiry = document.getElementById('card-preview-expiry');

  // DOM Elements - UPI Form
  const upiVpaInput = document.getElementById('upi-vpa');
  const upiVpaError = document.getElementById('upi-vpa-error');
  const upiAppsSelector = document.getElementById('upi-apps-selector');
  const upiHandleChips = document.querySelectorAll('.upi-handle-chip');

  // DOM Elements - Net Banking
  const netbankingBanks = document.getElementById('netbanking-banks');
  const otherBanksSelect = document.getElementById('other-banks-select');

  // DOM Elements - Action
  const btnPayNow = document.getElementById('btn-pay-now');
  const btnPayText = document.getElementById('btn-pay-text');
  const payIconLock = document.getElementById('pay-icon-lock');
  const paySpinner = document.getElementById('pay-spinner');

  // DOM Elements - Receipt Result View
  const resMchName = document.getElementById('res-mch-name');
  const resOrderId = document.getElementById('res-order-id');
  const resSrvName = document.getElementById('res-srv-name');
  const resMchVal = document.getElementById('res-mch-val');
  const resDatetimeVal = document.getElementById('res-datetime-val');
  const resCustomerVal = document.getElementById('res-customer-val');
  const resMethodVal = document.getElementById('res-method-val');
  const resAmountVal = document.getElementById('res-amount-val');
  const btnViewOrder = document.getElementById('btn-view-order');
  const btnPrintReceipt = document.getElementById('btn-print-receipt');

  // State
  let activeTab = 'card'; // 'card' | 'upi' | 'netbanking'
  let selectedBank = 'HDFC Bank';
  let selectedUpiApp = 'Google Pay';
  let generatedOrderId = '';
  let formattedDateString = '';

  /**
   * 1. Initialize Order Summary
   */
  function initializeOrderSummary() {
    if (srvCat) {
      srvCat.textContent = service.category;
      srvCat.className = `merchant-cat-pill ${service.categoryTheme}`;
    }
    if (srvImg) {
      srvImg.src = service.image;
      srvImg.alt = service.name;
    }
    if (srvTitle) srvTitle.textContent = service.name;
    if (mchName) mchName.textContent = service.merchantName;

    // Date formatting
    if (bookingDate) {
      const parts = bookingDate.split('-');
      if (parts.length === 3) {
        formattedDateString = new Date(parts[0], parts[1] - 1, parts[2]).toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      } else {
        formattedDateString = bookingDate;
      }
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      formattedDateString = tomorrow.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }

    if (dateVal) dateVal.textContent = formattedDateString;
    if (timeVal) timeVal.textContent = bookingTime;
    if (customerVal) customerVal.textContent = customerName;

    const subtotal = service.price * bookingQty;
    const finalAmount = parseFloat(initialTotal) || subtotal;

    if (subtotalVal) subtotalVal.textContent = `$${subtotal.toFixed(2)}`;
    if (totalVal) totalVal.textContent = `$${finalAmount.toFixed(2)}`;
    if (btnPayText) btnPayText.textContent = `Pay $${finalAmount.toFixed(2)} Securely`;

    // Pre-fill cardholder name
    if (cardHolderInput) {
      cardHolderInput.value = customerName;
      updateCardPreview();
    }

    // Back to checkout link with parameters preserved
    if (linkBackCheckout) {
      const q = new URLSearchParams({
        id: service.id,
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        date: bookingDate,
        time: bookingTime,
        qty: bookingQty
      });
      linkBackCheckout.href = `checkout.html?${q.toString()}`;
    }

    // Check if initial method was UPI
    if (preferredMethod.includes('wallet') || preferredMethod.includes('upi')) {
      switchTab('upi');
    } else {
      switchTab('card');
    }
  }

  /**
   * 2. Tab Switching Logic
   */
  function switchTab(targetTab) {
    activeTab = targetTab;

    // Update tab headers
    [tabCard, tabUpi, tabNetbanking].forEach(btn => {
      if (!btn) return;
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    });

    // Hide all panels
    if (formCardPanel) formCardPanel.setAttribute('hidden', '');
    if (formUpiPanel) formUpiPanel.setAttribute('hidden', '');
    if (formNetbankingPanel) formNetbankingPanel.setAttribute('hidden', '');

    if (targetTab === 'card') {
      if (tabCard) {
        tabCard.classList.add('active');
        tabCard.setAttribute('aria-selected', 'true');
      }
      if (formCardPanel) formCardPanel.removeAttribute('hidden');
    } else if (targetTab === 'upi') {
      if (tabUpi) {
        tabUpi.classList.add('active');
        tabUpi.setAttribute('aria-selected', 'true');
      }
      if (formUpiPanel) formUpiPanel.removeAttribute('hidden');
    } else if (targetTab === 'netbanking') {
      if (tabNetbanking) {
        tabNetbanking.classList.add('active');
        tabNetbanking.setAttribute('aria-selected', 'true');
      }
      if (formNetbankingPanel) formNetbankingPanel.removeAttribute('hidden');
    }
  }

  if (tabCard) tabCard.addEventListener('click', () => switchTab('card'));
  if (tabUpi) tabUpi.addEventListener('click', () => switchTab('upi'));
  if (tabNetbanking) tabNetbanking.addEventListener('click', () => switchTab('netbanking'));

  /**
   * 3. Card Input Formatting & Live Visual Preview
   */
  function updateCardPreview() {
    // Cardholder
    const nameVal = cardHolderInput ? cardHolderInput.value.trim() : '';
    if (cardPreviewHolder) {
      cardPreviewHolder.textContent = nameVal.toUpperCase() || 'YOUR NAME';
    }

    // Card Number
    const rawNumber = cardNumberInput ? cardNumberInput.value.replace(/\D/g, '') : '';
    if (cardPreviewNumber) {
      if (!rawNumber) {
        cardPreviewNumber.textContent = '•••• •••• •••• 4242';
      } else {
        const masked = rawNumber.padEnd(16, '•');
        const grouped = masked.match(/.{1,4}/g)?.join(' ') || masked;
        cardPreviewNumber.textContent = grouped;
      }
    }

    // Detect card brand
    let brand = 'CARD';
    if (rawNumber.startsWith('4')) {
      brand = 'VISA';
    } else if (/^(5[1-5]|2[2-7])/.test(rawNumber)) {
      brand = 'MASTERCARD';
    } else if (/^(34|37)/.test(rawNumber)) {
      brand = 'AMEX';
    } else if (/^(6011|65)/.test(rawNumber)) {
      brand = 'DISCOVER';
    }

    if (cardPreviewBrand) cardPreviewBrand.textContent = brand;
    if (cardBrandIcon) {
      cardBrandIcon.innerHTML = `<svg width="28" height="20" viewBox="0 0 32 20" fill="none"><rect width="32" height="20" rx="3" fill="#1e293b"/><text x="4" y="14" fill="#ffffff" font-size="7" font-weight="700">${brand}</text></svg>`;
    }

    // Expiry
    const expVal = cardExpiryInput ? cardExpiryInput.value.trim() : '';
    if (cardPreviewExpiry) {
      cardPreviewExpiry.textContent = expVal || '12/28';
    }
  }

  // Format Card Number (adds space every 4 digits)
  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').substring(0, 16);
      let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
      e.target.value = formatted;
      updateCardPreview();
      if (cardNumberError) cardNumberError.style.display = 'none';
      cardNumberInput.style.borderColor = '';
    });
  }

  // Format Expiry Date (MM/YY)
  if (cardExpiryInput) {
    cardExpiryInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').substring(0, 4);
      if (val.length >= 2) {
        val = val.substring(0, 2) + '/' + val.substring(2);
      }
      e.target.value = val;
      updateCardPreview();
      if (cardExpiryError) cardExpiryError.style.display = 'none';
      cardExpiryInput.style.borderColor = '';
    });
  }

  // Cardholder Name Input
  if (cardHolderInput) {
    cardHolderInput.addEventListener('input', () => {
      updateCardPreview();
      if (cardHolderError) cardHolderError.style.display = 'none';
      cardHolderInput.style.borderColor = '';
    });
  }

  // CVV Input
  if (cardCvvInput) {
    cardCvvInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
      if (cardCvvError) cardCvvError.style.display = 'none';
      cardCvvInput.style.borderColor = '';
    });
  }

  /**
   * UPI Interactions
   */
  if (upiAppsSelector) {
    const appCards = upiAppsSelector.querySelectorAll('.upi-app-card');
    appCards.forEach(card => {
      card.addEventListener('click', () => {
        appCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const title = card.querySelector('.upi-app-title');
        if (title) selectedUpiApp = title.textContent.trim();
      });
    });
  }

  upiHandleChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const handle = chip.getAttribute('data-handle');
      if (upiVpaInput && handle) {
        const current = upiVpaInput.value.split('@')[0] || 'user';
        upiVpaInput.value = `${current}${handle}`;
        if (upiVpaError) upiVpaError.style.display = 'none';
        upiVpaInput.style.borderColor = '';
      }
    });
  });

  /**
   * Net Banking Interactions
   */
  if (netbankingBanks) {
    const bankCards = netbankingBanks.querySelectorAll('.bank-option-card');
    bankCards.forEach(card => {
      card.addEventListener('click', () => {
        bankCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedBank = card.getAttribute('data-bank');
        if (otherBanksSelect) otherBanksSelect.value = '';
      });
    });
  }

  if (otherBanksSelect) {
    otherBanksSelect.addEventListener('change', () => {
      if (otherBanksSelect.value) {
        selectedBank = otherBanksSelect.value;
        const bankCards = netbankingBanks ? netbankingBanks.querySelectorAll('.bank-option-card') : [];
        bankCards.forEach(c => c.classList.remove('selected'));
      }
    });
  }

  /**
   * 4. Validation of Payment Fields
   */
  function validatePayment() {
    let isValid = true;

    if (activeTab === 'card') {
      // 1. Cardholder Name
      const holderVal = cardHolderInput ? cardHolderInput.value.trim() : '';
      if (!holderVal || holderVal.length < 2) {
        if (cardHolderError) cardHolderError.style.display = 'block';
        if (cardHolderInput) {
          cardHolderInput.style.borderColor = 'var(--color-error)';
          cardHolderInput.focus();
        }
        isValid = false;
      } else {
        if (cardHolderError) cardHolderError.style.display = 'none';
        if (cardHolderInput) cardHolderInput.style.borderColor = '';
      }

      // 2. Card Number (16 digits)
      const numberDigits = cardNumberInput ? cardNumberInput.value.replace(/\D/g, '') : '';
      if (numberDigits.length < 15) {
        if (cardNumberError) cardNumberError.style.display = 'block';
        if (cardNumberInput) {
          cardNumberInput.style.borderColor = 'var(--color-error)';
          if (isValid) cardNumberInput.focus();
        }
        isValid = false;
      } else {
        if (cardNumberError) cardNumberError.style.display = 'none';
        if (cardNumberInput) cardNumberInput.style.borderColor = '';
      }

      // 3. Expiry Date (MM/YY)
      const expVal = cardExpiryInput ? cardExpiryInput.value.trim() : '';
      const expRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
      if (!expRegex.test(expVal)) {
        if (cardExpiryError) cardExpiryError.style.display = 'block';
        if (cardExpiryInput) {
          cardExpiryInput.style.borderColor = 'var(--color-error)';
          if (isValid) cardExpiryInput.focus();
        }
        isValid = false;
      } else {
        if (cardExpiryError) cardExpiryError.style.display = 'none';
        if (cardExpiryInput) cardExpiryInput.style.borderColor = '';
      }

      // 4. CVV (3-4 digits)
      const cvvVal = cardCvvInput ? cardCvvInput.value.trim() : '';
      if (!cvvVal || cvvVal.length < 3) {
        if (cardCvvError) cardCvvError.style.display = 'block';
        if (cardCvvInput) {
          cardCvvInput.style.borderColor = 'var(--color-error)';
          if (isValid) cardCvvInput.focus();
        }
        isValid = false;
      } else {
        if (cardCvvError) cardCvvError.style.display = 'none';
        if (cardCvvInput) cardCvvInput.style.borderColor = '';
      }

    } else if (activeTab === 'upi') {
      const vpa = upiVpaInput ? upiVpaInput.value.trim() : '';
      if (!vpa || !vpa.includes('@') || vpa.length < 5) {
        if (upiVpaError) upiVpaError.style.display = 'block';
        if (upiVpaInput) {
          upiVpaInput.style.borderColor = 'var(--color-error)';
          upiVpaInput.focus();
        }
        isValid = false;
      } else {
        if (upiVpaError) upiVpaError.style.display = 'none';
        if (upiVpaInput) upiVpaInput.style.borderColor = '';
      }

    } else if (activeTab === 'netbanking') {
      if (!selectedBank) {
        alert('Please select your bank to continue with Net Banking.');
        isValid = false;
      }
    }

    return isValid;
  }

  /**
   * 5. Mock Payment Processing Simulation
   */
  function handlePaymentSubmit() {
    if (!validatePayment()) return;

    // Loading State
    if (btnPayNow) {
      btnPayNow.disabled = true;
      if (payIconLock) payIconLock.style.display = 'none';
      if (paySpinner) paySpinner.style.display = 'inline-block';
      if (btnPayText) btnPayText.textContent = 'Processing Mock Payment...';
    }

    // Simulate 1.2s secure processing
    setTimeout(() => {
      // Generate Order ID
      const randomSuffix = Math.floor(10000 + Math.random() * 90000);
      generatedOrderId = `SH-2026-${randomSuffix}`;

      const totalPaid = parseFloat(initialTotal) || (service.price * bookingQty);

      // Method description for receipt
      let methodDescription = 'Credit / Debit Card (•••• 4242)';
      if (activeTab === 'card') {
        const rawNum = cardNumberInput ? cardNumberInput.value.replace(/\D/g, '') : '4242';
        const last4 = rawNum.slice(-4) || '4242';
        methodDescription = `Card (${cardPreviewBrand.textContent} •••• ${last4})`;
      } else if (activeTab === 'upi') {
        const vpa = upiVpaInput ? upiVpaInput.value.trim() : 'user@upi';
        methodDescription = `UPI (${selectedUpiApp} • ${vpa})`;
      } else if (activeTab === 'netbanking') {
        methodDescription = `Net Banking (${selectedBank})`;
      }

      // Persist Order in LocalStorage for Feature 12 (Order History)
      const orderRecord = {
        orderId: generatedOrderId,
        serviceId: service.id,
        serviceName: service.name,
        serviceCategory: service.category,
        merchantName: service.merchantName,
        customerName: customerName,
        customerEmail: customerEmail,
        customerPhone: customerPhone,
        date: formattedDateString,
        rawDate: bookingDate,
        time: bookingTime,
        qty: bookingQty,
        amount: totalPaid.toFixed(2),
        paymentMethod: methodDescription,
        status: 'Confirmed',
        timestamp: new Date().toISOString()
      };

      try {
        const existing = JSON.parse(localStorage.getItem('servicehub_orders') || '[]');
        existing.unshift(orderRecord);
        localStorage.setItem('servicehub_orders', JSON.stringify(existing));
        sessionStorage.setItem('servicehub_last_order', JSON.stringify(orderRecord));
      } catch (e) {
        console.warn('Storage error:', e);
      }

      // Populate Receipt Screen
      if (resMchName) resMchName.textContent = service.merchantName;
      if (resOrderId) resOrderId.textContent = `#${generatedOrderId}`;
      if (resSrvName) resSrvName.textContent = service.name;
      if (resMchVal) resMchVal.textContent = service.merchantName;
      if (resDatetimeVal) resDatetimeVal.textContent = `${formattedDateString} at ${bookingTime}`;
      if (resCustomerVal) resCustomerVal.textContent = `${customerName} (${customerEmail})`;
      if (resMethodVal) resMethodVal.textContent = methodDescription;
      if (resAmountVal) resAmountVal.textContent = `$${totalPaid.toFixed(2)}`;

      // Switch views: Hide Form, Show Result Screen
      if (paymentActiveView) paymentActiveView.style.display = 'none';
      if (paymentResultView) paymentResultView.style.display = 'flex';

      // Update Step 3 to Completed in Progress Bar
      if (stepPaymentIndicator) {
        stepPaymentIndicator.className = 'step-item completed';
        if (stepPaymentBadge) {
          stepPaymentBadge.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';
        }
      }

      // Smooth scroll to top of confirmation receipt
      window.scrollTo({ top: 0, behavior: 'smooth' });

    }, 1200);
  }

  if (btnPayNow) {
    btnPayNow.addEventListener('click', handlePaymentSubmit);
  }

  /**
   * 6. "View Order" Navigation to Order History
   */
  if (btnViewOrder) {
    btnViewOrder.addEventListener('click', () => {
      const q = new URLSearchParams({
        orderId: generatedOrderId,
        serviceId: service.id,
        status: 'confirmed'
      });
      window.location.href = `order-history.html?${q.toString()}`;
    });
  }

  /**
   * Print Receipt
   */
  if (btnPrintReceipt) {
    btnPrintReceipt.addEventListener('click', () => {
      window.print();
    });
  }

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

  // Initialize page
  initializeOrderSummary();
});
