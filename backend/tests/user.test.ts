import request from 'supertest';
import { app } from '../src/app';
import { User } from '../src/domain/entities/User';
import { PrismaUserRepository } from '../src/repositories/prismaUserRepository';
import { faker } from '@faker-js/faker';

const userRepository = new PrismaUserRepository();

describe('GET /user', () => {
    it('should return 200 OK', async () => {
      const res = await request(app).get('/user');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(0);
    });
  
    it('should return 200 OK with data', async () => {
      const user: User = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'SecurePass123!'
      };
      try {
        await userRepository.create(user);
        const res = await request(app).get('/user');
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0]).toHaveProperty('name', user.name);
        expect(res.body[0]).toHaveProperty('email', user.email);
      } finally {
        await userRepository.deleteByEmail(user.email);
      }
    });
  
    it('should return 404 Not Found for non-existing email', async () => {
      const res = await request(app).get('/user/nonexistent@example.com');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'User not found');
    });
  
    it('should return 400 on invalid email format', async () => {
      const res = await request(app).get('/user/invalid-email');
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Invalid email format');
    });
});

describe('POST /user', () => {
    it('should return 201 when creating a valid user', async () => {
      const user: User = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'SecurePass123!'
      };
      const res = await request(app).post('/user').send(user);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('name', user.name);
      expect(res.body).toHaveProperty('email', user.email);
      await userRepository.deleteByEmail(user.email);
    });
  
    it('should return 400 when creating a user with a short password', async () => {
        const user = {
          name: 'John Doe',
          email: 'johndoe@example.com',
          password: faker.string.alpha(5),
        };
        const res = await request(app).post('/user').send(user);
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'Password is too short');
      });

      it('should return 400 when creating a user with an empty name', async () => {
        const user = {
          name: '',
          email: 'johndoe@example.com',
          password: faker.string.alpha(10),
        };
        const res = await request(app).post('/user').send(user);
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'Name is required');
      });

      it('should return 400 when creating a user with an empty email', async () => {
        const user = {
          name: 'John Doe',
          email: '',
          password: faker.string.alpha(10),
        };
        const res = await request(app).post('/user').send(user);
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'Email is required');
      });

      it('should return 400 when creating a user with an empty password', async () => {
        const user = {
          name: 'John Doe',
          email: 'johndoe@example.com',
          password: '',
        };
        const res = await request(app).post('/user').send(user);
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'Password is required');
      });
});

describe('PATCH /user', () => {
    it('should update an existing user successfully', async () => {
      const user: User = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: faker.string.alpha(10),
      };
      const userUpdate = { name: 'John Updated', email: 'johndoe@example.com' };
      try {
        await userRepository.create(user);
        const res = await request(app).patch(`/user/${user.email}`).send(userUpdate);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('name', userUpdate.name);
        expect(res.body).toHaveProperty('email', userUpdate.email);
      } finally {
        await userRepository.deleteByEmail(user.email);
      }
    });
  
    it('should return 404 when updating a non-existing user', async () => {
      const userUpdate = { name: 'John Updated', email: 'nonexistent@example.com' };
      const res = await request(app).patch('/user/nonexistent@example.com').send(userUpdate);
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'User not found');
    });
  
    it('should return 400 when updating a user with an invalid email', async () => {
      const userUpdate = { email: 'invalid-email' };
      const res = await request(app).patch('/user/invalid-email').send(userUpdate);
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Invalid email format');
    });
});

describe('DELETE /user', () => {
    it('should return 204 when deleting an existing user', async () => {
      const user: User = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: faker.string.alpha(10),
      };
      try {
        await userRepository.create(user);
        const res = await request(app).delete(`/user/${user.email}`);
        expect(res.status).toBe(204);
      } finally {
        await userRepository.deleteByEmail(user.email);
      }
    });
  
    it('should return 404 when deleting a non-existing user', async () => {
      const res = await request(app).delete('/user/nonexistent@example.com');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'User not found');
    });
  
    it('should return 400 when deleting a user with an invalid email', async () => {
      const res = await request(app).delete('/user/invalid-email');
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Invalid email format');
    });
});
  