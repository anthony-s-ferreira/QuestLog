import { expect } from 'chai';
import sinon from 'sinon';
import bcrypt from 'bcrypt';
import proxyquire from 'proxyquire';
import { UserType } from '../../src/domain/enums/UserType';
import { UserFormDTO } from '../../src/domain/formDTO/UserFormDTO';
import { User } from '../../src/domain/entities/User';

describe('UserService', () => {
    let sandbox: sinon.SinonSandbox;
    let userService: any;
    let repositoryStub: any;

    beforeEach(() => {
        sandbox = sinon.createSandbox();

        repositoryStub = {
            createUser: sandbox.stub(),
            getAllUsers: sandbox.stub(),
            getUserById: sandbox.stub(),
            updateUser: sandbox.stub(),
            deleteUserById: sandbox.stub(),
            updateUserPassword: sandbox.stub(),
            getUserByEmail: sandbox.stub()
        };

        const userServiceModule = proxyquire('../../src/services/UserService', {
            '../../src/repositories/prismaUserRepository': repositoryStub
        });

        userService = new userServiceModule.UserService();
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
            repositoryStub.createUser.resolves(expectedUser);

            const result = await userService.createUser(userForm);

            expect(repositoryStub.createUser.calledOnce).to.be.true;
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
                await userService.createUser(invalidUserForm);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error).to.be.instanceOf(Error);
            }
        });

        it('should throw an error if email is already registered', async () => {
            const userForm: UserFormDTO = {
                name: 'John Doe',
                email: 'existing@example.com',
                password: 'ValidPass123!',
                type: UserType.user
            };
        
            repositoryStub.getUserByEmail.resolves({ id: 1, ...userForm }); // Simula um usuário existente
        
            try {
                await userService.createUser(userForm);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error).to.be.instanceOf(Error);
            }
        });

        it('should create a user when name length is between 3 and 20 characters', async () => {
            const validUserForm: UserFormDTO = {
                name: 'ValidName',
                email: 'valid@example.com',
                password: 'ValidPass123!',
                type: UserType.user
            };
        
            const hashedPassword = 'hashedpassword123';
            const expectedUser: User = {
                id: 50000,
                ...validUserForm,
                password: hashedPassword
            };
        
            sandbox.stub(bcrypt, 'hash').resolves(hashedPassword);
            repositoryStub.createUser.resolves(expectedUser);
        
            const result = await userService.createUser(validUserForm);
        
            expect(repositoryStub.createUser.calledOnce).to.be.true;
            expect(result).to.be.a('string');
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

            repositoryStub.getAllUsers.resolves(users);

            const result = await userService.getAllUsers(1, 10);

            expect(result).to.be.an('array').that.has.lengthOf(2);
            result.forEach((user: User) => {
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

            repositoryStub.getUserById.resolves(user);

            const result = await userService.getUserById(userId);

            expect(result).to.deep.equal({
                id: userId,
                name: 'John Doe',
                email: 'johndoe@example.com',
                type: UserType.user
            });
            expect(result).to.not.have.property('password');
        });
    });

    describe('deleteUser', () => {
        it('should delete a user when user exists', async () => {
            const userId = 50000;
            repositoryStub.getUserById.resolves({ id: userId });
            repositoryStub.deleteUserById.resolves();

            await userService.deleteUser(userId);
            expect(repositoryStub.deleteUserById.calledOnceWith(userId)).to.be.true;
        });
    });

    it('should throw an error when name is too short or too long', async () => {
        const invalidUsers = [
            { name: 'Jo', email: 'valid@example.com', password: 'ValidPass123!', type: UserType.user },
            { name: 'A'.repeat(21), email: 'valid@example.com', password: 'ValidPass123!', type: UserType.user }
        ];

        for (const userForm of invalidUsers) {
            try {
                await userService.createUser(userForm);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error).to.be.instanceOf(Error);
            }
        }
    });

    it('should throw an error when password does not meet security criteria', async () => {
        const invalidPasswords = ['12345678', 'abcdefgh', 'ABCDEFGH', 'Abcdefgh', 'Abc12345'];

        for (const password of invalidPasswords) {
            try {
                await userService.createUser({ name: 'Valid User', email: 'valid@example.com', password, type: UserType.user });
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error).to.be.instanceOf(Error);
            }
        }
    });

    it('should throw an error when an unauthorized user tries to update another user', async () => {
        const userId = 50000;
        const unauthorizedUserId = 50001;
        const userForm: UserFormDTO = {
            name: 'John Updated',
            email: 'johnupdated@example.com',
            password: 'SecurePass123!',
            type: UserType.user
        };

        repositoryStub.getUserById.resolves({ id: userId });

        try {
            await userService.updateUser(unauthorizedUserId, userForm);
            expect.fail('Expected error was not thrown');
        } catch (error) {
            expect(error).to.be.instanceOf(Error);
        }
    });

    it('should throw an error when an unauthorized user tries to delete another user', async () => {
        const userId = 50000;
        const unauthorizedUserId = 50001;

        repositoryStub.getUserById.resolves({ id: userId });

        try {
            await userService.deleteUser(unauthorizedUserId);
            expect.fail('Expected error was not thrown');
        } catch (error) {
            expect(error).to.be.instanceOf(Error);
        }
    });

    it('should throw an error when email is not between 5 and 256 characters or invalid format', async () => {
        const invalidEmails = ['a@b.c', 'a'.repeat(257) + '@example.com', 'invalid-email'];

        for (const email of invalidEmails) {
            try {
                await userService.createUser({ name: 'Valid User', email, password: 'ValidPass123!', type: UserType.user });
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error).to.be.instanceOf(Error);
            }
        }
    });

    it('should throw an error when user type is not admin or user', async () => {
        try {
            await userService.createUser({ name: 'Valid User', email: 'valid@example.com', password: 'ValidPass123!', type: 'invalidType' as UserType });
            expect.fail('Expected error was not thrown');
        } catch (error) {
            expect(error).to.be.instanceOf(Error);
        }
    });
});