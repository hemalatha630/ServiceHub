/**
 * ServiceHub - Service Details Page Functionality (service-details.js)
 * Supports dynamic service data based on URL parameter (?id=s1, ?id=s2, ?id=auto, etc.)
 * Handles:
 *  1. Multi-service dataset with rich descriptions and checklists
 *  2. Interactive day & time slot availability selector
 *  3. "Book Now" confirmation modal workflow
 *  4. "Add to Cart" notification toast & badge counter
 *  5. Related services recommendation grid
 *  6. Mobile navigation toggle
 */

document.addEventListener('DOMContentLoaded', () => {
  // Comprehensive Service Dataset
  const servicesData = {
    's1': {
      id: 's1',
      code: 'SRV-101',
      name: 'Standard Residential Deep Clean & Sanitization',
      category: 'Cleaning',
      categoryTheme: 'theme-cleaning',
      merchantId: '1',
      merchantName: 'SparkleClean Co.',
      merchantInitials: 'SC',
      merchantBg: 'linear-gradient(135deg, #059669, #10b981)',
      merchantOwner: 'Elena Rostova',
      rating: '4.9',
      reviewCount: 142,
      price: '$65',
      duration: '2 hours',
      heroImg: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80',
      description: 'Our Standard Residential Deep Clean is a comprehensive, room-by-room treatment specifically formulated to eliminate deep-seated grime, allergens, and bacteria. Designed for modern living spaces, our vetted two-person specialist crew arrives fully equipped with hospital-grade, EPA-certified botanical detergents and HEPA micro-filtration vacuums.',
      included: [
        'Kitchen stovetop degreasing & exterior appliance polishing',
        'Full bathroom tile, grout scrubbing, tub, and glass disinfection',
        'Dusting of all flat surfaces, picture frames, and baseboards',
        'HEPA vacuuming of carpets, rugs, and hard floor steam mopping',
        'All eco-certified non-toxic cleaning supplies & tools provided',
        'Final quality checklist walkthrough with customer sign-off'
      ],
      location: 'At Your Location • Central City & Metro Area (25 mi service radius)',
      related: ['s2', 's3', 'auto']
    },

    's2': {
      id: 's2',
      code: 'SRV-102',
      name: 'Move-In / Move-Out Sanitization Overhaul',
      category: 'Cleaning',
      categoryTheme: 'theme-cleaning',
      merchantId: '1',
      merchantName: 'SparkleClean Co.',
      merchantInitials: 'SC',
      merchantBg: 'linear-gradient(135deg, #059669, #10b981)',
      merchantOwner: 'Elena Rostova',
      rating: '5.0',
      reviewCount: 89,
      price: '$140',
      duration: '3.5 hours',
      heroImg: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1200&q=80',
      description: 'A heavy-duty, vacant-property sanitization service engineered to guarantee full rental security deposit returns or prepare an acquired home for move-in day. We scrub every inch of interior cabinetry, high shelving, oven interiors, refrigerator compartments, and window tracks.',
      included: [
        'Complete inside-and-out oven and refrigerator detailing',
        'Interior cabinets, drawers, and pantry shelf scrubbing',
        'Baseboard deep clean, outlet dusting, and light fixtures',
        'Window sill, frame, and interior track sanitization',
        'Heavy-duty lime, calcium, and mineral deposit removal',
        'Landlord deposit return guarantee inspection pass'
      ],
      location: 'At Your Location • Central City & Metro Area (25 mi service radius)',
      related: ['s1', 's3', 'plumb']
    },

    's3': {
      id: 's3',
      code: 'SRV-103',
      name: 'Eco Commercial Office & Studio Maintenance',
      category: 'Cleaning',
      categoryTheme: 'theme-cleaning',
      merchantId: '1',
      merchantName: 'SparkleClean Co.',
      merchantInitials: 'SC',
      merchantBg: 'linear-gradient(135deg, #059669, #10b981)',
      merchantOwner: 'Elena Rostova',
      rating: '4.8',
      reviewCount: 46,
      price: '$190',
      duration: '4 hours',
      heroImg: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      description: 'Scheduled after-hours disinfection tailored for business offices, medical clinics, and creative studios. Emphasizes high-touch touchpoints like door handles, conference tables, and keyboards, combined with complete trash management and floor care.',
      included: [
        'High-touch surface and workstation antimicrobial sanitization',
        'Restroom full decontamination and supply restocking',
        'Kitchenette sanitization and coffee station degreasing',
        'Trash and recycling sorting and removal',
        'Commercial grade HEPA carpet filtration vacuuming',
        'Dedicated night supervisor and digital check-out log'
      ],
      location: 'At Business Facility • Central City & Commercial Districts',
      related: ['s1', 's2', 'auto']
    },

    'auto': {
      id: 'auto',
      code: 'SRV-201',
      name: 'Mobile Signature Full Auto Detail & Ceramic Seal',
      category: 'Automotive',
      categoryTheme: 'theme-automotive',
      merchantId: '2',
      merchantName: 'Apex Auto Studio',
      merchantInitials: 'AA',
      merchantBg: 'linear-gradient(135deg, #1e293b, #475569)',
      merchantOwner: 'Marcus Chen',
      rating: '5.0',
      reviewCount: 215,
      price: '$120',
      duration: '3 hours',
      heroImg: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=1200&q=80',
      description: 'Our mobile van arrives with self-contained power and deionized spot-free water. We perform a two-bucket hand wash, chemical iron paint decontamination, leather seat conditioning, carpet steam extraction, and high-gloss carnauba ceramic sealant.',
      included: [
        'Two-bucket scratch-free hand wash and foam bath',
        'Clay bar decontamination & wheel barrel deep clean',
        'Interior hot-water steam extraction on seats & mats',
        'UV leather cleaning and non-greasy conditioning',
        'Hydrophobic windshield and glass treatment',
        '6-month ceramic gloss paint sealant applied'
      ],
      location: 'At Your Driveway / Office • 30-mile mobile service radius',
      related: ['s1', 'plumb', 'beauty']
    },

    'plumb': {
      id: 'plumb',
      code: 'SRV-301',
      name: 'Drain Clearing & Fiber-Optic Camera Inspection',
      category: 'Repair',
      categoryTheme: 'theme-repair',
      merchantId: '3',
      merchantName: 'Precision Plumbing Pro',
      merchantInitials: 'PP',
      merchantBg: 'linear-gradient(135deg, #0284c7, #38bdf8)',
      merchantOwner: 'David Vance',
      rating: '4.8',
      reviewCount: 98,
      price: '$95',
      duration: '1.5 hours',
      heroImg: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=1200&q=80',
      description: 'Rapid diagnostic and unclogging service utilizing high-definition sewer cameras to identify root intrusion, grease buildup, or cracked lines, followed by commercial electric auger clearing.',
      included: [
        'High-resolution digital camera line inspection',
        'Full motorized cable auger line clearing',
        'Digital video recording link provided to customer',
        'Water pressure and drainage flow rate verification',
        'Enzyme preventive drain treatment applied',
        '30-day no-clog guarantee'
      ],
      location: 'On-Site Service • Westside & Greater Metro Area',
      related: ['s1', 'auto', 'beauty']
    },

    'beauty': {
      id: 'beauty',
      code: 'SRV-401',
      name: 'Bespoke Haircut, Scalp Spa & Conditioning',
      category: 'Beauty',
      categoryTheme: 'theme-beauty',
      merchantId: '4',
      merchantName: 'Glow Salon & Day Spa',
      merchantInitials: 'GS',
      merchantBg: 'linear-gradient(135deg, #db2777, #f472b6)',
      merchantOwner: 'Chloe Bennett',
      rating: '4.9',
      reviewCount: 165,
      price: '$85',
      duration: '1.25 hours',
      heroImg: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
      description: 'An indulgent personal care session beginning with a thorough consultation, customized botanical scalp massage, deeply hydrating protein mask, and precision styling by a senior stylist.',
      included: [
        'Personal hair and face-shape style consultation',
        '15-minute invigorating essential oil scalp massage',
        'Organic protein deep-conditioning hair treatment',
        'Precision customized haircut and texture refinement',
        'Blowout styling with heat-protectant finish'
      ],
      location: 'In-Salon Appointment • 312 Luxe Plaza, Suite 4B',
      related: ['s1', 'auto', 'plumb']
    }
  };

  // Determine active service from URL or default to 's1'
  const params = new URLSearchParams(window.location.search);
  const serviceId = params.get('id') || 's1';
  const service = servicesData[serviceId] || servicesData['s1'];

  // Update Page Title and Breadcrumbs
  document.title = `${service.name} &bull; ServiceHub`;
  const breadcrumbCat = document.getElementById('breadcrumb-category');
  const breadcrumbTitle = document.getElementById('breadcrumb-service-title');
  if (breadcrumbCat) {
    breadcrumbCat.textContent = service.category;
    breadcrumbCat.href = `merchants.html?category=${encodeURIComponent(service.category)}`;
  }
  if (breadcrumbTitle) breadcrumbTitle.textContent = service.name;

  // 1. Service Hero Visual & Tags
  const heroImg = document.getElementById('service-hero-img');
  const heroCatTag = document.getElementById('service-hero-category-tag');
  const heroDurationVal = document.getElementById('hero-duration-val');

  if (heroImg) {
    heroImg.src = service.heroImg;
    heroImg.alt = `${service.name} preview`;
  }
  if (heroCatTag) heroCatTag.textContent = service.category;
  if (heroDurationVal) heroDurationVal.textContent = service.duration;

  // 1. Service Header Card
  const serviceCatPill = document.getElementById('service-cat-pill');
  const serviceCodeLabel = document.getElementById('service-code-label');
  const serviceTitle = document.getElementById('service-title');
  const merchantAvatar = document.getElementById('merchant-avatar');
  const merchantProfileLink = document.getElementById('merchant-profile-link');
  const merchantNameVal = document.getElementById('merchant-name-val');
  const merchantOwnerVal = document.getElementById('merchant-owner-val');
  const serviceRatingVal = document.getElementById('service-rating-val');
  const serviceReviewCount = document.getElementById('service-review-count');
  const serviceDurationVal = document.getElementById('service-duration-val');

  if (serviceCatPill) {
    serviceCatPill.textContent = service.category;
    serviceCatPill.className = `merchant-cat-pill ${service.categoryTheme}`;
  }
  if (serviceCodeLabel) serviceCodeLabel.textContent = `Service ID: #${service.code}`;
  if (serviceTitle) serviceTitle.textContent = service.name;

  if (merchantAvatar) {
    merchantAvatar.textContent = service.merchantInitials;
    merchantAvatar.style.background = service.merchantBg;
  }
  if (merchantProfileLink) merchantProfileLink.href = `merchant-profile.html?id=${service.merchantId}`;
  if (merchantNameVal) merchantNameVal.textContent = service.merchantName;
  if (merchantOwnerVal) merchantOwnerVal.textContent = `Owner: ${service.merchantOwner}`;
  if (serviceRatingVal) serviceRatingVal.textContent = service.rating;
  if (serviceReviewCount) serviceReviewCount.textContent = `(${service.reviewCount} reviews)`;
  if (serviceDurationVal) serviceDurationVal.textContent = service.duration;

  // 2. Service Description & What is Included
  const serviceDescription = document.getElementById('service-description');
  const includedGrid = document.getElementById('service-included-grid');

  if (serviceDescription) serviceDescription.textContent = service.description;

  if (includedGrid && service.included) {
    includedGrid.innerHTML = '';
    service.included.forEach(item => {
      const div = document.createElement('div');
      div.className = 'included-checklist-item';
      div.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
        <span>${item}</span>
      `;
      includedGrid.appendChild(div);
    });
  }

  // 3 & 4. Sidebar Pricing & Location
  const priceVal = document.getElementById('service-price-val');
  const locationDesc = document.getElementById('service-location-desc');

  if (priceVal) priceVal.textContent = service.price;
  if (locationDesc) locationDesc.textContent = service.location;

  // 3. Availability Selector Logic
  let selectedDay = 'Tomorrow (Wed)';
  let selectedTime = '10:00 AM';

  const dayChips = document.querySelectorAll('.day-chip');
  const selectedDayLabel = document.getElementById('selected-day-label');
  dayChips.forEach(chip => {
    chip.addEventListener('click', () => {
      dayChips.forEach(c => {
        c.classList.remove('active');
        c.setAttribute('aria-checked', 'false');
      });
      chip.classList.add('active');
      chip.setAttribute('aria-checked', 'true');
      selectedDay = chip.getAttribute('data-day');
      if (selectedDayLabel) selectedDayLabel.textContent = selectedDay;
    });
  });

  const timeSlotBtns = document.querySelectorAll('.time-slot-btn');
  const selectedTimeLabel = document.getElementById('selected-time-label');
  timeSlotBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      timeSlotBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');
      selectedTime = btn.getAttribute('data-time');
      if (selectedTimeLabel) selectedTimeLabel.textContent = selectedTime;
    });
  });

  // 5. "Book Now" Button & Modal Workflow
  const btnBookNow = document.getElementById('btn-book-now');
  const bookingModal = document.getElementById('booking-modal');
  const modalClose = document.getElementById('modal-booking-close');
  const modalCancel = document.getElementById('modal-booking-cancel');
  const modalConfirm = document.getElementById('modal-booking-confirm');

  const modalSummaryService = document.getElementById('modal-summary-service');
  const modalSummaryMerchant = document.getElementById('modal-summary-merchant');
  const modalSummaryDateTime = document.getElementById('modal-summary-datetime');
  const modalSummaryPrice = document.getElementById('modal-summary-price');
  const modalBookingCategory = document.getElementById('modal-booking-category');

  function openBookingModal() {
    if (!bookingModal) return;
    if (modalSummaryService) modalSummaryService.textContent = service.name;
    if (modalSummaryMerchant) modalSummaryMerchant.textContent = service.merchantName;
    if (modalSummaryDateTime) modalSummaryDateTime.textContent = `${selectedDay} at ${selectedTime}`;
    if (modalSummaryPrice) modalSummaryPrice.textContent = service.price;
    if (modalBookingCategory) {
      modalBookingCategory.textContent = service.category;
      modalBookingCategory.className = `merchant-cat-pill ${service.categoryTheme}`;
    }

    bookingModal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    if (modalConfirm) modalConfirm.focus();
  }

  function closeBookingModal() {
    if (!bookingModal) return;
    bookingModal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  if (btnBookNow) btnBookNow.addEventListener('click', openBookingModal);
  if (modalClose) modalClose.addEventListener('click', closeBookingModal);
  if (modalCancel) modalCancel.addEventListener('click', closeBookingModal);

  if (modalConfirm) {
    modalConfirm.addEventListener('click', () => {
      modalConfirm.textContent = 'Request Confirmed!';
      modalConfirm.style.backgroundColor = '#059669';
      setTimeout(() => {
        closeBookingModal();
        modalConfirm.textContent = 'Confirm Request';
        modalConfirm.style.backgroundColor = '';
        showCartToast('Booking inquiry submitted successfully! The merchant will confirm shortly.');
      }, 700);
    });
  }

  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) closeBookingModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bookingModal && !bookingModal.hasAttribute('hidden')) {
      closeBookingModal();
    }
  });

  // 5. "Add to Cart" Button & Cart Toast
  let cartCount = 0;
  const btnAddCart = document.getElementById('btn-add-cart');
  const navCartCount = document.getElementById('nav-cart-count');
  const cartToast = document.getElementById('cart-toast');
  const cartToastMsg = document.getElementById('cart-toast-msg');
  let toastTimer = null;

  function showCartToast(message) {
    if (!cartToast) return;
    if (cartToastMsg) cartToastMsg.textContent = message;
    cartToast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      cartToast.classList.remove('show');
    }, 3200);
  }

  if (btnAddCart) {
    btnAddCart.addEventListener('click', () => {
      cartCount++;
      if (navCartCount) navCartCount.textContent = cartCount;
      showCartToast(`"${service.name}" added to your cart!`);
    });
  }

  // 7. Render Related Services Cards
  const relatedGrid = document.getElementById('related-services-grid');
  if (relatedGrid && service.related) {
    relatedGrid.innerHTML = '';
    service.related.forEach(relId => {
      const rel = servicesData[relId];
      if (!rel) return;

      const card = document.createElement('article');
      card.className = 'related-card';
      card.innerHTML = `
        <div class="related-img-wrap">
          <img src="${rel.heroImg}" alt="${rel.name}" class="related-img" loading="lazy">
          <span class="merchant-cat-pill ${rel.categoryTheme}" style="position: absolute; top: 8px; left: 8px; font-size: 0.7rem; padding: 0.2rem 0.5rem;">${rel.category}</span>
        </div>
        <div class="related-body">
          <p class="related-merchant-name">${rel.merchantName}</p>
          <h4 class="related-title">${rel.name}</h4>
          <div style="font-size: var(--font-size-xs); color: var(--color-text-muted); display: flex; align-items: center; gap: 0.25rem;">
            <span style="color: #eab308;">&#9733;</span>
            <span>${rel.rating} (${rel.reviewCount})</span>
            <span>&bull;</span>
            <span>${rel.duration}</span>
          </div>
          <div class="related-footer">
            <span class="related-price">${rel.price}</span>
            <a href="service-details.html?id=${rel.id}" class="btn btn-sm btn-secondary" style="padding: 0.35rem 0.65rem; font-size: var(--font-size-xs);">
              <span>View Details</span>
            </a>
          </div>
        </div>
      `;
      relatedGrid.appendChild(card);
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
});
