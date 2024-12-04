export function validateForm(formData) {
  const errors = {};

  const fname = formData.get("fname");
  const lname = formData.get("lname");
  const street = formData.get("street");
  const zip = formData.get("zip");
  const city = formData.get("city");

  // TODO - Fix code repeat

  // Validate first name
  if (validateName(fname) != null) {
    errors.fname = validateName(fname);
  }

  // Validate last name
  if (validateName(lname) != null) {
    errors.lname = validateName(lname);
  }

  // Validate street name
  if (validateStreetName(street) != null) {
    errors.street = validateStreetName(street);
  }

  //Validate zipcode
  if (validateZipCode(zip) != null) {
    errors.zip = validateZipCode(zip);
  }

  //Validate city
  if (validateCityName(city) != null) {
    errors.city = validateCityName(city);
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
