import {defineStore} from "pinia";
import { ref} from "vue";
import {ElMessage} from "element-plus";
import {add_account_, delete_account_, get_account_by_name_} from "../api/Account_Management.js";

export const user_account_store = defineStore('account',()=>{
    const account_list = ref([])

    // 根据名称获取用户信息
    const get_account_by_name =async (params) => {
        try {
            const res= await get_account_by_name_(params)
            if(res.data.code === 0){
                const data = JSON.parse(res.data.data)
                // console.log(data)
                account_list.value = data
            }
            else {
                ElMessage.error(res.data.message)
            }
        }
        catch(e) {
`            ElMessage.error("出现异常，请联系工作人员")
            console.error(e)`
        }
    }

    // 新增用户
    const add_account = async (params) => {
        try {
            const res = await add_account_(params)
            if(res.data.code === 0){
                const data = JSON.parse(res.data.data)
                ElMessage.success("添加成功")
            }
            else {
                ElMessage.error(res.data.message)
            }
        }
        catch(e) {
            ElMessage.error("出现异常，请联系工作人员")
            console.error(e)
        }
    }

    // 修改用户
    const update_account = async (params) => {
        try {
            const res = await add_account_(params)
            if(res.data.code === 0){
                const data = JSON.parse(res.data.data)
                if(params.id === 0) ElMessage.success("新增成功")
                else ElMessage.success("修改成功")
            }
            else {
                ElMessage.error(res.data.message)
            }
        }
        catch (e){
            ElMessage.error("出现异常，请联系工作人员")
            console.error(e)
        }
    }

    // 删除用户
    const delete_account = async (params) => {
        try {
            const res = await delete_account_(params)
            if(res.data.code === 0){
                ElMessage.success("删除成功")
            }
            else {
                ElMessage.error(res.data.message)
            }
        }
        catch (e) {
            ElMessage.error("出现异常，请联系工作人员")
            console.error(e)
        }
    }

    return {
        account_list,
        get_account_by_name,
        add_account,
        update_account,
        delete_account
    }
})