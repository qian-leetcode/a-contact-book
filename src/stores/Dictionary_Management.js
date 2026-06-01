import {defineStore} from "pinia";
import {ref} from "vue";
import {ElMessage} from "element-plus";
import {
    delete_dict_, down_dict_,
    get_dict_common_list_,
    get_Dict_type_list_, up_dict_,
    update_add_dict_
} from "../api/Dictionary_Management.js";

const use_DictCommon_store = defineStore("DictCommon", ()=>{

    // 字典类型列表
    const Dict_type_list = ref([])

    // 字典列表
    const Dict_common_list = ref([])

    // 获取字典类型列表
    const get_DictCommon_list = async () => {
        try {
            const res = await get_Dict_type_list_()
            // console.log(res)
            const data = JSON.parse(res.data.data)
            Dict_type_list.value = data
        }catch(err) {
            ElMessage.error("出现异常，请联系工作人员")
            console.log(err.message);
        }
    }

    // 获取字典列表
    const get_dict_common_list = async (params) => {
        try {
            const res = await get_dict_common_list_(params)
            console.log(res)
            if(res.data.data){
                const data = JSON.parse(res.data.data)
                Dict_common_list.value = data
                // console.log(res)
            }
            else{
                ElMessage("请刷新页面")
            }
        }
        catch(err) {
            ElMessage.error("出现异常，请联系工作人员")
            console.log(err.message);
        }
    }

    // 更新(新增)
    const update_add_dict = async (params) => {
        try {
            // console.log(params)
            const res = await update_add_dict_(params)
            if(res.data.code !== 0){
                ElMessage.error(res.data.message)
            }
            else {
                if(params.id === 0) {
                    ElMessage.success("新增成功")
                }
                else {
                    ElMessage.success("修改成功")
                }
            }
            // console.log(res)
        }
        catch(err) {
            console.log(err.message);
            ElMessage.error("出现异常，请联系工作人员")
        }
    }

    // 删除
    const delete_dict = async (params) => {
        try {
            await delete_dict_(params)
            ElMessage.success("删除成功")
        }
        catch(err) {
            console.log(err.message);
            ElMessage.error("出现异常，请联系工作人员")
        }
    }

    // 上移
    const up_dict = async(id) => {
        try {
            const params = {
                id:id
            }
            const res = await up_dict_(params)
            if(res.data.code !== 0){
                ElMessage.error(res.data.message)
            }
            else {
                ElMessage.success("上移成功")
            }
        }
        catch (err){
            console.log(err.message);
            ElMessage.error("出现异常，请联系工作人员")
        }
    }

    // 下移
    const down_dict = async(id) => {
        try {
            const params = {
                id:id
            }
            const res = await down_dict_(params)
            if(res.data.code !== 0){
                ElMessage.error(res.data.message)
            }
            else {
                ElMessage.success("下移成功")
            }
        }
        catch(err) {
            console.log(err.message);
            ElMessage.error("出现异常，请联系工作人员")
        }

    }

    return {
        Dict_type_list,
        get_DictCommon_list,
        get_dict_common_list,
        Dict_common_list,
        update_add_dict,
        delete_dict,
        up_dict,
        down_dict
    }
})
export default use_DictCommon_store

