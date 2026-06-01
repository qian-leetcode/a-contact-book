<script setup>

import {ref} from "vue";
import {useRouter} from "vue-router";
import {user_register_} from "../api/login.js";
import {use_user_store} from "../stores/user.js";
import {ElMessage} from "element-plus";

const router = useRouter()
const userStore = use_user_store()

// 登录表单数据类型
const login_information = ref({
    username:'',
    password:'',
})

// 提交登录
const user_login = async () => {
    const success = await userStore.login(
        login_information.value.username,
        login_information.value.password
    )
    console.log(login_information.value)
    console.log(success)
    if (success) {
        await router.push('/group')
    }
}

// 注册窗口显示
const register_visible = ref(false);

// 注册表单数据类型
const register_information = ref({
    username:'',
    password:'',
    re_password:'',
    name:''
})

// 提交注册
const user_register = async () => {
    try {
        const params = {
            user_name: register_information.value.username,
            password: register_information.value.password,
            name:register_information.value.name
        }
        const res = await user_register_(params)
        if(res.data.code === 0) {
            ElMessage.success("注册成功")
        }
        else {
            ElMessage.error("注册失败")
        }
    }catch (error) {
        ElMessage.error("注册异常，请联系工作人员")
        console.log(error);
    }
}

</script>

<template>
    <div>
        <h2>有本通讯录</h2>
        <h3>系统登录</h3>
        <el-form>
            <el-form-item label="用户名">
                <el-input v-model="login_information.username" placeholder="请输入用户名" clearable/>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="login_information.password" placeholder="请输入密码" clearable />
            </el-form-item>
            <el-button type="primary" @click="user_login">登录</el-button>
            <el-button type="warning" @click="register_visible = true">注册</el-button>
            <el-dialog
                title="账户注册"
                :model-value="register_visible"
                @close="register_visible = false"
            >
                <el-form label-width="100px">
                    <el-form-item label="用户名" required>
                        <el-input v-model="register_information.username" placeholder="请输入用户名" clearable />
                    </el-form-item>
                    <el-form-item label="密码"  required>
                        <el-input v-model="register_information.password" placeholder="请输入密码" clearable />
                    </el-form-item>
                    <el-form-item label="密码确认" required>
                        <el-input v-model="register_information.re_password" placeholder="请再次输入密码" clearable />
                    </el-form-item>
                    <el-form-item label="姓名" required>
                        <el-input v-model="register_information.name" placeholder="请输入姓名" clearable />
                    </el-form-item>
                    <el-button type="warning" @click="user_register">注册</el-button>
                    <el-button @click="register_visible = false">取消</el-button>
                </el-form>
            </el-dialog>
        </el-form>
    </div>

</template>

<style scoped>

</style>
