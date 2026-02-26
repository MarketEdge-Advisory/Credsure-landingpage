// src/api/financeApplications.js
import axios from 'axios';

const BASE_URL = 'https://credsure-backend-1564d84ae428.herokuapp.com/api/finance-applications';

const financeApplicationsApi = {
  async getAll(params = {}) {
    const token = localStorage.getItem('adminToken') || '';
    const res = await axios.get(BASE_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });
    return res.data;
  },
};

export default financeApplicationsApi;
