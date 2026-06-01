import request from "./request.js";

// 获取分组(根据名称) -- 获取联系人分组详细信息
export const get_contact_group_by_name_ = (params) => {
    return request.get('/ContactGroup/List',{params:params})
}

// 获取分组(根据id) -- 获取联系人分组列表
export const get_contact_group_by_id_ = (params) => {
    return request.get('/ContactGroup/Detail',{params:params})
}

// 更新联系人分组信息
export const update_contact_group_ = (params) => {
    return request.post('/ContactGroup/Update',params )
}

// 删除联系人分组信息
export const delete_contact_group_ = (params) => {
    return request.post('/ContactGroup/Delete',{} ,{params:params})
}

// 分组顺序号上移
export const index_up_contact_group_ = (params) => {
    return request.post('/ContactGroup/IndexUp',{} ,{params:params})
}

// 分组序号下移
export const index_down_contact_group_ = (params) => {
    return request.post('/ContactGroup/IndexDown',{} ,{params:params})
}

