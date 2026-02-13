import axios from 'axios';

const API_URL = '/api/sales';

const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return { Authorization: `Bearer ${user?.token}` };
};

const getSales = async () => {
    const response = await axios.get(API_URL, { headers: getAuthHeaders() });
    return response.data;
};

const createSale = async (sale) => {
    const response = await axios.post(API_URL, sale, { headers: getAuthHeaders() });
    return response.data;
};

const deleteSale = async (id) => {
    await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
};

const saleService = {
    getSales,
    createSale,
    deleteSale
};

export default saleService;
