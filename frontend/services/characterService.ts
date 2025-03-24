import { api } from './api';

export async function getCharacters() {
  const response = await api.get('/characters');
  return response.data;
}

export async function getCharacterById(id: number) {
  const response = await api.get(`/character/${id}`);
  return response.data;
}

export async function postCharacter(characterData: { name: string; description: string; rpgId: number }) {
  const response = await api.post('/character', characterData);
  return response.data;
}

export async function editCharacter(id: number, characterData: { name: string; description: string; rpgId: number }) {
  const response = await api.put(`/character/${id}`, characterData);
  return response.data;
}

export async function deleteCharacter(id: number) {
  const response = await api.delete(`/character/${id}`);
  return response.data;
}