const ENV = require("./Env");

describe('ENV Config', () => {
  describe('cors', () => {
    test('should have default origin', () => {
      expect(ENV.cors.origin).toBe('http://localhost:3000');
    });
  });

  describe('port', () => {
    test('should have default port', () => {
      expect(ENV.port).toBe(8000);
    });
  });

  describe('dir', () => {
    test('should have default logs directory', () => {
      expect(ENV.dir.logs).toBe('logs');
    });

    test('should have default media directory', () => {
      expect(ENV.dir.media).toBe('media');
    });
  });

  describe('db', () => {
    test('should have default db host', () => {
      expect(ENV.db.host).toBe('localhost');
    });

    test('should have default db port', () => {
      expect(ENV.db.port).toBe(27017);
    });

    test('should have default db user', () => {
      expect(ENV.db.user).toBe('root');
    });

    test('should have default db password', () => {
      expect(ENV.db.password).toBe('password');
    });

    test('should have default db database', () => {
      expect(ENV.db.database).toBe('wordle');
    });
  });

  describe('logger', () => {
    test('should have default logger level', () => {
      expect(ENV.logger.level).toBe('DEBUG');
    });
  });

  describe('rateLimiter', () => {
    test('should have default rate limiter windowMs', () => {
      expect(ENV.rateLimiter.windowMs).toBe(60000);
    });

    test('should have default rate limiter max', () => {
      expect(ENV.rateLimiter.max).toBe(10000);
    });
  });

  describe('jwt', () => {
    test('should have default jwt secret', () => {
      expect(ENV.jwt.secret).toBe('secret');
    });

    test('should have default jwt expiresIn', () => {
      expect(ENV.jwt.expiresIn).toBe('1h');
    });

    test('should have default jwt issuer', () => {
      expect(ENV.jwt.issuer).toBe('wordle');
    });

    test('should have default jwt refreshExpiresIn', () => {
      expect(ENV.jwt.refreshExpiresIn).toBe('1d');
    });
  });

  describe('otp', () => {
    test('should have default otp length', () => {
      expect(ENV.otp.length).toBe(6);
    });

    test('should have default otp expiresIn', () => {
      expect(ENV.otp.expiresIn).toBe(300);
    });
  });

  describe('totp', () => {
    test('should have default totp secret', () => {
      expect(ENV.totp.secret).toBe('totpSecret');
    });
  });

  describe('mailer', () => {
    test('should have undefined mailer fromEmail', () => {
      expect(ENV.mailer.fromEmail).toBeUndefined();
    });

    test('should have undefined mailer fromName', () => {
      expect(ENV.mailer.fromName).toBeUndefined();
    });

    test('should have undefined mailer replyTo', () => {
      expect(ENV.mailer.replyTo).toBeUndefined();
    });
  });

  describe('smtp', () => {
    test('should have undefined smtp host', () => {
      expect(ENV.smtp.host).toBeUndefined();
    });

    test('should have undefined smtp port', () => {
      expect(ENV.smtp.port).toBeUndefined();
    });

    test('should have undefined smtp secure', () => {
      expect(ENV.smtp.secure).toBeUndefined();
    });

    test('should have undefined smtp user', () => {
      expect(ENV.smtp.user).toBeUndefined();
    });

    test('should have undefined smtp pass', () => {
      expect(ENV.smtp.pass).toBeUndefined();
    });
  });

  test('should be frozen', () => {
    expect(Object.isFrozen(ENV)).toBe(true);
  });
});