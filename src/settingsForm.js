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
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    values
  };
}

const exported = { normalizeSettings, validateSettings };

if (typeof module !== 'undefined' && module.exports) {
  module.exports = exported;
}

if (typeof window !== 'undefined') {
  window.validateSettings = validateSettings;
}
