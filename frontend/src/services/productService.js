import axios from 'axios';

const API_URL = '/api/products';

const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return { Authorization: `Bearer ${user?.token}` };
};

const getProducts = async () => {
    const response = await axios.get(API_URL, { headers: getAuthHeaders() });
    return response.data;
};

const getProductById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`, { headers: getAuthHeaders() });
    return response.data;
};

const createProduct = async (product) => {
    const response = await axios.post(API_URL, product, { headers: getAuthHeaders() });
    return response.data;
};

const updateProduct = async (id, product) => {
    const response = await axios.put(`${API_URL}/${id}`, product, { headers: getAuthHeaders() });
    return response.data;
};

const deleteProduct = async (id) => {
    await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
};

const getStockAlerts = async () => {
    const response = await axios.get(`${API_URL}/alerts`, { headers: getAuthHeaders() });
    return response.data;
};

const productService = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getStockAlerts
};

export default productService;
