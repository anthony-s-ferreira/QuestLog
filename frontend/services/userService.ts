import { api } from './api';

export async function getUserById(id: number) {
    const response = await api.get(`/users/${id}`);
    return response.data;
}

export async function updateUser(id: number, userData: { name: string; email: string; password: string; type: string }) {
    try{
        const response = await api.put(`/users/${id}`, userData);
        return response.data;
    } catch (error) {
        throw error;
    }
    
}

export async function signupUser(userData: {name: string; email: string; password: string;}) {
    try {
        const signUpData = {
            name: userData.name,
            email: userData.email,
            password: userData.password,
            type: 'user'
        }
        const response = await api.post('/register', signUpData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function updateUserPassword(id: number, passwordData: { password: string; newPassword: string }) {
    const response = await api.patch(`/users/${id}/password`, passwordData);
    return response.data;
}

export async function deleteUser(id: number) {
    const response = await api.delete(`/users/${id}`);
    return response.data;
}
