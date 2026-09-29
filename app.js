/**
 * ServiceHub - Login Page Logic
 * Handles Role Selection (Customer/Merchant), Password Visibility Toggle,
 * Form Validation, and Accessibility (ARIA Sync).
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const roleTabs = document.querySelectorAll('.role-tab');
  const roleSubtitle = document.getElementById('role-subtitle');
  const userRoleInput = document.getElementById('user-role-input');
  const loginForm = document.getElementById('login-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const groupEmail = document.getElementById('group-email');
  const groupPassword = document.getElementById('group-password');
  const togglePasswordBtn = document.getElementById('toggle-password');
  const loginButton = document.getElementById('login-button');
  const statusMessage = document.getElementById('status-message');

  // Role Configuration
  const roleConfig = {
    customer: {
      title: 'Customer',
      subtitle: 'Sign in to book and track your service requests',
      emailPlaceholder: 'customer@example.com',
      submitText: 'Sign In as Customer'
    },
    merchant: {
      title: 'Merchant',
      subtitle: 'Sign in to manage your business services and clients',
      emailPlaceholder: 'merchant@business.com',
      submitText: 'Sign In as Merchant'
    }
  };

  /**
   * Switch Active Role (Customer / Merchant)
   * @param {string} role - 'customer' or 'merchant'
   */
  function setRole(role) {
    if (!roleConfig[role]) return;

    // Update Tab states
    roleTabs.forEach(tab => {
      const isSelected = tab.dataset.role === role;
      tab.classList.toggle('active', isSelected);
      tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      tab.setAttribute('tabindex', isSelected ? '0' : '-1');
    });

    // Update Hidden Input value
    userRoleInput.value = role;

    // Update Subtitle & Input Hint
    const config = roleConfig[role];
    roleSubtitle.textContent = config.subtitle;
    emailInput.placeholder = config.emailPlaceholder;

    // Update button text cleanly
    const btnText = loginButton.querySelector('.btn-text');
    if (btnText) {
      btnText.textContent = config.submitText;
    }

    // Reset temporary status message if present
    hideStatusMessage();
  }

  // Handle Tab Click
  roleTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetRole = tab.dataset.role;
      setRole(targetRole);
    });

    // Keyboard navigation (Arrow keys) for ARIA tablist
    tab.addEventListener('keydown', (e) => {
      let targetTab = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        targetTab = tab.nextElementSibling || roleTabs[0];
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        targetTab = tab.previousElementSibling || roleTabs[roleTabs.length - 1];
      }

      if (targetTab) {
        targetTab.focus();
        setRole(targetTab.dataset.role);
      }
    });
  });

  /**
   * Password Visibility Toggle
   */
  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', () => {
      const isCurrentlyPassword = passwordInput.getAttribute('type') === 'password';
      const newType = isCurrentlyPassword ? 'text' : 'password';
      
      passwordInput.setAttribute('type', newType);
      togglePasswordBtn.classList.toggle('visible', isCurrentlyPassword);
      togglePasswordBtn.setAttribute('aria-pressed', isCurrentlyPassword ? 'true' : 'false');
      togglePasswordBtn.setAttribute('aria-label', isCurrentlyPassword ? 'Hide password' : 'Show password');
      
      // Keep focus on input for seamless typing experience
      passwordInput.focus();
    });
  }

  /**
   * Helper: Show Banner Message
   */
  function showStatusMessage(type, message) {
    statusMessage.className = `status-banner ${type}`;
    statusMessage.textContent = message;
    statusMessage.hidden = false;
  }

  function hideStatusMessage() {
    statusMessage.hidden = true;
    statusMessage.textContent = '';
  }

  /**
   * Form Validation Helpers
   */
  function validateEmail(value) {
    // Standard RFC5322-compliant simple email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value.trim());
  }

  function clearError(groupElement, inputElement) {
    groupElement.classList.remove('has-error');
    inputElement.removeAttribute('aria-invalid');
  }

  function setError(groupElement, inputElement, messageId) {
    groupElement.classList.add('has-error');
    inputElement.setAttribute('aria-invalid', 'true');
  }

  // Clear errors on user input
  emailInput.addEventListener('input', () => {
    if (groupEmail.classList.contains('has-error')) {
      if (validateEmail(emailInput.value)) {
        clearError(groupEmail, emailInput);
      }
    }
  });

  passwordInput.addEventListener('input', () => {
    if (groupPassword.classList.contains('has-error')) {
      if (passwordInput.value.trim().length > 0) {
        clearError(groupPassword, passwordInput);
      }
    }
  });

  // Sync aria-invalid with CSS :user-invalid state for accessibility
  const syncAriaInvalid = (el) => {
    if (el.matches(':user-invalid')) {
      el.setAttribute('aria-invalid', 'true');
    }
  };
  document.addEventListener('blur', (e) => {
    if (e.target.matches && e.target.matches('.form-input')) {
      syncAriaInvalid(e.target);
    }
  }, true);

  /**
   * Form Submission Handler
   */
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    hideStatusMessage();

    let isValid = true;
    let firstInvalidInput = null;

    // Validate Email
    if (!validateEmail(emailInput.value)) {
      setError(groupEmail, emailInput, 'email-error');
      isValid = false;
      firstInvalidInput = emailInput;
    } else {
      clearError(groupEmail, emailInput);
    }

    // Validate Password
    if (!passwordInput.value.trim()) {
      setError(groupPassword, passwordInput, 'password-error');
      isValid = false;
      if (!firstInvalidInput) {
        firstInvalidInput = passwordInput;
      }
    } else {
      clearError(groupPassword, passwordInput);
    }

    if (!isValid) {
      if (firstInvalidInput) {
        firstInvalidInput.focus();
      }
      return;
    }

    // Simulate login interaction state without redirecting
    const activeRole = userRoleInput.value;
    const roleLabel = roleConfig[activeRole].title;
    const btnText = loginButton.querySelector('.btn-text');

    loginButton.classList.add('is-loading');
    if (btnText) btnText.textContent = 'Signing in...';

    setTimeout(() => {
      loginButton.classList.remove('is-loading');
      if (btnText) btnText.textContent = roleConfig[activeRole].submitText;
      showStatusMessage('success', `Signed in successfully as ${roleLabel}! (Demo Mode)`);
    }, 600);
  });

  // Initial setup for default role
  setRole('customer');
});
