import request from 'supertest';
import { app } from '../src/app';
import { EventType } from '../src/domain/entities/EventType';
import { PrismaEventTypeRepository } from '../src/repositories/prismaEventTypeRepository';
import { faker } from '@faker-js/faker'

const eventTypeRepository = new PrismaEventTypeRepository();

describe('GET /event-type', () => {
  it('should return 200 OK', async () => {
    const res = await request(app).get('/event-type');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(0);
  });

  it('should return 200 OK with data', async () => {
    const eventType: EventType = {
      name: 'Main event',
      description: 'This should be the main event'
    };
    let eventTypeId: number = 0;
    try {
      const eventTypeC = await eventTypeRepository.create(eventType);
      eventTypeId = eventTypeC.id? eventTypeC.id : 0;
      const res = await request(app).get('/event-type');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body).toHaveProperty('name', eventType.name);
      expect(res.body).toHaveProperty('description', eventType.description);
    } finally {
      await eventTypeRepository.deleteById(eventTypeId);
    }
  });

  it('should return 404 Not Found', async () => {
    const res = await request(app).get('/event-type/999999');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Event type not found');
  });

  it('should return 400 on incorrect id type', async () => {
    const res = await request(app).get('/event-type/invalid-id');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid id type');
    expect(res.body).toHaveProperty('message', 'The provided id type is not valid');
  });
});

describe('POST /event-type', () => {
    it('should return 201 when create a valid event type', async () => {
        const eventType: EventType = {
            name: 'Main event',
            description: 'This should be the main event'
        }
        const res = await request(app).post('/event-type').send(eventType);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('name', eventType.name);
        expect(res.body).toHaveProperty('description', eventType.description);
    });
    
    it('should return 400 when creating an invalid event type', async () => {
        const eventType = {
            name: '',
            description: ''
        }
        const res = await request(app).post('/event-type').send(eventType);
        expect(res.status).toBe(400);
    });

    it('should return 400 when creating an empty event type name', async () => {
        const eventType = {
            name: '',
            description: 'Event description'
        }
        const res = await request(app).post('/event-type').send(eventType);
        expect(res.status).toBe(400);
    });

    it('should return 400 when creating a null event type name', async () => {
        const eventType = {
            name: null,
            description: 'Event description'
        }
        const res = await request(app).post('/event-type').send(eventType);
        expect(res.status).toBe(400);
    });

    it('should return 400 when creating an empty event type description', async () => {
        const eventType = {
            name: 'Test event',
            description: null
        }
        const res = await request(app).post('/event-type').send(eventType);
        expect(res.status).toBe(400);
    });

    it('should return 400 when creating a null event type description', async () => {
        const eventType = {
            name: 'Test event',
            description: null
        }
        const res = await request(app).post('/event-type').send(eventType);
        expect(res.status).toBe(400);
    });
    
    it('should return 400 when creating an event type with a name longer than accepted', async () => {
        const eventType = {
            name: faker.string.alpha(21),
            description: 'Event type description'
        }
        const res = await request(app).post('/event-type').send(eventType);
        expect(res.status).toBe(400);
    });

    it('should return 400 when creating an event type with a description longer than accepted', async () => {
        const eventType = {
            name: 'Test event',
            description: faker.string.alpha(101)
        }
        const res = await request(app).post('/event-type').send(eventType);
        expect(res.status).toBe(400);
    });

    it('should return 400 when creating an event type with a name shorter than accepted', async () => {
        const eventType = {
            name: faker.string.alpha(5),
            description: 'Event type description'
        }
        const res = await request(app).post('/event-type').send(eventType);
        expect(res.status).toBe(400);
    });

    it('should return 400 when creating an event type with a description shorter than accepted', async () => {
        const eventType = {
            name: 'Test event',
            description: faker.string.alpha(10)
        }
        const res = await request(app).post('/event-type').send(eventType);
        expect(res.status).toBe(400);
    });
});

