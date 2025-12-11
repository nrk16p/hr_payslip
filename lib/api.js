import axios from "axios";

const API_BASE = "https://api-payslip-v2.vercel.app";

export const uploadExcel = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return axios.post(`${API_BASE}/upload_excel`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Salary Item Meta
export const getMeta = () => axios.get(`${API_BASE}/salary_items/meta`);
export const addMeta = (data) => axios.post(`${API_BASE}/salary_items/meta`, data);
export const deleteMeta = (item_name) =>
  axios.delete(`${API_BASE}/salary_items/meta`, { data: { item_name } });

// Salary Data
export const getSalary = (params) =>
  axios.get(`${API_BASE}/salary_data/data`, { params });
export const updateSalary = (data) =>
  axios.post(`${API_BASE}/salary_data/data`, data);
