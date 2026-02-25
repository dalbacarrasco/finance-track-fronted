import { BASE_URL, getHeaders } from './api';

export const getCategorias = async () => {
    const res = await fetch(`${BASE_URL}/category`, { headers: getHeaders() });
    return res.json();
};

export const createCategoria = async (data: object) => {
    const res = await fetch(`${BASE_URL}/category`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
    });
    return res.json();
};

export const updateCategoria = async (id: number, data: object) => {
    const res = await fetch(`${BASE_URL}/category/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
    });
    return res.json();
};

export const deleteCategoria = async (id: number) => {
    await fetch(`${BASE_URL}/category/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
};