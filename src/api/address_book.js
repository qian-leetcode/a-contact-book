import request from './request.js'

// 获取全部联系人
export const get_contact_info_by_=(params) => {
    return request.get('/Contact/List',{params:params})
}

// 根据id 获取联系人信息
export const get_contact_info_by_id_ = (params) => {
    return request.get('/Contact/Detail',{params:params})
}

