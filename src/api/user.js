import request from './request.js'

// 获取用户数据(id)
export const get_user_info_by_id_ = (params)=> {
    return request.get('/Account/List',{params:params})
}

// 获取用户数据(用户名)
export const get_user_info_by_name_ = (params)=> {
    return request.get('/Account/List',{params:params})
}