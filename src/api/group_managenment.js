import request from "./request.js";

// 根据名称查询联系人分组列表
export const get_contact_group_by_name_ = (params) => {
    return request.get('/ContactGroup/List',{params:params})
}

// 根据ID查询联系人分组详情
export const get_contact_group_by_id_ = (params) => {
    return request.get('/ContactGroup/Detail',{params:params})
}

// 更新/新增联系人分组
export const update_contact_group_ = (params) => {
    return request.post('/ContactGroup/Update',params )
}

// 删除联系人分组
export const delete_contact_group_ = (params) => {
    return request.post('/ContactGroup/Delete',{} ,{params:params})
}

// 分组上移
export const index_up_contact_group_ = (params) => {
    return request.post('/ContactGroup/IndexUp',{} ,{params:params})
}

// 分组下移
export const index_down_contact_group_ = (params) => {
    return request.post('/ContactGroup/IndexDown',{} ,{params:params})
}

