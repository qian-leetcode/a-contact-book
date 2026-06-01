<script setup>
import {use_user_store} from "../stores/user.js";

const user_store = use_user_store()
</script>

<template>
    <div class="page-body card">
        <h3 class="section-title">个人信息</h3>
        <el-form label-width="120px" label-position="left" class="profile-form">
            <el-form-item label="姓名">
                <el-input :model-value="user_store.userInfo?.opt_name" disabled style="width: 280px" />
            </el-form-item>
            <el-form-item label="用户名">
                <el-input :model-value="user_store.userInfo?.user_name" disabled style="width: 280px" />
            </el-form-item>
            <el-form-item label="是否管理员">
                <el-switch :model-value="user_store.userInfo?.is_admin" disabled />
            </el-form-item>
        </el-form>
    </div>
</template>

<style scoped>
.card {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
    padding: 24px 32px;
}
.section-title {
    margin: 0 0 24px 0;
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;
}
.profile-form {
    max-width: 500px;
}
</style>
