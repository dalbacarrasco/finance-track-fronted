import { BASE_URL, getHeaders } from './api';

export const getTransacciones = async (mes: number, anio: number) => {
    const res = await fetch(`${BASE_URL}/transaction?mes=${mes}&anio=${anio}`, {
        headers: getHeaders(),
    });
    return res.json();
};

export const createTransaccion = async (data: object) => {
    const res = await fetch(`${BASE_URL}/transaction`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
    });
    return res.json();
};

export const updateTransaccion = async (id: number, data: object) => {
    const res = await fetch(`${BASE_URL}/transaction/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
    });
    return res.json();
};

export const deleteTransaccion = async (id: number) => {
    await fetch(`${BASE_URL}/transaction/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
};