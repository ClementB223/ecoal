import axios from "axios";

const API = "http://127.0.0.1:8000/api";

export const login = async (email, password) => {
    const res = await axios.post(`${API}/login`, { email, password });

    localStorage.setItem("token", res.data.token);

    return res.data.user;
};

export const register = async (data) => {
    const res = await axios.post(`${API}/register`, data);

    localStorage.setItem("token", res.data.token);

    return res.data.user;
};

export const getMe = async () => {
    const token = localStorage.getItem("token");

    const res = await axios.get(`${API}/me`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return res.data;
};

export const logout = async () => {
    const token = localStorage.getItem("token");

    await axios.post(
        `${API}/logout`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    localStorage.removeItem("token");
};