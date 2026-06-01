import request from './request.js'

export const upload_file_common_ = (folder, name, file) => {
    const formData = new FormData()
    formData.append('file', file)
    return request.post('/Upload/UploadFileCommon', formData, {
        params: { folder, name }
    })
}

export const get_file_info_ = (id) => {
    return request.get('/Upload/FileInfo', { params: { id } })
}
