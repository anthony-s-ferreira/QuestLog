import { expect } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import { EventTypeFormDTO } from '../../src/domain/formDTO/EventTypeFormDTO';
import { EventType } from '../../src/domain/entities/EventType';

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
    });
});
