import {defineStore} from "pinia";
import {ref} from "vue";
import {ElMessage} from "element-plus";
import {get_contact_info_by_, get_contact_info_by_id_} from "../api/address_book.js";
import {use_group_management_store} from "./group_management.js";

export const use_address_book_store = defineStore("address_book",() =>{

    const contact_list = ref([])

    // 联系人(分组)
    const contact_group_list = ref([])

    // 联系人(称呼) -- 用于统计
    const contact_dict_statices_list = ref([])

    // 联系人(分组) -- 用于统计
    const contact_group_statices_list = ref([])

    //
    const get_contact_list = async (params) =>{
        try {
            const res = await get_contact_info_by_(params)
            // if(res.data.code === 0)
            if(res.data.code === 0){
                const data = JSON.parse(res.data.data)
                contact_list.value = data
                // console.log(data)
            }
            else {
                ElMessage.error(res.data.message)
            }
        }
        catch(err){
            console.log(err.message);
            ElMessage.error("出现异常，请联系工作人员")
        }
    }

    // 根据分组得到联系人
    const get_group_contact_list = async (params) =>{
        try {
            const res = await get_contact_info_by_(params)
            console.log(res)
            if(res.data.code === 0){
                const data = JSON.parse(res.data.data)
                contact_list.value = data
                console.log(data)
                const map = {}

                contact_list.value.forEach(item =>{
                    const group_key = item.group_id
                    if(!map[group_key]){
                        map[group_key] = {
                            group_id: item.group_id,
                            group_name: item.group_name,
                            users: []
                        }
                    }
                    map[group_key].users.push(item)
                })
                contact_dict_statices_list.value = Object.values(map)
                const group_store = use_group_management_store()
                group_store.group_list.forEach(g => {
                    if (!map[g.id]) {
                        map[g.id] = {
                            group_id: g.id,
                            group_name: g.name,
                            users: []
                        }
                    }
                })
                contact_group_list.value = Object.values(map)
            }
            else {
                ElMessage.error(res.data.message)
            }
        }
        catch(err){
            console.log(err.message);
            ElMessage.error("出现异常，请联系工作人员")
        }
    }

    // 根据称呼得到联系人分组  -- call_name
    const get_contact_group_statices_list = async (params) =>{
        try {

        }
        catch(err){
            console.log(err.message);
            ElMessage.error("出现异常，请联系工作人员")
        }
    }

    return {
        get_contact_list,
        contact_list,
        get_group_contact_list,
        contact_group_list,
        contact_dict_statices_list,
        get_contact_group_statices_list
    }
})
