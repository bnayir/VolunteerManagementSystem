import axios from 'axios';

const api = axios.create({
    baseURL: 'https://127.0.0.1:7231/api', 
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); 
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; 
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response; 
    },
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.warn("Oturum geçersiz veya yetkisiz erişim. Yönlendiriliyor...");
            
           
            // localStorage.removeItem('token');
            // localStorage.removeItem('user');
            // window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);

export default api;