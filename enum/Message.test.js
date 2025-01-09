// FILE: enum/Message.test.js
const { SOCKET_INITIALIZED } = require("./Message");

describe("Message Constants", () => {
  test("should have SOCKET_INITIALIZED message", () => {
    expect(SOCKET_INITIALIZED).toBe("Socket.io server initialized");
  });
});
