const acceptDisclaimerKey = "acceptedDisclaimer";

export const needsToAcceptDisclaimer = async () => {
  return !localStorage.getItem(acceptDisclaimerKey);
};

export const saveAcceptedDisclaimer = async () => {
  return localStorage.setItem(acceptDisclaimerKey, true);
};

export const clearAcceptedDisclaimer = async () => {
  return localStorage.removeItem(acceptDisclaimerKey);
};
