import request from "./request.js";

// 获取字典所有类型列表
export const get_Dict_type_list_ = () => {
    return request.get('/Dict/Common/AllTypes')
}

// 获取字典列表
export const get_dict_common_list_ = (params) => {
    return request.get('/Dict/Common/List',{params:params})
}

//更新（新增）
export const update_add_dict_ = async(params) =>{
    return request.post('/Dict/Common/Update' ,params)
}

// 删除
export const delete_dict_ = async(params) =>{
    return request.post('/Dict/Common/Delete',{},{params:params})
}

// 上移
export const up_dict_ = async(params) =>{
    return request.post('/Dict/Common/IndexUp',{},{params:params})
}

// 下移
export const down_dict_ = async(params) =>{
    return request.post('/Dict/Common/IndexDown',{},{params:params})
}
