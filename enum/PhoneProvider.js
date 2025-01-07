/**
 * Enum for phone providers
 */
const PHONE_PROVIDER = Object.freeze({
  VIETNAM: {
    VIETTEL: "Viettel",
    VIETNAMOBILE: "Vietnamobile",
    WINTEL: "Wintel",
    MOBIFONE: "Mobifone",
    VNSKY: "VNSKY",
    VINAPHONE: "Vinaphone",
  },
  USA: {
    VERIZON: "Verizon",
    ATT: "AT&T",
    TMOBILE: "T-Mobile",
    SPRINT: "Sprint",
  },
  // Add more countries and providers as needed
});

module.exports = { PHONE_PROVIDER };