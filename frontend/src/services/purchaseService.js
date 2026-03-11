import axios from 'axios';

const API_URL = '/api/purchases';

const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return { Authorization: `Bearer ${user?.token}` };
};

const getPurchases = async () => {
    const response = await axios.get(API_URL, { headers: getAuthHeaders() });
    return response.data;
};

const createPurchase = async (purchase) => {
    const response = await axios.post(API_URL, purchase, { headers: getAuthHeaders() });
    return response.data;
};

const getPurchaseById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`, { headers: getAuthHeaders() });
    return response.data;
};

const deletePurchase = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
    return response.data;
};

const purchaseService = {
    getPurchases,
    createPurchase,
    getPurchaseById,
    deletePurchase
};

export default purchaseService;
