import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getCategories = () => api.get('/categories');
export const createCategory = (category: { name: string; type: string }) => api.post('/categories', category);
export const updateCategory = (id: number, category: { name: string; type: string }) => api.put(`/categories/${id}`, category);
export const deleteCategory = (id: number) => api.delete(`/categories/${id}`);

export const getTransactions = (params?: any) => api.get('/transactions', { params });
export const getTransactionById = (id: number) => api.get(`/transactions/${id}`);
export const createTransaction = (transaction: any) => api.post('/transactions', transaction);
export const updateTransaction = (id: number, transaction: any) => api.put(`/transactions/${id}`, transaction);
export const deleteTransaction = (id: number) => api.delete(`/transactions/${id}`);

export default api;
