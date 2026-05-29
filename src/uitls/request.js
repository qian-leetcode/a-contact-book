import axios from "axios";
import router from '../router/index.js'
import {ElMessage} from "element-plus";

const request = axios.create({
    baseURL: 'http://abtest.wyk.plus/api/',
    timeout: 10000
})

request.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    console.log('请求URL:', config.url, 'token:', token)
    if (token) {
        config.headers.token = token
    }
    return config
})

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
