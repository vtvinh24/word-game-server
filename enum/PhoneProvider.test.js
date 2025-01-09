// FILE: enum/PhoneProvider.test.js
const { PHONE_PROVIDER } = require("./PhoneProvider");

describe("PHONE_PROVIDER Enum", () => {
  describe("VIETNAM", () => {
    test("should have VIETTEL provider", () => {
      expect(PHONE_PROVIDER.VIETNAM.VIETTEL).toBe("Viettel");
    });

    test("should have VIETNAMOBILE provider", () => {
      expect(PHONE_PROVIDER.VIETNAM.VIETNAMOBILE).toBe("Vietnamobile");
    });

    test("should have WINTEL provider", () => {
      expect(PHONE_PROVIDER.VIETNAM.WINTEL).toBe("Wintel");
    });

    test("should have MOBIFONE provider", () => {
      expect(PHONE_PROVIDER.VIETNAM.MOBIFONE).toBe("Mobifone");
    });

    test("should have VNSKY provider", () => {
      expect(PHONE_PROVIDER.VIETNAM.VNSKY).toBe("VNSKY");
    });

    test("should have VINAPHONE provider", () => {
      expect(PHONE_PROVIDER.VIETNAM.VINAPHONE).toBe("Vinaphone");
    });
  });

  describe("USA", () => {
    test("should have VERIZON provider", () => {
      expect(PHONE_PROVIDER.USA.VERIZON).toBe("Verizon");
    });

    test("should have ATT provider", () => {
      expect(PHONE_PROVIDER.USA.ATT).toBe("AT&T");
    });

    test("should have TMOBILE provider", () => {
      expect(PHONE_PROVIDER.USA.TMOBILE).toBe("T-Mobile");
    });

    test("should have SPRINT provider", () => {
      expect(PHONE_PROVIDER.USA.SPRINT).toBe("Sprint");
    });
  });

  test("should be frozen", () => {
    expect(Object.isFrozen(PHONE_PROVIDER)).toBe(true);
  });
});
