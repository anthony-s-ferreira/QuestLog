import { expect } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import { faker } from '@faker-js/faker';
import { RPGFormDTO } from '../../src/domain/formDTO/RpgFormDTO';

describe('RpgService', () => {
  let sandbox: any;
  let rpgService: any;
  let repositoryStub: any;
  let validatorStub: any;
  let userServiceStub: any;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    repositoryStub = {
      createRpg: sandbox.stub(),
      getAllRpgs: sandbox.stub(),
      getRpgById: sandbox.stub(),
      updateRpg: sandbox.stub(),
      getRpgsByUserId: sandbox.stub(),
      updateRPGStatus: sandbox.stub(),
      deleteRPGById: sandbox.stub(),
      getRpgUsers: sandbox.stub()
    };

    validatorStub = {
      validateRPGName: sandbox.stub(),
      validateRPGDescription: sandbox.stub(),
      validateRPGStatus: sandbox.stub(),
      validateRPGExists: sandbox.stub(),
      validateId: sandbox.stub(),
      validateLimit: sandbox.stub(),
      validatePage: sandbox.stub(),
      validateUserExists: sandbox.stub()
    };

    userServiceStub = {
      convertUser: sandbox.stub(),
    };

    const rpgServiceModule = proxyquire('../../src/services/RpgService', {
      '../repositories/prismaRpgRepository': repositoryStub,
      '../validators/RpgValidator': {
        validateRPGName: validatorStub.validateRPGName,
        validateRPGDescription: validatorStub.validateRPGDescription,
        validateRPGStatus: validatorStub.validateRPGStatus,
        validateRPGExists: validatorStub.validateRPGExists
      },
      '../validators/CommonValidator': {
        validateId: validatorStub.validateId,
        validateLimit: validatorStub.validateLimit,
        validatePage: validatorStub.validatePage
      },
      '../validators/UserValidator': {
        validateUserExists: validatorStub.validateUserExists
      },
      './UserService': {
        UserService: function () {
          return userServiceStub;
        }
      }
    });

    rpgService = new rpgServiceModule.RpgService();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('createRPG', () => {
    it('should throw an error if name is missing', async () => {
      validatorStub.validateRPGName.throws(new Error('RPG name is required.'));

      const invalidRPG: RPGFormDTO = {
        name: '',
        description: 'Some description with >= 20 chars',
        masterid: 1,
        active: true
      };

      try {
        await rpgService.createRPG(invalidRPG);
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('RPG name is required.');
      }
    });

    it('should throw an error if name is too short', async () => {
      validatorStub.validateRPGName.throws(new Error('RPG name must have at least 3 characters.'));

      const invalidRPG: RPGFormDTO = {
        name: faker.string.alpha(2),
        description: faker.string.alpha(20),
        masterid: 1,
        active: true
      };

      try {
        await rpgService.createRPG(invalidRPG);
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('RPG name must have at least 3 characters.');
      }
    });

    it('should throw an error if name is too long', async () => {
      validatorStub.validateRPGName.throws(new Error('RPG name must have at most 20 characters.'));

      const invalidRPG: RPGFormDTO = {
        name: faker.string.alpha(21),
        description: faker.string.alpha(20),
        masterid: 1,
        active: true
      };

      try {
        await rpgService.createRPG(invalidRPG);
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('RPG name must have at most 20 characters.');
      }
    });

    it('should throw an error if description is missing', async () => {
      validatorStub.validateRPGName.returns();
      validatorStub.validateRPGDescription.throws(new Error('RPG description is required.'));

      const invalidRPG: RPGFormDTO = {
        name: 'MyRPG',
        description: '',
        masterid: 1,
        active: true
      };

      try {
        await rpgService.createRPG(invalidRPG);
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('RPG description is required.');
      }
    });

    it('should throw an error if description is too short', async () => {
      validatorStub.validateRPGName.returns();
      validatorStub.validateRPGDescription.throws(new Error('RPG description must have at least 20 characters.'));

      const invalidRPG: RPGFormDTO = {
        name: 'MyRPG',
        description: faker.string.alpha(10),
        masterid: 1,
        active: true
      };

      try {
        await rpgService.createRPG(invalidRPG);
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('RPG description must have at least 20 characters.');
      }
    });

    it('should throw an error if description is too long', async () => {
      validatorStub.validateRPGName.returns();
      validatorStub.validateRPGDescription.throws(new Error('RPG description must have at most 200 characters.'));

      const invalidRPG: RPGFormDTO = {
        name: 'MyRPG',
        description: faker.string.alpha(201),
        masterid: 1,
        active: true
      };

      try {
        await rpgService.createRPG(invalidRPG);
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('RPG description must have at most 200 characters.');
      }
    });

    it('should throw an error if masterid is null', async () => {
      validatorStub.validateRPGName.returns();
      validatorStub.validateRPGDescription.returns();
      validatorStub.validateId.throws(new Error('User ID is required.'));

      const invalidRPG: RPGFormDTO = {
        name: 'MyRPG',
        description: faker.string.alpha(20),
        masterid: null as any,
        active: true
      };

      try {
        await rpgService.createRPG(invalidRPG);
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('User ID is required.');
      }
    });

    it('should throw an error if masterid is negative', async () => {
      validatorStub.validateRPGName.returns();
      validatorStub.validateRPGDescription.returns();
      validatorStub.validateId.throws(new Error('User ID must be a positive number.'));

      const invalidRPG: RPGFormDTO = {
        name: 'MyRPG',
        description: faker.string.alpha(20),
        masterid: -1,
        active: true
      };

      try {
        await rpgService.createRPG(invalidRPG);
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('User ID must be a positive number.');
      }
    });

    it('should throw an error if RPG status is invalid', async () => {
      validatorStub.validateRPGName.returns();
      validatorStub.validateRPGDescription.returns();
      validatorStub.validateId.returns();
      validatorStub.validateRPGStatus.throws(new Error('RPG status must be a boolean.'));

      const invalidRPG: RPGFormDTO = {
        name: 'MyRPG',
        description: faker.string.alpha(20),
        masterid: 1,
        active: 'notBoolean' as any
      };

      try {
        await rpgService.createRPG(invalidRPG);
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('RPG status must be a boolean.');
      }
    });

    it('should create a RPG successfully if data is valid (name min size)', async () => {
      validatorStub.validateRPGName.returns();
      validatorStub.validateRPGDescription.returns();
      validatorStub.validateId.returns();
      validatorStub.validateRPGStatus.returns();

      const validRPG: RPGFormDTO = {
        name: faker.string.alphanumeric(3),
        description: faker.string.alpha(20),
        masterid: 1,
        active: true
      };

      const createdRPG = {
        id: 10,
        name: validRPG.name,
        description: validRPG.description,
        masterid: validRPG.masterid,
        active: validRPG.active,
        master: { id: 1, username: 'MasterUser' }
      };

      repositoryStub.createRpg.resolves(createdRPG);
      userServiceStub.convertUser.returns({ id: 1, username: 'MasterUser' });

      const result = await rpgService.createRPG(validRPG);
      expect(result.id).to.equal(10);
      expect(result.name).to.equal(validRPG.name);
      expect(repositoryStub.createRpg.calledOnce).to.be.true;
    });

    it('should create a RPG successfully if data is valid (name max size)', async () => {
      validatorStub.validateRPGName.returns();
      validatorStub.validateRPGDescription.returns();
      validatorStub.validateId.returns();
      validatorStub.validateRPGStatus.returns();

      const validRPG: RPGFormDTO = {
        name: faker.string.alphanumeric(20),
        description: faker.string.alpha(20),
        masterid: 1,
        active: true
      };

      const createdRPG = {
        id: 11,
        name: validRPG.name,
        description: validRPG.description,
        masterid: validRPG.masterid,
        active: validRPG.active,
        master: { id: 1, username: 'MasterUser' }
      };

      repositoryStub.createRpg.resolves(createdRPG);
      userServiceStub.convertUser.returns({ id: 1, username: 'MasterUser' });

      const result = await rpgService.createRPG(validRPG);
      expect(result.id).to.equal(11);
      expect(result.name).to.equal(validRPG.name);
      expect(repositoryStub.createRpg.calledOnce).to.be.true;
    });

    it('should create a RPG successfully if data is valid (description min size)', async () => {
      validatorStub.validateRPGName.returns();
      validatorStub.validateRPGDescription.returns();
      validatorStub.validateId.returns();
      validatorStub.validateRPGStatus.returns();

      const validRPG: RPGFormDTO = {
        name: 'MyRPG',
        description: faker.string.alpha(20),
        masterid: 1,
        active: true
      };

      const createdRPG = {
        id: 12,
        name: validRPG.name,
        description: validRPG.description,
        masterid: validRPG.masterid,
        active: validRPG.active,
        master: { id: 1, username: 'MasterUser' }
      };

      repositoryStub.createRpg.resolves(createdRPG);
      userServiceStub.convertUser.returns({ id: 1, username: 'MasterUser' });

      const result = await rpgService.createRPG(validRPG);
      expect(result.id).to.equal(12);
      expect(result.description).to.equal(validRPG.description);
      expect(repositoryStub.createRpg.calledOnce).to.be.true;
    });

    it('should create a RPG successfully if data is valid (description max size)', async () => {
      validatorStub.validateRPGName.returns();
      validatorStub.validateRPGDescription.returns();
      validatorStub.validateId.returns();
      validatorStub.validateRPGStatus.returns();

      const validRPG: RPGFormDTO = {
        name: 'MyRPGMaxDesc',
        description: faker.string.alpha(200),
        masterid: 1,
        active: true
      };

      const createdRPG = {
        id: 13,
        name: validRPG.name,
        description: validRPG.description,
        masterid: validRPG.masterid,
        active: validRPG.active,
        master: { id: 1, username: 'MasterUser' }
      };

      repositoryStub.createRpg.resolves(createdRPG);
      userServiceStub.convertUser.returns({ id: 1, username: 'MasterUser' });

      const result = await rpgService.createRPG(validRPG);
      expect(result.id).to.equal(13);
      expect(result.description).to.equal(validRPG.description);
      expect(repositoryStub.createRpg.calledOnce).to.be.true;
    });
  });

  describe('getAllRPGs', () => {
    it('should throw an error when page is negative', async () => {
      validatorStub.validatePage.throws(new Error('Page number must be a positive integer.'));

      try {
        await rpgService.getAllRPGs(-1, 10);
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('Page number must be a positive integer.');
      }
    });

    it('should throw an error when limit is negative', async () => {
      validatorStub.validatePage.returns();
      validatorStub.validateLimit.throws(new Error('Limit must be a positive integer.'));

      try {
        await rpgService.getAllRPGs(1, -10);
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('Limit must be a positive integer.');
      }
    });

    it('should return a list of RPGs with default pagination', async () => {
      validatorStub.validatePage.returns();
      validatorStub.validateLimit.returns();

      const rpgs = [
        { id: 1, name: 'RPG1', master: { id: 10 }, active: true },
        { id: 2, name: 'RPG2', master: { id: 11 }, active: false },
      ];

      repositoryStub.getAllRpgs.resolves(rpgs);
      userServiceStub.convertUser.returns({ id: 10, username: 'User10' });

      const result = await rpgService.getAllRPGs(undefined, undefined);
      expect(result).to.have.length(2);
      expect(repositoryStub.getAllRpgs.calledWith(1, 10)).to.be.true;
    });

    it('should return a list of RPGs with custom pagination', async () => {
      validatorStub.validatePage.returns();
      validatorStub.validateLimit.returns();

      const rpgs = [
        { id: 1, name: 'RPG1', master: { id: 10 }, active: true },
        { id: 2, name: 'RPG2', master: { id: 11 }, active: false },
      ];

      repositoryStub.getAllRpgs.resolves(rpgs);
      userServiceStub.convertUser.returns({ id: 10, username: 'User10' });

      const result = await rpgService.getAllRPGs(2, 5);
      expect(result).to.have.length(2);
      expect(repositoryStub.getAllRpgs.calledWith(2, 5)).to.be.true;
    });
  });

  describe('getRPGById', () => {
    it('should throw an error if id is null', async () => {
      validatorStub.validateId.throws(new Error('RPG ID is required.'));

      try {
        await rpgService.getRPGById(null);
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('RPG ID is required.');
      }
    });

    it('should throw an error if id is string', async () => {
      validatorStub.validateId.throws(new Error('RPG ID must be a number.'));

      try {
        await rpgService.getRPGById('test');
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('RPG ID must be a number.');
      }
    });

    it('should throw an error if id is a negative number', async () => {
      validatorStub.validateId.throws(new Error('RPG ID must be a positive number.'));

      try {
        await rpgService.getRPGById(-1);
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('RPG ID must be a positive number.');
      }
    });

    it('should throw an error if rpg does not exist', async () => {
      validatorStub.validateId.returns();
      validatorStub.validateRPGExists.rejects(new Error('RPG not found.'));

      try {
        await rpgService.getRPGById(99);
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('RPG not found.');
      }
    });

    it('should get rpg successfully if id is valid', async () => {
      validatorStub.validateId.returns();
      validatorStub.validateRPGExists.resolves();

      const theRpg = {
        id: 1,
        name: 'MyRPG',
        description: 'Some description',
        master: { id: 10 },
        active: true
      };

      repositoryStub.getRpgById.resolves(theRpg);
      userServiceStub.convertUser.returns({ id: 10, username: 'MasterUser' });

      const result = await rpgService.getRPGById(1);
      expect(result.id).to.equal(1);
      expect(result.name).to.equal('MyRPG');
      expect(repositoryStub.getRpgById.calledOnce).to.be.true;
    });
  });

  describe('updateRPG', () => {
    it('should throw an error if rpg id is invalid', async () => {
      validatorStub.validateId.throws(new Error('RPG ID is required.'));

      try {
        await rpgService.updateRPG(null, {});
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('RPG ID is required.');
      }
    });

    it('should throw an error if rpg id is a string', async () => {
      validatorStub.validateId.throws(new Error('RPG ID must be a number.'));

      try {
        await rpgService.updateRPG('test' as any, {});
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('RPG ID must be a number.');
      }
    });

    it('should throw an error if rpg id is a negative number', async () => {
      validatorStub.validateId.throws(new Error('RPG ID must be a positive number.'));

      try {
        await rpgService.updateRPG(-1, {});
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('RPG ID must be a positive number.');
      }
    });

    it('should throw an error if rpg does not exist', async () => {
      validatorStub.validateId.returns();
      validatorStub.validateRPGExists.rejects(new Error('RPG not found.'));

      try {
        await rpgService.updateRPG(99, {
          name: 'NewName',
          description: 'Some desc >= 20 chars',
          masterid: 1,
          active: true
        });
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('RPG not found.');
      }
    });

    it('should throw an error if name is invalid', async () => {
      validatorStub.validateId.returns();
      validatorStub.validateRPGExists.resolves();
      validatorStub.validateRPGName.throws(new Error('RPG name must have at least 3 characters.'));

      try {
        await rpgService.updateRPG(1, {
          name: 'aa',
          description: 'Valid enough description >= 20 chars',
          masterid: 1,
          active: true
        });
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('RPG name must have at least 3 characters.');
      }
    });

    it('should throw an error if description is invalid', async () => {
      validatorStub.validateId.returns();
      validatorStub.validateRPGExists.resolves();
      validatorStub.validateRPGName.returns();
      validatorStub.validateRPGDescription.throws(new Error('RPG description must have at least 20 characters.'));

      try {
        await rpgService.updateRPG(1, {
          name: 'MyRPG',
          description: 'short',
          masterid: 1,
          active: true
        });
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('RPG description must have at least 20 characters.');
      }
    });

    it('should update successfully if data is valid', async () => {
      validatorStub.validateId.returns();
      validatorStub.validateRPGExists.resolves();
      validatorStub.validateRPGName.returns();
      validatorStub.validateRPGDescription.returns();

      const existingRpg = {
        id: 1,
        name: 'OldName',
        description: 'OldDesc with >= 20 chars',
        master: { id: 10, username: 'MasterUser' },
        active: true
      };

      repositoryStub.getRpgById.resolves(existingRpg);

      const updatedRpgMock = {
        id: 1,
        name: 'NewName',
        description: 'New valid description >= 20 chars',
        master: { id: 10, username: 'MasterUser' },
        active: true
      };

      repositoryStub.updateRpg.resolves(updatedRpgMock);
      userServiceStub.convertUser.returns({ id: 10, username: 'MasterUser' });

      const result = await rpgService.updateRPG(1, {
        name: 'NewName',
        description: 'New valid description >= 20 chars',
        masterid: 10,
        active: true
      });
      expect(result.name).to.equal('NewName');
      expect(repositoryStub.updateRpg.calledOnce).to.be.true;
    });
  });

  describe('getRPGByUserId', () => {
    it('should throw an error if userId is invalid', async () => {
      validatorStub.validateId.throws(new Error('User ID is required.'));

      try {
        await rpgService.getRPGByUserId(null);
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('User ID is required.');
      }
    });

    it('should throw an error if userId is negative', async () => {
      validatorStub.validateId.throws(new Error('User ID must be a positive number.'));

      try {
        await rpgService.getRPGByUserId(-5);
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('User ID must be a positive number.');
      }
    });

    it('should throw an error if user does not exist', async () => {
      validatorStub.validateId.returns();
      validatorStub.validateUserExists.rejects(new Error('User with id: 99 does not exist.'));

      try {
        await rpgService.getRPGByUserId(99);
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('User with id: 99 does not exist.');
      }
    });

    it('should return a list of RPGs for a valid user', async () => {
      validatorStub.validateId.returns();
      validatorStub.validateUserExists.resolves();

      const rpgs = [
        { id: 1, name: 'RPG1', master: { id: 10 } },
        { id: 2, name: 'RPG2', master: { id: 10 } },
      ];

      repositoryStub.getRpgsByUserId.resolves(rpgs);
      userServiceStub.convertUser.returns({ id: 10, username: 'MasterUser' });

      const result = await rpgService.getRPGByUserId(10);
      expect(result).to.have.length(2);
      expect(repositoryStub.getRpgsByUserId.calledOnce).to.be.true;
    });
  });

  describe('updateRPGStatus', () => {
    it('should throw an error if id is invalid', async () => {
      validatorStub.validateId.throws(new Error('RPG ID is required.'));

      try {
        await rpgService.updateRPGStatus(null, true);
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('RPG ID is required.');
      }
    });

    it('should throw an error if rpg does not exist', async () => {
      validatorStub.validateId.returns();
      validatorStub.validateRPGExists.rejects(new Error('RPG not found.'));

      try {
        await rpgService.updateRPGStatus(99, true);
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('RPG not found.');
      }
    });

    it('should throw an error if active is not boolean', async () => {
      validatorStub.validateId.returns();
      validatorStub.validateRPGExists.resolves();
      validatorStub.validateRPGStatus.throws(new Error('RPG status must be a boolean.'));

      try {
        await rpgService.updateRPGStatus(1, 'invalid' as any);
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('RPG status must be a boolean.');
      }
    });

    it('should update rpg status successfully', async () => {
      validatorStub.validateId.returns();
      validatorStub.validateRPGExists.resolves();
      validatorStub.validateRPGStatus.returns();

      const existingRpg = {
        id: 1,
        name: 'MyRPG',
        description: 'Some description',
        master: { id: 10 },
        active: false
      };

      repositoryStub.getRpgById.resolves(existingRpg);

      const updatedRpg = {
        ...existingRpg,
        active: true
      };

      repositoryStub.updateRPGStatus.resolves(updatedRpg);
      userServiceStub.convertUser.returns({ id: 10, username: 'MasterUser' });

      const result = await rpgService.updateRPGStatus(1, true);
      expect(result.active).to.be.true;
      expect(repositoryStub.updateRPGStatus.calledOnce).to.be.true;
    });
  });

  describe('deleteRPG', () => {
    it('should throw an error if id is invalid', async () => {
      validatorStub.validateId.throws(new Error('RPG ID is required.'));

      try {
        await rpgService.deleteRPG(null);
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('RPG ID is required.');
      }
    });

    it('should throw an error if id is negative', async () => {
      validatorStub.validateId.throws(new Error('RPG ID must be a positive number.'));

      try {
        await rpgService.deleteRPG(-1);
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('RPG ID must be a positive number.');
      }
    });

    it('should throw an error if rpg does not exist', async () => {
      validatorStub.validateId.returns();
      validatorStub.validateRPGExists.rejects(new Error('RPG not found.'));

      try {
        await rpgService.deleteRPG(99);
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('RPG not found.');
      }
    });

    it('should delete rpg successfully if it exists', async () => {
      validatorStub.validateId.returns();
      validatorStub.validateRPGExists.resolves();
      repositoryStub.deleteRPGById.resolves();

      try {
        await rpgService.deleteRPG(1);
      } catch (error) {
        expect.fail('Expected no error to be thrown');
      }

      expect(repositoryStub.deleteRPGById.calledOnce).to.be.true;
    });
  });

  describe('validateUserInRPG', () => {
    it('should throw an error if rpgId is invalid', async () => {
      validatorStub.validateId.throws(new Error('RPG ID is required.'));

      try {
        await rpgService.validateUserInRPG(null, 10);
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('RPG ID is required.');
      }
    });

    it('should throw an error if rpgId is negative', async () => {
      validatorStub.validateId.onFirstCall().throws(new Error('RPG ID must be a positive number.'));

      try {
        await rpgService.validateUserInRPG(-1, 10);
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('RPG ID must be a positive number.');
      }
    });

    it('should throw an error if userId is invalid', async () => {
      validatorStub.validateId.onFirstCall().returns();
      validatorStub.validateId.onSecondCall().throws(new Error('User ID is required.'));

      try {
        await rpgService.validateUserInRPG(1, null);
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('User ID is required.');
      }
    });

    it('should throw an error if userId is string', async () => {
      validatorStub.validateId.onFirstCall().returns();
      validatorStub.validateId.onSecondCall().throws(new Error('User ID must be a number.'));

      try {
        await rpgService.validateUserInRPG(1, 'abc' as any);
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('User ID must be a number.');
      }
    });

    it('should throw an error if rpg does not exist', async () => {
      validatorStub.validateId.returns();
      validatorStub.validateRPGExists.rejects(new Error('RPG not found.'));

      try {
        await rpgService.validateUserInRPG(99, 10);
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('RPG not found.');
      }
    });

    it('should throw an error if user does not exist', async () => {
      validatorStub.validateId.returns();
      validatorStub.validateRPGExists.resolves();
      validatorStub.validateUserExists.rejects(new Error('User not found.'));

      try {
        await rpgService.validateUserInRPG(1, 99);
        expect.fail('Expected error was not thrown');
      } catch (error) {
        expect(error.message).to.equal('User not found.');
      }
    });

    it('should return true if user is the RPG master', async () => {
      validatorStub.validateId.returns();
      validatorStub.validateRPGExists.resolves();
      validatorStub.validateUserExists.resolves();

      const rpgInfo = {
        masterid: 10,
        characters: [
          { id: 1, ownerId: 20 },
          { id: 2, ownerId: 21 }
        ]
      };
      repositoryStub.getRpgUsers.resolves(rpgInfo);

      const result = await rpgService.validateUserInRPG(1, 10);
      expect(result).to.be.true;
    });

    it('should return true if user is the owner of at least one character', async () => {
      validatorStub.validateId.returns();
      validatorStub.validateRPGExists.resolves();
      validatorStub.validateUserExists.resolves();

      const rpgInfo = {
        masterid: 10,
        characters: [
          { id: 1, ownerId: 20 },
          { id: 2, ownerId: 21 }
        ]
      };
      repositoryStub.getRpgUsers.resolves(rpgInfo);

      const result = await rpgService.validateUserInRPG(1, 20);
      expect(result).to.be.true;
    });

    it('should return false if user is neither master nor character owner', async () => {
      validatorStub.validateId.returns();
      validatorStub.validateRPGExists.resolves();
      validatorStub.validateUserExists.resolves();

      const rpgInfo = {
        masterid: 10,
        characters: [
          { id: 1, ownerId: 20 },
          { id: 2, ownerId: 21 }
        ]
      };
      repositoryStub.getRpgUsers.resolves(rpgInfo);

      const result = await rpgService.validateUserInRPG(1, 99);
      expect(result).to.be.false;
    });
  });
});
