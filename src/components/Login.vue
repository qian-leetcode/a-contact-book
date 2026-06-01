<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router";
import {user_register_} from "../api/login.js";
import {use_user_store} from "../stores/user.js";
import {ElMessage} from "element-plus";

const router = useRouter()
const userStore = use_user_store()

const login_information = ref({
    username: '',
    password: '',
})

const user_login = async () => {
    const success = await userStore.login(
        login_information.value.username,
        login_information.value.password
    )
    if (success) {
        await router.push('/group')
    }
}

const register_visible = ref(false);

const register_information = ref({
    username: '',
    password: '',
    re_password: '',
    name: ''
})

const user_register = async () => {
    try {
        const params = {
            user_name: register_information.value.username,
            password: register_information.value.password,
            name: register_information.value.name
        }
        const res = await user_register_(params)
        if (res.data.code === 0) {
            ElMessage.success("注册成功")
            register_visible.value = false
        } else {
            ElMessage.error("注册失败")
        }
    } catch (error) {
        ElMessage.error("注册异常，请联系工作人员");
        console.log(error);
    }
}
</script>

<template>
    <div class="login-page">
        <div class="login-card">
            <div class="login-header">
                <h2 class="login-title">有本通讯录</h2>
                <p class="login-subtitle">系统登录</p>
            </div>
            <el-form class="login-form">
                <el-form-item>
                    <el-input
                        v-model="login_information.username"
                        placeholder="请输入用户名"
                        clearable
                    />
                </el-form-item>
                <el-form-item>
                    <el-input
                        v-model="login_information.password"
                        placeholder="请输入密码"
                        clearable
                        type="password"
                        @keyup.enter="user_login"
                    />
                </el-form-item>
                <el-form-item class="login-buttons">
                    <el-button type="primary" @click="user_login" class="login-btn">登录</el-button>
                    <el-button @click="register_visible = true" class="register-btn">注册</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>

    <el-dialog
        title="账户注册"
        v-model="register_visible"
        @close="register_visible = false"
        width="450px"
    >
        <el-form label-width="100px">
            <el-form-item label="用户名" required>
                <el-input v-model="register_information.username" placeholder="请输入用户名" clearable />
            </el-form-item>
            <el-form-item label="密码" required>
                <el-input v-model="register_information.password" placeholder="请输入密码" clearable type="password" />
            </el-form-item>
            <el-form-item label="密码确认" required>
                <el-input v-model="register_information.re_password" placeholder="请再次输入密码" clearable type="password" />
            </el-form-item>
            <el-form-item label="姓名" required>
                <el-input v-model="register_information.name" placeholder="请输入姓名" clearable />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="register_visible = false">取消</el-button>
            <el-button type="primary" @click="user_register">注册</el-button>
        </template>
    </el-dialog>
</template>

<style scoped>
.login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.login-card {
    width: 400px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    padding: 40px 36px;
}
.login-header {
    text-align: center;
    margin-bottom: 32px;
}
.login-title {
    font-size: 24px;
    font-weight: 700;
    color: #303133;
    margin: 0 0 8px 0;
}
.login-subtitle {
    font-size: 14px;
    color: #909399;
    margin: 0;
}
.login-form {
    max-width: 100%;
}
.login-buttons {
    margin-bottom: 0;
}
.login-btn {
    width: 100%;
}
.register-btn {
    width: 100%;
    margin-left: 0 !important;
    margin-top: 8px;
}
</style>
