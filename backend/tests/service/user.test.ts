import { expect } from 'chai';
import sinon from 'sinon';
import bcrypt from 'bcrypt';
import { UserService } from '../../src/services/UserService';
import * as repository from '../../src/repositories/prismaUserRepository';
import { UserType } from '../../src/domain/enums/UserType';
import { UserFormDTO } from '../../src/domain/formDTO/UserFormDTO';
import { User } from '../../src/domain/entities/User';

describe('UserService', () => {
    let sandbox: sinon.SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('createUser', () => {
        it('should create a user when valid data is provided', async () => {
            const userForm: UserFormDTO = {
                name: 'John Doe',
                email: 'johndoe@example.com',
                password: 'SecurePass123!',
                type: UserType.user as UserType
            };

            const hashedPassword = 'hashedpassword123';
            const expectedUser: User = {
                id: 50000,
                name: 'John Doe',
                email: 'johndoe@example.com',
                password: hashedPassword,
                type: UserType.user
            };

            sandbox.stub(bcrypt, 'hash').resolves(hashedPassword);
            const createStub = sandbox.stub(repository, 'createUser').resolves(expectedUser);

            const result = await new UserService().createUser(userForm);

            expect(createStub.calledOnce).to.be.true;
            expect(result).to.be.a('string');
        });

        it('should throw an error when invalid data is provided', async () => {
            const invalidUserForm: UserFormDTO = {
                name: 'Jo',
                email: 'invalid-email',
                password: '12345',
                type: UserType.user
            };

            try {
                await new UserService().createUser(invalidUserForm);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error).to.be.instanceOf(Error);
            }
        });
    });

    describe('getAllUsers', () => {
        it('should return all users without passwords', async () => {
            const users: User[] = [
                {
                    id: 50000,
                    name: 'User One',
                    email: 'userone@example.com',
                    password: 'hashedpassword1',
                    type: UserType.user
                },
                {
                    id: 50001,
                    name: 'User Two',
                    email: 'usertwo@example.com',
                    password: 'hashedpassword2',
                    type: UserType.admin
                }
            ];

            sandbox.stub(repository, 'getAllUsers').resolves(users);

            const result = await new UserService().getAllUsers(1, 10);

            expect(result).to.be.an('array').that.has.lengthOf(2);
            result.forEach(user => {
                expect(user).to.not.have.property('password');
            });
        });
    });

    describe('getUserById', () => {
        it('should return a user without password when user exists', async () => {
            const userId = 50000;
            const user: User = {
                id: userId,
                name: 'John Doe',
                email: 'johndoe@example.com',
                password: 'hashedpassword',
                type: UserType.user
            };

            sandbox.stub(repository, 'getUserById').resolves(user);

            const result = await new UserService().getUserById(userId);

            expect(result).to.deep.equal({
                id: userId,
                name: 'John Doe',
                email: 'johndoe@example.com',
                type: UserType.user
            });
            expect(result).to.not.have.property('password');
        });

        it('should throw an error when user does not exist', async () => {
            const userId = 50000;
            sandbox.stub(repository, 'getUserById').resolves(null);

            try {
                await new UserService().getUserById(userId);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error).to.be.instanceOf(Error);
            }
        });
    });

    describe('updateUser', () => {
        it('should update a user when valid data is provided', async () => {
            const userId = 50000;
            const userForm: UserFormDTO = {
                name: 'John Updated',
                email: 'johnupdated@example.com',
                password: 'SecurePass123!',
                type: UserType.user
            };

            const existingUser: User = {
                id: userId,
                name: 'John Doe',
                email: 'johndoe@example.com',
                password: 'hashedpassword',
                type: UserType.user
            };

            const updatedUser: User = {
                ...existingUser,
                ...userForm,
                password: existingUser.password
            };

            sandbox.stub(repository, 'getUserById').resolves(existingUser);
            const updateStub = sandbox.stub(repository, 'updateUser').resolves(updatedUser);

            const result = await new UserService().updateUser(userId, userForm);

            expect(updateStub.calledOnce).to.be.true;
            expect(result).to.deep.equal({
                id: userId,
                name: 'John Updated',
                email: 'johnupdated@example.com',
                type: UserType.user
            });
        });

        it('should throw an error when user does not exist', async () => {
            const userId = 50000;
            const userForm: UserFormDTO = {
                name: 'John Updated',
                email: 'johnupdated@example.com',
                password: 'SecurePass123!',
                type: UserType.user
            };

            sandbox.stub(repository, 'getUserById').resolves(null);

            try {
                await new UserService().updateUser(userId, userForm);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error).to.be.instanceOf(Error);
            }
        });
    });

    describe('deleteUser', () => {
        it('should delete a user when user exists', async () => {
            const userId = 50000;
            const existingUser: User = {
                id: userId,
                name: 'John Doe',
                email: 'johndoe@example.com',
                password: 'hashedpassword',
                type: UserType.user
            };

            sandbox.stub(repository, 'getUserById').resolves(existingUser);
            const deleteStub = sandbox.stub(repository, 'deleteUserById').resolves();

            await new UserService().deleteUser(userId);

            expect(deleteStub.calledOnceWith(userId)).to.be.true;
        });

        it('should throw an error when user does not exist', async () => {
            const userId = 50000;
            sandbox.stub(repository, 'getUserById').resolves(null);

            try {
                await new UserService().deleteUser(userId);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error).to.be.instanceOf(Error);
            }
        });
    });

    describe('updateUserPassword', () => {
        it('should update a user\'s password when valid data is provided', async () => {
            const userId = 50000;
            const newPassword = 'NewSecurePass123!';
            const hashedPassword = 'hashednewpassword';

            const existingUser: User = {
                id: userId,
                name: 'John Doe',
                email: 'johndoe@example.com',
                password: 'hashedpassword',
                type: UserType.user
            };

            sandbox.stub(repository, 'getUserById').resolves(existingUser);
            sandbox.stub(bcrypt, 'hash').resolves(hashedPassword);
            const updateStub = sandbox.stub(repository, 'updateUserPassword').resolves({
                ...existingUser,
                password: hashedPassword
            });

            const result = await new UserService().updateUserPassword(userId, newPassword);

            expect(updateStub.calledOnce).to.be.true;
            expect(result).to.deep.equal({
                id: userId,
                name: 'John Doe',
                email: 'johndoe@example.com',
                type: UserType.user
            });
        });

        it('should throw an error when user does not exist', async () => {
            const userId = 50000;
            const newPassword = 'NewSecurePass123!';

            sandbox.stub(repository, 'getUserById').resolves(null);

            try {
                await new UserService().updateUserPassword(userId, newPassword);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error).to.be.instanceOf(Error);
            }
        });
    });
});