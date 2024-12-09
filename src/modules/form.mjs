export function validateForm(formData) {
  const errors = {};

  // Form fields and their validator functions
  const fieldsToValidate = {
    fname: validateName,
    lname: validateName,
    street: validateStreetName,
    zip: validateZipCode,
    city: validateCityName,
    entrycode: validateEntryCode,
    phone: validatePhone,
    email: validateEmail,
  };

  //
  for (const [field, validator] of Object.entries(fieldsToValidate)) {
    const formInput = formData.get(field);
    const error = validator(formInput);
    if (error) {
      errors[field] = error;
    }
  }

  return errors;
}

//----------------------------------------------------
/**
 * Validates name and returns error message
 * @param {String} name
 * @returns {String|null} Error message or null if valid
 */

function validateName(name) {
  if (!name || name.trim() === "") {
    //If no input or only whitespaces
    return "Namn obligatoriskt.";
  } else if (name.length < 2) {
    return "Namnet måste vara minst 2 tecken långt.";
  } else if (name.length > 50) {
    return "Namnet får vara högst 50 tecken långt.";
  } else if (!/^[a-öA-Ö\s-]+$/.test(name)) {
    // Allows letters A-Ö, spaces, and -
    return "Namnet får endast innehålla bokstäver, mellanslag och bindestreck.";
  }
  return null; // No errors
}

//----------------------------------------------------
/**
 *
 * @param {String} street
 * @returns {String|null} Error message or null if valid
 */

function validateStreetName(street) {
  if (!street || street.trim() === "") {
    return "Gatunamnet är obligatoriskt."; // Street name is required
  } else if (street.length < 3) {
    return "Gatunamnet måste vara minst 3 tecken långt.";
  } else if (street.length > 100) {
    return "Gatunamnet får vara högst 100 tecken långt.";
  } else if (!/^[a-öA-Ö0-9\s'-]+$/.test(street)) {
    // Allows letters A-Ö, numbers, spaces, ' and -
    return "Gatunamnet får endast innehålla bokstäver, siffror, mellanslag, bindestreck och apostrofer.";
  }
  return null; // No errors
}

/**
 *
 * @param {String} zipCode
 * @returns {String|null} Error message or null if valid
 */

function validateZipCode(zipCode) {
  if (!zipCode || zipCode.trim() === "") {
    return "Postnumret är obligatoriskt.";
  } else if (!/^\d{5}$/.test(zipCode)) {
    // Matches exactly 5 digits
    return "Postnumret måste bestå av exakt 5 siffror.";
  }
  return null; // No errors
}

function validateCityName(city) {
  if (!city || city.trim() === "") {
    return "Ort obligatoriskt.";
  } else if (city.length < 2) {
    return "Ort måste vara minst 2 tecken långt.";
  } else if (city.length > 50) {
    return "Ort får vara högst 50 tecken långt.";
  } else if (!/^[a-öA-Ö\s-]+$/.test(city)) {
    // Allows letters A-Ö, spaces, and hyphens
    return "Ort får endast innehålla bokstäver, mellanslag och bindestreck.";
  }
  return null; // No errors
}

function validateEntryCode(entryCode) {
  if (!/^[0-9*#]*$/.test(entryCode)) {
    // Allows empty(field not required) numbers, * and #
    return "Portkod får endast innehålla siffror, * och #";
  }
  return null;
}

function validatePhone(phone) {
  if (!phone || phone.trim() === "") {
    return "Telefon obligatoriskt.";
  } else if (
    !/^\+?([0-9]{1,3})?[-. ]?(\(?[0-9]{1,4}\)?)?[-. ]?([0-9]{1,4})[-. ]?([0-9]{1,4})[-. ]?([0-9]{1,9})$/.test(
      phone
    ) // Allows international phonenumber with +, allwos user to split number with: - . space
  ) {
    return "Telefonnummer ogiltigt format";
  }
  return null;
}

function validateEmail(email) {
  if (!email || email.trim() === "") {
    return "Email obligatorisk";
  } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    return "Email ogiltigt format";
  }
  return null;
}
