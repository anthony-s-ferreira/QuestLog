import { api } from './api';

export async function getRPGs() {
  const response = await api.get('/rpgs');
  return response.data;
}