describe('PATCH /event-type', () => {
    it('should update an existing event type sucessfully', async () => {
        const eventType: EventType = {
            name: 'Main event',
            description: 'This should be the main event'
        };
        const eventTypePut = {name: 'New name', description: 'New description'};
        let eventTypeId: number = 0;
        try {
        const eventTypeC = await eventTypeRepository.create(eventType);
        eventTypeId = eventTypeC.id? eventTypeC.id : 0;
        const res = await request(app).patch(`/event-type/${eventTypeId}`).send(eventTypePut);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('name', 'New name');
        expect(res.body).toHaveProperty('description', 'New description');
        } finally {
            await eventTypeRepository.deleteById(eventTypeId);
        }
    });

    it('should return 404 when updating a non existing event type', async () => {
        const eventTypePut = {name: 'New name', description: 'New description'};
        const res = await request(app).patch('/event-type/999999').send(eventTypePut);
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error', 'Event type not found');
    });

    it('should return 400 when updating a non valid event type id', async () => {
        const eventTypePut = {name: 'New name', description: 'New description'};
        const res = await request(app).patch('/event-type/invalid-id').send(eventTypePut);
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'Invalid id type');
        expect(res.body).toHaveProperty('message', 'The provided id type is not valid');
    });

    it('should return 400 when updating an event type with a name longer than accepted', async () => {
        const eventType: EventType = {
            name: 'Main event',
            description: 'This should be the main event'
        };
        const eventTypePut = {name: faker.string.alpha(21), description: 'New description'};
        let eventTypeId: number = 0;
        try {
        const eventTypeC = await eventTypeRepository.create(eventType);
        eventTypeId = eventTypeC.id? eventTypeC.id : 0;
        const res = await request(app).patch(`/event-type/${eventTypeId}`).send(eventTypePut);
        expect(res.status).toBe(400);
        } finally {
            await eventTypeRepository.deleteById(eventTypeId);
        }
    });

    it('should return 400 when updating an event type with a name longer than accepted', async () => {
        const eventType: EventType = {
            name: 'Main event',
            description: 'This should be the main event'
        };
        const eventTypePut = {name: 'Event type put', description: faker.string.alpha(101)};
        let eventTypeId: number = 0;
        try {
        const eventTypeC = await eventTypeRepository.create(eventType);
        eventTypeId = eventTypeC.id? eventTypeC.id : 0;
        const res = await request(app).patch(`/event-type/${eventTypeId}`).send(eventTypePut);
        expect(res.status).toBe(400);
        } finally {
            await eventTypeRepository.deleteById(eventTypeId);
        }
    });

    it('should return 400 when updating an event type with a name shorter than accepted', async () => {
        const eventType: EventType = {
            name: 'Main event',
            description: 'This should be the main event'
        };
        const eventTypePut = {name: faker.string.alpha(5), description: 'New description'};
        let eventTypeId: number = 0;
        try {
        const eventTypeC = await eventTypeRepository.create(eventType);
        eventTypeId = eventTypeC.id? eventTypeC.id : 0;
        const res = await request(app).patch(`/event-type/${eventTypeId}`).send(eventTypePut);
        expect(res.status).toBe(400);
        } finally {
            await eventTypeRepository.deleteById(eventTypeId);
        }
    });

    it('should return 400 when updating an event type with a description shorter than accepted', async () => {
        const eventType: EventType = {
            name: 'Main event',
            description: 'This should be the main event'
        };
        const eventTypePut = {name: 'Event type put', description: faker.string.alpha(10)};
        let eventTypeId: number = 0;
        try {
        const eventTypeC = await eventTypeRepository.create(eventType);
        eventTypeId = eventTypeC.id? eventTypeC.id : 0;
        const res = await request(app).patch(`/event-type/${eventTypeId}`).send(eventTypePut);
        expect(res.status).toBe(400);
        } finally {
            await eventTypeRepository.deleteById(eventTypeId)
        }
    });

    it('should return 400 when updating an event type with a null name', async () => {
        const eventType: EventType = {
            name: 'Main event',
            description: 'This should be the main event'
        };
        const eventTypePut = {name: null, description: 'New description'};
        let eventTypeId: number = 0;
        try {
        const eventTypeC = await eventTypeRepository.create(eventType);
        eventTypeId = eventTypeC.id? eventTypeC.id : 0;
        const res = await request(app).patch(`/event-type/${eventTypeId}`).send(eventTypePut);
        expect(res.status).toBe(400);
        } finally {
            await eventTypeRepository.deleteById(eventTypeId);
        }
    });

    it('should return 400 when updating an event type with a null description', async () => {
        const eventType: EventType = {
            name: 'Main event',
            description: 'This should be the main event'
        };
        const eventTypePut = {name: 'Event type put', description: null};
        let eventTypeId: number = 0;
        try {
        const eventTypeC = await eventTypeRepository.create(eventType);
        eventTypeId = eventTypeC.id? eventTypeC.id : 0;
        const res = await request(app).patch(`/event-type/${eventTypeId}`).send(eventTypePut);
        expect(res.status).toBe(400);
        } finally {
            await eventTypeRepository.deleteById(eventTypeId);
        }
    });

    it('should return 400 when updating an event type with an empty name', async () => {
        const eventType: EventType = {
            name: 'Main event',
            description: 'This should be the main event'
        };
        const eventTypePut = {name: '', description: 'New description'};
        let eventTypeId: number = 0;
        try {
        const eventTypeC = await eventTypeRepository.create(eventType);
        eventTypeId = eventTypeC.id? eventTypeC.id : 0;
        const res = await request(app).patch(`/event-type/${eventTypeId}`).send(eventTypePut);
        expect(res.status).toBe(400);
        } finally {
            await eventTypeRepository.deleteById(eventTypeId);
        }
    });

    it('should return 400 when updating an event type with an empty description', async () => {
        const eventType: EventType = {
            name: 'Main event',
            description: 'This should be the main event'
        };
        const eventTypePut = {name: 'Event type put', description: ''};
        let eventTypeId: number = 0;
        try {
        const eventTypeC = await eventTypeRepository.create(eventType);
        eventTypeId = eventTypeC.id? eventTypeC.id : 0;
        const res = await request(app).patch(`/event-type/${eventTypeId}`).send(eventTypePut);
        expect(res.status).toBe(400);
        } finally {
            await eventTypeRepository.deleteById(eventTypeId);
        }
    });

});

