/**
 * ServiceHub - Merchant Listing Page Functionality (merchants.js)
 * Handles:
 *  1. Live real-time search by name, category, or service
 *  2. Multi-parameter filtering (Category, Price Range, Minimum Rating)
 *  3. Dynamic page header updates based on selected category
 *  4. URL query parameter parsing (?category=..., ?search=...)
 *  5. Empty state presentation and quick filter reset
 *  6. Interactive "View Profile" preview modal
 *  7. Responsive mobile navigation toggle
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements - Search and Filters
  const searchInput = document.getElementById('merchant-search-input');
  const filterCategory = document.getElementById('filter-category');
  const filterPrice = document.getElementById('filter-price');
  const filterRating = document.getElementById('filter-rating');
  const btnReset = document.getElementById('btn-reset-filters');
  const emptyResetBtn = document.getElementById('empty-reset-btn');
  const resultsCountBadge = document.getElementById('results-count');
  const emptyState = document.getElementById('empty-state');
  const merchantsGrid = document.getElementById('merchants-grid');
  const merchantCards = Array.from(document.querySelectorAll('.merchant-card'));

  // DOM Elements - Dynamic Header
  const pageTitle = document.getElementById('page-title');
  const badgeText = document.getElementById('badge-text');
  const pageSubtitle = document.getElementById('page-subtitle');

  // DOM Elements - Mobile Navigation
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  // DOM Elements - Profile Preview Modal
  const profileModal = document.getElementById('profile-preview-modal');
  const modalCloseBtn = document.getElementById('modal-profile-close');
  const modalActionBtn = document.getElementById('modal-profile-action');
  const previewTitle = document.getElementById('preview-title');
  const previewOwner = document.getElementById('preview-owner');
  const previewCategory = document.getElementById('preview-category');
  const previewRatingVal = document.getElementById('preview-rating-val');
  const previewPrice = document.getElementById('preview-price');
  const previewDesc = document.getElementById('preview-description');
  const previewLocationVal = document.getElementById('preview-location-val');

  // Category descriptions dictionary for dynamic headers
  const categoryMeta = {
    'All': {
      title: 'Verified Service Providers',
      badge: 'All Providers',
      desc: 'Browse verified local merchants, compare starting rates, review genuine customer feedback, and view provider profiles.'
    },
    'Home': {
      title: 'Home Service Providers',
      badge: 'Home Services',
      desc: 'Connect with certified interior contractors, electricians, painters, carpenters, and home improvement experts.'
    },
    'Beauty': {
      title: 'Beauty & Wellness Specialists',
      badge: 'Beauty & Wellness',
      desc: 'Book top-rated estheticians, hairstylists, nail technicians, and skincare artisans in your neighborhood.'
    },
    'Pet': {
      title: 'Pet Care & Grooming Providers',
      badge: 'Pet Care Services',
      desc: 'Find vetted pet sitters, dog trainers, mobile groomers, and animal wellness professionals.'
    },
    'Automotive': {
      title: 'Automotive Technicians & Detailers',
      badge: 'Automotive Services',
      desc: 'Mobile detailing, mechanic diagnosis, oil changes, tire service, and auto care brought directly to you.'
    },
    'Education': {
      title: 'Education & Private Tutors',
      badge: 'Education & Tutoring',
      desc: 'Experienced academic tutors, music instructors, language specialists, and test prep coaches.'
    },
    'Repair': {
      title: 'Device & Appliance Repair Specialists',
      badge: 'Repair & Maintenance',
      desc: 'Fast and reliable repair services for smartphones, laptops, HVAC, plumbing, and home appliances.'
    },
    'Cleaning': {
      title: 'Professional Cleaning Services',
      badge: 'Cleaning & Sanitation',
      desc: 'Eco-friendly residential deep cleaning, commercial sanitization, carpet cleaning, and move-out specialists.'
    },
    'Other': {
      title: 'Specialized Local Services',
      badge: 'Other Services',
      desc: 'Event photographers, personal fitness trainers, mobile notary publics, and tailored community services.'
    }
  };

  /**
   * Updates the page header elements based on the currently selected category
   * @param {string} category 
   */
  function updateHeader(category) {
    const meta = categoryMeta[category] || categoryMeta['All'];
    if (pageTitle) pageTitle.textContent = meta.title;
    if (badgeText) badgeText.textContent = meta.badge;
    if (pageSubtitle) pageSubtitle.textContent = meta.desc;
  }

  /**
   * Main filtering and search engine
   */
  function applyFilters() {
    const searchQuery = (searchInput ? searchInput.value : '').trim().toLowerCase();
    const selectedCategory = filterCategory ? filterCategory.value : 'All';
    const selectedPrice = filterPrice ? filterPrice.value : 'All';
    const selectedRating = filterRating ? filterRating.value : 'All';

    // Update Header dynamically
    updateHeader(selectedCategory);

    let matchCount = 0;

    merchantCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category') || '';
      const cardPrice = parseFloat(card.getAttribute('data-price') || '0');
      const cardRating = parseFloat(card.getAttribute('data-rating') || '0');
      const cardContent = card.innerText.toLowerCase();

      // 1. Category Filter Match
      const matchesCategory = (selectedCategory === 'All' || 
        cardCategory.toLowerCase() === selectedCategory.toLowerCase());

      // 2. Price Range Filter Match
      let matchesPrice = true;
      if (selectedPrice === 'under50') {
        matchesPrice = cardPrice < 50;
      } else if (selectedPrice === '50to100') {
        matchesPrice = cardPrice >= 50 && cardPrice <= 100;
      } else if (selectedPrice === 'over100') {
        matchesPrice = cardPrice > 100;
      }

      // 3. Rating Filter Match
      let matchesRating = true;
      if (selectedRating !== 'All') {
        const minRating = parseFloat(selectedRating);
        matchesRating = cardRating >= minRating;
      }

      // 4. Search Query Match
      let matchesSearch = true;
      if (searchQuery.length > 0) {
        matchesSearch = cardContent.includes(searchQuery);
      }

      // Final Visibility Determination
      if (matchesCategory && matchesPrice && matchesRating && matchesSearch) {
        card.style.display = '';
        card.removeAttribute('aria-hidden');
        matchCount++;
      } else {
        card.style.display = 'none';
        card.setAttribute('aria-hidden', 'true');
      }
    });

    // Update Results Counter
    if (resultsCountBadge) {
      if (matchCount === 1) {
        resultsCountBadge.textContent = 'Showing 1 merchant';
      } else {
        resultsCountBadge.textContent = `Showing ${matchCount} merchants`;
      }
    }

    // Toggle Empty State Box
    if (matchCount === 0) {
      if (emptyState) emptyState.removeAttribute('hidden');
      if (merchantsGrid) merchantsGrid.style.display = 'none';
    } else {
      if (emptyState) emptyState.setAttribute('hidden', '');
      if (merchantsGrid) merchantsGrid.style.display = 'grid';
    }
  }

  /**
   * Resets all search and filter controls to default
   */
  function resetAllFilters() {
    if (searchInput) searchInput.value = '';
    if (filterCategory) filterCategory.value = 'All';
    if (filterPrice) filterPrice.value = 'All';
    if (filterRating) filterRating.value = 'All';

    // Clear URL parameters cleanly without refreshing page
    if (window.history.replaceState) {
      const cleanUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;
      window.history.replaceState({ path: cleanUrl }, '', cleanUrl);
    }

    applyFilters();
    if (searchInput) searchInput.focus();
  }

  // Event Listeners for Filters and Search
  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  if (filterCategory) {
    filterCategory.addEventListener('change', () => {
      // Sync URL parameter when user changes category
      if (window.history.replaceState) {
        const url = new URL(window.location);
        if (filterCategory.value !== 'All') {
          url.searchParams.set('category', filterCategory.value);
        } else {
          url.searchParams.delete('category');
        }
        window.history.replaceState({}, '', url);
      }
      applyFilters();
    });
  }

  if (filterPrice) {
    filterPrice.addEventListener('change', applyFilters);
  }

  if (filterRating) {
    filterRating.addEventListener('change', applyFilters);
  }

  if (btnReset) {
    btnReset.addEventListener('click', resetAllFilters);
  }

  if (emptyResetBtn) {
    emptyResetBtn.addEventListener('click', resetAllFilters);
  }

  // Profile Preview Modal Handling
  function openProfileModal(card) {
    if (!profileModal || !card) return;

    const titleEl = card.querySelector('.merchant-card-title');
    const ownerEl = card.querySelector('.merchant-owner');
    const catPill = card.querySelector('.merchant-cat-pill');
    const ratingEl = card.querySelector('.merchant-rating-row span:nth-child(2)');
    const priceEl = card.querySelector('.merchant-price-val');
    const descEl = card.querySelector('.merchant-card-desc');
    const locEl = card.querySelector('.merchant-location-row span');

    if (previewTitle && titleEl) previewTitle.textContent = titleEl.textContent.trim();
    if (previewOwner && ownerEl) previewOwner.textContent = ownerEl.textContent.trim();
    if (previewCategory && catPill) {
      previewCategory.textContent = catPill.textContent.trim();
      previewCategory.className = catPill.className; // preserve theme pill color
    }
    if (previewRatingVal && ratingEl) previewRatingVal.textContent = ratingEl.textContent.trim();
    if (previewPrice && priceEl) previewPrice.textContent = priceEl.textContent.trim();
    if (previewDesc && descEl) previewDesc.textContent = descEl.textContent.trim();
    if (previewLocationVal && locEl) previewLocationVal.textContent = locEl.textContent.trim();

    profileModal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden'; // prevent scrolling while modal is open
    if (modalActionBtn) modalActionBtn.focus();
  }

  function closeProfileModal() {
    if (!profileModal) return;
    profileModal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  // Attach modal listeners to "View Profile" buttons
  document.querySelectorAll('.btn-view-profile').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.merchant-card');
      openProfileModal(card);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProfileModal);
  }

  if (modalActionBtn) {
    modalActionBtn.addEventListener('click', closeProfileModal);
  }

  if (profileModal) {
    profileModal.addEventListener('click', (e) => {
      if (e.target === profileModal) {
        closeProfileModal();
      }
    });
  }

  // Keyboard accessibility (Escape key to close modal)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && profileModal && !profileModal.hasAttribute('hidden')) {
      closeProfileModal();
    }
  });

  // Mobile navigation menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('nav-open');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('nav-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Initial URL Parameter Parsing
  // Handles incoming links like merchants.html?category=Home or merchants.html?search=cleaning
  function parseInitialUrlParams() {
    const params = new URLSearchParams(window.location.search);
    
    // Category param
    const categoryParam = params.get('category');
    if (categoryParam && filterCategory) {
      // Find matching option (case-insensitive)
      const options = Array.from(filterCategory.options);
      const match = options.find(opt => opt.value.toLowerCase() === categoryParam.trim().toLowerCase());
      if (match) {
        filterCategory.value = match.value;
      }
    }

    // Search param
    const searchParam = params.get('search');
    if (searchParam && searchInput) {
      searchInput.value = searchParam.trim();
    }

    // Rating param
    const ratingParam = params.get('rating');
    if (ratingParam && filterRating) {
      filterRating.value = ratingParam.trim();
    }

    // Price param
    const priceParam = params.get('price');
    if (priceParam && filterPrice) {
      filterPrice.value = priceParam.trim();
    }

    // Run initial filter calculation
    applyFilters();
  }

  parseInitialUrlParams();
});
