// TODO - Add helper functions here

export function prettyDate(date) {
  return `${date.getFullYear()}-${padString(date.getMonth() + 1)}-${padString(
    date.getDate()
  )}`;
}

export function padString(number) {
  return String(number).padStart(2, "0");
}

export function calculateProductPrice(product) {
  return (product.amount * product.price).toFixed(2);
}

export function calculateProductPriceDiscount(product) {
  return (
    product.amount * product.originalPrice -
    product.amount * product.price
  ).toFixed(2);
}

export function calculateProductOriginalPrice(product) {
  return (product.amount * product.originalPrice).toFixed(2);
}
