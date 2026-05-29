<script setup>
import {onMounted, ref} from "vue";
import {ElMessage} from "element-plus";
import { get_contact_group_by_id_ } from "../api/group_managenment.js";

const query_form = ref({
    id:'',
    filter:'',
})

const get_group = async () => {
    try {
        const params = {
            id:1
        }
        const res = await get_contact_group_by_id_(params)
        console.log(res)
        if(res.data.code === 0){

        }
        else {
            ElMessage.error("列表获取异常" ,res.data.message)
        }
    }
    catch (error) {
        ElMessage.error(error.message);
    }
}

onMounted(() =>{
    get_group();
})

</script>

<template>
    <el-header>
    <div>
        <el-space>
            <el-radio-group>
                <el-radio-button>分组显示</el-radio-button>
                <el-radio-button>字母排序显示</el-radio-button>
            </el-radio-group>
            <div>
                <el-select placeholder="请选择分组">
                </el-select>
            </div>
            <div>

            </div>

        </el-space>
    </div>
    </el-header>
    <router-view></router-view>
</template>
<style scoped>

</style>