import axios from "axios";

const USERS_API_BASE = "https://api-ncac.onrender.com";
const AUTH_STORAGE_KEY = "mena_payroll_auth";

const ALLOWED_DEPARTMENT_IDS = [1, 7];
const ALLOWED_EMAILS = [
  "narongkorn.a@menatransport.co.th",
  "kittaboon.l@menatransport.co.th",
];

export async function loginWithEmployeeId(employeeId) {
  const id = employeeId.trim();
  if (!id) throw new Error("กรุณากรอกรหัสพนักงาน");

  let user;
  try {
    const res = await axios.get(
      `${USERS_API_BASE}/users/${encodeURIComponent(id)}`
    );
    user = res.data;
  } catch (err) {
    if (err.response?.status === 404) {
      throw new Error("ไม่พบรหัสพนักงานนี้ในระบบ");
    }
    throw new Error("เชื่อมต่อระบบยืนยันตัวตนไม่สำเร็จ กรุณาลองใหม่");
  }

  const email = (user.email || "").trim().toLowerCase();
  const isAllowedDepartment = ALLOWED_DEPARTMENT_IDS.includes(
    user.department_id
  );
  const isAllowedEmail = ALLOWED_EMAILS.includes(email);

  if (!isAllowedDepartment && !isAllowedEmail) {
    throw new Error("คุณไม่มีสิทธิ์เข้าถึงระบบนี้");
  }

  const session = {
    employee_id: user.employee_id,
    name: `${user.firstname ?? ""} ${user.lastname ?? ""}`.trim(),
    email: user.email,
    department: user.department,
    department_id: user.department_id,
    position: user.position,
    loginAt: new Date().toISOString(),
  };

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  return session;
}

export function getSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_STORAGE_KEY);
}
