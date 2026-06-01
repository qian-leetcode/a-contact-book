<script setup>
import {use_user_store} from "../stores/user.js";

const user_store = use_user_store()
</script>

<template>
    <div style="display: flex; justify-content: center; margin-top: 40px">
        <el-form label-width="120px" label-position="left">
            <el-form-item label="姓名">
                <el-input :model-value="user_store.userInfo?.opt_name" disabled style="width: 250px" />
            </el-form-item>
            <el-form-item label="用户名">
                <el-input :model-value="user_store.userInfo?.user_name" disabled style="width: 250px" />
            </el-form-item>
            <el-form-item label="是否管理员">
                <el-switch :model-value="user_store.userInfo?.is_admin" disabled />
            </el-form-item>
        </el-form>
    </div>
</template>
