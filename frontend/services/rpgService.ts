import { api } from './api';

export async function getRPGs() {
  const response = await api.get('/rpgs');
  return response.data;
}

export async function getRPGById(id: number) {
  const response = await api.get(`/rpg/${id}`);
  return response.data;
}

export async function getRPGEventsById(id: number, page: number, limit: number) {
  const response = await api.get(`/rpg/${id}/events?page=${page}&limit=${limit}`);
  return response.data;
}

export async function getRPGSelect() {
  const response = await api.get('/rpgs/select');
  return response.data;
}

export async function getRPGCharactersById(id: number) {
  const response = await api.get(`/rpg/${id}/characters`);
  return response.data;
}

export async function postRpg(rpgData: { name: string; description: string }) {
  const response = await api.post('/rpg', rpgData);
  return response.data;
}

export async function editRpg(id: number, rpgData: { name: string; description: string }) {
  const response = await api.put(`/rpg/${id}`, rpgData);
  return response.data;
}

export async function changeRpgStatus(id: number, status: boolean) {
  const response = await api.patch(`/rpg/${id}`, {status: status});
  return response.data;
}

export async function deleteRpg(id: number) {
  const response = await api.delete(`/rpg/${id}`);
  return response.data;
}