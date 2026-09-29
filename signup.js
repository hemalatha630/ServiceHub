/**
 * ServiceHub - Customer Sign Up Logic
 * Handles Form Validation, Password Visibility Toggles,
 * Password Matching, and Registration Success with Auto-Redirect.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const signupForm = document.getElementById('signup-form');
  const formContainer = document.getElementById('form-container');
  const successView = document.getElementById('success-view');
  const registeredUserName = document.getElementById('registered-user-name');
  const redirectCountdown = document.getElementById('redirect-countdown');
  const createAccountBtn = document.getElementById('create-account-button');

  // Input Elements
  const fullnameInput = document.getElementById('fullname');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');

  // Input Group Containers
  const groupFullname = document.getElementById('group-fullname');
  const groupEmail = document.getElementById('group-email');
  const groupPhone = document.getElementById('group-phone');
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
   * Validation Helper Functions
   */
  function validateFullName(value) {
    return value.trim().length >= 2;
  }

  function validateEmail(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value.trim());
  }

  function validatePhone(value) {
    // Allows optional +, digits, spaces, hyphens, parentheses (7 to 15 digits total)
    const digitsOnly = value.replace(/\D/g, '');
    return digitsOnly.length >= 7 && digitsOnly.length <= 15;
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
  fullnameInput.addEventListener('input', () => {
    if (groupFullname.classList.contains('has-error') && validateFullName(fullnameInput.value)) {
      clearError(groupFullname, fullnameInput);
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

  passwordInput.addEventListener('input', () => {
    if (groupPassword.classList.contains('has-error') && validatePassword(passwordInput.value)) {
      clearError(groupPassword, passwordInput);
    }
    // Re-validate confirm password if it already has value
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
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    let firstInvalidInput = null;

    // 1. Full Name
    if (!validateFullName(fullnameInput.value)) {
      setError(groupFullname, fullnameInput);
      isValid = false;
      firstInvalidInput = firstInvalidInput || fullnameInput;
    } else {
      clearError(groupFullname, fullnameInput);
    }

    // 2. Email
    if (!validateEmail(emailInput.value)) {
      setError(groupEmail, emailInput);
      isValid = false;
      firstInvalidInput = firstInvalidInput || emailInput;
    } else {
      clearError(groupEmail, emailInput);
    }

    // 3. Phone
    if (!validatePhone(phoneInput.value)) {
      setError(groupPhone, phoneInput);
      isValid = false;
      firstInvalidInput = firstInvalidInput || phoneInput;
    } else {
      clearError(groupPhone, phoneInput);
    }

    // 4. Password
    if (!validatePassword(passwordInput.value)) {
      setError(groupPassword, passwordInput);
      isValid = false;
      firstInvalidInput = firstInvalidInput || passwordInput;
    } else {
      clearError(groupPassword, passwordInput);
    }

    // 5. Confirm Password
    if (!validateConfirmPassword(passwordInput.value, confirmPasswordInput.value)) {
      setError(groupConfirmPassword, confirmPasswordInput);
      isValid = false;
      firstInvalidInput = firstInvalidInput || confirmPasswordInput;
    } else {
      clearError(groupConfirmPassword, confirmPasswordInput);
    }

    // If validation fails, focus the first error field
    if (!isValid) {
      if (firstInvalidInput) {
        firstInvalidInput.focus();
      }
      return;
    }

    // Simulate Registration Flow
    const btnText = createAccountBtn.querySelector('.btn-text');
    createAccountBtn.classList.add('is-loading');
    if (btnText) btnText.textContent = 'Creating Account...';

    setTimeout(() => {
      // Hide form and display success view
      formContainer.hidden = true;
      successView.hidden = false;

      const firstName = fullnameInput.value.trim().split(' ')[0] || 'there';
      registeredUserName.textContent = firstName;

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
