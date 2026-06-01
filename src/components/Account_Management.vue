<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import {user_account_store} from "../stores/Account_Management.js";

const account_store = user_account_store()

const query_form = reactive({
    filter: ''
})

const get_account_list = async () => {
    const params = { filter: query_form.filter }
    await account_store.get_account_by_name(params)
}

const show = ref(false)

const account_info = reactive({
    id: '0',
    name: '',
    user_name: '',
    Password: '',
    is_main: false,
    available: true
})

const add_account = async () => {
    if (!account_info.name || !account_info.user_name || !account_info.Password) {
        ElMessage.warning('请完善信息（姓名、用户名、密码为必填）')
        return
    }
    const params = {
        id: Number(account_info.id),
        name: account_info.name,
        user_name: account_info.user_name,
        Password: account_info.Password,
        is_main: account_info.is_main,
        available: account_info.available,
    }
    await account_store.add_account(params)
    show.value = false
    await get_account_list()
}

const open_update = async (row) => {
    account_info.id = row.id
    account_info.name = row.name
    account_info.user_name = row.user_name
    account_info.Password = row.Password
    account_info.is_main = row.is_main
    account_info.available = row.available
    show.value = true
}

watch(show, () => {
    if (show.value === false) {
        account_info.id = '0'
        account_info.name = ''
        account_info.user_name = ''
        account_info.Password = ''
        account_info.is_main = false
        account_info.available = true
    }
})

const show_password = ref(false)
const user_password = ref('')

const fun_show_password = (row) => {
    user_password.value = row.Password
    show_password.value = true
}

const show_hide = ref(false)

const hide_account = async (row) => {
    account_info.id = row.id
    account_info.name = row.name
    account_info.user_name = row.user_name
    account_info.Password = row.Password
    account_info.is_main = row.is_main
    account_info.available = row.available !== true
    show_hide.value = true
}

const put_hide_account = async () => {
    const params = {
        id: Number(account_info.id),
        name: account_info.name,
        user_name: account_info.user_name,
        Password: account_info.Password,
        is_main: account_info.is_main,
        available: account_info.available,
    }
    await account_store.add_account(params)
    await get_account_list()
    show_hide.value = false
}

const delete_account = async (id) => {
    await account_store.delete_account({ id: Number(id) })
    await get_account_list()
}

onMounted(() => {
    get_account_list()
})
</script>

<template>
    <div class="page-toolbar">
        <div class="toolbar-left">
            <span class="label">筛选条件：</span>
            <el-input v-model="query_form.filter" placeholder="姓名/用户名" clearable class="filter-input" />
        </div>
        <div class="toolbar-right">
            <el-button type="primary" @click="show = true">新增</el-button>
            <el-button icon="Refresh" @click="get_account_list">刷新列表</el-button>
        </div>
    </div>

    <div class="page-body">
        <el-table :data="account_store.account_list" border stripe class="data-table">
            <el-table-column prop="name" label="姓名" />
            <el-table-column prop="user_name" label="用户名" />
            <el-table-column label="可用" width="80">
                <template #default="{row}">
                    <el-checkbox :model-value="row.available" disabled />
                </template>
            </el-table-column>
            <el-table-column label="操作" width="400">
                <template #default="{row}">
                    <el-button @click="fun_show_password(row)" size="small" type="success" plain>显示密码</el-button>
                    <el-button @click="hide_account(row)" size="small" type="warning" plain>
                        {{row.available ? '禁用' : '启用'}}
                    </el-button>
                    <el-button @click="open_update(row)" size="small" type="primary" plain>编辑</el-button>
                    <el-button @click="delete_account(row.id)" size="small" type="danger" plain>删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>

    <el-dialog
        v-model="show"
        title="账户信息"
        @close="show = false"
        width="450px"
    >
        <el-form>
            <el-form-item label="姓名">
                <el-input v-model="account_info.name" placeholder="请输入姓名" clearable />
            </el-form-item>
            <el-form-item label="用户名">
                <el-input v-model="account_info.user_name" placeholder="请输入用户名" clearable />
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="account_info.Password" placeholder="请输入密码" clearable />
            </el-form-item>
            <el-form-item>
                <el-checkbox v-model="account_info.available">账户可用</el-checkbox>
                <el-checkbox v-model="account_info.is_main" style="margin-left: 16px;">管理员账户</el-checkbox>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="show = false">取消</el-button>
            <el-button type="primary" @click="add_account">保存</el-button>
        </template>
    </el-dialog>

    <el-dialog
        v-model="show_password"
        @close="show_password = false"
        title="密码信息"
        width="400px"
    >
        <p>当前账号密码是：<strong>{{user_password}}</strong></p>
        <template #footer>
            <el-button @click="show_password = false">关闭</el-button>
        </template>
    </el-dialog>

    <el-dialog
        v-model="show_hide"
        @close="show_hide = false"
        title="确认操作"
        width="400px"
    >
        <p>将要禁用当前所选账号"{{account_info.name}}({{account_info.user_name}})"么？</p>
        <template #footer>
            <el-button @click="show_hide = false">取消</el-button>
            <el-button type="danger" @click="put_hide_account">确定</el-button>
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
