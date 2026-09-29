/**
 * ServiceHub - Merchant Sign Up Logic
 * Handles Form Validation, Category Selection, Real-Time Description Counter,
 * Password Matching, and Registration Success.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const merchantForm = document.getElementById('merchant-form');
  const formContainer = document.getElementById('form-container');
  const successView = document.getElementById('success-view');
  const registeredBusinessName = document.getElementById('registered-business-name');
  const redirectCountdown = document.getElementById('redirect-countdown');
  const createMerchantBtn = document.getElementById('create-merchant-button');

  // Input Elements
  const businessNameInput = document.getElementById('business-name');
  const ownerNameInput = document.getElementById('owner-name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const categorySelect = document.getElementById('category');
  const descriptionTextarea = document.getElementById('description');
  const descriptionCounter = document.getElementById('description-counter');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');

  // Input Group Containers
  const groupBusinessName = document.getElementById('group-business-name');
  const groupOwnerName = document.getElementById('group-owner-name');
  const groupEmail = document.getElementById('group-email');
  const groupPhone = document.getElementById('group-phone');
  const groupCategory = document.getElementById('group-category');
  const groupDescription = document.getElementById('group-description');
  const groupPassword = document.getElementById('group-password');
  const groupConfirmPassword = document.getElementById('group-confirm-password');

  // Toggle Password Buttons
  const togglePasswordBtn = document.getElementById('toggle-password');
  const toggleConfirmPasswordBtn = document.getElementById('toggle-confirm-password');

  /**
   * Helper: Setup Password Visibility Toggle
   */
  function setupPasswordToggle(button, input) {
    if (!button || !input) return;

    button.addEventListener('click', () => {
      const isCurrentlyPassword = input.getAttribute('type') === 'password';
      const newType = isCurrentlyPassword ? 'text' : 'password';

      input.setAttribute('type', newType);
      button.classList.toggle('visible', isCurrentlyPassword);
      button.setAttribute('aria-pressed', isCurrentlyPassword ? 'true' : 'false');
      button.setAttribute('aria-label', isCurrentlyPassword ? 'Hide password' : 'Show password');
      input.focus();
    });
  }

  setupPasswordToggle(togglePasswordBtn, passwordInput);
  setupPasswordToggle(toggleConfirmPasswordBtn, confirmPasswordInput);

  /**
   * Description Character Counter
   */
  if (descriptionTextarea && descriptionCounter) {
    descriptionTextarea.addEventListener('input', () => {
      const currentLength = descriptionTextarea.value.length;
      descriptionCounter.textContent = `${currentLength} / 300`;
      
      if (groupDescription.classList.contains('has-error') && currentLength >= 10) {
        clearError(groupDescription, descriptionTextarea);
      }
    });
  }

  /**
   * Validation Helper Functions
   */
  function validateTextLength(value, min = 2) {
    return value.trim().length >= min;
  }

  function validateEmail(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value.trim());
  }

  function validatePhone(value) {
    const digitsOnly = value.replace(/\D/g, '');
    return digitsOnly.length >= 7 && digitsOnly.length <= 15;
  }

  function validateCategory(value) {
    const validCategories = ['Home', 'Beauty', 'Pet', 'Automotive', 'Education', 'Repair', 'Cleaning', 'Other'];
    return validCategories.includes(value);
  }

  function validatePassword(value) {
    return value.length >= 8;
  }

  function validateConfirmPassword(password, confirmPassword) {
    return confirmPassword.length > 0 && password === confirmPassword;
  }

  function setError(groupElement, inputElement) {
    groupElement.classList.add('has-error');
    inputElement.setAttribute('aria-invalid', 'true');
  }

  function clearError(groupElement, inputElement) {
    groupElement.classList.remove('has-error');
    inputElement.removeAttribute('aria-invalid');
  }

  /**
   * Live Error Clearing on Input
   */
  businessNameInput.addEventListener('input', () => {
    if (groupBusinessName.classList.contains('has-error') && validateTextLength(businessNameInput.value)) {
      clearError(groupBusinessName, businessNameInput);
    }
  });

  ownerNameInput.addEventListener('input', () => {
    if (groupOwnerName.classList.contains('has-error') && validateTextLength(ownerNameInput.value)) {
      clearError(groupOwnerName, ownerNameInput);
    }
  });

  emailInput.addEventListener('input', () => {
    if (groupEmail.classList.contains('has-error') && validateEmail(emailInput.value)) {
      clearError(groupEmail, emailInput);
    }
  });

  phoneInput.addEventListener('input', () => {
    if (groupPhone.classList.contains('has-error') && validatePhone(phoneInput.value)) {
      clearError(groupPhone, phoneInput);
    }
  });

  categorySelect.addEventListener('change', () => {
    if (groupCategory.classList.contains('has-error') && validateCategory(categorySelect.value)) {
      clearError(groupCategory, categorySelect);
    }
  });

  passwordInput.addEventListener('input', () => {
    if (groupPassword.classList.contains('has-error') && validatePassword(passwordInput.value)) {
      clearError(groupPassword, passwordInput);
    }
    if (confirmPasswordInput.value.length > 0 && groupConfirmPassword.classList.contains('has-error')) {
      if (validateConfirmPassword(passwordInput.value, confirmPasswordInput.value)) {
        clearError(groupConfirmPassword, confirmPasswordInput);
      }
    }
  });

  confirmPasswordInput.addEventListener('input', () => {
    if (groupConfirmPassword.classList.contains('has-error')) {
      if (validateConfirmPassword(passwordInput.value, confirmPasswordInput.value)) {
        clearError(groupConfirmPassword, confirmPasswordInput);
      }
    }
  });

  /**
   * Form Submission Handler
   */
  merchantForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    let firstInvalidInput = null;

    // 1. Business Name
    if (!validateTextLength(businessNameInput.value)) {
      setError(groupBusinessName, businessNameInput);
      isValid = false;
      firstInvalidInput = firstInvalidInput || businessNameInput;
    } else {
      clearError(groupBusinessName, businessNameInput);
    }

    // 2. Owner Name
    if (!validateTextLength(ownerNameInput.value)) {
      setError(groupOwnerName, ownerNameInput);
      isValid = false;
      firstInvalidInput = firstInvalidInput || ownerNameInput;
    } else {
      clearError(groupOwnerName, ownerNameInput);
    }

    // 3. Email
    if (!validateEmail(emailInput.value)) {
      setError(groupEmail, emailInput);
      isValid = false;
      firstInvalidInput = firstInvalidInput || emailInput;
    } else {
      clearError(groupEmail, emailInput);
    }

    // 4. Phone
    if (!validatePhone(phoneInput.value)) {
      setError(groupPhone, phoneInput);
      isValid = false;
      firstInvalidInput = firstInvalidInput || phoneInput;
    } else {
      clearError(groupPhone, phoneInput);
    }

    // 5. Category
    if (!validateCategory(categorySelect.value)) {
      setError(groupCategory, categorySelect);
      isValid = false;
      firstInvalidInput = firstInvalidInput || categorySelect;
    } else {
      clearError(groupCategory, categorySelect);
    }

    // 6. Description
    if (!validateTextLength(descriptionTextarea.value, 10)) {
      setError(groupDescription, descriptionTextarea);
      isValid = false;
      firstInvalidInput = firstInvalidInput || descriptionTextarea;
    } else {
      clearError(groupDescription, descriptionTextarea);
    }

    // 7. Password
    if (!validatePassword(passwordInput.value)) {
      setError(groupPassword, passwordInput);
      isValid = false;
      firstInvalidInput = firstInvalidInput || passwordInput;
    } else {
      clearError(groupPassword, passwordInput);
    }

    // 8. Confirm Password
    if (!validateConfirmPassword(passwordInput.value, confirmPasswordInput.value)) {
      setError(groupConfirmPassword, confirmPasswordInput);
      isValid = false;
      firstInvalidInput = firstInvalidInput || confirmPasswordInput;
    } else {
      clearError(groupConfirmPassword, confirmPasswordInput);
    }

    // If validation fails, focus the first invalid field
    if (!isValid) {
      if (firstInvalidInput) {
        firstInvalidInput.focus();
      }
      return;
    }

    // Submit animation & Success flow
    const btnText = createMerchantBtn.querySelector('.btn-text');
    createMerchantBtn.classList.add('is-loading');
    if (btnText) btnText.textContent = 'Registering Merchant...';

    setTimeout(() => {
      formContainer.hidden = true;
      successView.hidden = false;

      const businessName = businessNameInput.value.trim() || 'Partner';
      registeredBusinessName.textContent = businessName;

      // Countdown and Auto-Redirect to Login Page
      let secondsLeft = 3;
      redirectCountdown.textContent = `Redirecting to login in ${secondsLeft} seconds...`;

      const countdownInterval = setInterval(() => {
        secondsLeft -= 1;
        if (secondsLeft > 0) {
          redirectCountdown.textContent = `Redirecting to login in ${secondsLeft} second${secondsLeft === 1 ? '' : 's'}...`;
        } else {
          clearInterval(countdownInterval);
          window.location.href = 'index.html';
        }
      }, 1000);
    }, 700);
  });
});
