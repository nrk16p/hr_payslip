import axios from "axios";

const API_BASE = "https://api-payslip-v2.vercel.app";

// 🔹 Get salary data (handle hyphen key properly)
export const getSalary = async (params) => {
  return axios.get(`${API_BASE}/salary_data/data`, {
    params: {
      emp_id: params.emp_id,
      "month-year": params["month-year"],
    },
  });
};

// 🔹 Update or insert salary data
export const updateSalary = async (data) => {
  const payload = {
    "month-year": data.Sheet,
    emp_id: data["รหัสพนักงาน"],
    datalist: data.datalist,
  };
  return axios.post(`${API_BASE}/salary_data/data`, payload);
};

// 🔹 Delete salary data (for specific employee & month)
export const deleteSalary = async (monthYear, empId) => {
  return axios.delete(`${API_BASE}/salary_data/data`, {
    params: {
      "month-year": monthYear,
      emp_id: empId,
    },
  });
};

// 🔹 Upload Excel
export const uploadExcel = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return axios.post(`${API_BASE}/upload_excel`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// 🔹 Manage salary metadata
export const getMeta = () => axios.get(`${API_BASE}/salary_items/meta`);
export const addMeta = (data) => axios.post(`${API_BASE}/salary_items/meta`, data);
export const deleteMeta = (item_name) =>
  axios.delete(`${API_BASE}/salary_items/meta`, { data: { item_name } });
