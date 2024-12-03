export function validateForm(formData) {
  const errors = {};

  const fname = formData.get("fname");
  const lname = formData.get("lname");

  // Validate first name
  if (validateName(fname) != null) {
    errors.fname = validateName(fname);
  }

  // Validate last name
  if (validateName(lname) != null) {
    errors.lname = validateName(lname);
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
    //if no input or only whitespaces
    return "Namn obligatoriskt.";
  } else if (name.length < 2) {
    return "Namnet måste vara minst 2 tecken långt.";
  } else if (name.length > 50) {
    return "Namnet får vara högst 50 tecken långt.";
  } else if (!/^[a-öA-Ö\s-]+$/.test(name)) {
    // allows letters A-Ö, spaces, and -
    return "Namnet får endast innehålla bokstäver, mellanslag och bindestreck.";
  }
  return null;
}
