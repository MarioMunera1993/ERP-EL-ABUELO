import axios from 'axios';

const API_URL_CLIENTS = '/api/clients';
const API_URL_SUPPLIERS = '/api/suppliers';

const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return { Authorization: `Bearer ${user?.token}` };
};

const getClients = async () => {
    const response = await axios.get(API_URL_CLIENTS, { headers: getAuthHeaders() });
    return response.data;
};

const createClient = async (client) => {
    const response = await axios.post(API_URL_CLIENTS, client, { headers: getAuthHeaders() });
    return response.data;
};

const updateClient = async (id, client) => {
    const response = await axios.put(`${API_URL_CLIENTS}/${id}`, client, { headers: getAuthHeaders() });
    return response.data;
};

const deleteClient = async (id) => {
    await axios.delete(`${API_URL_CLIENTS}/${id}`, { headers: getAuthHeaders() });
};

const getSuppliers = async () => {
    const response = await axios.get(API_URL_SUPPLIERS, { headers: getAuthHeaders() });
    return response.data;
};

const createSupplier = async (supplier) => {
    const response = await axios.post(API_URL_SUPPLIERS, supplier, { headers: getAuthHeaders() });
    return response.data;
};

const updateSupplier = async (id, supplier) => {
    const response = await axios.put(`${API_URL_SUPPLIERS}/${id}`, supplier, { headers: getAuthHeaders() });
    return response.data;
};

const deleteSupplier = async (id) => {
    await axios.delete(`${API_URL_SUPPLIERS}/${id}`, { headers: getAuthHeaders() });
};

const directoryService = {
    getClients,
    createClient,
    updateClient,
    deleteClient,
    getSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier
};

export default directoryService;
