/**
 * ServiceHub - Home Page Logic
 * Handles Mobile Navigation Toggle, Search Filtering,
 * Category Filtering, and Service Preview Dialog.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when clicking outside or clicking a nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Service Data Details for the View Service Modal
  const serviceDetails = {
    '1': {
      title: 'Deep Home Cleaning & Sanitization',
      category: 'Cleaning',
      merchant: 'SparkleClean Co.',
      rating: '4.9 (128 reviews)',
      price: '$120 / visit',
      description: 'Comprehensive top-to-bottom home sanitization including kitchens, bathrooms, floor scrubbing, dusting, window sills, and eco-friendly disinfection.'
    },
    '2': {
      title: 'Emergency Plumbing & Pipe Repair',
      category: 'Repair',
      merchant: 'Express Plumbing Pros',
      rating: '4.8 (94 reviews)',
      price: '$85 / hour',
      description: 'Rapid response pipe inspections, leak diagnostics, clog removal, drain clearing, fixture replacements, and residential water line repair.'
    },
    '3': {
      title: 'Mobile Interior & Exterior Car Detailing',
      category: 'Automotive',
      merchant: 'Apex Auto Studio',
      rating: '5.0 (215 reviews)',
      price: '$150 / service',
      description: 'On-demand mobile car wash, hand wax, ceramic finish, interior steam sanitization, leather upholstery conditioning, and streak-free window shine.'
    },
    '4': {
      title: 'Full Pet Grooming, Bath & Nail Trim',
      category: 'Pet',
      merchant: 'HappyPaws Grooming',
      rating: '4.9 (88 reviews)',
      price: '$65 / pet',
      description: 'Gentle, certified pet care featuring hypoallergenic herbal baths, warm blow-dry, ear cleaning, paw pad balm, and breed-specific coat styling.'
    },
    '5': {
      title: 'Custom Hair Styling, Cut & Coloring',
      category: 'Beauty',
      merchant: 'Glow Beauty Lounge',
      rating: '4.8 (142 reviews)',
      price: '$75 / session',
      description: 'Personalized hair care with professional stylists. Includes haircut, blow-out, balayage, gloss treatments, and organic botanical hair masks.'
    },
    '6': {
      title: '1-on-1 Academic Tutoring (Math & Science)',
      category: 'Education',
      merchant: 'BrightPath Learning',
      rating: '4.9 (64 reviews)',
      price: '$50 / hour',
      description: 'Tailored private sessions for grades K-12 and college prep. Focused on conceptual mastery, exam preparation, and homework reinforcement.'
    }
  };

  // Search & Filtering Elements
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  const servicesGrid = document.getElementById('services-grid');
  const serviceCards = document.querySelectorAll('.service-card');
  const categoryCards = document.querySelectorAll('.category-card');
  const tagButtons = document.querySelectorAll('.tag-btn');

  let activeCategory = null;

  /**
   * Filter Services by Search Term and Active Category
   */
  function filterServices() {
    const query = (searchInput.value || '').toLowerCase().trim();
    let visibleCount = 0;

    serviceCards.forEach(card => {
      const cardCategory = (card.dataset.category || '').toLowerCase();
      const cardTitle = (card.dataset.title || '').toLowerCase();
      const cardMerchant = (card.querySelector('.service-merchant span')?.textContent || '').toLowerCase();

      const matchesQuery = !query || 
        cardTitle.includes(query) || 
        cardCategory.includes(query) || 
        cardMerchant.includes(query);

      const matchesCategory = !activeCategory || cardCategory === activeCategory.toLowerCase();

      if (matchesQuery && matchesCategory) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Check if empty message is needed
    let emptyMsg = document.getElementById('empty-services-msg');
    if (visibleCount === 0) {
      if (!emptyMsg) {
        emptyMsg = document.createElement('div');
        emptyMsg.id = 'empty-services-msg';
        emptyMsg.style.gridColumn = '1 / -1';
        emptyMsg.style.textAlign = 'center';
        emptyMsg.style.padding = '3rem 1rem';
        emptyMsg.style.color = 'var(--color-text-muted)';
        emptyMsg.innerHTML = `
          <p style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--color-text-main);">No services found</p>
          <p style="font-size: 0.875rem;">Try adjusting your search terms or selecting a different category.</p>
          <button type="button" id="reset-filter-btn" class="btn btn-sm btn-secondary" style="margin-top: 1rem; width: auto;">Reset Filters</button>
        `;
        servicesGrid.appendChild(emptyMsg);
        document.getElementById('reset-filter-btn')?.addEventListener('click', resetFilters);
      }
      emptyMsg.hidden = false;
    } else if (emptyMsg) {
      emptyMsg.hidden = true;
    }
  }

  function resetFilters() {
    searchInput.value = '';
    activeCategory = null;
    categoryCards.forEach(c => c.classList.remove('active'));
    filterServices();
  }

  // Handle Search Input & Form Submit
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    filterServices();
    // Scroll smoothly to services
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  });

  searchInput.addEventListener('input', () => {
    filterServices();
  });

  // Handle Quick Tag Clicks
  tagButtons.forEach(tagBtn => {
    tagBtn.addEventListener('click', () => {
      const term = tagBtn.dataset.search;
      searchInput.value = term;
      filterServices();
      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Handle Category Card Clicks
  categoryCards.forEach(card => {
    const handleCategoryClick = () => {
      const cat = card.dataset.category;
      if (activeCategory === cat) {
        activeCategory = null;
        card.classList.remove('active');
      } else {
        categoryCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        activeCategory = cat;
      }
      filterServices();
      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
    };

    card.addEventListener('click', handleCategoryClick);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleCategoryClick();
      }
    });
  });

  // Modal Preview
  const serviceModal = document.getElementById('service-modal');
  const modalClose = document.getElementById('modal-close');
  const modalCloseAction = document.getElementById('modal-close-action');
  const modalCategory = document.getElementById('modal-category');
  const modalTitle = document.getElementById('modal-title');
  const modalMerchant = document.getElementById('modal-merchant');
  const modalRatingVal = document.getElementById('modal-rating-val');
  const modalPrice = document.getElementById('modal-price');
  const modalDescription = document.getElementById('modal-description');

  function openModal(serviceId) {
    const data = serviceDetails[serviceId];
    if (!data || !serviceModal) return;

    modalCategory.textContent = data.category;
    modalTitle.textContent = data.title;
    modalMerchant.querySelector('span').textContent = data.merchant;
    modalRatingVal.textContent = data.rating;
    modalPrice.textContent = data.price;
    modalDescription.textContent = data.description;

    serviceModal.hidden = false;
    // Trigger CSS opacity transition
    requestAnimationFrame(() => {
      serviceModal.classList.add('open');
    });
    modalClose.focus();
  }

  function closeModal() {
    if (!serviceModal) return;
    serviceModal.classList.remove('open');
    setTimeout(() => {
      serviceModal.hidden = true;
    }, 200);
  }

  document.querySelectorAll('.btn-view-service').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      openModal(id);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalCloseAction) modalCloseAction.addEventListener('click', closeModal);
  if (serviceModal) {
    serviceModal.addEventListener('click', (e) => {
      if (e.target === serviceModal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && serviceModal && !serviceModal.hidden) {
      closeModal();
    }
  });
});
