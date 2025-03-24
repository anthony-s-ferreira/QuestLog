import { api } from './api';

// export async function getEvents() {
//   const response = await api.get('/events');
//   return response.data;
// }

export async function getEventById(id: number) {
  const response = await api.get(`/event/${id}`);
  return response.data;
}

export async function postEvent(eventData: { name: string; description: string; date: string; eventTypeId: number; characterId: number }) {
  const response = await api.post('/event', eventData);
  return response.data;
}

export async function editEvent(id: number, eventData: { name: string; description: string; date: string; eventTypeId: number; characterId: number }) {
  const response = await api.put(`/event/${id}`, eventData);
  return response.data;
}

export async function deleteEvent(id: number) {
  const response = await api.delete(`/event/${id}`);
  return response.data;
}