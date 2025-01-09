// FILE: enum/Error.test.js
const { USER_NOT_FOUND, userNotFoundError, OtpSecretError, OTP_SECRET_ERROR, SOCKET_NOT_INITIALIZED, SOCKET_AUTH_ERROR, socketAuthError } = require("./Error");

describe("Error Constants and Instances", () => {
  test("should have USER_NOT_FOUND constant", () => {
    expect(USER_NOT_FOUND).toBe("User not found");
  });

  test("should have userNotFoundError instance", () => {
    expect(userNotFoundError).toBeInstanceOf(Error);
    expect(userNotFoundError.message).toBe(USER_NOT_FOUND);
  });

  test("should have OTP_SECRET_ERROR constant", () => {
    expect(OTP_SECRET_ERROR).toBe("Missing or invalid OTP secret");
  });

  test("should have OtpSecretError instance", () => {
    expect(OtpSecretError).toBeInstanceOf(Error);
    expect(OtpSecretError.message).toBe(OTP_SECRET_ERROR);
  });

  test("should have SOCKET_NOT_INITIALIZED constant", () => {
    expect(SOCKET_NOT_INITIALIZED).toBe("Socket.io server not initialized");
  });

  test("should have SOCKET_AUTH_ERROR constant", () => {
    expect(SOCKET_AUTH_ERROR).toBe("Socket authentication error");
  });

  test("should have socketAuthError instance", () => {
    expect(socketAuthError).toBeInstanceOf(Error);
    expect(socketAuthError.message).toBe(SOCKET_AUTH_ERROR);
  });
});
