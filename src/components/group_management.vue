<script setup>

import {onMounted, reactive, ref, watch} from "vue";
import {use_group_management_store} from "../stores/group_management.js";
import {ElMessage} from "element-plus";

const group_store  = use_group_management_store()


// 查询列表
const query_form = reactive({
    name:''
})

// 分组列表
const group_list = ref([])

// // 获取列表
// const get_contact_group_by_id = async(id) =>{
//     await group_store.get_contact_group_by_id(id)
// }

// 获取列表（名称查询使用）
const get_contact_group_by_name = async () => {
    await group_store.get_contact_group_by_name(query_form.name)
    group_list.value = group_store.group_list
}

// 上移
const up_idx = async (id) =>{
    // console.log(id)
    await group_store.index_up(Number(id));
    await get_contact_group_by_name();
}

// 下移
const down_idx = async (id) =>{
    await group_store.index_down(Number(id));
    await get_contact_group_by_name();
}

// 新增
const show = ref(false);

// 分组信息表
const group_info_form = reactive({
    id:'0',
    name:'',
    idx:null
})

// 新增
const add_group = async () => {
    if(group_info_form.name === '' || group_info_form.idx === ''){
        ElMessage.warning("请完善信息")
        return
    }

    await group_store.update_contact_group(group_info_form)
    if(group_info_form.id === '0')ElMessage.success("新增成功")
    else ElMessage.success("修改成功")
    await get_contact_group_by_name();
    show.value = false
}

// 开始编辑
const open_update = async(row) => {
    show.value = true
    group_info_form.id = row.id
    group_info_form.name = row.name
    group_info_form.idx = Number(row.idx)
}
// 删除
const show_delete = ref(false);

const open_delete = async(row) => {
    console.log(row)
    group_info_form.id = row.id;
    group_info_form.name = row.name
    group_info_form.idx = Number(row.idx);
    show_delete.value = true
}

const delete_group = async () => {
    await group_store.delete_contact_group(Number(group_info_form.id))
    await get_contact_group_by_name();
    show_delete.value = false
}

// 监听窗口
watch(show_delete , ()=>{
    if(show_delete.value === false){
        group_info_form.id = '0'
        group_info_form.name = ''
        group_info_form.idx = null
    }
})

watch(show , ()=>{
    if(show.value === false){
        group_info_form.id = '0'
        group_info_form.name = ''
        group_info_form.idx = null
    }
})


onMounted(() => {
    // get_contact_group_list()
        get_contact_group_by_name();
})

</script>

<template>
    <div style="display: flex">
        <div style="display: flex;width: 200px" >
            <span style="width: 100px;margin: 0 auto ">筛选条件:</span>
            <el-input v-model="query_form.name" placeholder="名称/简写" clearable />
        </div>

        <el-button type="primary" @click="show = true"> 新增 </el-button>
        <el-dialog
            title="分组详情"
            v-model="show"
            @close="show = false"
        >
            <el-form>
                <el-form-item label="分组名称">
                    <el-input
                        v-model="group_info_form.name"
                        placeholder="请输入分组名称"
                        clearable
                    />
                </el-form-item>
                <el-form-item label="分组序号">
                    <el-input-number
                        v-model.number="group_info_form.idx"
                        :min=0
                        :step=1
                        placeholder=0
                    />
                </el-form-item>

            </el-form>
            <template #footer>
                <div>
                    <el-button @click="show = false">取消</el-button>
                    <el-button type="primary" @click="add_group">保存</el-button>
                </div>
            </template>
        </el-dialog>
        <el-button icon="Refresh" @click="get_contact_group_by_name()"> 刷新列表 </el-button>
    </div>
    <div>
        <el-table :data="group_list" border stripe style="width: 100%">
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="idx" label="序列号"></el-table-column>
            <el-table-column label="操作">
                <template #default="{row}">
                    <el-button @click="up_idx(row.id)" size="small" link style="color: rgb(103, 194, 58)">上移</el-button>
                    <el-button @click="down_idx(row.id)" size="small" link style="color: rgb(103, 194, 58)">下移</el-button>
                    <el-button @click="open_update(row)" size="small" link style="color: rgb(64, 158, 255)">编辑</el-button>
                    <el-button @click="open_delete(row)" size="small" link style="color: rgb(245 ,108,108)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
            v-model="show_delete"
            @close="show_delete = false"
        >
            将要删除分组"{{group_info_form.name}}",确认继续吗?
            <el-button @click="delete_group()">确认</el-button>
        </el-dialog>
    </div>
</template>

<style scoped>

</style>