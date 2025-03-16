import { expect } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import { EventTypeFormDTO } from '../../src/domain/formDTO/EventTypeFormDTO';
import { EventTypeDTO } from '../../src/domain/DTO/EventTypeDTO';
import { EventType } from '../../src/domain/entities/EventType';
import { faker } from '@faker-js/faker';

describe('EventTypeService', () => {
    let sandbox: sinon.SinonSandbox;
    let eventTypeService: any;
    let repositoryStub: any;
    let validatorStub: any;

    beforeEach(() => {
        sandbox = sinon.createSandbox();

        repositoryStub = {
            createEventType: sandbox.stub(),
            updateEventType: sandbox.stub(),
            getEventTypes: sandbox.stub(),
            getEventType: sandbox.stub(),
            deleteEventType: sandbox.stub(),
        };

        validatorStub = {
            validateEventTypeName: sandbox.stub(),
            validateEventTypeDescription: sandbox.stub(),
            validateEventTypeExists: sandbox.stub(),
            validateId: sandbox.stub(),
        };

        const eventTypeServiceModule = proxyquire('../../src/services/EventTypeService', {
            '../../src/repositories/prismaEventTypeRepository': repositoryStub,
            '../../src/validators/EventTypeValidator': validatorStub,
            '../../src/validators/CommonValidator': { validateId: validatorStub.validateId },
        });

        eventTypeService = new eventTypeServiceModule.EventTypeService();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('createEventType', () => {
        it('should throw an error when name is invalid', async () => {
            validatorStub.validateEventTypeName.throws(new Error('Event Type name is required.'));

            const invalidEventTypeForm: EventTypeFormDTO = {
                name: '',
                description: 'A valid description for an event type.'
            };

            try {
                await eventTypeService.createEventType(invalidEventTypeForm);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                if (error instanceof Error) {
                    expect(error.message).to.equal('Event Type name is required.');
                } else {
                    expect.fail('Caught an unknown error type');
                }
            }
        });

        it('should throw an error when name is missing', async () => {
            const eventTypeForm: Partial<EventTypeFormDTO> = {
                description: 'A valid event type description.'
            };
    
            validatorStub.validateEventTypeName.throws(new Error('Event Type name is required.'));
    
            try {
                await eventTypeService.createEventType(eventTypeForm as EventTypeFormDTO);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                if (error instanceof Error) {
                    expect(error.message).to.equal('Event Type name is required.');
                } else {
                    expect.fail('Caught an unknown error type');
                }
            }
    
            expect(repositoryStub.createEventType.called).to.be.false;
        });
    
        it('should throw an error when description is missing', async () => {
            const eventTypeForm: Partial<EventTypeFormDTO> = {
                name: 'Conference'
            };
    
            validatorStub.validateEventTypeDescription.throws(new Error('Event Type description is required.'));
    
            try {
                await eventTypeService.createEventType(eventTypeForm as EventTypeFormDTO);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                if (error instanceof Error) {
                    expect(error.message).to.equal('Event Type description is required.');
                } else {
                    expect.fail('Caught an unknown error type');
                }
            }
    
            expect(repositoryStub.createEventType.called).to.be.false;
        });
    
        it('should throw an error when description does not have the minimun size', async () => {
            const eventTypeForm: Partial<EventTypeFormDTO> = {
                name: 'Conference',
                description: 'Less than 20'
            };
    
            validatorStub.validateEventTypeDescription.throws(new Error('Event Type description must have at least 20 characters.'));
    
            try {
                await eventTypeService.createEventType(eventTypeForm as EventTypeFormDTO);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                if (error instanceof Error) {
                    expect(error.message).to.equal('Event Type description must have at least 20 characters.');
                } else {
                    expect.fail('Caught an unknown error type');
                }
            }
    
            expect(repositoryStub.createEventType.called).to.be.false;
        });

        it('should throw an error when description has more than the max size', async () => {
            const eventTypeForm: Partial<EventTypeFormDTO> = {
                name: 'Conference',
                description: faker.string.alphanumeric(201)
            };
    
            validatorStub.validateEventTypeDescription.throws(new Error('Event Type description must have at most 200 characters.'));
    
            try {
                await eventTypeService.createEventType(eventTypeForm as EventTypeFormDTO);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                if (error instanceof Error) {
                    expect(error.message).to.equal('Event Type description must have at most 200 characters.');
                } else {
                    expect.fail('Caught an unknown error type');
                }
            }
    
            expect(repositoryStub.createEventType.called).to.be.false;
        });

        it('should throw an error when name does not have the minimun size', async () => {
            const eventTypeForm: Partial<EventTypeFormDTO> = {
                name: faker.string.alphanumeric(2),
                description: faker.string.alphanumeric(200)
            };
    
            validatorStub.validateEventTypeDescription.throws(new Error('Event Type name must have at least 3 characters.'));
    
            try {
                await eventTypeService.createEventType(eventTypeForm as EventTypeFormDTO);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                if (error instanceof Error) {
                    expect(error.message).to.equal('Event Type name must have at least 3 characters.');
                } else {
                    expect.fail('Caught an unknown error type');
                }
            }
    
            expect(repositoryStub.createEventType.called).to.be.false;
        });

        it('should throw an error when name has more than the max size', async () => {
            const eventTypeForm: Partial<EventTypeFormDTO> = {
                name: faker.string.alphanumeric(21),
                description: faker.string.alphanumeric(201)
            };
    
            validatorStub.validateEventTypeDescription.throws(new Error('Event Type name must have at most 20 characters'));
    
            try {
                await eventTypeService.createEventType(eventTypeForm as EventTypeFormDTO);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                if (error instanceof Error) {
                    expect(error.message).to.equal('Event Type name must have at most 20 characters');
                } else {
                    expect.fail('Caught an unknown error type');
                }
            }
    
            expect(repositoryStub.createEventType.called).to.be.false;
        });

        it('Should create sucessfully when the EventType name has the minimun size', async () => {
            const eventTypeForm: Partial<EventTypeFormDTO> = {
                name: faker.string.alphanumeric(3),
                description: faker.string.alphanumeric(50)
            };
        
            const expectedEventType = {
                name: eventTypeForm.name,
                description: eventTypeForm.description
            };
        
            repositoryStub.createEventType.resolves(expectedEventType);
        
            try {
                const eventType = await eventTypeService.createEventType(eventTypeForm as EventTypeFormDTO);
                expect(eventType.name).to.equal(expectedEventType.name);
                expect(eventType.description).to.equal(expectedEventType.description);
            } catch (error) {
                expect.fail('Expected no error to be thrown');
            }
        
            expect(repositoryStub.createEventType.calledOnce).to.be.true;
        });

        it('Should create sucessfully when the EventType name has the max size', async () => {
            const eventTypeForm: Partial<EventTypeFormDTO> = {
                name: faker.string.alphanumeric(20),
                description: faker.string.alphanumeric(50)
            };
        
            const expectedEventType = {
                name: eventTypeForm.name,
                description: eventTypeForm.description
            };
        
            repositoryStub.createEventType.resolves(expectedEventType);
        
            try {
                const eventType = await eventTypeService.createEventType(eventTypeForm as EventTypeFormDTO);
                expect(eventType.name).to.equal(expectedEventType.name);
                expect(eventType.description).to.equal(expectedEventType.description);
            } catch (error) {
                expect.fail('Expected no error to be thrown');
            }
        
            expect(repositoryStub.createEventType.calledOnce).to.be.true;
        });

        it('Should create sucessfully when the EventType description has the minimun size', async () => {
            const eventTypeForm: Partial<EventTypeFormDTO> = {
                name: faker.string.alphanumeric(10),
                description: faker.string.alphanumeric(20)
            };
    
            const expectedEventType = {
                name: eventTypeForm.name,
                description: eventTypeForm.description
            };
        
            repositoryStub.createEventType.resolves(expectedEventType);
        
            try {
                const eventType = await eventTypeService.createEventType(eventTypeForm as EventTypeFormDTO);
                expect(eventType.name).to.equal(expectedEventType.name);
                expect(eventType.description).to.equal(expectedEventType.description);
            } catch (error) {
                expect.fail('Expected no error to be thrown');
            }
        
            expect(repositoryStub.createEventType.calledOnce).to.be.true;
        });

        it('Should create sucessfully when the EventType description has the max size', async () => {
            const eventTypeForm: Partial<EventTypeFormDTO> = {
                name: faker.string.alphanumeric(10),
                description: faker.string.alphanumeric(200)
            };
    
            const expectedEventType = {
                name: eventTypeForm.name,
                description: eventTypeForm.description
            };
        
            repositoryStub.createEventType.resolves(expectedEventType);
        
            try {
                const eventType = await eventTypeService.createEventType(eventTypeForm as EventTypeFormDTO);
                expect(eventType.name).to.equal(expectedEventType.name);
                expect(eventType.description).to.equal(expectedEventType.description);
            } catch (error) {
                expect.fail('Expected no error to be thrown');
            }
        
            expect(repositoryStub.createEventType.calledOnce).to.be.true;
        });

    });

    describe('getEventTypeById', () => {
        it('should throw an error when event type does not exist', async () => {
            repositoryStub.getEventType.resolves(null);
            validatorStub.validateEventTypeExists.rejects(new Error('Event Type with id: 99 does not exist.'));

            try {
                await eventTypeService.getEventTypeById(99);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                if (error instanceof Error) {
                    expect(error.message).to.equal('Event Type with id: 99 does not exist.');
                } else {
                    expect.fail('Caught an unknown error type');
                }
            }
        });

        it('should throw an error when event type id is null', async () => {
            repositoryStub.getEventType.resolves(null);
            validatorStub.validateEventTypeExists.rejects(new Error('Event Type ID is required.'));

            try {
                await eventTypeService.getEventTypeById(null);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                if (error instanceof Error) {
                    expect(error.message).to.equal('Event Type ID is required.');
                } else {
                    expect.fail('Caught an unknown error type');
                }
            }
        });

        it('should throw an error when event type id is a string', async () => {
            repositoryStub.getEventType.resolves(null);
            validatorStub.validateEventTypeExists.rejects(new Error('Event Type ID must be a number.'));

            try {
                await eventTypeService.getEventTypeById('null');
                expect.fail('Expected error was not thrown');
            } catch (error) {
                if (error instanceof Error) {
                    expect(error.message).to.equal('Event Type ID must be a number.');
                } else {
                    expect.fail('Caught an unknown error type');
                }
            }
        });

        it('should throw an error when event type id is a negative number', async () => {
            repositoryStub.getEventType.resolves(null);
            validatorStub.validateEventTypeExists.rejects(new Error('Event Type ID must be a positive number.'));

            try {
                await eventTypeService.getEventTypeById(-1);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                if (error instanceof Error) {
                    expect(error.message).to.equal('Event Type ID must be a positive number.');
                } else {
                    expect.fail('Caught an unknown error type');
                }
            }
        });
    });

    describe('updateEventType', () => {
        it('should throw an error when updating an event type that does not exist', async () => {
            repositoryStub.updateEventType.resolves(null);
            validatorStub.validateEventTypeExists.rejects(new Error('Event Type with id: 99 does not exist.'));

            try {
                await eventTypeService.updateEventType(99, {
                    name: 'Updated',
                    description: 'Updated description'
                });
                expect.fail('Expected error was not thrown');
            } catch (error) {
                if (error instanceof Error) {
                    expect(error.message).to.equal('Event Type with id: 99 does not exist.');
                } else {
                    expect.fail('Caught an unknown error type');
                }
            }
        });

        it('should throw an error when updating an event type with an id as null', async () => {
            repositoryStub.updateEventType.resolves(null);
            validatorStub.validateEventTypeExists.rejects(new Error('Event Type ID is required.'));

            try {
                await eventTypeService.updateEventType(null, {
                    name: 'Updated',
                    description: 'Updated description'
                });
                expect.fail('Expected error was not thrown');
            } catch (error) {
                if (error instanceof Error) {
                    expect(error.message).to.equal('Event Type ID is required.');
                } else {
                    expect.fail('Caught an unknown error type');
                }
            }
        });

        it('should throw an error when updating an event type with an id as string', async () => {
            repositoryStub.updateEventType.resolves(null);
            validatorStub.validateEventTypeExists.rejects(new Error('Event Type ID must be a number.'));

            try {
                await eventTypeService.updateEventType('99', {
                    name: 'Updated',
                    description: 'Updated description'
                });
                expect.fail('Expected error was not thrown');
            } catch (error) {
                if (error instanceof Error) {
                    expect(error.message).to.equal('Event Type ID must be a number.');
                } else {
                    expect.fail('Caught an unknown error type');
                }
            }
        });

        it('should throw an error when updating an event type with a negative id', async () => {
            repositoryStub.updateEventType.resolves(null);
            validatorStub.validateEventTypeExists.rejects(new Error('Event Type ID must be a positive number.'));

            try {
                await eventTypeService.updateEventType(-1, {
                    name: 'Updated',
                    description: 'Updated description'
                });
                expect.fail('Expected error was not thrown');
            } catch (error) {
                if (error instanceof Error) {
                    expect(error.message).to.equal('Event Type ID must be a positive number.');
                } else {
                    expect.fail('Caught an unknown error type');
                }
            }
        });

        it('should update successfully when the EventType name and description are valid', async () => {
            const eventTypeForm: Partial<EventTypeFormDTO> = {
                name: 'Updated',
                description: 'Updated description'
            };
    
            const expectedEventType = {
                id: 1,
                name: eventTypeForm.name,
                description: eventTypeForm.description
            };
    
            repositoryStub.updateEventType.resolves(expectedEventType);
    
            try {
                const eventType = await eventTypeService.updateEventType(1, eventTypeForm as EventTypeFormDTO);
                expect(eventType.name).to.equal(expectedEventType.name);
                expect(eventType.description).to.equal(expectedEventType.description);
            } catch (error) {
                expect.fail('Expected no error to be thrown');
            }
    
            expect(repositoryStub.updateEventType.calledOnce).to.be.true;
        });

        it('should throw an error when updating an event type with an invalid name', async () => {
            const eventTypeForm: Partial<EventTypeFormDTO> = {
                name: '',
                description: 'Updated description'
            };
    
            validatorStub.validateEventTypeName.throws(new Error('Event Type name is required.'));
    
            try {
                await eventTypeService.updateEventType(1, eventTypeForm as EventTypeFormDTO);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                if (error instanceof Error) {
                    expect(error.message).to.equal('Event Type name is required.');
                } else {
                    expect.fail('Caught an unknown error type');
                }
            }
    
            expect(repositoryStub.updateEventType.called).to.be.false;
        });
    
        it('should throw an error when updating an event type with an invalid description', async () => {
            const eventTypeForm: Partial<EventTypeFormDTO> = {
                name: 'Updated',
                description: ''
            };
    
            validatorStub.validateEventTypeDescription.throws(new Error('Event Type description is required.'));
    
            try {
                await eventTypeService.updateEventType(1, eventTypeForm as EventTypeFormDTO);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                if (error instanceof Error) {
                    expect(error.message).to.equal('Event Type description is required.');
                } else {
                    expect.fail('Caught an unknown error type');
                }
            }
    
            expect(repositoryStub.updateEventType.called).to.be.false;
        });

        it('should throw an error when name does not have the minimum size', async () => {
            const eventTypeForm: Partial<EventTypeFormDTO> = {
                name: faker.string.alphanumeric(2),
                description: faker.string.alphanumeric(200)
            };
    
            validatorStub.validateEventTypeName.throws(new Error('Event Type name must have at least 3 characters.'));
    
            try {
                await eventTypeService.updateEventType(1, eventTypeForm as EventTypeFormDTO);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                if (error instanceof Error) {
                    expect(error.message).to.equal('Event Type name must have at least 3 characters.');
                } else {
                    expect.fail('Caught an unknown error type');
                }
            }
    
            expect(repositoryStub.updateEventType.called).to.be.false;
        });
    
        it('should throw an error when name has more than the max size', async () => {
            const eventTypeForm: Partial<EventTypeFormDTO> = {
                name: faker.string.alphanumeric(21),
                description: faker.string.alphanumeric(200)
            };
    
            validatorStub.validateEventTypeName.throws(new Error('Event Type name must have at most 20 characters.'));
    
            try {
                await eventTypeService.updateEventType(1, eventTypeForm as EventTypeFormDTO);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                if (error instanceof Error) {
                    expect(error.message).to.equal('Event Type name must have at most 20 characters.');
                } else {
                    expect.fail('Caught an unknown error type');
                }
            }
    
            expect(repositoryStub.updateEventType.called).to.be.false;
        });
    
        it('should throw an error when description does not have the minimum size', async () => {
            const eventTypeForm: Partial<EventTypeFormDTO> = {
                name: 'Conference',
                description: 'Less than 20'
            };
    
            validatorStub.validateEventTypeDescription.throws(new Error('Event Type description must have at least 20 characters.'));
    
            try {
                await eventTypeService.updateEventType(1, eventTypeForm as EventTypeFormDTO);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                if (error instanceof Error) {
                    expect(error.message).to.equal('Event Type description must have at least 20 characters.');
                } else {
                    expect.fail('Caught an unknown error type');
                }
            }
    
            expect(repositoryStub.updateEventType.called).to.be.false;
        });
    
        it('should throw an error when description has more than the max size', async () => {
            const eventTypeForm: Partial<EventTypeFormDTO> = {
                name: 'Conference',
                description: faker.string.alphanumeric(201)
            };
    
            validatorStub.validateEventTypeDescription.throws(new Error('Event Type description must have at most 200 characters.'));
    
            try {
                await eventTypeService.updateEventType(1, eventTypeForm as EventTypeFormDTO);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                if (error instanceof Error) {
                    expect(error.message).to.equal('Event Type description must have at most 200 characters.');
                } else {
                    expect.fail('Caught an unknown error type');
                }
            }
    
            expect(repositoryStub.updateEventType.called).to.be.false;
        });
    
        it('should update successfully when the EventType name has the minimum size', async () => {
            const eventTypeForm: Partial<EventTypeFormDTO> = {
                name: faker.string.alphanumeric(3),
                description: faker.string.alphanumeric(50)
            };
    
            const expectedEventType = {
                id: 1,
                name: eventTypeForm.name,
                description: eventTypeForm.description
            };
    
            repositoryStub.updateEventType.resolves(expectedEventType);
    
            try {
                const eventType = await eventTypeService.updateEventType(1, eventTypeForm as EventTypeFormDTO);
                expect(eventType.name).to.equal(expectedEventType.name);
                expect(eventType.description).to.equal(expectedEventType.description);
            } catch (error) {
                expect.fail('Expected no error to be thrown');
            }
    
            expect(repositoryStub.updateEventType.calledOnce).to.be.true;
        });
    
        it('should update successfully when the EventType name has the max size', async () => {
            const eventTypeForm: Partial<EventTypeFormDTO> = {
                name: faker.string.alphanumeric(20),
                description: faker.string.alphanumeric(50)
            };
    
            const expectedEventType = {
                id: 1,
                name: eventTypeForm.name,
                description: eventTypeForm.description
            };
    
            repositoryStub.updateEventType.resolves(expectedEventType);
    
            try {
                const eventType = await eventTypeService.updateEventType(1, eventTypeForm as EventTypeFormDTO);
                expect(eventType.name).to.equal(expectedEventType.name);
                expect(eventType.description).to.equal(expectedEventType.description);
            } catch (error) {
                expect.fail('Expected no error to be thrown');
            }
    
            expect(repositoryStub.updateEventType.calledOnce).to.be.true;
        });
    
        it('should update successfully when the EventType description has the minimum size', async () => {
            const eventTypeForm: Partial<EventTypeFormDTO> = {
                name: faker.string.alphanumeric(10),
                description: faker.string.alphanumeric(20)
            };
    
            const expectedEventType = {
                id: 1,
                name: eventTypeForm.name,
                description: eventTypeForm.description
            };
    
            repositoryStub.updateEventType.resolves(expectedEventType);
    
            try {
                const eventType = await eventTypeService.updateEventType(1, eventTypeForm as EventTypeFormDTO);
                expect(eventType.name).to.equal(expectedEventType.name);
                expect(eventType.description).to.equal(expectedEventType.description);
            } catch (error) {
                expect.fail('Expected no error to be thrown');
            }
    
            expect(repositoryStub.updateEventType.calledOnce).to.be.true;
        });
    
        it('should update successfully when the EventType description has the max size', async () => {
            const eventTypeForm: Partial<EventTypeFormDTO> = {
                name: faker.string.alphanumeric(10),
                description: faker.string.alphanumeric(200)
            };
    
            const expectedEventType = {
                id: 1,
                name: eventTypeForm.name,
                description: eventTypeForm.description
            };
    
            repositoryStub.updateEventType.resolves(expectedEventType);
    
            try {
                const eventType = await eventTypeService.updateEventType(1, eventTypeForm as EventTypeFormDTO);
                expect(eventType.name).to.equal(expectedEventType.name);
                expect(eventType.description).to.equal(expectedEventType.description);
            } catch (error) {
                expect.fail('Expected no error to be thrown');
            }
    
            expect(repositoryStub.updateEventType.calledOnce).to.be.true;
        });
    });

    describe('deleteEventType', () => {
        it('should throw an error when trying to delete an event type that does not exist', async () => {
            repositoryStub.getEventType.resolves(null);
            validatorStub.validateEventTypeExists.rejects(new Error('Event Type with id: 99 does not exist.'));

            try {
                await eventTypeService.deleteEventType(99);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                if (error instanceof Error) {
                    expect(error.message).to.equal('Event Type with id: 99 does not exist.');
                } else {
                    expect.fail('Caught an unknown error type');
                }
            }
        });

        it('should throw an error when trying to delete an event type with an id as null', async () => {
            repositoryStub.deleteEventType.resolves(null);
            validatorStub.validateEventTypeExists.rejects(new Error('Event Type ID is required.'));

            try {
                await eventTypeService.deleteEventType(null);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                if (error instanceof Error) {
                    expect(error.message).to.equal('Event Type ID is required.');
                } else {
                    expect.fail('Caught an unknown error type');
                }
            }
        });
    
        it('should throw an error when trying to delete an event type with an id as string', async () => {
            repositoryStub.deleteEventType.resolves(null);
            validatorStub.validateEventTypeExists.rejects(new Error('Event Type ID must be a number.'));

            try {
                await eventTypeService.deleteEventType('test');
                expect.fail('Expected error was not thrown');
            } catch (error) {
                if (error instanceof Error) {
                    expect(error.message).to.equal('Event Type ID must be a number.');
                } else {
                    expect.fail('Caught an unknown error type');
                }
            }
        });
    
        it('should throw an error when trying to delete an event type with a negative id', async () => {
            repositoryStub.deleteEventType.resolves(null);
            validatorStub.validateEventTypeExists.rejects(new Error('Event Type ID must be a positive number.'));

            try {
                await eventTypeService.deleteEventType(-1);
                expect.fail('Expected error was not thrown');
            } catch (error) {
                if (error instanceof Error) {
                    expect(error.message).to.equal('Event Type ID must be a positive number.');
                } else {
                    expect.fail('Caught an unknown error type');
                }
            }
        });
    
        it('should delete successfully when the EventType exists', async () => {
            repositoryStub.getEventType.resolves({ id: 1, name: 'Conference', description: 'A valid description' });
            repositoryStub.deleteEventType.resolves();
    
            try {
                await eventTypeService.deleteEventType(1);
            } catch (error) {
                expect.fail('Expected no error to be thrown');
            }
    
            expect(repositoryStub.deleteEventType.calledOnce).to.be.true;
        });
    });
});
