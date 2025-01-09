// FILE: enum/PhoneCountryCode.test.js
const { PHONE_COUNTRY_CODE } = require("./PhoneCountryCode");

describe("PHONE_COUNTRY_CODE Enum", () => {
  test("should have VIETNAM country code", () => {
    expect(PHONE_COUNTRY_CODE.VIETNAM).toBe("+84");
  });

  test("should have UNITED_STATES country code", () => {
    expect(PHONE_COUNTRY_CODE.UNITED_STATES).toBe("+1");
  });

  test("should have CHINA country code", () => {
    expect(PHONE_COUNTRY_CODE.CHINA).toBe("+86");
  });

  test("should have JAPAN country code", () => {
    expect(PHONE_COUNTRY_CODE.JAPAN).toBe("+81");
  });

  test("should have SOUTH_KOREA country code", () => {
    expect(PHONE_COUNTRY_CODE.SOUTH_KOREA).toBe("+82");
  });

  test("should have THAILAND country code", () => {
    expect(PHONE_COUNTRY_CODE.THAILAND).toBe("+66");
  });

  test("should have INDONESIA country code", () => {
    expect(PHONE_COUNTRY_CODE.INDONESIA).toBe("+62");
  });

  test("should be frozen", () => {
    expect(Object.isFrozen(PHONE_COUNTRY_CODE)).toBe(true);
  });
});
