import axios from 'axios';
// import { ConflictError, HttpError, InternalServerError, NotFoundError, UnauthorizedError } from "../errors/http_errors";
import { axiosInterceptors } from "./interceptors/axios.interceptor"
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});


axiosInterceptors(api);

export default api;
