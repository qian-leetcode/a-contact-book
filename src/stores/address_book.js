import {defineStore} from "pinia";
import {ref} from "vue";
import {ElMessage} from "element-plus";
import {get_contact_info_by_, get_contact_info_by_id_, update_contact_, delete_contact_} from "../api/address_book.js";
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
            // console.log(res)
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
                contact_group_statices_list.value = Object.values(map)
                console.log(contact_group_statices_list.value)
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
            const res = await get_contact_info_by_(params)
            if(res.data.code === 0){
                const data = JSON.parse(res.data.data)
                contact_list.value = data
                // console.log(data)
                const map = {}
                contact_list.value.forEach(item =>{
                    const group_key = item.call_name
                    if(!map[group_key]){
                        map[group_key] = {
                            call_name: item.call_name,
                            users: []
                        }
                    }
                    map[group_key].users.push(item)
                })
                // console.log(map)
                contact_dict_statices_list.value = Object.values(map)
                console.log(contact_dict_statices_list.value)
            }
        }
        catch(err){
            console.log(err.message);
            ElMessage.error("出现异常，请联系工作人员")
        }
    }

    // 按字母排序
    const contact_letter_list = ref([])

    const contact_sort_by_letter = async (params) =>{
        try {
            const res = await get_contact_info_by_(params)
            if(res.data.code === 0) {
                const data = JSON.parse(res.data.data)
                contact_list.value = data
                const map = {}
                contact_list.value.forEach(item =>{
                    const letter = item.ch_group || '#'
                    if(!map[letter]){
                        map[letter] = {
                            letter,
                            users: []
                        }
                    }
                    map[letter].users.push(item)
                })
                const sorted = Object.values(map).sort((a, b) => {
                    const aIsLetter = /^[A-Za-z]$/.test(a.letter)
                    const bIsLetter = /^[A-Za-z]$/.test(b.letter)
                    if (aIsLetter && !bIsLetter) return -1
                    if (!aIsLetter && bIsLetter) return 1
                    return a.letter.localeCompare(b.letter)
                })
                contact_letter_list.value = sorted
            }
            else {
                ElMessage.error(res.data.message)
            }
        }
        catch (err){
            console.log(err.message);
            ElMessage.error("出现异常，请联系工作人员")
        }
    }

    // 新增/更新联系人
    const update_contact = async (data) => {
        try {
            const res = await update_contact_(data)
            if (res.data.code === 0) {
                ElMessage.success("保存成功")
                return JSON.parse(res.data.data)
            } else {
                ElMessage.error(res.data.message)
                return null
            }
        } catch (err) {
            console.log(err.message);
            ElMessage.error("出现异常，请联系工作人员")
            return null
        }
    }

    // 删除联系人
    const delete_contact = async (id) => {
        try {
            const res = await delete_contact_(id)
            if (res.data.code === 0) {
                ElMessage.success("删除成功")
                return true
            } else {
                ElMessage.error(res.data.message)
                return false
            }
        } catch (err) {
            console.log(err.message);
            ElMessage.error("出现异常，请联系工作人员")
            return false
        }
    }

    return {
        get_contact_list,
        contact_list,
        get_group_contact_list,
        contact_group_list,
        contact_dict_statices_list,
        get_contact_group_statices_list,
        contact_group_statices_list,
        contact_sort_by_letter,
        contact_letter_list,
        update_contact,
        delete_contact,
    }
})
