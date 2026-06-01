import request from './request.js'

// 获取全部联系人
export const get_contact_info_by_=(params) => {
    return request.get('/Contact/List',{params:params})
}

// 根据id 获取联系人信息
export const get_contact_info_by_id_ = (params) => {
    return request.get('/Contact/Detail',{params:params})
}

// 新增/更新联系人 (id=0 新增, >0 更新)
export const update_contact_ = (data) => {
    return request.post('/Contact/Update', data)
}

