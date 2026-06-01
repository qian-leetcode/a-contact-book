import axios from "axios";
import router from '../router/index.js'
import {ElMessage} from "element-plus";

const request = axios.create({
    baseURL: 'http://abtest.wyk.plus/api/',
    timeout: 10000
})

// 请求拦截器：自动携带token
request.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.token = token
    }
    return config
})

// 响应拦截器：401时跳转登录页
request.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            router.push('/')
            ElMessage.error("登录已过期，请重新登录")
        }
        return Promise.reject(error)
    }
)

export default request;
