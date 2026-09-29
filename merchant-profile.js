/**
 * ServiceHub - Merchant Profile Page Functionality (merchant-profile.js)
 * Supports dynamic merchant data based on URL parameter (?id=1, ?id=2, etc.)
 * Handles:
 *  1. Multi-merchant profile dataset
 *  2. Header & business details rendering
 *  3. Dynamic services offered list with interactive "View Details" modal
 *  4. Availability table & customer reviews rendering
 *  5. Direct contact links & smooth scrolling navigation
 *  6. Mobile menu toggle
 */

document.addEventListener('DOMContentLoaded', () => {
  // Comprehensive Sample Merchant Dataset
  const merchantsData = {
    '1': {
      id: '1',
      name: 'SparkleClean Co.',
      initials: 'SC',
      avatarBg: 'linear-gradient(135deg, #059669, #10b981)',
      category: 'Cleaning',
      categoryTheme: 'theme-cleaning',
      owner: 'Elena Rostova',
      rating: '4.9',
      reviewCount: 142,
      location: 'Central City, Metro Area • 1.8 mi',
      address: '742 Evergreen Blvd, Central City, CA 90210',
      serviceArea: 'Central City and surrounding 25-mile radius',
      phone: '+1 (555) 349-2810',
      email: 'elena@sparklecleanco.com',
      shortDesc: 'Residential and commercial deep cleaning specialists with over 8 years of local experience, vetted crews, and eco-friendly supplies.',
      fullAbout: `
        <p>Founded in 2018 by Elena Rostova, SparkleClean Co. provides superior residential and commercial sanitization services throughout Central City and adjacent neighborhoods. We believe that a truly clean space fosters well-being, clarity, and peace of mind.</p>
        <p>Every technician on our team undergoes rigorous background screening, in-depth chemical safety training, and hands-on apprenticeship. We exclusively use hospital-grade, EPA-certified, and biodegradable cleaning solutions that are completely safe for households with young children, cats, and dogs.</p>
      `,
      facts: {
        experience: '8+ Years in Business',
        check: '100% Verified Crew',
        insurance: '$1M General Liability',
        response: 'Typically < 15 mins',
        team: '12 Certified Specialists',
        languages: 'English, Spanish'
      },
      nextSlot: 'Tomorrow at 10:00 AM',
      schedule: [
        { day: 'Monday', time: '8:00 AM – 6:00 PM' },
        { day: 'Tuesday', time: '8:00 AM – 6:00 PM' },
        { day: 'Wednesday', time: '8:00 AM – 6:00 PM' },
        { day: 'Thursday', time: '8:00 AM – 6:00 PM' },
        { day: 'Friday', time: '8:00 AM – 6:00 PM' },
        { day: 'Saturday', time: '9:00 AM – 4:00 PM' },
        { day: 'Sunday', time: 'Closed (Emergency Only)' }
      ],
      ratingDistribution: { '5': 92, '4': 6, '3': 2, '2': 0, '1': 0 },
      services: [
        {
          id: 's1',
          name: 'Standard Residential Deep Clean',
          desc: 'Comprehensive top-to-bottom sanitize of living areas, kitchen degreasing, bathroom scrubbing, dusting, and floor polishing.',
          price: '$65',
          duration: '2 hours',
          features: [
            'All eco-certified supplies and tools provided',
            'Full checklist inspection upon completion',
            'Safe for pets and young children',
            'Living room, kitchen, and bathroom sanitization'
          ]
        },
        {
          id: 's2',
          name: 'Move-In / Move-Out Sanitization',
          desc: 'Rigorous empty-home overhaul designed for full security deposit return. Inside cabinets, oven, fridge, baseboards, and window tracks.',
          price: '$140',
          duration: '3.5 hours',
          features: [
            'Oven, refrigerator, and microwave deep detailing',
            'Full interior cabinet and drawer scrubbing',
            'Baseboards, vents, and interior window tracks',
            'Landlord deposit return guarantee'
          ]
        },
        {
          id: 's3',
          name: 'Eco Commercial Office Maintenance',
          desc: 'Tailored after-hours sanitizing for studios, clinics, and offices. Trash removal, workstation disinfection, glass clean, and vacuuming.',
          price: '$190',
          duration: '4 hours',
          features: [
            'High-touch surface disinfection protocols',
            'Restroom sanitization and restock',
            'Customizable after-hours scheduling',
            'Dedicated account supervisor'
          ]
        }
      ],
      reviews: [
        {
          name: 'Jessica Miller',
          initials: 'JM',
          date: 'September 14, 2026',
          stars: 5,
          text: 'Elena and her crew were exceptional! My apartment has never looked this immaculate. They arrived exactly on time, were extremely courteous, and used genuinely non-toxic supplies that didn\'t bother my asthmatic cat at all. Will definitely book bi-weekly!'
        },
        {
          name: 'David Kaufman',
          initials: 'DK',
          date: 'August 28, 2026',
          stars: 5,
          text: 'Booked their move-out deep clean on relatively short notice. They brought all specialized gear, took care of stubborn kitchen grease, and our landlord returned 100% of our deposit with zero complaints. Well worth every dollar.'
        },
        {
          name: 'Samantha Taylor',
          initials: 'ST',
          date: 'August 12, 2026',
          stars: 5,
          text: 'Prompt communication from quote to completion. Transparent pricing with no surprises. They even went the extra mile on the bathroom tile grout. Highly recommend SparkleClean to anyone in Central City.'
        }
      ]
    },

    '2': {
      id: '2',
      name: 'Apex Auto Studio',
      initials: 'AA',
      avatarBg: 'linear-gradient(135deg, #1e293b, #475569)',
      category: 'Automotive',
      categoryTheme: 'theme-automotive',
      owner: 'Marcus Chen',
      rating: '5.0',
      reviewCount: 215,
      location: 'South District • 3.4 mi',
      address: '108 Industrial Pkwy, South District, CA 90212',
      serviceArea: 'South District, Metro, and 30-mile mobile radius',
      phone: '+1 (555) 892-4411',
      email: 'marcus@apexautostudio.com',
      shortDesc: 'Certified mobile auto detailing and ceramic paint protection. We bring water, power, and showroom shine directly to your driveway.',
      fullAbout: `
        <p>Apex Auto Studio was founded by Marcus Chen, an IDA-certified master automotive detailer with over a decade of experience detailing everything from daily drivers to concours-level exotics.</p>
        <p>Our custom mobile vans are completely self-contained with deionized spot-free water, whisper-quiet generators, and commercial steam extractors. We treat every vehicle like a bespoke work of art.</p>
      `,
      facts: {
        experience: '10+ Years in Business',
        check: 'IDA Certified Detailer',
        insurance: '$2M Garage Keepers',
        response: 'Typically < 20 mins',
        team: '6 Mobile Specialists',
        languages: 'English, Mandarin'
      },
      nextSlot: 'Thursday at 1:00 PM',
      schedule: [
        { day: 'Monday', time: '7:30 AM – 6:30 PM' },
        { day: 'Tuesday', time: '7:30 AM – 6:30 PM' },
        { day: 'Wednesday', time: '7:30 AM – 6:30 PM' },
        { day: 'Thursday', time: '7:30 AM – 6:30 PM' },
        { day: 'Friday', time: '7:30 AM – 6:30 PM' },
        { day: 'Saturday', time: '8:00 AM – 5:00 PM' },
        { day: 'Sunday', time: 'Closed' }
      ],
      ratingDistribution: { '5': 98, '4': 2, '3': 0, '2': 0, '1': 0 },
      services: [
        {
          id: 's2-1',
          name: 'Mobile Signature Full Detail',
          desc: 'Two-bucket hand wash, clay bar paint decontamination, leather conditioning, interior steam sanitization, and carnauba wax seal.',
          price: '$120',
          duration: '3 hours',
          features: [
            'Spot-free reverse-osmosis water rinse',
            'Full interior vacuum and steam shampoo',
            'Wheels and brake calipers deep clean',
            'Tire dressing and exterior glass seal'
          ]
        },
        {
          id: 's2-2',
          name: 'Ceramic Paint Protection & Polish',
          desc: 'Single-stage machine paint enhancement polish removing swirl marks, finished with a 1-year graphene ceramic coating.',
          price: '$280',
          duration: '5 hours',
          features: [
            'Paint depth gauge reading and inspection',
            'Swirl mark removal machine polish',
            '1-year hydrophobic ceramic coat',
            'Complimentary maintenance wash kit'
          ]
        },
        {
          id: 's2-3',
          name: 'Interior Ozone Odor Removal',
          desc: 'Complete medical-grade ozone gas sterilization to eliminate stubborn pet odors, smoke, and mold spores from cabin HVAC.',
          price: '$95',
          duration: '1.5 hours',
          features: [
            'Cabin filter inspection and replacement',
            'Deep upholstery enzyme breakdown',
            'Hospital-grade ozone treatment cycle'
          ]
        }
      ],
      reviews: [
        {
          name: 'Brian O\'Connor',
          initials: 'BO',
          date: 'September 20, 2026',
          stars: 5,
          text: 'Marcus did a phenomenal job on my black SUV. It literally looks better than the day I picked it up from the dealership. His mobile rig is fully equipped, and he didn\'t even need to plug into my outlets.'
        },
        {
          name: 'Emily Watson',
          initials: 'EW',
          date: 'September 2, 2026',
          stars: 5,
          text: 'Super professional and courteous. Got coffee stains out of my light beige cloth seats that had been there for 6 months. Will be setting up a recurring monthly subscription.'
        }
      ]
    },

    '3': {
      id: '3',
      name: 'Precision Plumbing Pro',
      initials: 'PP',
      avatarBg: 'linear-gradient(135deg, #0284c7, #38bdf8)',
      category: 'Repair',
      categoryTheme: 'theme-repair',
      owner: 'David Vance',
      rating: '4.8',
      reviewCount: 98,
      location: 'Westside • 2.1 mi',
      address: '404 Waterfront Way, Westside, CA 90214',
      serviceArea: 'Westside and Greater Metro',
      phone: '+1 (555) 723-9901',
      email: 'david@precisionplumbing.com',
      shortDesc: 'Master-licensed plumbing contractor specializing in pipe leak detection, water heater installations, drain clearing, and repairs.',
      fullAbout: `
        <p>With over 15 years as a Master Plumber, David Vance established Precision Plumbing Pro to provide clear, upfront, honest plumbing services without predatory diagnostic fees.</p>
        <p>We leverage high-resolution drain cameras, hydro-jetters, and electronic acoustic leak detectors to pinpoint and solve issues accurately on the first visit.</p>
      `,
      facts: {
        experience: '15+ Years in Business',
        check: 'Master Plumber Lic #8841',
        insurance: '$2M Commercial Policy',
        response: 'Typically < 10 mins',
        team: '8 Licensed Technicians',
        languages: 'English'
      },
      nextSlot: 'Today at 3:30 PM',
      schedule: [
        { day: 'Monday', time: '7:00 AM – 7:00 PM' },
        { day: 'Tuesday', time: '7:00 AM – 7:00 PM' },
        { day: 'Wednesday', time: '7:00 AM – 7:00 PM' },
        { day: 'Thursday', time: '7:00 AM – 7:00 PM' },
        { day: 'Friday', time: '7:00 AM – 7:00 PM' },
        { day: 'Saturday', time: '8:00 AM – 4:00 PM' },
        { day: 'Sunday', time: 'Emergency On-Call' }
      ],
      ratingDistribution: { '5': 88, '4': 10, '3': 2, '2': 0, '1': 0 },
      services: [
        {
          id: 's3-1',
          name: 'Drain Clearing & Camera Inspection',
          desc: 'High-definition fiber-optic video scope through sewer and drain lines followed by motorized auger clearing.',
          price: '$95',
          duration: '1.5 hours',
          features: [
            'Digital recording of line provided',
            'Full blockage clearing guaranteed',
            'Safe for older cast iron and PVC pipes'
          ]
        },
        {
          id: 's3-2',
          name: 'Tankless & Standard Water Heater Repair',
          desc: 'Diagnostic testing of heating elements, thermostats, gas valves, and anode rod replacement.',
          price: '$150',
          duration: '2 hours',
          features: [
            'Comprehensive 18-point safety check',
            'Genuine OEM replacement components',
            '1-year labor warranty'
          ]
        }
      ],
      reviews: [
        {
          name: 'Robert Hastings',
          initials: 'RH',
          date: 'September 18, 2026',
          stars: 5,
          text: 'David arrived in under 45 minutes when my kitchen drain backed up. Fixed the problem cleanly, showed me video footage of tree roots, and gave clear preventive advice. Top-notch professional!'
        }
      ]
    }
  };

  // Extract merchant ID from URL, default to 1 (SparkleClean Co.)
  const params = new URLSearchParams(window.location.search);
  const merchantId = params.get('id') || '1';
  const merchant = merchantsData[merchantId] || merchantsData['1'];

  // Update Page Title and Breadcrumb
  document.title = `${merchant.name} &bull; ServiceHub`;
  const breadcrumbName = document.getElementById('breadcrumb-current-name');
  if (breadcrumbName) breadcrumbName.textContent = merchant.name;

  // Header Elements
  const avatarEl = document.getElementById('profile-avatar');
  const catPillEl = document.getElementById('profile-cat-pill');
  const bizNameEl = document.getElementById('profile-biz-name');
  const ratingValEl = document.getElementById('profile-rating-val');
  const reviewCountEl = document.getElementById('profile-review-count');
  const locValEl = document.getElementById('profile-loc-val');
  const ownerValEl = document.getElementById('profile-owner-val');
  const shortDescEl = document.getElementById('profile-short-desc');

  if (avatarEl) {
    avatarEl.textContent = merchant.initials;
    avatarEl.style.background = merchant.avatarBg;
  }
  if (catPillEl) {
    catPillEl.textContent = merchant.category;
    catPillEl.className = `merchant-cat-pill ${merchant.categoryTheme}`;
  }
  if (bizNameEl) bizNameEl.textContent = merchant.name;
  if (ratingValEl) ratingValEl.textContent = merchant.rating;
  if (reviewCountEl) reviewCountEl.textContent = `(${merchant.reviewCount} reviews)`;
  if (locValEl) locValEl.textContent = merchant.location;
  if (ownerValEl) ownerValEl.textContent = `Owner: ${merchant.owner}`;
  if (shortDescEl) shortDescEl.textContent = merchant.shortDesc;

  // About Section
  const fullAboutEl = document.getElementById('profile-full-about');
  if (fullAboutEl) fullAboutEl.innerHTML = merchant.fullAbout;

  // Facts Grid
  const factExp = document.getElementById('fact-exp');
  const factCheck = document.getElementById('fact-check');
  const factIns = document.getElementById('fact-ins');
  const factResp = document.getElementById('fact-resp');
  const factTeam = document.getElementById('fact-team');
  const factLang = document.getElementById('fact-lang');

  if (factExp) factExp.textContent = merchant.facts.experience;
  if (factCheck) factCheck.textContent = merchant.facts.check;
  if (factIns) factIns.textContent = merchant.facts.insurance;
  if (factResp) factResp.textContent = merchant.facts.response;
  if (factTeam) factTeam.textContent = merchant.facts.team;
  if (factLang) factLang.textContent = merchant.facts.languages;

  // Render Services Offered
  const servicesListEl = document.getElementById('services-list');
  const servicesCountBadge = document.getElementById('services-count-badge');
  if (servicesCountBadge) {
    servicesCountBadge.textContent = `${merchant.services.length} Services Available`;
  }

  if (servicesListEl) {
    servicesListEl.innerHTML = '';
    merchant.services.forEach((srv, idx) => {
      const card = document.createElement('article');
      card.className = 'profile-service-card';
      card.setAttribute('role', 'listitem');
      card.innerHTML = `
        <div class="service-card-left">
          <div class="service-icon-box" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
            </svg>
          </div>
          <div class="service-card-details">
            <h3 class="service-item-title">${srv.name}</h3>
            <p class="service-item-desc">${srv.desc}</p>
            <div class="service-meta-badges">
              <span class="service-duration-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>
                <span>${srv.duration}</span>
              </span>
              <span class="service-duration-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Verified Rate</span>
              </span>
            </div>
          </div>
        </div>
        <div class="service-card-right">
          <span class="service-item-price">${srv.price}</span>
          <a href="service-details.html?id=${srv.id}" class="btn btn-sm btn-secondary btn-service-details">
            <span>View Details</span>
          </a>
        </div>
      `;
      servicesListEl.appendChild(card);
    });
  }

  // Render Availability
  const nextSlotEl = document.getElementById('next-slot-text');
  if (nextSlotEl) nextSlotEl.textContent = `Next Open Slot: ${merchant.nextSlot}`;

  const scheduleTable = document.getElementById('schedule-table');
  if (scheduleTable && merchant.schedule) {
    scheduleTable.innerHTML = '';
    merchant.schedule.forEach(row => {
      const isClosed = row.time.toLowerCase().includes('closed');
      const rowEl = document.createElement('div');
      rowEl.className = 'schedule-row';
      rowEl.innerHTML = `
        <span class="schedule-day">${row.day}</span>
        <span class="schedule-time ${isClosed ? 'schedule-closed' : ''}">${row.time}</span>
      `;
      scheduleTable.appendChild(rowEl);
    });
  }

  // Render Reviews Summary & Review Cards
  const reviewScoreBig = document.getElementById('review-score-big');
  const reviewScoreCount = document.getElementById('review-score-count');
  if (reviewScoreBig) reviewScoreBig.textContent = merchant.rating;
  if (reviewScoreCount) reviewScoreCount.textContent = `Based on ${merchant.reviewCount} reviews`;

  const reviewsListEl = document.getElementById('customer-reviews-list');
  if (reviewsListEl && merchant.reviews) {
    reviewsListEl.innerHTML = '';
    merchant.reviews.forEach(rev => {
      const starsStr = '&#9733;'.repeat(rev.stars);
      const revEl = document.createElement('article');
      revEl.className = 'customer-review-card';
      revEl.innerHTML = `
        <div class="reviewer-meta-row">
          <div class="reviewer-profile-info">
            <div class="reviewer-avatar-init">${rev.initials}</div>
            <div>
              <h3 class="reviewer-name">${rev.name}</h3>
              <span class="review-date">${rev.date} &bull; Verified Customer</span>
            </div>
          </div>
          <div class="rating-stars-gold" aria-label="${rev.stars} stars">${starsStr}</div>
        </div>
        <p class="review-comment-text">${rev.text}</p>
      `;
      reviewsListEl.appendChild(revEl);
    });
  }

  // Render Contact Info
  const phoneLink = document.getElementById('contact-phone-link');
  const emailLink = document.getElementById('contact-email-link');
  const addressVal = document.getElementById('contact-address-val');

  if (phoneLink) {
    phoneLink.textContent = merchant.phone;
    phoneLink.href = `tel:${merchant.phone.replace(/[^0-9+]/g, '')}`;
  }
  if (emailLink) {
    emailLink.textContent = merchant.email;
    emailLink.href = `mailto:${merchant.email}`;
  }
  if (addressVal) {
    addressVal.textContent = merchant.serviceArea;
  }

  // Service Details Modal Management
  const modal = document.getElementById('service-details-modal');
  const modalTitle = document.getElementById('modal-service-title');
  const modalPrice = document.getElementById('modal-service-price');
  const modalDuration = document.getElementById('modal-service-duration');
  const modalDesc = document.getElementById('modal-service-desc');
  const modalCategory = document.getElementById('modal-service-category');
  const modalFeatures = document.getElementById('modal-service-features');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalCloseAction = document.getElementById('modal-close-action');
  const modalInquireAction = document.getElementById('modal-inquire-action');

  function openServiceModal(srv) {
    if (!modal || !srv) return;
    if (modalTitle) modalTitle.textContent = srv.name;
    if (modalPrice) modalPrice.textContent = srv.price;
    if (modalDuration) modalDuration.textContent = srv.duration;
    if (modalDesc) modalDesc.textContent = srv.desc;
    if (modalCategory) {
      modalCategory.textContent = merchant.category;
      modalCategory.className = `merchant-cat-pill ${merchant.categoryTheme}`;
    }

    if (modalFeatures && srv.features) {
      modalFeatures.innerHTML = '';
      srv.features.forEach(f => {
        const li = document.createElement('li');
        li.className = 'service-modal-feature-item';
        li.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
          <span>${f}</span>
        `;
        modalFeatures.appendChild(li);
      });
    }

    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    if (modalCloseBtn) modalCloseBtn.focus();
  }

  function closeServiceModal() {
    if (!modal) return;
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  // Delegate clicks on View Details buttons
  document.addEventListener('click', (e) => {
    const targetBtn = e.target.closest('.btn-service-details');
    if (targetBtn) {
      const idx = parseInt(targetBtn.getAttribute('data-service-idx'), 10);
      if (!isNaN(idx) && merchant.services[idx]) {
        openServiceModal(merchant.services[idx]);
      }
    }
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeServiceModal);
  if (modalCloseAction) modalCloseAction.addEventListener('click', closeServiceModal);
  if (modalInquireAction) {
    modalInquireAction.addEventListener('click', () => {
      closeServiceModal();
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeServiceModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.hasAttribute('hidden')) {
      closeServiceModal();
    }
  });

  // Mobile Menu Toggle
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
