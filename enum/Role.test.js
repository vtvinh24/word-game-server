const { ROLE } = require("./Role");

// FILE: enum/Role.test.js

describe("ROLE Enum", () => {
  test("should have PLAYER role", () => {
    expect(ROLE.PLAYER).toBe("PLAYER");
  });

  test("should have MANAGER role", () => {
    expect(ROLE.MANAGER).toBe("MANAGER");
  });

  test("should have SUPPORT role", () => {
    expect(ROLE.SUPPORT).toBe("SUPPORT");
  });

  test("should have ADMIN role", () => {
    expect(ROLE.ADMIN).toBe("ADMIN");
  });

  test("should be frozen", () => {
    expect(Object.isFrozen(ROLE)).toBe(true);
  });
});