describe('PUT /event-type', () => {
    it('should update an existing event type sucessfully', async () => {
        const eventType: EventType = {
            name: 'Main event',
            description: 'This should be the main event'
        };
        const eventTypePut = {name: 'New name', description: 'New description'};
        let eventTypeId: number = 0;
        try {
        const eventTypeC = await eventTypeRepository.create(eventType);
        eventTypeId = eventTypeC.id? eventTypeC.id : 0;
        const res = await request(app).put(`/event-type/${eventTypeId}`).send(eventTypePut);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('name', 'New name');
        expect(res.body).toHaveProperty('description', 'New description');
        } finally {
            await eventTypeRepository.deleteById(eventTypeId);
        }
    });

    it('should return 404 when updating a non existing event type', async () => {
        const eventTypePut = {name: 'New name', description: 'New description'};
        const res = await request(app).put('/event-type/999999').send(eventTypePut);
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error', 'Event type not found');
    });

    it('should return 400 when updating a non valid event type id', async () => {
        const eventTypePut = {name: 'New name', description: 'New description'};
        const res = await request(app).put('/event-type/invalid-id').send(eventTypePut);
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'Invalid id type');
        expect(res.body).toHaveProperty('message', 'The provided id type is not valid');
    });

    it('should return 400 when updating an event type with a name longer than accepted', async () => {
        const eventType: EventType = {
            name: 'Main event',
            description: 'This should be the main event'
        };
        const eventTypePut = {name: faker.string.alpha(21), description: 'New description'};
        let eventTypeId: number = 0;
        try {
        const eventTypeC = await eventTypeRepository.create(eventType);
        eventTypeId = eventTypeC.id? eventTypeC.id : 0;
        const res = await request(app).put(`/event-type/${eventTypeId}`).send(eventTypePut);
        expect(res.status).toBe(400);
        } finally {
            await eventTypeRepository.deleteById(eventTypeId);
        }
    });

    it('should return 400 when updating an event type with a name longer than accepted', async () => {
        const eventType: EventType = {
            name: 'Main event',
            description: 'This should be the main event'
        };
        const eventTypePut = {name: 'Event type put', description: faker.string.alpha(101)};
        let eventTypeId: number = 0;
        try {
        const eventTypeC = await eventTypeRepository.create(eventType);
        eventTypeId = eventTypeC.id? eventTypeC.id : 0;
        const res = await request(app).put(`/event-type/${eventTypeId}`).send(eventTypePut);
        expect(res.status).toBe(400);
        } finally {
            await eventTypeRepository.deleteById(eventTypeId);
        }
    });

    it('should return 400 when updating an event type with a name shorter than accepted', async () => {
        const eventType: EventType = {
            name: 'Main event',
            description: 'This should be the main event'
        };
        const eventTypePut = {name: faker.string.alpha(5), description: 'New description'};
        let eventTypeId: number = 0;
        try {
        const eventTypeC = await eventTypeRepository.create(eventType);
        eventTypeId = eventTypeC.id? eventTypeC.id : 0;
        const res = await request(app).put(`/event-type/${eventTypeId}`).send(eventTypePut);
        expect(res.status).toBe(400);
        } finally {
            await eventTypeRepository.deleteById(eventTypeId);
        }
    });

    it('should return 400 when updating an event type with a description shorter than accepted', async () => {
        const eventType: EventType = {
            name: 'Main event',
            description: 'This should be the main event'
        };
        const eventTypePut = {name: 'Event type put', description: faker.string.alpha(10)};
        let eventTypeId: number = 0;
        try {
        const eventTypeC = await eventTypeRepository.create(eventType);
        eventTypeId = eventTypeC.id? eventTypeC.id : 0;
        const res = await request(app).put(`/event-type/${eventTypeId}`).send(eventTypePut);
        expect(res.status).toBe(400);
        } finally {
            await eventTypeRepository.deleteById(eventTypeId)
        }
    });

    it('should return 400 when updating an event type with a null name', async () => {
        const eventType: EventType = {
            name: 'Main event',
            description: 'This should be the main event'
        };
        const eventTypePut = {name: null, description: 'New description'};
        let eventTypeId: number = 0;
        try {
        const eventTypeC = await eventTypeRepository.create(eventType);
        eventTypeId = eventTypeC.id? eventTypeC.id : 0;
        const res = await request(app).put(`/event-type/${eventTypeId}`).send(eventTypePut);
        expect(res.status).toBe(400);
        } finally {
            await eventTypeRepository.deleteById(eventTypeId);
        }
    });

    it('should return 400 when updating an event type with a null description', async () => {
        const eventType: EventType = {
            name: 'Main event',
            description: 'This should be the main event'
        };
        const eventTypePut = {name: 'Event type put', description: null};
        let eventTypeId: number = 0;
        try {
        const eventTypeC = await eventTypeRepository.create(eventType);
        eventTypeId = eventTypeC.id? eventTypeC.id : 0;
        const res = await request(app).put(`/event-type/${eventTypeId}`).send(eventTypePut);
        expect(res.status).toBe(400);
        } finally {
            await eventTypeRepository.deleteById(eventTypeId);
        }
    });

    it('should return 400 when updating an event type with an empty name', async () => {
        const eventType: EventType = {
            name: 'Main event',
            description: 'This should be the main event'
        };
        const eventTypePut = {name: '', description: 'New description'};
        let eventTypeId: number = 0;
        try {
        const eventTypeC = await eventTypeRepository.create(eventType);
        eventTypeId = eventTypeC.id? eventTypeC.id : 0;
        const res = await request(app).put(`/event-type/${eventTypeId}`).send(eventTypePut);
        expect(res.status).toBe(400);
        } finally {
            await eventTypeRepository.deleteById(eventTypeId);
        }
    });

    it('should return 400 when updating an event type with an empty description', async () => {
        const eventType: EventType = {
            name: 'Main event',
            description: 'This should be the main event'
        };
        const eventTypePut = {name: 'Event type put', description: ''};
        let eventTypeId: number = 0;
        try {
        const eventTypeC = await eventTypeRepository.create(eventType);
        eventTypeId = eventTypeC.id? eventTypeC.id : 0;
        const res = await request(app).put(`/event-type/${eventTypeId}`).send(eventTypePut);
        expect(res.status).toBe(400);
        } finally {
            await eventTypeRepository.deleteById(eventTypeId);
        }
    });
});

describe('DELETE /event-type', () => {
    it('should return 204 when deleting an existing event type', async () => {
        const eventType: EventType = {
            name: 'Main event',
            description: 'This should be the main event'
          };
          let eventTypeId: number = 0;
          try {
            const eventTypeC = await eventTypeRepository.create(eventType);
            eventTypeId = eventTypeC.id? eventTypeC.id : 0;
            const res = await request(app).delete(`/event-type/${eventTypeId}`);
            expect(res.status).toBe(204);
          } finally {
            await eventTypeRepository.deleteById(eventTypeId);
          }
    });
    
    it('should return 404 when deleting a non existing event type', async () => {
        const res = await request(app).delete('/event-type/999999');
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error', 'Event type not found');
    });

    it('should return 400 when deleting a non valid event type id', async () => {
        const res = await request(app).delete('/event-type/invalid-id');
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'Invalid id type');
        expect(res.body).toHaveProperty('message', 'The provided id type is not valid');
    });
});