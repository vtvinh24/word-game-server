// FILE: enum/HttpStatus.test.js
const { CUSTOM_HTTP_STATUS } = require("./HttpStatus");

describe("CUSTOM_HTTP_STATUS Enum", () => {
  describe("JWT Token", () => {
    test("should have AUTH_TOKEN_EXPIRED status", () => {
      expect(CUSTOM_HTTP_STATUS.AUTH_TOKEN_EXPIRED).toEqual({
        code: 401,
        message: "token expired",
      });
    });

    test("should have AUTH_TOKEN_INVALID status", () => {
      expect(CUSTOM_HTTP_STATUS.AUTH_TOKEN_INVALID).toEqual({
        code: 401,
        message: "invalid token",
      });
    });
  });

  describe("Generic authentication", () => {
    test("should have AUTH_CREDENTIALS_INVALID status", () => {
      expect(CUSTOM_HTTP_STATUS.AUTH_CREDENTIALS_INVALID).toEqual({
        code: 400,
        message: "invalid credentials",
      });
    });

    test("should have AUTH_INFO_TAKEN status", () => {
      expect(CUSTOM_HTTP_STATUS.AUTH_INFO_TAKEN).toEqual({
        code: 409,
        message: "username, email or phone taken",
      });
    });

    test("should have AUTH_ACCOUNT_LOCKED status", () => {
      expect(CUSTOM_HTTP_STATUS.AUTH_ACCOUNT_LOCKED).toEqual({
        code: 403,
        message: "account locked",
      });
    });

    test("should have AUTH_PASSWORD_TOO_WEAK status", () => {
      expect(CUSTOM_HTTP_STATUS.AUTH_PASSWORD_TOO_WEAK).toEqual({
        code: 400,
        message: "password too weak",
      });
    });
  });

  describe("2FA", () => {
    test("should have AUTH_REQUIRE_2FA status", () => {
      expect(CUSTOM_HTTP_STATUS.AUTH_REQUIRE_2FA).toEqual({
        code: 204,
        message: "two-factor code required",
      });
    });

    test("should have AUTH_2FA_INVALID status", () => {
      expect(CUSTOM_HTTP_STATUS.AUTH_2FA_INVALID).toEqual({
        code: 401,
        message: "invalid two-factor code",
      });
    });

    test("should have AUTH_2FA_DISABLED status", () => {
      expect(CUSTOM_HTTP_STATUS.AUTH_2FA_DISABLED).toEqual({
        code: 403,
        message: "two-factor secret not generated",
      });
    });
  });

  test("should be frozen", () => {
    expect(Object.isFrozen(CUSTOM_HTTP_STATUS)).toBe(true);
  });
});
