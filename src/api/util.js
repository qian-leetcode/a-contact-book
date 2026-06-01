const API_BASE = 'http://abtest.wyk.plus'

// 将相对路径转为完整URL
export const full_url = (url) => {
    if (!url) return ''
    if (/^(https?:|blob:)/i.test(url)) return url
    return API_BASE + (url.startsWith('/') ? url : '/' + url)
}
