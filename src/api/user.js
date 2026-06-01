import request from './request.js'

// 根据ID获取用户信息
export const get_user_info_by_id_ = (params)=> {
    return request.get('/Account/List',{params:params})
}

// 根据用户名获取用户信息
export const get_user_info_by_name_ = (params)=> {
    return request.get('/Account/List',{params:params})
}

// 获取用户密码
export const get_user_password_= (params)=> {
    return request.post('Account/Password',{},{params:params})
}

// 修改用户密码
export const update_user_password_ = (params) => {
    return request.post('/ChangePassword',{} ,{params:params})
}
