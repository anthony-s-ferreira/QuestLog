import { expect } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import { faker } from '@faker-js/faker';
import { EventFormDTO } from '../../src/domain/formDTO/EventFormDTO';

describe('EventService', () => {
    let sandbox: any;
    let eventService: any;

    let repositoryStub: any;
    let validatorStub: any;
    let characterServiceStub: any;
    let eventTypeServiceStub: any;

    beforeEach(() => {
        sandbox = sinon.createSandbox();

        repositoryStub = {
            getEventsByRPGId: sandbox.stub(),
            createEvent: sandbox.stub(),
            updateEvent: sandbox.stub(),
            getEvents: sandbox.stub(),
            getEvent: sandbox.stub(),
            deleteEvent: sandbox.stub()
        };

        // Validadores
        validatorStub = {
            validateEventDescription: sandbox.stub(),
            validateCharacterExists: sandbox.stub(),
            validateEventTypeExists: sandbox.stub(),
            validateEventExists: sandbox.stub(),
            validateId: sandbox.stub(),
            validateLimit: sandbox.stub(),
            validatePage: sandbox.stub(),
            validateRPGExists: sandbox.stub()
        };

        characterServiceStub = {
            getCharacterById: sandbox.stub()
        };

        eventTypeServiceStub = {
            convertEventType: sandbox.stub()
        };

        const eventServiceModule = proxyquire('../../src/services/EventService', {
            '../repositories/prismaEventRepository': repositoryStub,
            '../validators/EventValidator': {
                validateEventDescription: validatorStub.validateEventDescription,
                validateEventExists: validatorStub.validateEventExists
            },
            '../validators/CharacterValidator': {
                validateCharacterExists: validatorStub.validateCharacterExists
            },
            '../validators/EventTypeValidator': {
                validateEventTypeExists: validatorStub.validateEventTypeExists
            },
            '../validators/CommonValidator': {
                validateId: validatorStub.validateId,
                validateLimit: validatorStub.validateLimit,
                validatePage: validatorStub.validatePage
            },
            '../validators/RpgValidator': {
                validateRPGExists: validatorStub.validateRPGExists
            },
            './CharacterService': {
                CharacterService: function () {
                    return characterServiceStub;
                }
            },
            './EventTypeService': {
                EventTypeService: function () {
                    return eventTypeServiceStub;
                }
            }
        });

        eventService = new eventServiceModule.EventService();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('getEventsByRPGId', () => {
        it('should throw an error if rpgId is invalid', async () => {
            validatorStub.validateId.throws(new Error('RPG ID is required.'));

            try {
                await eventService.getEventsByRPGId(null, 1, 10);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('RPG ID is required.');
            }
        });

        it('should throw an error if page is negative', async () => {
            validatorStub.validateId.returns();
            validatorStub.validatePage.throws(new Error('Page must be a positive integer.'));

            try {
                await eventService.getEventsByRPGId(1, -1, 10);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('Page must be a positive integer.');
            }
        });

        it('should throw an error if limit is negative', async () => {
            validatorStub.validateId.returns();
            validatorStub.validatePage.returns();
            validatorStub.validateLimit.throws(new Error('Limit must be a positive integer.'));

            try {
                await eventService.getEventsByRPGId(1, 1, -10);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('Limit must be a positive integer.');
            }
        });

        it('should throw an error if RPG does not exist', async () => {
            validatorStub.validateId.returns();
            validatorStub.validatePage.returns();
            validatorStub.validateLimit.returns();
            validatorStub.validateRPGExists.rejects(new Error('RPG with id: 99 does not exist.'));

            try {
                await eventService.getEventsByRPGId(99, 1, 10);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('RPG with id: 99 does not exist.');
            }
        });

        it('should return a list of events when rpgId is valid', async () => {
            validatorStub.validateId.returns();
            validatorStub.validatePage.returns();
            validatorStub.validateLimit.returns();
            validatorStub.validateRPGExists.resolves();

            const events = [
                { id: 1, description: 'Event1', characterId: 10, type: 100 },
                { id: 2, description: 'Event2', characterId: 11, type: 101 }
            ];

            repositoryStub.getEventsByRPGId.resolves(events);

            characterServiceStub.getCharacterById.resolves({ id: 10, name: 'CharName' });
            eventTypeServiceStub.convertEventType.returns({ id: 100, name: 'TypeName' });

            const result = await eventService.getEventsByRPGId(1, 1, 10);
            expect(result).to.have.length(2);
            expect(repositoryStub.getEventsByRPGId.calledOnce).to.be.true;
        });
    });

    describe('createEvent', () => {
        it('should throw an error when event description is missing', async () => {
            validatorStub.validateEventDescription.throws(new Error('Event description is required.'));

            const invalidForm = {
                description: '',
                characterId: 10,
                typeId: 20
            };

            try {
                await eventService.createEvent(invalidForm);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('Event description is required.');
            }
        });

        it('should throw an error when character does not exist', async () => {
            validatorStub.validateEventDescription.returns();
            validatorStub.validateCharacterExists.rejects(new Error('Character with id: 999 does not exist.'));

            const invalidForm = {
                description: faker.string.alpha(20),
                characterId: 999,
                typeId: 20
            };

            try {
                await eventService.createEvent(invalidForm);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('Character with id: 999 does not exist.');
            }
        });

        it('should throw an error when event type does not exist', async () => {
            validatorStub.validateEventDescription.returns();
            validatorStub.validateCharacterExists.resolves();
            validatorStub.validateEventTypeExists.rejects(new Error('Event Type with id: 50 does not exist.'));

            const invalidForm = {
                description: faker.string.alpha(20),
                characterId: 10,
                typeId: 50
            };

            try {
                await eventService.createEvent(invalidForm);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('Event Type with id: 50 does not exist.');
            }
        });

        it('should create event successfully when data is valid', async () => {
            validatorStub.validateEventDescription.returns();
            validatorStub.validateCharacterExists.resolves();
            validatorStub.validateEventTypeExists.resolves();

            const validForm = {
                description: faker.string.alpha(20),
                characterId: 10,
                typeId: 20
            };

            const createdEvent = {
                id: 1,
                description: validForm.description,
                characterId: validForm.characterId,
                type: validForm.typeId,
                createdAt: new Date()
            };

            repositoryStub.createEvent.resolves(createdEvent);

            characterServiceStub.getCharacterById.resolves({ id: 10, name: 'CharName' });
            eventTypeServiceStub.convertEventType.returns({ id: 20, name: 'EventTypeName' });

            const result = await eventService.createEvent(validForm);
            expect(result.id).to.equal(1);
            expect(result.description).to.equal(validForm.description);
            expect(repositoryStub.createEvent.calledOnce).to.be.true;
        });
    });

    describe('updateEvent', () => {
        it('should throw an error if event id is invalid', async () => {
            validatorStub.validateId.throws(new Error('Event ID is required.'));

            try {
                await eventService.updateEvent(null, {});
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('Event ID is required.');
            }
        });

        it('should throw an error if event does not exist', async () => {
            validatorStub.validateId.returns();
            validatorStub.validateId.returns(); // for eventForm.character
            validatorStub.validateId.returns(); // for eventForm.type
            validatorStub.validateEventExists.rejects(new Error('Event not found.'));

            try {
                await eventService.updateEvent(99, {
                    character: 1,
                    type: 2,
                    description: 'Desc'
                });
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('Event not found.');
            }
        });

        it('should throw an error if character does not exist', async () => {
            validatorStub.validateId.returns();
            validatorStub.validateEventExists.resolves();
            validatorStub.validateCharacterExists.rejects(new Error('Character with id: 999 does not exist.'));

            try {
                await eventService.updateEvent(1, {
                    character: 999,
                    type: 2,
                    description: 'Valid description with length >= 20'
                });
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('Character with id: 999 does not exist.');
            }
        });

        it('should throw an error if event type does not exist', async () => {
            validatorStub.validateId.returns();
            validatorStub.validateEventExists.resolves();
            validatorStub.validateCharacterExists.resolves();
            validatorStub.validateEventTypeExists.rejects(new Error('Event type with id: 500 does not exist.'));

            try {
                await eventService.updateEvent(1, {
                    character: 1,
                    type: 500,
                    description: 'Valid description with length >= 20'
                });
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('Event type with id: 500 does not exist.');
            }
        });

        it('should throw an error if description is invalid', async () => {
            validatorStub.validateId.returns();
            validatorStub.validateEventExists.resolves();
            validatorStub.validateCharacterExists.resolves();
            validatorStub.validateEventTypeExists.resolves();
            validatorStub.validateEventDescription.throws(new Error('Event description must have at least 20 characters.'));

            try {
                await eventService.updateEvent(1, {
                    character: 10,
                    type: 20,
                    description: 'short'
                });
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('Event description must have at least 20 characters.');
            }
        });

        it('should update successfully if data is valid', async () => {
            validatorStub.validateId.returns();
            validatorStub.validateEventExists.resolves();
            validatorStub.validateCharacterExists.resolves();
            validatorStub.validateEventTypeExists.resolves();
            validatorStub.validateEventDescription.returns();

            const existingEvent = {
                id: 1,
                description: 'Old desc',
                characterId: 10,
                type: 20,
                createdAt: new Date()
            };

            repositoryStub.getEvent.resolves(existingEvent);

            const updatedEvent = {
                id: 1,
                description: 'New valid event description',
                character: 10,
                type: 20
            };

            repositoryStub.updateEvent.resolves({
                ...existingEvent,
                description: updatedEvent.description,
                characterId: updatedEvent.character,
                type: updatedEvent.type,
            });

            // Stubs convertEvent
            characterServiceStub.getCharacterById.resolves({ id: 10, name: 'SomeChar' });
            eventTypeServiceStub.convertEventType.returns({ id: 20, name: 'SomeEventType' });

            const result = await eventService.updateEvent(1, {
                character: 10,
                type: 20,
                description: 'New valid event description'
            });

            expect(result.description).to.equal('New valid event description');
            expect(repositoryStub.updateEvent.calledOnce).to.be.true;
        });
    });

    describe('getEvents', () => {
        it('should throw an error when page is negative', async () => {
            validatorStub.validatePage.throws(new Error('Page number must be a positive integer.'));

            try {
                await eventService.getEvents(-1, 10);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('Page number must be a positive integer.');
            }
        });

        it('should throw an error when limit is negative', async () => {
            validatorStub.validatePage.returns();
            validatorStub.validateLimit.throws(new Error('Limit must be a positive integer.'));

            try {
                await eventService.getEvents(1, -5);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('Limit must be a positive integer.');
            }
        });

        it('should return a list of events with default page/limit', async () => {
            validatorStub.validatePage.returns();
            validatorStub.validateLimit.returns();

            const events = [
                { id: 1, description: 'Event1', characterId: 10, type: 100, createdAt: new Date() },
                { id: 2, description: 'Event2', characterId: 11, type: 101, createdAt: new Date() }
            ];
            repositoryStub.getEvents.resolves(events);

            // convertEvent stubs
            characterServiceStub.getCharacterById.resolves({ id: 10, name: 'CharName' });
            eventTypeServiceStub.convertEventType.returns({ id: 100, name: 'TypeName' });

            const result = await eventService.getEvents(undefined, undefined);
            expect(result).to.have.length(2);
            expect(repositoryStub.getEvents.calledOnce).to.be.true;
        });
    });

    describe('getEvent', () => {
        it('should throw an error if event id is invalid', async () => {
            validatorStub.validateId.throws(new Error('Event ID is required.'));

            try {
                await eventService.getEvent(null);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('Event ID is required.');
            }
        });

        it('should throw an error if event does not exist', async () => {
            validatorStub.validateId.returns();
            validatorStub.validateEventExists.rejects(new Error('Event not found.'));

            try {
                await eventService.getEvent(99);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                expect(error.message).to.equal('Event not found.');
            }
        });

        it('should retrieve an event successfully', async () => {
            validatorStub.validateId.returns();
            validatorStub.validateEventExists.resolves();

            const theEvent = {
                id: 1,
                description: 'Some event description',
                characterId: 10,
                type: 100,
                createdAt: new Date()
            };

            repositoryStub.getEvent.resolves(theEvent);
            characterServiceStub.getCharacterById.resolves({ id: 10, name: 'CharName' });
            eventTypeServiceStub.convertEventType.returns({ id: 100, name: 'TypeName' });

            const result = await eventService.getEvent(1);
            expect(result.id).to.equal(1);
            expect(result.description).to.equal(theEvent.description);
            expect(repositoryStub.getEvent.calledOnce).to.be.true;
        });
    });

    describe('deleteEvent', () => {
        it('should delete an event successfully', async () => {
            repositoryStub.deleteEvent.resolves();

            try {
                await eventService.deleteEvent(1);
            } catch (error) {
                expect.fail('Expected no error to be thrown');
            }

            expect(repositoryStub.deleteEvent.calledOnce).to.be.true;
        });
    });
});