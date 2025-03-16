import { expect } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import { CharacterFormDTO } from '../../src/domain/formDTO/CharacterFormDTO';
import { faker } from '@faker-js/faker';

describe('CharacterService', () => {
    let sandbox: sinon.SinonSandbox;
    let characterService: any;

    let repositoryStub: any;
    let validatorStub: any;
    let userServiceStub: any;
    let rpgServiceStub: any;

    beforeEach(() => {
        sandbox = sinon.createSandbox();

        repositoryStub = {
            createCharacter: sandbox.stub(),
            getAllCharacters: sandbox.stub(),
            getCharacterById: sandbox.stub(),
            updateCharacter: sandbox.stub(),
            deleteCharacterById: sandbox.stub(),
            getCharactersByUserId: sandbox.stub(),
        };

        validatorStub = {
            validateCharacterExists: sandbox.stub(),
            validateCharacterName: sandbox.stub(),
            validateId: sandbox.stub(),
            validateUserExists: sandbox.stub(),
            validateRPGExists: sandbox.stub(),
            // Adicione aqui as funções usadas no teste getAllCharacters:
            validatePage: sandbox.stub(),
            validateLimit: sandbox.stub(),
        };

        userServiceStub = {
            getUserById: sandbox.stub(),
        };

        rpgServiceStub = {
            getRPGById: sandbox.stub(),
        };

        const characterServiceModule = proxyquire('../../src/services/CharacterService', {
            '../repositories/prismaCharacterRepository': repositoryStub,
            '../validators/CharacterValidator': {
                validateCharacterExists: validatorStub.validateCharacterExists,
                validateCharacterName: validatorStub.validateCharacterName
            },
            '../validators/CommonValidator': {
                validateId: validatorStub.validateId
            },
            '../validators/UserValidator': {
                validateUserExists: validatorStub.validateUserExists
            },
            '../validators/RpgValidator': {
                validateRPGExists: validatorStub.validateRPGExists
            },
            './UserService': {
                UserService: function () {
                    return userServiceStub;
                }
            },
            './RpgService': {
                RpgService: function () {
                    return rpgServiceStub;
                }
            }
        });

        characterService = new characterServiceModule.CharacterService();
    });

    afterEach(() => {
        sandbox.restore();
    });


    describe('createCharacter', () => {
        it('should throw an error when character name is missing', async () => {
            validatorStub.validateCharacterName.throws(new Error('Character name is required.'));

            const invalidForm: CharacterFormDTO = {
                name: '',
                ownerId: 1,
                rpgId: 1
            };

            try {
                await characterService.createCharacter(invalidForm);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('Character name is required.');
            }
        });

        it('should throw an error when character name is too short', async () => {
            validatorStub.validateCharacterName.throws(new Error('Character name must have at least 3 characters.'));

            const invalidForm: CharacterFormDTO = {
                name: faker.string.alphanumeric(2),
                ownerId: 1,
                rpgId: 1
            };

            try {
                await characterService.createCharacter(invalidForm);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('Character name must have at least 3 characters.');
            }
        });

        it('should throw an error when character name is too long', async () => {
            validatorStub.validateCharacterName.throws(new Error('Character name must have at most 30 characters.'));

            const invalidForm: CharacterFormDTO = {
                name: faker.string.alpha(31),
                ownerId: 1,
                rpgId: 1
            };

            try {
                await characterService.createCharacter(invalidForm);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('Character name must have at most 30 characters.');
            }
        });

        it('should throw an error when ownerId is null', async () => {
            validatorStub.validateId.throws(new Error('Owner ID is required.'));

            const invalidForm: CharacterFormDTO = {
                name: 'ValidName',
                ownerId: null as any,
                rpgId: 1
            };
            try {
                await characterService.createCharacter(invalidForm);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('Owner ID is required.');
            }
        });

        it('should throw an error when ownerId is string', async () => {
            validatorStub.validateId.throws(new Error('Owner ID must be a number.'));

            const invalidForm: CharacterFormDTO = {
                name: 'ValidName',
                ownerId: 'abc' as any,
                rpgId: 1
            };
            try {
                await characterService.createCharacter(invalidForm);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('Owner ID must be a number.');
            }
        });

        it('should throw an error when ownerId is negative', async () => {
            validatorStub.validateId.throws(new Error('Owner ID must be a positive number.'));

            const invalidForm: CharacterFormDTO = {
                name: 'ValidName',
                ownerId: -1,
                rpgId: 1
            };

            try {
                await characterService.createCharacter(invalidForm);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('Owner ID must be a positive number.');
            }
        });

        it('should throw an error when user does not exist', async () => {
            validatorStub.validateUserExists.rejects(new Error('User with id: 99 does not exist.'));

            const invalidForm: CharacterFormDTO = {
                name: 'ValidName',
                ownerId: 99,
                rpgId: 1
            };

            try {
                await characterService.createCharacter(invalidForm);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('User with id: 99 does not exist.');
            }
        });

        it('should throw an error when rpgId is null', async () => {
            validatorStub.validateId.throws(new Error('RPG ID is required.'));

            const invalidForm: CharacterFormDTO = {
                name: 'ValidName',
                ownerId: 1,
                rpgId: null as any
            };
            try {
                await characterService.createCharacter(invalidForm);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('RPG ID is required.');
            }
        });

        it('should throw an error when rpgId is string', async () => {
            validatorStub.validateId.throws(new Error('RPG ID must be a number.'));

            const invalidForm: CharacterFormDTO = {
                name: 'ValidName',
                ownerId: 1,
                rpgId: 'abc' as any
            };
            try {
                await characterService.createCharacter(invalidForm);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('RPG ID must be a number.');
            }
        });

        it('should throw an error when rpgId is negative', async () => {
            validatorStub.validateId.throws(new Error('RPG ID must be a positive number.'));

            const invalidForm: CharacterFormDTO = {
                name: 'ValidName',
                ownerId: 1,
                rpgId: -1
            };

            try {
                await characterService.createCharacter(invalidForm);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('RPG ID must be a positive number.');
            }
        });

        it('should throw an error when RPG does not exist', async () => {
            validatorStub.validateRPGExists.rejects(new Error('RPG with id: 99 does not exist.'));

            const invalidForm: CharacterFormDTO = {
                name: 'ValidName',
                ownerId: 1,
                rpgId: 99
            };

            try {
                await characterService.createCharacter(invalidForm);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('RPG with id: 99 does not exist.');
            }
        });

        it('should create successfully with a valid name (min length)', async () => {
            const validForm: CharacterFormDTO = {
                name: faker.string.alphanumeric(3),
                ownerId: 1,
                rpgId: 1
            };
            const expectedChar = {
                id: 10,
                name: validForm.name,
                owner: { id: validForm.ownerId },
                rpg: { id: validForm.rpgId }
            };

            repositoryStub.createCharacter.resolves(expectedChar);

            const char = await characterService.createCharacter(validForm);
            expect(char.name).to.equal(validForm.name);
            expect(char.id).to.equal(expectedChar.id);
            expect(repositoryStub.createCharacter.calledOnce).to.be.true;
        });

        it('should create successfully with a valid name (max length)', async () => {
            const validForm: CharacterFormDTO = {
                name: faker.string.alphanumeric(30),
                ownerId: 1,
                rpgId: 1
            };
            const expectedChar = {
                id: 11,
                name: validForm.name,
                owner: { id: validForm.ownerId },
                rpg: { id: validForm.rpgId }
            };

            repositoryStub.createCharacter.resolves(expectedChar);

            const char = await characterService.createCharacter(validForm);
            expect(char.name).to.equal(validForm.name);
            expect(char.id).to.equal(expectedChar.id);
            expect(repositoryStub.createCharacter.calledOnce).to.be.true;
        });

        it('should create successfully with a valid name (normal length)', async () => {
            const validForm: CharacterFormDTO = {
                name: 'ValidCharacter',
                ownerId: 1,
                rpgId: 1
            };
            const expectedChar = {
                id: 12,
                name: validForm.name,
                owner: { id: validForm.ownerId },
                rpg: { id: validForm.rpgId }
            };

            repositoryStub.createCharacter.resolves(expectedChar);

            const char = await characterService.createCharacter(validForm);
            expect(char.name).to.equal(validForm.name);
            expect(char.id).to.equal(expectedChar.id);
            expect(repositoryStub.createCharacter.calledOnce).to.be.true;
        });
    });


    describe('getCharacterById', () => {
        it('should throw an error when character does not exist', async () => {
            repositoryStub.getCharacterById.resolves(null);
            validatorStub.validateCharacterExists.rejects(new Error('Character not found.'));

            try {
                await characterService.getCharacterById(99);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('Character not found.');
            }
        });

        it('should throw an error when id is null', async () => {
            validatorStub.validateId.throws(new Error('Character ID is required.'));

            try {
                await characterService.getCharacterById(null);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('Character ID is required.');
            }
        });

        it('should throw an error when id is string', async () => {
            validatorStub.validateId.throws(new Error('Character ID must be a number.'));

            try {
                await characterService.getCharacterById('abc' as any);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('Character ID must be a number.');
            }
        });

        it('should throw an error when id is negative', async () => {
            validatorStub.validateId.throws(new Error('Character ID must be a positive number.'));

            try {
                await characterService.getCharacterById(-1);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('Character ID must be a positive number.');
            }
        });

        it('should retrieve a character successfully', async () => {
            const expectedChar = {
                id: 1,
                name: 'MyChar',
                owner: { id: 10 },
                rpg: { id: 20 }
            };
            repositoryStub.getCharacterById.resolves(expectedChar);

            const result = await characterService.getCharacterById(1);
            expect(result.id).to.equal(expectedChar.id);
            expect(result.name).to.equal(expectedChar.name);
        });
    });

    describe('updateCharacter', () => {
        it('should throw an error when character does not exist', async () => {
            repositoryStub.updateCharacter.resolves(null);
            validatorStub.validateCharacterExists.rejects(new Error('Character not found.'));

            try {
                await characterService.updateCharacter(99, 'NewName');
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('Character not found.');
            }
        });

        it('should throw an error when id is null', async () => {
            validatorStub.validateId.throws(new Error('Character ID is required.'));

            try {
                await characterService.updateCharacter(null, 'ValidName');
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('Character ID is required.');
            }
        });

        it('should throw an error when id is string', async () => {
            validatorStub.validateId.throws(new Error('Character ID must be a number.'));

            try {
                await characterService.updateCharacter('abc' as any, 'ValidName');
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('Character ID must be a number.');
            }
        });

        it('should throw an error when id is negative', async () => {
            validatorStub.validateId.throws(new Error('Character ID must be a positive number.'));

            try {
                await characterService.updateCharacter(-1, 'ValidName');
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('Character ID must be a positive number.');
            }
        });

        it('should throw an error when name is missing', async () => {
            validatorStub.validateCharacterName.throws(new Error('Character name is required.'));

            try {
                await characterService.updateCharacter(1, '');
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('Character name is required.');
            }
        });

        it('should throw an error when name is too short', async () => {
            validatorStub.validateCharacterName.throws(new Error('Character name must have at least 3 characters.'));

            try {
                await characterService.updateCharacter(1, faker.string.alphanumeric(2));
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('Character name must have at least 3 characters.');
            }
        });

        it('should throw an error when name is too long', async () => {
            validatorStub.validateCharacterName.throws(new Error('Character name must have at most 30 characters.'));

            try {
                await characterService.updateCharacter(1, faker.string.alpha(31));
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('Character name must have at most 30 characters.');
            }
        });

        it('should update successfully with valid data (min length)', async () => {
            const validName = faker.string.alphanumeric(3);
            const existingChar = {
                id: 1,
                name: 'OldName',
                owner: { id: 10 },
                rpg: { id: 20 }
            };
            const updatedChar = {
                id: 1,
                name: validName,
                owner: { id: 10 },
                rpg: { id: 20 }
            };
        
            // Stubs que retornam dados simulados de owner e rpg
            userServiceStub.getUserById.resolves({ 
              id: 10, 
              username: 'SomeUser' 
            });
            rpgServiceStub.getRPGById.resolves({ 
              id: 20, 
              name: 'SomeRPG' 
            });
        
            repositoryStub.getCharacterById.resolves(existingChar);
            repositoryStub.updateCharacter.resolves(updatedChar);
        
            const result = await characterService.updateCharacter(1, validName);
            expect(result.name).to.equal(validName);
            expect(repositoryStub.updateCharacter.calledOnce).to.be.true;
        });
        

        it('should update successfully with valid data (max length)', async () => {
            const validName = faker.string.alphanumeric(30);
        
            const existingChar = {
              id: 1,
              name: 'OldName',
              owner: { id: 10 },
              rpg: { id: 20 }
            };
        
            const updatedChar = {
              id: 1,
              name: validName,
              owner: { id: 10 },
              rpg: { id: 20 }
            };
        
            userServiceStub.getUserById.resolves({
              id: 10,
              username: 'MockUser'
            });
            rpgServiceStub.getRPGById.resolves({
              id: 20,
              name: 'MockRPG'
            });
        
            repositoryStub.getCharacterById.resolves(existingChar);
            repositoryStub.updateCharacter.resolves(updatedChar);
        
            const result = await characterService.updateCharacter(1, validName);
        
            expect(result.name).to.equal(validName);
            expect(repositoryStub.updateCharacter.calledOnce).to.be.true;
        });

        it('should update successfully with valid data (normal length)', async () => {
            const validName = 'ValidChar';
            
            const existingChar = {
              id: 1,
              name: 'OldName',
              owner: { id: 10 },
              rpg: { id: 20 },
            };
            const updatedChar = {
              id: 1,
              name: validName,
              owner: { id: 10 },
              rpg: { id: 20 },
            };
        
            userServiceStub.getUserById.resolves({ id: 10, username: 'MockUser' });
            rpgServiceStub.getRPGById.resolves({ id: 20, name: 'MockRPG' });
        
            repositoryStub.getCharacterById.resolves(existingChar);
            repositoryStub.updateCharacter.resolves(updatedChar);
        
            const result = await characterService.updateCharacter(1, validName);
            expect(result.name).to.equal(validName);
            expect(repositoryStub.updateCharacter.calledOnce).to.be.true;
        });
        
    });


    describe('deleteCharacter', () => {
        it('should throw an error when trying to delete a character that does not exist', async () => {
            repositoryStub.getCharacterById.resolves(null);
            validatorStub.validateCharacterExists.rejects(new Error('Character not found.'));

            try {
                await characterService.deleteCharacter(99);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('Character not found.');
            }
        });

        it('should throw an error when id is null', async () => {
            validatorStub.validateId.throws(new Error('Character ID is required.'));

            try {
                await characterService.deleteCharacter(null);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('Character ID is required.');
            }
        });

        it('should throw an error when id is string', async () => {
            validatorStub.validateId.throws(new Error('Character ID must be a number.'));

            try {
                await characterService.deleteCharacter('abc' as any);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('Character ID must be a number.');
            }
        });

        it('should throw an error when id is negative', async () => {
            validatorStub.validateId.throws(new Error('Character ID must be a positive number.'));

            try {
                await characterService.deleteCharacter(-1);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('Character ID must be a positive number.');
            }
        });

        it('should delete successfully when character exists', async () => {
            repositoryStub.getCharacterById.resolves({ id: 1, name: 'Char' });
            repositoryStub.deleteCharacterById.resolves();

            try {
                await characterService.deleteCharacter(1);
            } catch (error) {
                expect.fail('Expected no error to be thrown');
            }

            expect(repositoryStub.deleteCharacterById.calledOnce).to.be.true;
        });
    });


    describe('getAllCharacters', () => {
        it('should return a list of characters with default page and limit', async () => {
            const characters = [
                { id: 1, name: 'Char1', owner: { id: 10 }, rpg: { id: 20 } },
                { id: 2, name: 'Char2', owner: { id: 11 }, rpg: { id: 21 } },
            ];
            repositoryStub.getAllCharacters.resolves(characters);

            const result = await characterService.getAllCharacters(undefined, undefined);
            expect(result).to.have.length(2);
            expect(repositoryStub.getAllCharacters.calledWith(1, 10)).to.be.true;
        });

        it('should throw an error when page is negative', async () => {
            validatorStub.validatePage.throws(new Error('Page must be a positive integer.'));

            try {
                await characterService.getAllCharacters(-1, 10);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('Page must be a positive integer.');
            }
        });

        it('should throw an error when limit is negative', async () => {
            validatorStub.validateLimit.throws(new Error('Limit must be a positive integer.'));

            try {
                await characterService.getAllCharacters(1, -10);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('Limit must be a positive integer.');
            }
        });

        it('should return a list of characters with custom page and limit', async () => {
            const characters = [
                { id: 1, name: 'Char1', owner: { id: 10 }, rpg: { id: 20 } },
                { id: 2, name: 'Char2', owner: { id: 11 }, rpg: { id: 21 } },
            ];
            repositoryStub.getAllCharacters.resolves(characters);

            const result = await characterService.getAllCharacters(2, 5);
            expect(result).to.have.length(2);
            expect(repositoryStub.getAllCharacters.calledWith(2, 5)).to.be.true;
        });
    });


    describe('getCharactersByUserId', () => {
        it('should throw an error when userId is null', async () => {
            validatorStub.validateId.throws(new Error('User ID is required.'));

            try {
                await characterService.getCharactersByUserId(null);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('User ID is required.');
            }
        });

        it('should throw an error when userId is string', async () => {
            validatorStub.validateId.throws(new Error('User ID must be a number.'));

            try {
                await characterService.getCharactersByUserId('abc' as any);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('User ID must be a number.');
            }
        });

        it('should throw an error when userId is negative', async () => {
            validatorStub.validateId.throws(new Error('User ID must be a positive number.'));

            try {
                await characterService.getCharactersByUserId(-1);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('User ID must be a positive number.');
            }
        });

        it('should throw an error if user does not exist', async () => {
            validatorStub.validateUserExists.rejects(new Error('User with id: 99 does not exist.'));

            try {
                await characterService.getCharactersByUserId(99);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('User with id: 99 does not exist.');
            }
        });

        it('should return characters for a valid user', async () => {
            const characters = [
                { id: 1, name: 'Char1', owner: { id: 10 }, rpg: { id: 20 } },
                { id: 2, name: 'Char2', owner: { id: 10 }, rpg: { id: 20 } },
            ];
            repositoryStub.getCharactersByUserId.resolves(characters);

            const result = await characterService.getCharactersByUserId(10);
            expect(result).to.have.length(2);
            expect(repositoryStub.getCharactersByUserId.calledOnce).to.be.true;
        });
    });
});
