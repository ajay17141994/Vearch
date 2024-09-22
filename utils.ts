  // Basic IBAN validation
  export const validateIban = (iban: string): boolean => {
    const ibanRegex = /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/;
    return ibanRegex.test(iban);
  };