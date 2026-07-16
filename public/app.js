const form = document.getElementById('settings-form');
const emailInput = document.getElementById('email');
const intervalInput = document.getElementById('interval');
const digestInput = document.getElementById('digest');
const statusNode = document.getElementById('form-status');
const emailError = document.getElementById('email-error');
const intervalError = document.getElementById('interval-error');

function normalizeSettings(input = {}) {
  return {
    email: String(input.email || '').trim(),
    interval: String(input.interval || '').trim(),
    digest: Boolean(input.digest)
  };
}

function validateSettings(input = {}) {
  const values = normalizeSettings(input);
  const errors = {};

  if (!values.email) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!values.interval) {
    errors.interval = 'Choose a delivery interval.';
  } else if (!['daily', 'weekly', 'monthly'].includes(values.interval)) {
    errors.interval = 'Choose a supported delivery interval.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    values
  };
}

function renderErrors(errors) {
  emailError.textContent = errors.email || '';
  intervalError.textContent = errors.interval || '';
}

function clearErrors() {
  renderErrors({});
  statusNode.textContent = '';
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  clearErrors();

  const { isValid, errors } = validateSettings({
    email: emailInput.value,
    interval: intervalInput.value,
    digest: digestInput.checked
  });

  if (!isValid) {
    renderErrors(errors);
    statusNode.textContent = 'Please fix the highlighted issues.';
    return;
  }

  statusNode.textContent = 'Settings saved successfully.';
});
