<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import {use_group_management_store} from "../stores/group_management.js";
import {ElMessage} from "element-plus";

const group_store = use_group_management_store()

// 查询条件
const query_form = reactive({
    name: ''
})

const group_list = ref([])

// 查询分组列表
const get_contact_group_by_name = async () => {
    await group_store.get_contact_group_by_name(query_form.name)
    group_list.value = group_store.group_list
}

// 分组上移
const up_idx = async (id) => {
    await group_store.index_up(Number(id));
    await get_contact_group_by_name();
}

// 分组下移
const down_idx = async (id) => {
    await group_store.index_down(Number(id));
    await get_contact_group_by_name();
}

// 新增/编辑弹窗
const show = ref(false)

// 分组表单数据
const group_info_form = reactive({
    id: '0',
    name: '',
    idx: null
})

// 保存分组（新增/修改）
const add_group = async () => {
    if (group_info_form.name === '' || group_info_form.idx === null || group_info_form.idx === undefined) {
        ElMessage.warning("请完善信息")
        return
    }
    await group_store.update_contact_group(group_info_form)
    ElMessage.success(group_info_form.id === '0' ? "新增成功" : "修改成功")
    await get_contact_group_by_name();
    show.value = false
}

// 打开编辑弹窗
const open_update = async (row) => {
    show.value = true
    group_info_form.id = row.id
    group_info_form.name = row.name
    group_info_form.idx = Number(row.idx)
}

// 删除确认弹窗
const show_delete = ref(false)

// 打开删除确认
const open_delete = async (row) => {
    group_info_form.id = row.id;
    group_info_form.name = row.name
    group_info_form.idx = Number(row.idx);
    show_delete.value = true
}

// 确认删除分组
const delete_group = async () => {
    await group_store.delete_contact_group(Number(group_info_form.id))
    await get_contact_group_by_name();
    show_delete.value = false
}

// 关闭删除弹窗时重置
watch(show_delete, () => {
    if (show_delete.value === false) {
        group_info_form.id = '0'
        group_info_form.name = ''
        group_info_form.idx = null
    }
})

// 关闭编辑弹窗时重置
watch(show, () => {
    if (show.value === false) {
        group_info_form.id = '0'
        group_info_form.name = ''
        group_info_form.idx = null
    }
})

onMounted(() => {
    get_contact_group_by_name();
})
</script>

<template>
    <div class="page-toolbar">
        <div class="toolbar-left">
            <el-input
                v-model="query_form.name"
                placeholder="名称/简写"
                clearable
                class="filter-input"
            />
        </div>
        <div class="toolbar-right">
            <el-button type="primary" @click="show = true">新增</el-button>
            <el-button icon="Refresh" @click="get_contact_group_by_name()">刷新列表</el-button>
        </div>
    </div>

    <div class="page-body">
        <el-table :data="group_list" border stripe class="data-table">
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="idx" label="序列号" width="120" />
            <el-table-column label="操作" width="320">
                <template #default="{row}">
                    <el-button @click="up_idx(row.id)" size="small" type="success" plain>上移</el-button>
                    <el-button @click="down_idx(row.id)" size="small" type="success" plain>下移</el-button>
                    <el-button @click="open_update(row)" size="small" type="primary" plain>编辑</el-button>
                    <el-button @click="open_delete(row)" size="small" type="danger" plain>删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>

    <el-dialog
        v-model="show"
        title="分组详情"
        @close="show = false"
        width="400px"
    >
        <el-form>
            <el-form-item label="分组名称">
                <el-input v-model="group_info_form.name" placeholder="请输入分组名称" clearable />
            </el-form-item>
            <el-form-item label="分组序号">
                <el-input-number
                    v-model.number="group_info_form.idx"
                    :min="0"
                    :step="1"
                    placeholder="0"
                />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="show = false">取消</el-button>
            <el-button type="primary" @click="add_group">保存</el-button>
        </template>
    </el-dialog>

    <el-dialog
        v-model="show_delete"
        @close="show_delete = false"
        title="确认删除"
        width="400px"
    >
        <p>将要删除分组"{{group_info_form.name}}"，确认继续吗？</p>
        <template #footer>
            <el-button @click="show_delete = false">取消</el-button>
            <el-button type="danger" @click="delete_group">确认删除</el-button>
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
    gap: 12px;
}
.toolbar-right {
    display: flex;
    align-items: center;
    gap: 8px;
}
.filter-input {
    width: 200px;
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
