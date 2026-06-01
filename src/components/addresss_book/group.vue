<script setup>

import {use_address_book_store} from "../../stores/address_book.js";
import {onMounted, reactive, ref} from "vue";
import {use_group_management_store} from "../../stores/group_management.js";

const address_store = use_address_book_store()
const group_store  = use_group_management_store()


const query_contact = reactive({
    group_id:'-1',
    filter:''
})

const group_list = ref([])
const contact_group_list = ref([])

const get_group_list = async () => {
    await group_store.get_contact_group_by_name()
    group_list.value = group_store.group_list
}

const get_contact_list = async () => {
    const params = {
        group_id:Number(query_contact.group_id),
        filter:query_contact.filter,
    }
    await address_store.get_contact_list(params)
}

onMounted(() => {
    get_contact_list()
    get_group_list()
})

</script>

<template>
    <div
        v-for="group in address_store.contact_group_list"
        :key="group.group_id"
        class="group-card"
    >
        <div class="group-header">
            <span class="group-icon">📁</span>
            <span class="group-name">{{ group.group_name }}</span>
        </div>
        <div class="user-list">
            <div
                v-for="user in group.users"
                :key="user.id"
                class="user-item"

            >
                <div class="user-avatar">
                    {{ user.name?.[0] || '?' }}
                </div>
                <div class="user-info">
                    <div class="user-name">{{ user.name }} ({{ user.call_name }})</div>
                    <div class="user-mobile">{{ user.mobile }}</div>
                </div>
                <div class="user-actions">
                    <el-button type="primary" size="small" class="edit-btn">编辑</el-button>
                    <el-button type="danger" size="small" class="delete-btn">删除</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.group-card {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    padding: 16px;
    margin-bottom: 16px;
    transition: box-shadow 0.2s;
}
.group-card:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}
.group-header {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f0f0f0;
}
.group-icon {
    font-size: 18px;
    margin-right: 8px;
}
.group-name {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
}
.user-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.user-item {
    display: flex;
    align-items: center;
    padding: 10px 12px;
    background: #f9f9f9;
    border-radius: 10px;
    transition: background 0.2s, transform 0.1s;
}
.user-item:hover {
    background: #f0f5ff;
    transform: translateY(-1px);
}
.user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #409eff;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: bold;
    flex-shrink: 0;
    margin-right: 12px;
    text-transform: uppercase;
}
.user-info {
    flex: 1;
    min-width: 0;
}
.user-name {
    font-size: 14px;
    font-weight: 500;
    color: #303133;
    margin-bottom: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.user-mobile {
    font-size: 12px;
    color: #909399;
}
.user-actions {
    display: flex;
    gap: 6px;
    flex-shrink: 0;
    margin-left: 8px;
}
.edit-btn,
.delete-btn {
    padding: 4px 10px;
    font-size: 12px;
}
.edit-btn {
    background-color: #409eff;
    color: #fff;
    border: none;
}
.delete-btn {
    background-color: #f56c6c;
    color: #fff;
    border: none;
}
</style>
