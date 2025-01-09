// FILE: enum/Fields.test.js
const { ROLE, USER_STATUS, NOTIFICATION_STATUS } = require("./Fields");
const { ROLE: ROLES } = require("./Role");

describe("Fields Enum", () => {
  describe("ROLE Array", () => {
    test("should contain PLAYER role", () => {
      expect(ROLE).toContain(ROLES.PLAYER);
    });

    test("should contain SUPPORT role", () => {
      expect(ROLE).toContain(ROLES.SUPPORT);
    });

    test("should contain MANAGER role", () => {
      expect(ROLE).toContain(ROLES.MANAGER);
    });

    test("should contain ADMIN role", () => {
      expect(ROLE).toContain(ROLES.ADMIN);
    });
  });

  describe("USER_STATUS Array", () => {
    test("should contain REGISTERED status", () => {
      expect(USER_STATUS).toContain("REGISTERED");
    });

    test("should contain ACTIVE status", () => {
      expect(USER_STATUS).toContain("ACTIVE");
    });

    test("should contain INACTIVE status", () => {
      expect(USER_STATUS).toContain("INACTIVE");
    });
  });

  describe("NOTIFICATION_STATUS Array", () => {
    test("should contain SENT status", () => {
      expect(NOTIFICATION_STATUS).toContain("SENT");
    });

    test("should contain SEEN status", () => {
      expect(NOTIFICATION_STATUS).toContain("SEEN");
    });
  });
});
