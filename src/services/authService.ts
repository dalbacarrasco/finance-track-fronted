import { BASE_URL, getHeaders } from './api';

export const register = async (name: string, email: string, password: string) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ Name: name, Email: email, Password: password }),
    });
    return res.json();
};

export const login = async (email: string, password: string) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ Email: email, Password: password }),
    });
    return res.json();
};