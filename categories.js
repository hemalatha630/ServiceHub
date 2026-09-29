/**
 * ServiceHub - Categories Page Logic
 * Handles Mobile Menu Toggle and Real-Time Category Card Filtering.
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

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Real-Time Category Filter
  const searchInput = document.getElementById('category-search-input');
  const categoriesGrid = document.getElementById('categories-grid');
  const categoryCards = document.querySelectorAll('.cat-detailed-card');

  if (searchInput && categoriesGrid) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase().trim();
      let matchCount = 0;

      categoryCards.forEach(card => {
        const category = (card.dataset.category || '').toLowerCase();
        const keywords = (card.dataset.keywords || '').toLowerCase();
        const desc = (card.querySelector('.cat-detailed-desc')?.textContent || '').toLowerCase();

        const matches = !query || 
          category.includes(query) || 
          keywords.includes(query) || 
          desc.includes(query);

        if (matches) {
          card.style.display = 'flex';
          matchCount++;
        } else {
          card.style.display = 'none';
        }
      });

      // Show/Hide Empty State
      let emptyMsg = document.getElementById('empty-cat-msg');
      if (matchCount === 0) {
        if (!emptyMsg) {
          emptyMsg = document.createElement('div');
          emptyMsg.id = 'empty-cat-msg';
          emptyMsg.style.gridColumn = '1 / -1';
          emptyMsg.style.textAlign = 'center';
          emptyMsg.style.padding = '3.5rem 1rem';
          emptyMsg.style.color = 'var(--color-text-muted)';
          emptyMsg.innerHTML = `
            <p style="font-size: 1.125rem; font-weight: 700; color: var(--color-text-main); margin-bottom: 0.5rem;">No categories found</p>
            <p style="font-size: 0.875rem;">No service category matched "<strong>${searchInput.value}</strong>".</p>
            <button type="button" id="reset-cat-btn" class="btn btn-sm btn-secondary" style="margin-top: 1rem; width: auto;">Show All Categories</button>
          `;
          categoriesGrid.appendChild(emptyMsg);
          document.getElementById('reset-cat-btn')?.addEventListener('click', () => {
            searchInput.value = '';
            categoryCards.forEach(c => c.style.display = 'flex');
            emptyMsg.hidden = true;
            searchInput.focus();
          });
        }
        emptyMsg.hidden = false;
      } else if (emptyMsg) {
        emptyMsg.hidden = true;
      }
    });

    // Clear filter on Escape
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        categoryCards.forEach(c => c.style.display = 'flex');
        const emptyMsg = document.getElementById('empty-cat-msg');
        if (emptyMsg) emptyMsg.hidden = true;
      }
    });
  }
});
