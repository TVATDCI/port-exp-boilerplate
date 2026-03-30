import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import contactRouter from '../../routes/index.js';

// Create test express app
const app = express();
app.use(express.json());
app.use('/api', contactRouter);

describe('Contact Controller Integration Tests', () => {
  let server;

  beforeAll(async () => {
    // Connect to in-memory MongoDB
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());

    server = app.listen(3001);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    server.close();
  });

  beforeEach(async () => {
    // Clear collections
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });

  describe('POST /api/contact', () => {
    it('should create a new contact message with valid data', async () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message that is long enough.',
      };

      const response = await request(app).post('/api/contact').send(validData).expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('John Doe');
      expect(response.body.data.email).toBe('john@example.com');
      expect(response.body.data.message).toBe('This is a test message that is long enough.');
      expect(response.body.data.id).toBeDefined();
    });

    it('should reject empty name', async () => {
      const invalidData = {
        name: '',
        email: 'john@example.com',
        message: 'This is a test message that is long enough.',
      };

      const response = await request(app).post('/api/contact').send(invalidData).expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should reject invalid email', async () => {
      const invalidData = {
        name: 'John Doe',
        email: 'invalid-email',
        message: 'This is a test message that is long enough.',
      };

      const response = await request(app).post('/api/contact').send(invalidData).expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should reject message too short', async () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Short',
      };

      const response = await request(app).post('/api/contact').send(invalidData).expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
