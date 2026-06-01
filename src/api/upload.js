import request from './request.js'

// 上传文件（通用）
export const upload_file_common_ = (folder, name, file) => {
    const formData = new FormData()
    formData.append('file', file)
    return request.post('/Upload/UploadFileCommon', formData, {
        params: { folder, name }
    })
}

// 获取文件信息
export const get_file_info_ = (id) => {
    return request.get('/Upload/FileInfo', { params: { id } })
}
