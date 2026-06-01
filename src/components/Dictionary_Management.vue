<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import use_DictCommon_store from "../stores/Dictionary_Management.js";

const DictCommon_store = use_DictCommon_store()

const query_form = reactive({
    type: '',
})

const get_Dict_type_list = async () => {
    await DictCommon_store.get_DictCommon_list()
    query_form.type = DictCommon_store.Dict_type_list[0]?.value
    await get_dict_common_list()
}

const dict_common_list = ref([])

const get_dict_common_list = async () => {
    const params = { type: query_form.type }
    await DictCommon_store.get_dict_common_list(params)
    dict_common_list.value = DictCommon_store.Dict_common_list
}

const show = ref(false)
const dict_info = reactive({
    id: '0',
    dic_type: query_form.type,
    content: '',
    idx: ''
})

const open_update = async (row) => {
    show.value = true
    dict_info.id = row.id
    dict_info.dic_type = row.dic_type
    dict_info.content = row.content
    dict_info.idx = row.idx
}

const update_dict_common_list = async () => {
    const params = {
        id: Number(dict_info.id),
        dic_type: query_form.type,
        content: dict_info.content,
        idx: Number(dict_info.idx)
    }
    await DictCommon_store.update_add_dict(params)
    show.value = false
    await get_dict_common_list()
}

const delete_dict_common_list = async (id) => {
    await DictCommon_store.delete_dict({ id })
    await get_dict_common_list()
}

const up_dict = async (id) => {
    await DictCommon_store.up_dict(id)
    await get_dict_common_list()
}

const down_dict = async (id) => {
    await DictCommon_store.down_dict(id)
    await get_dict_common_list()
}

watch(show, () => {
    if (show.value === false) {
        dict_info.id = '0'
        dict_info.dic_type = ''
        dict_info.content = ''
        dict_info.idx = ''
    }
})

onMounted(() => {
    get_Dict_type_list()
})
</script>

<template>
    <div class="page-toolbar">
        <div class="toolbar-left">
            <span class="label">字典类型：</span>
            <el-select v-model="query_form.type" class="type-select">
                <el-option
                    v-for="it in DictCommon_store.Dict_type_list"
                    :key="it.value"
                    :label="it.name"
                    :value="it.value"
                />
            </el-select>
        </div>
        <div class="toolbar-right">
            <el-button type="primary" @click="show = true">新增</el-button>
            <el-button icon="Refresh" @click="get_dict_common_list">刷新列表</el-button>
        </div>
    </div>

    <div class="page-body">
        <el-table :data="dict_common_list" border stripe class="data-table">
            <el-table-column prop="content" label="名称" />
            <el-table-column prop="idx" label="序列号" width="120" />
            <el-table-column label="操作" width="320">
                <template #default="{row}">
                    <el-button @click="up_dict(row.id)" size="small" type="success" plain>上移</el-button>
                    <el-button @click="down_dict(row.id)" size="small" type="success" plain>下移</el-button>
                    <el-button @click="open_update(row)" size="small" type="primary" plain>编辑</el-button>
                    <el-button @click="delete_dict_common_list(row.id)" size="small" type="danger" plain>删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>

    <el-dialog
        v-model="show"
        title="字典项目信息详情"
        @close="show = false"
        width="500px"
    >
        <el-input
            v-model="dict_info.content"
            type="textarea"
            placeholder="项目内容"
            :rows="8"
        />
        <template #footer>
            <el-button @click="show = false">取消</el-button>
            <el-button type="primary" @click="update_dict_common_list">保存</el-button>
        </template>
    </el-dialog>
</template>

<style scoped>
.page-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    padding: 16px 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
    margin-bottom: 16px;
}
.toolbar-left {
    display: flex;
    align-items: center;
    gap: 8px;
}
.toolbar-right {
    display: flex;
    align-items: center;
    gap: 8px;
}
.label {
    font-size: 14px;
    color: #606266;
    white-space: nowrap;
}
.type-select {
    width: 180px;
}
.page-body {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
    padding: 16px 20px;
}
.data-table {
    width: 100%;
}
</style>
