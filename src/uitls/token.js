

// token
const TOKEN_KEY = 'token'

// 刷新时间
const deadline = 0

// 设置 token
export function setToken(token){
    localStorage.setItem(TOKEN_KEY, token)
}

// 获取 token
export function getToken(){
    return localStorage.getItem(TOKEN_KEY)
}

// 移除 token
export function removeTokens(){
    localStorage.removeItem(TOKEN_KEY)
}

// 获取过期时间






