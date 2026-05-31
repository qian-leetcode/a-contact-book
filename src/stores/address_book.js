import {defineStore} from "pinia";
import {ref} from "vue";



export const use_address_book_store = defineStore("address_book",() =>{

    const is_logged_in = ref(false)

    const get_contact_group_list = async (params) =>{
        try {
            // const
        }
        catch(err){
            console.log(err)
        }
    }

})

