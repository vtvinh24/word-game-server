// FILE: enum/Locale.test.js
const { LOCALE } = require("./Locale");

describe("LOCALE Enum", () => {
  test("should have VIETNAM locale", () => {
    expect(LOCALE.VIETNAM).toBe("vi-VN");
  });

  test("should have UNITED_STATES locale", () => {
    expect(LOCALE.UNITED_STATES).toBe("en-US");
  });

  test("should have CHINA locale", () => {
    expect(LOCALE.CHINA).toBe("zh-CN");
  });

  test("should have JAPAN locale", () => {
    expect(LOCALE.JAPAN).toBe("ja-JP");
  });

  test("should have SOUTH_KOREA locale", () => {
    expect(LOCALE.SOUTH_KOREA).toBe("ko-KR");
  });

  test("should have THAILAND locale", () => {
    expect(LOCALE.THAILAND).toBe("th-TH");
  });

  test("should have INDONESIA locale", () => {
    expect(LOCALE.INDONESIA).toBe("id-ID");
  });

  test("should be frozen", () => {
    expect(Object.isFrozen(LOCALE)).toBe(true);
  });
});
