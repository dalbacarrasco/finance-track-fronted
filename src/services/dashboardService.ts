import { BASE_URL, getHeaders } from './api';

export const getResumen = async (mes: number, año: number) => {
    const res = await fetch(`${BASE_URL}/dashboard/resume?mes=${mes}&anio=${año}`, {
        headers: getHeaders(),
    });
    return res.json();
};

export const getGastosPorCategoria = async (mes: number, año: number) => {
    const res = await fetch(`${BASE_URL}/dashboard/by-category?mes=${mes}&año=${año}`, {
        headers: getHeaders(),
    });
    return res.json();
};