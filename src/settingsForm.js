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

module.exports = {
  normalizeSettings,
  validateSettings
};
