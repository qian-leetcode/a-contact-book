<script setup>

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
            <el-menu-item index="/address_book">通讯录</el-menu-item>
            <el-menu-item index="/group_management">分组管理</el-menu-item>
            <el-menu-item index="/Personal_Center">个人中心</el-menu-item>
            <el-menu-item index="/Dictionary_Management">字典管理</el-menu-item>
            <el-menu-item index="/Account_Management">账户管理</el-menu-item>
            <el-menu-item index="/statistics">统计</el-menu-item>
            <el-dropdown>
            <span>1</span>
            <template #dropdown>

                <el-dropdown-item>修改密码</el-dropdown-item>
                <el-dropdown-item>退出登录</el-dropdown-item>
            </template>
        </el-dropdown>
        </el-menu>

        </div>
    </el-header>
    <router-view>   </router-view>
</template>

<style scoped>

</style>