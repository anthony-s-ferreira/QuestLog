import { api } from './api';

export async function getAllUsers(page: number, limit: number) {
    const response = await api.get(`/admin/users?page=${page}&limit=${limit}`);
    return response.data;
}

export async function getAllRPGs(page: number, limit: number) {
    const response = await api.get(`/admin/rpgs?page=${page}&limit=${limit}`);
    return response.data;
}

export async function getAllEvents(page: number, limit: number) {
    const response = await api.get(`/admin/events?page=${page}&limit=${limit}`);
    return response.data;
}

export async function getAllCharacters(page: number, limit: number) {
    const response = await api.get(`/admin/characters?page=${page}&limit=${limit}`);
    return response.data;
}

export async function setUserAdmin(id: number) {
    const response = await api.patch(`/admin/setAdmin/${id}`);
    return response.data;
}

export async function getUserById(id: number) {
    const response = await api.get('/users/' + id);
    return response.data;
}