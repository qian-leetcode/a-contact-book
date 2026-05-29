import request from "../uitls/request.js";

// 获取分组(根据名称)
export const get_contact_group_by_name_ = (params) => {
    return request.get('ContactGroup/List',{params:params})
}

// 获取分组(根据id)
export const get_contact_group_by_id_ = (params) => {
    return request.get('ContactGroup/Detail',{params:params})
}