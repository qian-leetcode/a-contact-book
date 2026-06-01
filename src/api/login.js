import request from './request.js'


// 与系统是否是正确的连接
export const user_user_connect_  = () => {
    return request.get('/Connect');
}

// 用户登录
export const user_login_ = (params) => {
    return request.post('/UserLogin' , {},{params:params});
}



// 用户注册
export const user_register_ = (params) => {
    return request.post('/Register' ,params);
}


// 检测当前的登录信息是否有效
export const user_check_login_ = () => {
    return request.get('/CheckLogin');
}

// 修改用户密码
export const change_user_password_ = (params) => {
    return request.post('/ChangePassword',{},{params:params});
}

// 用户退出
export const user_logout_ = () => {
    return request.post('/Logout')
}

