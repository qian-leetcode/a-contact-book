<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import {user_account_store} from "../stores/Account_Management.js";
import {ElMessage} from "element-plus";

const account_store = user_account_store()

const query_form = reactive({
    filter:''
})

//获取账户信息列表
const get_account_list = async () => {
    const params = {
        filter: query_form.filter,
    }
    await account_store.get_account_by_name(params)
}

// 显示窗口
const show = ref(false)

const account_info = reactive({
    id:'0',
    name:'',
    user_name:'',
    Password:'',
    is_main:false,
    available:true
})

// 新增
const add_account = async () => {
    const params = {
        id:Number(account_info.id),
        name: account_info.name,
        user_name: account_info.user_name,
        Password:account_info.Password,
        is_main:account_info.is_main,
        available:account_info.available,
    }
    await account_store.add_account(params)
    show.value = false
    await get_account_list()
}

// 修改
const open_update = async (row) => {
    account_info.id = row.id
    account_info.name = row.name
    account_info.user_name = row.user_name
    account_info.Password=row.Password
    account_info.is_main=row.is_main
    account_info.available=row.available
    show.value = true
}

watch(show , ()=>{
    if(show.value === false){
        account_info.id = '0'
        account_info.name = ''
        account_info.user_name = ''
        account_info.Password = ''
        account_info.is_main=false
        account_info.available=true
    }
})

// 显示密码
const show_password = ref(false)
const user_password = ref('')

const fun_show_password = (row) => {
    user_password.value = row.Password
    show_password.value = true
}

// 禁用
const show_hide = ref(false)

const hide_account = async (row) => {
    account_info.id = row.id
    account_info.name = row.name
    account_info.user_name = row.user_name
    account_info.Password=row.Password
    account_info.is_main=row.is_main
    account_info.available = row.available !== true
    show_hide.value = true
}

// 提交禁止
const put_hide_account = async () => {
    const params = {
        id:Number(account_info.id),
        name: account_info.name,
        user_name: account_info.user_name,
        Password:account_info.Password,
        is_main:account_info.is_main,
        available:account_info.available,
    }
    await account_store.add_account(params)
    await get_account_list()
    show_hide.value = false
}

// 删除
const delete_account = async (id) => {
    const params = {
        id:Number(id),
    }
    await account_store.delete_account(params)
    await get_account_list()
}


onMounted(() => {
    get_account_list()
})

</script>

<template>
    <div style="display: flex;">
        <div style="display: flex;width: 200px" >
            <span style="width: 150px;margin: 0 auto ">筛选条件:</span>
            <el-input v-model="query_form.filter"
            >
<!--                <el-option-->
<!--                    v-for="it in account_store.account_list"-->
<!--                    :key="it.value"-->
<!--                    :label="it.name"-->
<!--                    :value="it.value"-->
<!--                />-->
            </el-input>
        </div>

        <el-button type="primary" @click="show = true"> 新增 </el-button>
        <el-dialog
            v-model="show"
            title="字典项目信息详情"
            @close="show = false"
        >
            <el-form>
                <el-form-item >
                    <el-input
                        v-model="account_info.name"
                        placeholder="请输入姓名"
                        clearable
                    />
                </el-form-item>
                <el-checkbox v-model="account_info.available">账户可用</el-checkbox>
                <el-checkbox v-model="account_info.is_main">管理员账户</el-checkbox>
                <el-form-item>
                    <el-input
                        v-model="account_info.user_name"
                        placeholder="请输入用户名"
                        clearable
                    />
                </el-form-item>
                <el-form-item>
                    <el-input
                        v-model="account_info.Password"
                        placeholder="请输入密码"
                        clearable
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <div>
                    <el-button @click="show = false">取消</el-button>
                    <el-button type="primary" @click="add_account">保存</el-button>
                </div>
            </template>
        </el-dialog>

        <el-button icon="Refresh" @click="get_account_list"> 刷新列表 </el-button>
    </div>

    <div>
        <el-table :data="account_store.account_list" border stripe style="width: 100%">
            <el-table-column prop="name" label="姓名" />
            <el-table-column prop="user_name" label="用户名" />
            <el-table-column prop="" label="可用" >
                <template #default="{row}">
                    <el-checkbox
                        :model-value="row.available"
                        disabled
                    />
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template #default="{row}">
                    <el-button @click="fun_show_password(row)" size="small" link style="color: rgb(103, 194, 58)">显示密码</el-button>
                    <el-button @click="hide_account(row)" size="small" link style="color: rgb(103, 194, 58)">
                        {{row.available ? '禁用' : '启用'}}
                    </el-button>
                    <el-button @click="open_update(row)" size="small" link style="color: rgb(64, 158, 255)">编辑</el-button>
                    <el-button @click="delete_account(row.id)" size="small" link style="color: rgb(245 ,108,108)">删除</el-button>
                </template>
            </el-table-column>

        </el-table>
        <div>
            <el-dialog
                v-model="show_password"
                @close="show_password = false"
            >
                <span> 当前账号密码是：{{user_password}}</span>
            </el-dialog>

            <el-dialog
                v-model="show_hide"
                @close="show_hide = false"
            >
                <span>将要禁用当前所选账号"{{account_info.name}}({{account_info.user_name}})"么？</span>
                <el-button @click="put_hide_account">确定</el-button>
            </el-dialog>
        </div>

    </div>
</template>

<style scoped>

</style>