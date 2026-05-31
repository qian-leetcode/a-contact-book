<script setup>

import {onMounted, reactive, ref, watch} from "vue";
import use_DictCommon_store from "../stores/Dictionary_Management.js";

const DictCommon_store= use_DictCommon_store()

// 查询列表
const query_form = reactive({
    type:'',
})


// 获取字典类型列表
const get_Dict_type_list = async () => {
    await DictCommon_store.get_DictCommon_list()
    query_form.type = DictCommon_store.Dict_type_list[0].value
    await get_dict_common_list()
}

const dict_common_list = ref([])

// 获取字典列表
const get_dict_common_list = async () => {
    const params = {
        type:query_form.type,
    }
    await DictCommon_store.get_dict_common_list(params)
    dict_common_list.value = DictCommon_store.Dict_common_list
    console.log(dict_common_list.value)
}

const show = ref(false);
const dict_info = reactive({
    id:'',
    dic_type:'',
    content:'',
    idx:''
})


//修改
const open_update = async (row) => {
    show.value = true
    dict_info.id = row.id
    dict_info.dic_type = row.dic_type
    dict_info.content = row.content
    dict_info.idx = row.idx
    console.log(row)
}

// 编辑更新
const update_dict_common_list = async () => {
    const params = {
        id:Number(dict_info.id),
        // dic_type:"CallName",
        dic_type: dict_info.dic_type,
        content:dict_info.content,
        idx:Number(dict_info.idx)
    }

    await DictCommon_store.update_add_dict(params)
    // console.log(params)
    show.value = false
    await get_dict_common_list()
}

// 删除
const delete_dict_common_list = async (id) => {
    const params = {
        id:id,
    }
    await DictCommon_store.delete_dict(params)
    await get_dict_common_list()
}

// 上移
const up_dict = async(id) => {
    await DictCommon_store.up_dict(id)
    await get_dict_common_list()
}

// 下移
const down_dict = async(id) => {
    await DictCommon_store.down_dict(id)
    await get_dict_common_list()
}

watch(show , ()=>{
    if(show.value === false){
        dict_info.id=''
        dict_info.dic_type=''
        dict_info.content=''
        dict_info.idx=''
    }
})

onMounted(() => {
    get_Dict_type_list()
})

</script>

<template>
    <div style="display: flex;">
        <div style="display: flex;width: 200px" >
            <span style="width: 150px;margin: 0 auto ">筛选条件:</span>
            <el-select v-model="query_form.type"
            >
                <el-option
                    v-for="it in DictCommon_store.Dict_type_list"
                    :key="it.value"
                    :label="it.name"
                    :value="it.value"
                />
            </el-select>
        </div>

        <el-button type="primary" @click="show = true"> 新增 </el-button>
        <el-dialog
            v-model="show"
            title="字典项目信息详情"
            @close="show = false"
        >
            <el-input
                v-model="dict_info.content"
                type="textarea"
                placeholder="项目内容"
                :rows="8"
            ></el-input>
            <template #footer>
                <div>
                    <el-button @click="show = false">取消</el-button>
                    <el-button type="primary" @click="update_dict_common_list">保存</el-button>
                </div>
            </template>
        </el-dialog>

        <el-button icon="Refresh" @click="get_dict_common_list"> 刷新列表 </el-button>
    </div>
    <div>
        <el-table :data="dict_common_list" border stripe style="width: 100%">
            <el-table-column prop="content" label="名称" />
            <el-table-column prop="idx" label="序列号" />
            <el-table-column label="操作">
                <template #default="{row}">
                    <el-button @click="up_dict(row.id)" size="small" link style="color: rgb(103, 194, 58)">上移</el-button>
                    <el-button @click="down_dict(row.id)" size="small" link style="color: rgb(103, 194, 58)">下移</el-button>
                    <el-button @click="open_update(row)" size="small" link style="color: rgb(64, 158, 255)">编辑</el-button>
                    <el-button @click="delete_dict_common_list(row.id)" size="small" link style="color: rgb(245 ,108,108)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<style scoped>

</style>