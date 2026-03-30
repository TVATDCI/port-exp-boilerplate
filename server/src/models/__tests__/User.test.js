import mongoose from 'mongoose';
import User from '../models/User.js';

describe('User Model', () => {
  beforeAll(async () => {
    // Connect to in-memory MongoDB
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    // Clear collection before each test
    await User.deleteMany({});
  });

  describe('Password Hashing', () => {
    it('should hash password before saving', async () => {
      const user = await User.create({
        email: 'test@example.com',
        password: 'Password123',
      });

      expect(user.password).not.toBe('Password123');
      expect(user.password).toHaveLength(60); // bcrypt hash length
    });

    it('should not rehash password if not modified', async () => {
      const user = await User.create({
        email: 'test@example.com',
        password: 'Password123',
      });

      const originalHash = user.password;
      user.email = 'updated@example.com';
      await user.save();

      expect(user.password).toBe(originalHash);
    });
  });

  describe('Password Comparison', () => {
    it('should return true for correct password', async () => {
      const user = await User.create({
        email: 'test@example.com',
        password: 'Password123',
      });

      const isMatch = await user.correctPassword('Password123', user.password);
      expect(isMatch).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const user = await User.create({
        email: 'test@example.com',
        password: 'Password123',
      });

      const isMatch = await user.correctPassword('WrongPassword', user.password);
      expect(isMatch).toBe(false);
    });
  });

  describe('Validation', () => {
    it('should require email', async () => {
      await expect(User.create({ password: 'Password123' })).rejects.toThrow();
    });

    it('should require password', async () => {
      await expect(User.create({ email: 'test@example.com' })).rejects.toThrow();
    });

    it('should require minimum password length', async () => {
      await expect(User.create({ email: 'test@example.com', password: 'short' })).rejects.toThrow();
    });

    it('should create user with valid data', async () => {
      const user = await User.create({
        email: 'test@example.com',
        password: 'Password123',
      });

      expect(user.email).toBe('test@example.com');
      expect(user.role).toBe('user');
    });

    it('should store email in lowercase', async () => {
      const user = await User.create({
        email: 'TEST@EXAMPLE.COM',
        password: 'Password123',
      });

      expect(user.email).toBe('test@example.com');
    });
  });

  describe('Role Management', () => {
    it('should default role to user', async () => {
      const user = await User.create({
        email: 'test@example.com',
        password: 'Password123',
      });

      expect(user.role).toBe('user');
    });

    it('should allow admin role', async () => {
      const user = await User.create({
        email: 'admin@example.com',
        password: 'Password123',
        role: 'admin',
      });

      expect(user.role).toBe('admin');
    });

    it('should reject invalid roles', async () => {
      await expect(
        User.create({
          email: 'test@example.com',
          password: 'Password123',
          role: 'superadmin',
        })
      ).rejects.toThrow();
    });
  });
});
