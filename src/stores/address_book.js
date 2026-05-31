import {defineStore} from "pinia";
import {ref} from "vue";
import {ElMessage} from "element-plus";
import {get_contact_info_by_} from "../api/address_book.js";



export const use_address_book_store = defineStore("address_book",() =>{

    const is_logged_in = ref(false)

    const get_contact_list = async (params) =>{
        try {
            const res = await get_contact_info_by_(params)
            console.log(res)
            // if(res.data.code === 0)
        }
        catch(err){
            console.log(err.message);
            ElMessage.error("出现异常，请联系工作人员")
        }
    }

    return {
        get_contact_list,
    }
})

