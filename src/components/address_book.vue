<script setup>
import {onMounted, ref} from "vue";
import {ElMessage} from "element-plus";
import { get_contact_group_by_id_ } from "../api/group_managenment.js";
import { Plus, Refresh } from '@element-plus/icons-vue'

const query_form = ref({
    id:'',
    filter:'',
})

const get_group = async () => {
    try {
        const params = {
            id:0
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
            <div style="display: flex;width: 200px">
                <span style="width: 100px">分组:</span>
                <el-select placeholder="请选择分组">
                </el-select>
            </div>
            <div style="display: flex;width: 200px" >
                <span style="width: 100px;margin: 0 auto ">筛选:</span>
                <el-input placeholder="姓名/手机号/称呼" clearable />
            </div>

                <el-button type="primary"> 新增 </el-button>
                <el-button icon="Refresh"> 刷新列表 </el-button>
        </el-space>
    </div>
    </el-header>
    <hr>
    <router-view></router-view>
</template>
<style scoped>

</style>