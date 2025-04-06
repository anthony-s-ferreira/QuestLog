import { api } from './api';

export async function getEventTypes() {
  const response = await api.get('/eventType');
  return response.data;
}

export async function getEventTypeById(id: number) {
  const response = await api.get(`/eventType/${id}`);
  return response.data;
}

export async function postEventType(eventTypeData: { name: string; description: string }) {
  const response = await api.post('/eventType', eventTypeData);
  return response.data;
}

export async function editEventType(id: number, eventTypeData: { name: string; description: string }) {
  const response = await api.put(`/eventType/${id}`, eventTypeData);
  return response.data;
}

export async function deleteEventType(id: number) {
  const response = await api.delete(`/eventType/${id}`);
  return response.data;
}