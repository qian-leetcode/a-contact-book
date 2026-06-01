<script setup>
import {use_user_store} from "../stores/user.js";
import {useRouter} from "vue-router";
import {computed, reactive, ref, watch} from "vue";
import {ElMessage} from "element-plus";

const user_store = use_user_store()
const router = useRouter()

// 是否为管理员
const is_admin = computed(() => user_store.userInfo?.is_admin)

// 退出登录
const handleLogout = async () => {
    await user_store.logout()
    await router.push('/')
}

// 修改密码弹窗
const show_update_password = ref(false)
const change_password_form = reactive({
    password: '',
    new_password: '',
    re_new_password: '',
})

// 提交修改密码
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

// 关闭弹窗时重置表单
watch(show_update_password, (value) => {
    if (show_update_password.value === false) {
        change_password_form.password = ''
        change_password_form.new_password = ''
        change_password_form.re_new_password = ''
    }
})
</script>

<template>
    <div class="app-container">
        <el-header class="app-header">
            <div class="header-left">
                <img src="../assets/img1.png" alt="" class="logo">
                <h2 class="app-title">有本通讯录</h2>
            </div>
            <div class="header-center">
                <el-menu mode="horizontal" :router="true" class="nav-menu" :ellipsis="false">
                    <el-menu-item index="/address_book">通讯录</el-menu-item>
                    <el-menu-item index="/group_management">分组管理</el-menu-item>
                    <el-menu-item index="/Personal_Center">个人中心</el-menu-item>
                    <el-menu-item v-if="is_admin" index="/Dictionary_Management">字典管理</el-menu-item>
                    <el-menu-item v-if="is_admin" index="/Account_Management">账户管理</el-menu-item>
                    <el-menu-item index="/statistics">统计</el-menu-item>
                </el-menu>
            </div>
            <div class="header-right">
                <el-dropdown>
                    <span class="user-dropdown">
                        {{ user_store.userInfo?.opt_name }}（{{ user_store.userInfo?.user_name }}）
                    </span>
                    <template #dropdown>
                        <el-dropdown-item @click="show_update_password = true">修改密码</el-dropdown-item>
                        <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
                    </template>
                </el-dropdown>
            </div>
        </el-header>
        <div class="app-content">
            <router-view />
        </div>
    </div>

    <el-dialog
        v-model="show_update_password"
        @close="show_update_password = false"
        title="修改密码"
        width="400px"
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
            <el-button @click="show_update_password = false">取消</el-button>
            <el-button type="primary" @click="update_password">修改密码</el-button>
        </template>
    </el-dialog>
</template>

<style scoped>
.app-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: #f0f2f5;
}
.app-header {
    display: flex;
    align-items: center;
    padding: 0 24px;
    background: linear-gradient(135deg, #409eff, #337ecc);
    color: #fff;
    height: 60px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    position: sticky;
    top: 0;
    z-index: 100;
}
.header-left {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
}
.logo {
    width: 36px;
    height: 36px;
    border-radius: 8px;
}
.app-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    color: #fff;
}
.header-center {
    flex: 1;
    display: flex;
    justify-content: center;
    padding: 0 24px;
}
.nav-menu {
    border-bottom: none !important;
    background: transparent !important;
    overflow: visible !important;
}
.nav-menu .el-menu-item {
    flex-shrink: 0 !important;
    white-space: nowrap !important;
    color: rgba(255, 255, 255, 0.85) !important;
    border-bottom: 2px solid transparent !important;
    font-size: 14px;
    height: 60px;
    line-height: 60px;
    transition: all 0.2s;
}
.nav-menu .el-menu-item:hover {
    color: #fff !important;
    background: rgba(255, 255, 255, 0.1) !important;
}
.nav-menu .el-menu-item.is-active {
    color: #fff !important;
    border-bottom-color: #fff !important;
    background: rgba(255, 255, 255, 0.15) !important;
}
.header-right {
    flex-shrink: 0;
}
.user-dropdown {
    color: rgba(255, 255, 255, 0.9);
    cursor: pointer;
    font-size: 14px;
    padding: 6px 12px;
    border-radius: 6px;
    transition: background 0.2s;
}
.user-dropdown:hover {
    background: rgba(255, 255, 255, 0.15);
    color: #fff;
}
.app-content {
    flex: 1;
    padding: 20px 24px;
    max-width: 1400px;
    width: 100%;
    margin: 0 auto;
    box-sizing: border-box;
}
</style>
