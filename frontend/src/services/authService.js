import axios from 'axios';
const API_URL = '/api/auth/';
const login = async (username, password) => {
    try {
        const response = await axios.post(API_URL + 'login', {
            username,
            password
        });

        // Guardamos el token y datos en el navegador
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }

        return response.data;
    } catch (error) {
        // Capturamos el error del backend
        throw error.response?.data || 'Error de conexión con el servidor';
    }
};
const logout = () => {
    localStorage.removeItem('user');
};
const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};
const authService = { login, logout, getCurrentUser };
export default authService;