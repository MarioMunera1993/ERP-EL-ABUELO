import axios from 'axios';

const API_URL = '/api/categories';

const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return { Authorization: `Bearer ${user?.token}` };
};

const getCategories = async () => {
    const response = await axios.get(API_URL, { headers: getAuthHeaders() });
    return response.data;
};

const createCategory = async (category) => {
    const response = await axios.post(API_URL, category, { headers: getAuthHeaders() });
    return response.data;
};

const deleteCategory = async (id) => {
    await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
};

const categoryService = {
    getCategories,
    createCategory,
    deleteCategory
};

export default categoryService;
