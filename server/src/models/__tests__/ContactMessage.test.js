import mongoose from 'mongoose';
import ContactMessage from '../models/ContactMessage.js';

describe('ContactMessage Model', () => {
  beforeAll(async () => {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await ContactMessage.deleteMany({});
  });

  describe('Validation', () => {
    it('should require name', async () => {
      await expect(
        ContactMessage.create({
          email: 'test@example.com',
          message: 'Hello, this is a test message.',
        })
      ).rejects.toThrow();
    });

    it('should require email', async () => {
      await expect(
        ContactMessage.create({
          name: 'Test User',
          message: 'Hello, this is a test message.',
        })
      ).rejects.toThrow();
    });

    it('should require message', async () => {
      await expect(
        ContactMessage.create({
          name: 'Test User',
          email: 'test@example.com',
        })
      ).rejects.toThrow();
    });

    it('should require minimum name length (2)', async () => {
      await expect(
        ContactMessage.create({
          name: 'A',
          email: 'test@example.com',
          message: 'Hello, this is a test message.',
        })
      ).rejects.toThrow();
    });

    it('should require minimum message length (10)', async () => {
      await expect(
        ContactMessage.create({
          name: 'Test User',
          email: 'test@example.com',
          message: 'Short',
        })
      ).rejects.toThrow();
    });

    it('should reject name over 100 characters', async () => {
      await expect(
        ContactMessage.create({
          name: 'A'.repeat(101),
          email: 'test@example.com',
          message: 'Hello, this is a test message.',
        })
      ).rejects.toThrow();
    });

    it('should reject message over 1000 characters', async () => {
      await expect(
        ContactMessage.create({
          name: 'Test User',
          email: 'test@example.com',
          message: 'A'.repeat(1001),
        })
      ).rejects.toThrow();
    });
  });

  describe('Default Values', () => {
    it('should default read to false', async () => {
      const message = await ContactMessage.create({
        name: 'Test User',
        email: 'test@example.com',
        message: 'Hello, this is a test message.',
      });

      expect(message.read).toBe(false);
    });

    it('should default readAt to null', async () => {
      const message = await ContactMessage.create({
        name: 'Test User',
        email: 'test@example.com',
        message: 'Hello, this is a test message.',
      });

      expect(message.readAt).toBeNull();
    });
  });

  describe('Email Normalization', () => {
    it('should convert email to lowercase', async () => {
      const message = await ContactMessage.create({
        name: 'Test User',
        email: 'TEST@EXAMPLE.COM',
        message: 'Hello, this is a test message.',
      });

      expect(message.email).toBe('test@example.com');
    });

    it('should trim whitespace from email', async () => {
      const message = await ContactMessage.create({
        name: 'Test User',
        email: '  test@example.com  ',
        message: 'Hello, this is a test message.',
      });

      expect(message.email).toBe('test@example.com');
    });
  });

  describe('Name Trimming', () => {
    it('should trim whitespace from name', async () => {
      const message = await ContactMessage.create({
        name: '  Test User  ',
        email: 'test@example.com',
        message: 'Hello, this is a test message.',
      });

      expect(message.name).toBe('Test User');
    });
  });

  describe('Timestamps', () => {
    it('should auto-generate createdAt', async () => {
      const message = await ContactMessage.create({
        name: 'Test User',
        email: 'test@example.com',
        message: 'Hello, this is a test message.',
      });

      expect(message.createdAt).toBeDefined();
      expect(message.updatedAt).toBeDefined();
    });
  });

  describe('Successful Creation', () => {
    it('should create message with valid data', async () => {
      const message = await ContactMessage.create({
        name: 'Test User',
        email: 'test@example.com',
        message: 'Hello, this is a test message.',
      });

      expect(message.name).toBe('Test User');
      expect(message.email).toBe('test@example.com');
      expect(message.message).toBe('Hello, this is a test message.');
      expect(message.read).toBe(false);
    });
  });
});
