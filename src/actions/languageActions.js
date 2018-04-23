import { LANGUAGE_CHANGE, LANGUAGE_CHANGED }
from "../constants";

export const languageChanged = () => ({
  type: LANGUAGE_CHANGED
});

export const languageChange = (language) => ({
  type: LANGUAGE_CHANGE,
  language
});
