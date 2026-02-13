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

const purchaseService = {
    getPurchases,
    createPurchase
};

export default purchaseService;
