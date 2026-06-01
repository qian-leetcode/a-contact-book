<script setup>
import {use_user_store} from "../stores/user.js";
import {useRouter} from "vue-router";
import {computed, reactive, ref, watch} from "vue";
import {ElMessage} from "element-plus";

const user_store = use_user_store()
const router = useRouter()

const is_admin = computed(() => user_store.userInfo?.is_admin)

const handleLogout = async () => {
    await user_store.logout()
    await router.push('/')
}

// 修改密码
const show_update_password = ref(false)
const change_password_form = reactive({
    password: '',
    new_password: '',
    re_new_password: '',
})

const update_password = async () => {
    if(change_password_form.new_password !== change_password_form.re_new_password){
        ElMessage.warning("两次输入的新密码不一致")
        return
    }
    const params = {
        old_pwd: change_password_form.password,
        new_pwd: change_password_form.new_password
    }
    await user_store.update_password(params)
    show_update_password.value = false
}


watch(show_update_password, (value) => {
    if (show_update_password.value === false) {
        change_password_form.password = ''
        change_password_form.new_password = ''
        change_password_form.re_new_password = ''
    }
})


</script>

<template>
    <el-header style="display: flex ;width: 100%">
        <div style="display: flex;">
            <img src="../assets/img1.png" alt="" style="width: 50px">
            <h2>有本通讯录</h2>
        </div>
        <div style="flex: 1">
        <el-menu
            mode="horizontal"
            :router="true"
        >
<!--            <span>{{user_store.userInfo}}</span>-->
<!--            <el-button @click="get_user_password"></el-button>-->
            <el-menu-item index="/address_book">通讯录</el-menu-item>
            <el-menu-item index="/group_management">分组管理</el-menu-item>
            <el-menu-item index="/Personal_Center">个人中心</el-menu-item>
            <el-menu-item v-if="is_admin" index="/Dictionary_Management">字典管理</el-menu-item>
            <el-menu-item v-if="is_admin" index="/Account_Management">账户管理</el-menu-item>
            <el-menu-item index="/statistics">统计</el-menu-item>
            <el-dropdown style="height: 100%; display: inline-flex; align-items: center; margin-left: 20px">
            <span>{{ user_store.userInfo?.opt_name }}（{{ user_store.userInfo?.user_name }}）</span>
            <template #dropdown>
                <el-dropdown-item @click="show_update_password = true">修改密码</el-dropdown-item>
                <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
            </template>
        </el-dropdown>

        <el-dialog
            v-model="show_update_password"
            @close="show_update_password = false"
        >
            <el-form>
                <el-form-item label="密码">
                    <el-input v-model="change_password_form.password" placeholder="请输入原密码" clearable/>
                </el-form-item>
                <el-form-item label="新密码">
                    <el-input v-model="change_password_form.new_password" placeholder="请输入新密码" clearable/>
                </el-form-item>
                <el-form-item label="新密码确认">
                    <el-input v-model="change_password_form.re_new_password" placeholder="请再次输入新密码" clearable/>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="update_password">修改密码</el-button>
                <el-button @click="show_update_password = false">取消</el-button>
            </template>
        </el-dialog>
        </el-menu>

        </div>
    </el-header>
    <router-view>   </router-view>
</template>

<style scoped>
.el-header {
    align-items: center;
}
</style>