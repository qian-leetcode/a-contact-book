import request from './request.js'

// 获取用户列表
export const get_account_by_name_ = (params) => {
    return request.get('/Account/List',{params:params})
}

// 新增用户
export const add_account_ = (params) => {
    return request.post('/Account/Update',params)
}

// 删除用户
export const delete_account_ = (params) => {
    return request.post('/Account/Delete',{} ,{params:params})
}