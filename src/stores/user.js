import { defineStore } from 'pinia'
import { ref } from "vue";
import { user_login_, user_logout_ } from '../api/login';
import { ElMessage } from "element-plus";
import {get_user_password_, update_user_password_} from "../api/user.js";

export const use_user_store = defineStore('user', () => {
    const userInfo = ref()
    const is_logged_in = ref(false)
    const user_password = ref('')

    // 用户登录
    async function login(username, password) {
        try {
            localStorage.removeItem('token')
            const params = {
                user_name: username,
                password: password
            }
            const res = await user_login_(params)
            console.log(res.data.data)
            console.log(typeof res.data.data)
            if (res.data.code === 0) {
                const data = JSON.parse(res.data.data)
                userInfo.value = data
                is_logged_in.value = true
                localStorage.setItem('token', data.token)
                ElMessage.success("登录成功")
                return true
            } else {
                ElMessage.error("登录失败: " + (res.data.message || ''))
                return false
            }
        } catch (error) {
            ElMessage.error("登录异常")
            console.log(error)
            return false
        }
    }

    // 退出登录
    const logout = async () => {
        try {
            await user_logout_()
        } catch (error) {
            console.log("退出登录失败", error)
        } finally {
            userInfo.value = undefined
            is_logged_in.value = false
            localStorage.removeItem('token')
        }
    }

    // 获取用户密码
    const get_password = async (id) => {
        try {
            const params = {
                id:Number(id)
            }
            const res = await get_user_password_(params)
            if(res.data.code === 0) {
                const data = JSON.parse(res.data.data)
                user_password.value = data
                // console.log(user_password.value)
            }
            else {
                ElMessage.error(res.data.message)
            }

        }
        catch (error){
            console.log(error)
            ElMessage.error("出现异常，请联系工作人员")
        }
    }

    // 更新密码
    const update_password = async (params) => {
        try {
            const res = await update_user_password_(params)
            // console.log(res)
            if(res.data.code === 0) {
                ElMessage.success("修改成功")
            }
            else {
                ElMessage.error(res.data.message)
            }
        }catch (error) {
            console.log(error)
            ElMessage.error("出现异常，请联系工作人员")
        }
    }

    return {
        userInfo,
        is_logged_in,
        login,
        logout,
        get_password,
        user_password,
        update_password
    }
}, {
    persist: true
})