// src/api/financeApplications.js
import axios from './axiosInstance';

const BASE_URL = '/finance-applications';

const financeApplicationsApi = {
  async getAll(params = {}) {
    const res = await axios.get(BASE_URL, { params });
    return res.data;
  },
};

export default financeApplicationsApi;