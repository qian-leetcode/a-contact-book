import {defineStore} from "pinia";
import {ref} from "vue";
import {
    delete_contact_group_,
    get_contact_group_by_id_, get_contact_group_by_name_,
    index_down_contact_group_,
    index_up_contact_group_, update_contact_group_
} from "../api/group_managenment.js";
import {ElMessage} from "element-plus";

export const use_group_management_store = defineStore('group', ()=> {

    // 分组数据
    const group_list = ref([])

    // 根据Id 获取列表信息
    const get_contact_group_by_id = async (id) => {
        try {
            const params = {id:id}
            // console.log(params)
            const res = await get_contact_group_by_id_(params)
        }
        catch(e) {
            ElMessage.error("出现异常，请联系工作人员")
            console.error(e)
        }
    }

    // 获取列表名称
    const get_contact_group_by_name =async (name) => {
        try {
            const params = {filter:name}
            // console.log(params)
            const res = await get_contact_group_by_name_(params);
            const data = JSON.parse(res.data.data)
            // console.log(data)
            group_list.value=data
        }
        catch(e) {
            ElMessage.error("出现异常，请联系工作人员")
            console.error(e)
        }
    }

    // 更新
    const update_contact_group = async (params) => {
        try {
            const param = {
                id : Number(params.id),
                name : params.name,
                idx : Number(params.idx),
            }
            const res = await update_contact_group_(param)
            if(res.data.code !== 0){
                // ElMessage.success("修改成功")
                ElMessage.error(res.data.message);
            }
        }
        catch (error) {
            ElMessage.error("出现异常，请联系工作人员")
            console.error(error)
        }
    }

    // 删除
    const delete_contact_group = async (id) => {
        try {
            const params = {id:id}
            const res = await delete_contact_group_(params)
            // const data = JSON.parse(res.data.data)
            if(res.data.code === 0){
                ElMessage.success("删除成功")
            }
            else {
                ElMessage.error(res.data.message);
            }
        }
        catch(err) {
            ElMessage.error("出现异常，请联系工作人员")
            console.log(err)
        }
    }

    //  上移
    const index_up = async (id) => {
        try {
            const params = {id}
            const res = await index_up_contact_group_(params)
            // console.log(res)
            // const data = JSON.parse(res.data.data)
            // console.log(res.data)

            if(res.data.code !== 0){
                ElMessage.error(res.data.message)
            }
            else {
                ElMessage.success("上移成功")
            }
        }
        catch (error) {
            ElMessage.error("出现异常，请联系工作人员")
            console.log(error)
        }
    }

    // 下移
    const index_down = async (id) => {
        try {
            const params = {id}
            const res = await index_down_contact_group_(params)
            // const data = JSON.parse(res.data.data)
            // console.log(res.data)
            if(res.data.code !== 0){
                ElMessage.error(res.data.message)
            }
            else {
                ElMessage.success("下移成功")
            }
        }
        catch (error) {
            ElMessage.error("出现异常，请联系工作人员")
            console.log(error)
        }
    }

    return {
        group_list,
        get_contact_group_by_name,
        get_contact_group_by_id,
        index_up,
        index_down,
        update_contact_group,
        delete_contact_group
    }
})
