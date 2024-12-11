export function validatePersonalId(personalId) {
  const personalIdRegex = /^(19|20)?[0-9]{6}[- ]?[0-9]{4}$/;

  if (!personalIdRegex.test(personalId.value)) {
    return "Personnummer format: ÅÅÅÅMMDDXXXX";
  }
  return null;
}

export function validateGdpr(gdpr) {
  if (!gdpr.checked) {
    return "Godkänn behandling av personuppgifter";
  }
  return null;
}
