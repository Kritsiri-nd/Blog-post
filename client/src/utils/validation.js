// Validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateRequired = (value) => {
  return value.trim().length > 0;
};

export const validateUsername = (username) => {
  // Username should be at least 3 characters and contain only letters, numbers, and underscores
  const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
  return usernameRegex.test(username);
};

// Form validation functions
export const validateSignUpForm = (formData) => {
  const errors = {};

  // Name validation
  if (!validateRequired(formData.name)) {
    errors.name = "Name is required";
  }

  // Username validation
  if (!validateRequired(formData.username)) {
    errors.username = "Username is required";
  } else if (!validateUsername(formData.username)) {
    errors.username = "Username must be at least 3 characters and contain only letters, numbers, and underscores";
  }

  // Email validation
  if (!validateRequired(formData.email)) {
    errors.email = "Email is required";
  } else if (!validateEmail(formData.email)) {
    errors.email = "Email must be a valid email";
  }

  // Password validation
  if (!validateRequired(formData.password)) {
    errors.password = "Password is required";
  } else if (!validatePassword(formData.password)) {
    errors.password = "Password must be at least 6 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateSignInForm = (formData) => {
  const errors = {};

  // Email validation
  if (!validateRequired(formData.email)) {
    errors.email = "Email is required";
  } else if (!validateEmail(formData.email)) {
    errors.email = "Email must be a valid email";
  }

  // Password validation
  if (!validateRequired(formData.password)) {
    errors.password = "Password is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
