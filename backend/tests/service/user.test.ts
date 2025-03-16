import { expect } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

describe('UserService', () => {
  let sandbox: any;
  let userService: any;
  let repositoryStub: any;
  let validatorStub: any;
  let bcryptStub: any;
  let jwtStub: any;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    repositoryStub = {
      createUser: sandbox.stub(),
      getAllUsers: sandbox.stub(),
      getUserById: sandbox.stub(),
      updateUser: sandbox.stub(),
      updateUserPassword: sandbox.stub(),
      deleteUserById: sandbox.stub(),
      getUserByEmail: sandbox.stub(),
    };

    validatorStub = {
      validateUserName: sandbox.stub(),
      validateUserEmail: sandbox.stub(),
      validateUserType: sandbox.stub(),
      validateUserPassword: sandbox.stub(),
      validateId: sandbox.stub(),
      validateLimit: sandbox.stub(),
      validatePage: sandbox.stub(),
    };

    bcryptStub = {
      hash: sandbox.stub(),
    };

    jwtStub = {
      generateToken: sandbox.stub(),
    };

    const userServiceModule = proxyquire('../../src/services/UserService', {
      '../repositories/prismaUserRepository': repositoryStub,
      '../validators/UserValidator': {
        validateUserName: validatorStub.validateUserName,
        validateUserEmail: validatorStub.validateUserEmail,
        validateUserType: validatorStub.validateUserType,
        validateUserPassword: validatorStub.validateUserPassword,
      },
      '../validators/CommonValidator': {
        validateId: validatorStub.validateId,
        validateLimit: validatorStub.validateLimit,
        validatePage: validatorStub.validatePage,
      },
      'bcrypt': bcryptStub,
      '../config/jwt': {
        generateToken: jwtStub.generateToken,
      }
    });

    userService = new userServiceModule.UserService();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('createUser', () => {
    it('should throw an error if user name is missing', async () => {
      validatorStub.validateUserName.throws(new Error('User name is required.'));
      const invalidForm = {
        name: '',
        email: 'test@example.com',
        password: 'Password1!',
        type: 'user'
      };
      try {
        await userService.createUser(invalidForm);
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('User name is required.');
      }
    });

    it('should throw an error if user email is invalid', async () => {
      validatorStub.validateUserName.returns();
      validatorStub.validateUserEmail.throws(new Error('User email must be a valid email address.'));
      const invalidForm = {
        name: 'ValidName',
        email: 'invalid',
        password: 'Password1!',
        type: 'user'
      };
      try {
        await userService.createUser(invalidForm);
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('User email must be a valid email address.');
      }
    });

    it('should throw an error if user type is invalid', async () => {
      validatorStub.validateUserName.returns();
      validatorStub.validateUserEmail.returns();
      validatorStub.validateUserType.throws(new Error('User type must be either admin or user.'));
      const invalidForm = {
        name: 'ValidName',
        email: 'test@example.com',
        password: 'Password1!',
        type: 'invalidType'
      };
      try {
        await userService.createUser(invalidForm);
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('User type must be either admin or user.');
      }
    });

    it('should throw an error if user password is invalid', async () => {
      validatorStub.validateUserName.returns();
      validatorStub.validateUserEmail.returns();
      validatorStub.validateUserType.returns();
      validatorStub.validateUserPassword.throws(new Error('User password must contain at least one uppercase letter.'));
      const invalidForm = {
        name: 'ValidName',
        email: 'test@example.com',
        password: 'password1!',
        type: 'user'
      };
      try {
        await userService.createUser(invalidForm);
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('User password must contain at least one uppercase letter.');
      }
    });

    it('should create a user successfully with valid data', async () => {
      validatorStub.validateUserName.returns();
      validatorStub.validateUserEmail.returns();
      validatorStub.validateUserType.returns();
      validatorStub.validateUserPassword.returns();
      const validForm = {
        name: 'ValidName',
        email: 'test@example.com',
        password: 'Password1!',
        type: 'user'
      };
      bcryptStub.hash.resolves('hashedPassword');
      jwtStub.generateToken.returns('mocked.jwt.token');
      const createdUser = {
        id: 1,
        name: validForm.name,
        email: validForm.email,
        password: 'hashedPassword',
        type: validForm.type
      };
      repositoryStub.createUser.resolves(createdUser);
      const token = await userService.createUser(validForm);
      expect(token).to.equal('mocked.jwt.token');
      expect(repositoryStub.createUser.calledOnce).to.be.true;
      expect(bcryptStub.hash.calledOnce).to.be.true;
      expect(jwtStub.generateToken.calledOnce).to.be.true;
    });
  });

  describe('getAllUsers', () => {
    it('should throw an error if page is negative', async () => {
      validatorStub.validatePage.throws(new Error('Page must be a positive integer.'));
      try {
        await userService.getAllUsers(-1, 10);
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('Page must be a positive integer.');
      }
    });

    it('should throw an error if limit is negative', async () => {
      validatorStub.validatePage.returns();
      validatorStub.validateLimit.throws(new Error('Limit must be a positive integer.'));
      try {
        await userService.getAllUsers(1, -5);
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('Limit must be a positive integer.');
      }
    });

    it('should return a list of users with default page/limit', async () => {
      validatorStub.validatePage.returns();
      validatorStub.validateLimit.returns();
      const users = [
        { id: 1, name: 'User1', email: 'user1@example.com', type: 'user' },
        { id: 2, name: 'User2', email: 'user2@example.com', type: 'admin' },
      ];
      repositoryStub.getAllUsers.resolves(users);
      const result = await userService.getAllUsers(undefined, undefined);
      expect(result).to.have.length(2);
      expect(repositoryStub.getAllUsers.calledOnce).to.be.true;
    });
  });

  describe('getUserById', () => {
    it('should throw an error if id is invalid', async () => {
      validatorStub.validateId.throws(new Error('User ID is required.'));
      try {
        await userService.getUserById(null);
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('User ID is required.');
      }
    });

    it('should throw an error if user does not exist', async () => {
      validatorStub.validateId.returns();
      const validateUserExistsStub = sinon.stub(userService, 'validateUserExists').rejects(new Error('User not found.'));
      try {
        await userService.getUserById(99);
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('User not found.');
      }
      validateUserExistsStub.restore();
    });

    it('should return a user successfully', async () => {
      validatorStub.validateId.returns();
      const validateUserExistsStub = sinon.stub(userService, 'validateUserExists').resolves();
      const user = {
        id: 1,
        name: 'John',
        email: 'john@example.com',
        type: 'user'
      };
      repositoryStub.getUserById.resolves(user);
      const result = await userService.getUserById(1);
      expect(result.id).to.equal(1);
      expect(result.email).to.equal('john@example.com');
      validateUserExistsStub.restore();
    });
  });

  describe('updateUser', () => {
    it('should throw an error if user id is invalid', async () => {
      validatorStub.validateId.throws(new Error('User ID must be a positive integer.'));
      try {
        await userService.updateUser(null, {});
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('User ID must be a positive integer.');
      }
    });

    it('should throw an error if user does not exist', async () => {
      validatorStub.validateId.returns();
      const validateUserExistsStub = sinon.stub(userService, 'validateUserExists').rejects(new Error('User not found.'));
      try {
        await userService.updateUser(99, {
          name: 'NewName',
          email: 'new@example.com',
          password: 'Password1!',
          type: 'admin'
        });
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('User not found.');
      }
      validateUserExistsStub.restore();
    });

    it('should throw an error if name is invalid', async () => {
      validatorStub.validateId.returns();
      const validateUserExistsStub = sinon.stub(userService, 'validateUserExists').resolves();
      validatorStub.validateUserName.throws(new Error('User name must have at least 3 characters.'));
      try {
        await userService.updateUser(1, {
          name: 'Jo',
          email: 'jo@example.com',
          password: 'Password1!',
          type: 'user'
        });
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('User name must have at least 3 characters.');
      }
      validateUserExistsStub.restore();
    });

    it('should update successfully if data is valid', async () => {
      validatorStub.validateId.returns();
      const validateUserExistsStub = sinon.stub(userService, 'validateUserExists').resolves();
      validatorStub.validateUserName.returns();
      validatorStub.validateUserEmail.returns();
      validatorStub.validateUserType.returns();
      sinon.stub(userService, 'getUserById').resolves({
        id: 1,
        name: 'OldName',
        email: 'old@example.com',
        type: 'user'
      });
      const updatedUserMock = {
        id: 1,
        name: 'NewName',
        email: 'new@example.com',
        type: 'admin'
      };
      repositoryStub.updateUser.resolves(updatedUserMock);
      const result = await userService.updateUser(1, {
        name: 'NewName',
        email: 'new@example.com',
        password: 'Password1!',
        type: 'admin'
      });
      expect(result.id).to.equal(1);
      expect(result.email).to.equal('new@example.com');
      expect(repositoryStub.updateUser.calledOnce).to.be.true;
      validateUserExistsStub.restore();
    });
  });

  describe('updateUserPassword', () => {
    it('should throw an error if password is invalid', async () => {
      validatorStub.validateUserPassword.throws(new Error('User password must have at least 8 characters.'));
      try {
        await userService.updateUserPassword(1, 'short');
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('User password must have at least 8 characters.');
      }
    });

    it('should update user password successfully', async () => {
      validatorStub.validateUserPassword.returns();
      sinon.stub(userService, 'getUser').resolves({
        id: 1,
        password: 'oldHashedPassword'
      });
      bcryptStub.hash.resolves('newHashedPassword');
      const updatedUser = {
        id: 1,
        name: 'User',
        email: 'user@example.com',
        type: 'user',
        password: 'newHashedPassword'
      };
      repositoryStub.updateUserPassword.resolves(updatedUser);
      const result = await userService.updateUserPassword(1, 'NewPassword1!');
      expect(bcryptStub.hash.calledOnce).to.be.true;
      expect(result.password).to.not.equal('oldHashedPassword');
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      repositoryStub.deleteUserById.resolves();
      try {
        await userService.deleteUser(1);
      } catch (error) {
        expect.fail('Expected no error to be thrown');
      }
      expect(repositoryStub.deleteUserById.calledOnce).to.be.true;
    });
  });

  describe('validateNewPassword', () => {
    it('should throw an error if current password is incorrect', async () => {
      sinon.stub(userService, 'getUser').resolves({
        id: 1,
        password: 'oldHashedPassword'
      });
      try {
        await userService.validateNewPassword(1, 'WRONGpassword', 'NewPassword1!');
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('Current password is incorrect');
      }
    });

    it('should throw an error if the new password is the same as the current one', async () => {
      sinon.stub(userService, 'getUser').resolves({
        id: 1,
        password: 'SameHashedPassword'
      });
      try {
        await userService.validateNewPassword(1, 'SameHashedPassword', 'SameHashedPassword');
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('New password must be different from the current password');
      }
    });

    it('should pass if current password matches and new password is different', async () => {
      sinon.stub(userService, 'getUser').resolves({
        id: 1,
        password: 'oldHashedPassword'
      });
      try {
        await userService.validateNewPassword(1, 'oldHashedPassword', 'newHashedPassword');
      } catch (error) {
        expect.fail('Expected no error to be thrown');
      }
    });
  });

  describe('getUser', () => {
    it('should throw an error if id is invalid', async () => {
      validatorStub.validateId.throws(new Error('User ID is required.'));
      try {
        await userService.getUser(null);
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('User ID is required.');
      }
    });

    it('should throw an error if user does not exist', async () => {
      validatorStub.validateId.returns();
      const validateUserExistsStub = sinon.stub(userService, 'validateUserExists').rejects(new Error('User not found.'));
      try {
        await userService.getUser(99);
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('User not found.');
      }
      validateUserExistsStub.restore();
    });

    it('should return a user if it exists', async () => {
      validatorStub.validateId.returns();
      const validateUserExistsStub = sinon.stub(userService, 'validateUserExists').resolves();
      const user = { id: 1, name: 'Test', email: 'test@example.com', type: 'user', password: 'hash' };
      repositoryStub.getUserById.resolves(user);
      const result = await userService.getUser(1);
      expect(result.id).to.equal(1);
      expect(result.email).to.equal('test@example.com');
      validateUserExistsStub.restore();
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user if found by email', async () => {
      const user = { id: 1, email: 'test@example.com', type: 'user' };
      repositoryStub.getUserByEmail.resolves(user);
      const result = await userService.getUserByEmail('test@example.com');
      expect(result.id).to.equal(1);
    });

    it('should return null if user not found', async () => {
      repositoryStub.getUserByEmail.resolves(null);
      const result = await userService.getUserByEmail('notfound@example.com');
      expect(result).to.be.null;
    });
  });

  describe('validateUserExists', () => {
    it('should throw an error if user does not exist', async () => {
      validatorStub.validateId.returns();
      repositoryStub.getUserById.resolves(null);
      try {
        await userService.validateUserExists(99);
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('User not found.');
      }
    });

    it('should not throw an error if user exists', async () => {
      validatorStub.validateId.returns();
      repositoryStub.getUserById.resolves({ id: 1 });
      try {
        await userService.validateUserExists(1);
      } catch (error) {
        expect.fail('Expected no error to be thrown');
      }
    });
  });
});
