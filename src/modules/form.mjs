export function validateForm(e, checkoutForm) {
  e.preventDefault(); //prevents page to reload on submit

  const formData = new FormData(checkoutForm);
  const fname = formData.get("fname");
  const lname = formData.get("lname");

  console.error("First name: " + validateName(fname));
  console.error("Last name: " + validateName(lname));

  console.log(fname);
  console.log(lname);
}

//----------------------------------------------------
/**
 * Validates name and returns error message
 * @param {*} name
 * @returns String with error message
 */

function validateName(name) {
  if (!name || name.trim() === "") {
    //if no input or only whitespaces
    return "Name is required.";
  } else if (name.length < 2) {
    return "Name must be at least 2 characters long.";
  } else if (name.length > 50) {
    return "Name must be less than 50 characters long.";
  } else if (!/^[a-öA-Ö\s'-]+$/.test(name)) {
    // allows letters A-Ö, spaces, ' and -
    return "Name can only include letters, spaces, and hyphens.";
  }
  return null;
}
