export function validateForm(e, checkoutForm) {
  e.preventDefault(); //prevents page to reload on submit

  const formData = new FormData(checkoutForm);
  const fname = formData.get("fname");
  const lname = formData.get("lname");

  if (fname.length < 2) {
    console.error("Firstname is required.");
  }
  if (lname.length < 2) {
    console.error("Lastname is required.");
  }

  console.log(fname);
  console.log(lname);
}
