const { LOCALE } = require("#enum/Locale.js");
const { log } = require("./Logger");

const getE164Phone = (phone, locale = LOCALE.VIETNAM) => {
  switch (locale) {
    case LOCALE.VIETNAM:
      return `+84${phone.slice(1)}`;

    case LOCALE.UNITED_STATES:
      return `+1${phone}`;

    default:
      log(`Unsupported locale ${locale} while converting ${phone} to E.164`, "WARN", "Validator");
      return phone;
  }
};

/**
 * This function gets the country name from the country code
 * @example
 * getCountry("vi-VN") // -> "Vietnam"
 *
 * @param {string} countryCode
 * @returns
 */
const getCountry = (countryCode) => {
  return Object.keys(LOCALE).find((key) => LOCALE[key] === countryCode);
};

/**
 * This function gets the country code from the country name
 * @example
 * getCountryCode("Vietnam") // -> "vi-VN"
 * @param {string} country
 * @returns {string|null}
 */
const getCountryCode = (country) => {
  const countryCode = LOCALE[country.toUpperCase().replace(/\s+/g, '_')];
  if (countryCode) {
    return countryCode;
  } else {
    return null;
  }
};


module.exports = {
  getE164Phone,
  getCountry,
  getCountryCode,
};
