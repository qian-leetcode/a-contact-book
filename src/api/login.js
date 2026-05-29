import request from '../uitls/request.js'

// 用户登录
export const user_login_ = (params) => {
    return request.post('/UserLogin' , {},{params:params});
}

// 用户退出
export const user_logout_ = () => {
    return request.post('/Logout' ,{},{})
}

// 用户注册
export const user_register_ = (params) => {
    return request.post('/Register' ,{},{params:params});
}