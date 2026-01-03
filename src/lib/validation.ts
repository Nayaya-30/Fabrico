import { ValidationError } from '@/types'

// Email validation
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Phone validation (supports international formats)
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

// ZIP code validation (US format)
export function validateZipCode(zip: string): boolean {
  const zipRegex = /^\d{5}(-\d{4})?$/
  return zipRegex.test(zip)
}

// Required field validation
export function validateRequired(value: string, fieldName: string): ValidationError | null {
  if (!value || value.trim().length === 0) {
    return {
      field: fieldName,
      message: `${fieldName} is required`
    }
  }
  return null
}

// Min length validation
export function validateMinLength(
  value: string,
  minLength: number,
  fieldName: string
): ValidationError | null {
  if (value.trim().length < minLength) {
    return {
      field: fieldName,
      message: `${fieldName} must be at least ${minLength} characters`
    }
  }
  return null
}

// Max length validation
export function validateMaxLength(
  value: string,
  maxLength: number,
  fieldName: string
): ValidationError | null {
  if (value.length > maxLength) {
    return {
      field: fieldName,
      message: `${fieldName} must be no more than ${maxLength} characters`
    }
  }
  return null
}

// Date validation (must be in the past)
export function validatePastDate(dateString: string, fieldName: string): ValidationError | null {
  const date = new Date(dateString)
  const today = new Date()
  
  if (date > today) {
    return {
      field: fieldName,
      message: `${fieldName} must be in the past`
    }
  }
  return null
}

// Age validation
export function validateAge(
  dateOfBirth: string,
  minAge: number,
  maxAge: number
): ValidationError | null {
  const birthDate = new Date(dateOfBirth)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  if (age < minAge || age > maxAge) {
    return {
      field: 'dateOfBirth',
      message: `Age must be between ${minAge} and ${maxAge} years`
    }
  }
  return null
}

// Contact form validation
export function validateContactForm(data: {
  name: string
  email: string
  phone?: string
  message: string
}): ValidationError[] {
  const errors: ValidationError[] = []

  // Name validation
  const nameError = validateRequired(data.name, 'Name')
  if (nameError) errors.push(nameError)

  // Email validation
  const emailRequiredError = validateRequired(data.email, 'Email')
  if (emailRequiredError) {
    errors.push(emailRequiredError)
  } else if (!validateEmail(data.email)) {
    errors.push({ field: 'email', message: 'Invalid email address' })
  }

  // Phone validation (optional)
  if (data.phone && !validatePhone(data.phone)) {
    errors.push({ field: 'phone', message: 'Invalid phone number' })
  }

  // Message validation
  const messageError = validateRequired(data.message, 'Message')
  if (messageError) {
    errors.push(messageError)
  } else {
    const minLengthError = validateMinLength(data.message, 10, 'Message')
    if (minLengthError) errors.push(minLengthError)
  }

  return errors
}

// Newsletter form validation
export function validateNewsletterForm(data: {
  email: string
  name?: string
}): ValidationError[] {
  const errors: ValidationError[] = []

  const emailRequiredError = validateRequired(data.email, 'Email')
  if (emailRequiredError) {
    errors.push(emailRequiredError)
  } else if (!validateEmail(data.email)) {
    errors.push({ field: 'email', message: 'Invalid email address' })
  }

  return errors
}

// Admission form validation
export function validateAdmissionForm(data: any, step: number): ValidationError[] {
  const errors: ValidationError[] = []

  if (step === 1) {
    // Student info validation
    if (!data.studentFirstName) errors.push(validateRequired(data.studentFirstName, 'Student First Name')!)
    if (!data.studentLastName) errors.push(validateRequired(data.studentLastName, 'Student Last Name')!)
    if (!data.dateOfBirth) errors.push(validateRequired(data.dateOfBirth, 'Date of Birth')!)
    if (!data.gender) errors.push(validateRequired(data.gender, 'Gender')!)
    if (!data.gradeApplying) errors.push(validateRequired(data.gradeApplying, 'Grade Applying')!)
  }

  if (step === 2) {
    // Parent info validation
    if (!data.parentFirstName) errors.push(validateRequired(data.parentFirstName, 'Parent First Name')!)
    if (!data.parentLastName) errors.push(validateRequired(data.parentLastName, 'Parent Last Name')!)
    
    if (!data.email) {
      errors.push(validateRequired(data.email, 'Email')!)
    } else if (!validateEmail(data.email)) {
      errors.push({ field: 'email', message: 'Invalid email address' })
    }
    
    if (!data.phone) {
      errors.push(validateRequired(data.phone, 'Phone')!)
    } else if (!validatePhone(data.phone)) {
      errors.push({ field: 'phone', message: 'Invalid phone number' })
    }
    
    if (!data.address) errors.push(validateRequired(data.address, 'Address')!)
    if (!data.city) errors.push(validateRequired(data.city, 'City')!)
    if (!data.state) errors.push(validateRequired(data.state, 'State')!)
    
    if (!data.zipCode) {
      errors.push(validateRequired(data.zipCode, 'ZIP Code')!)
    } else if (!validateZipCode(data.zipCode)) {
      errors.push({ field: 'zipCode', message: 'Invalid ZIP code' })
    }
  }

  return errors.filter(Boolean)
}