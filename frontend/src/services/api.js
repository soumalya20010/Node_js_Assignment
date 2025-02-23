import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const search = async (query, page = 1, limit = 5, sort = 'name') => {
    const response = await axios.get(`${API_URL}/search`, {
        params: { query, page, limit, sort }
    });
    return response.data;
};

export const getCompany = async (companyId) => {
    const response = await axios.get(`${API_URL}/companies/${companyId}`);
    return response.data;
};

export const createCompany = async (companyData) => {
    const response = await axios.post(`${API_URL}/companies`, companyData);
    return response.data;
};