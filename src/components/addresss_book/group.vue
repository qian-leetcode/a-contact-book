<script setup>
import {use_address_book_store} from "../../stores/address_book.js";
import {onMounted, reactive, ref} from "vue";
import {use_group_management_store} from "../../stores/group_management.js";
import use_DictCommon_store from "../../stores/Dictionary_Management.js";
import {ElMessage} from "element-plus";
import {upload_file_common_} from "../../api/upload.js";

const address_store = use_address_book_store()
const group_store = use_group_management_store()
const DictCommon_store = use_DictCommon_store()

const query_contact = reactive({
    group_id: '-1',
    filter: ''
})

const group_list = ref([])
const contact_group_list = ref([])

const handle_delete = async (user) => {
    const res = await address_store.delete_contact(user.id)
    if (res) {
        await get_contact_list()
    }
}

const get_group_list = async () => {
    await group_store.get_contact_group_by_name()
    group_list.value = group_store.group_list
}

const get_contact_list = async () => {
    const params = {
        group_id: Number(query_contact.group_id),
        filter: query_contact.filter,
    }
    await address_store.get_group_contact_list(params)
}

const show_edit = ref(false)
const edit_info = reactive({
    id: '',
    name: '',
    group_id: '-1',
    phone: '',
    img1: '',
    dict: ''
})
const edit_avatar_file = ref(null)
const edit_old_avatar_id = ref('')

const open_edit = (user) => {
    const matched = DictCommon_store.Dict_common_list.find(
        item => item.content === user.call_name
    )
    edit_info.id = user.id
    edit_info.name = user.name
    edit_info.group_id = user.group_id
    edit_info.phone = user.mobile
    edit_info.img1 = user.avatar_url || ''
    edit_info.dict = matched?.id ?? ''
    edit_old_avatar_id.value = user.avatar || ''
    edit_avatar_file.value = null
    show_edit.value = true
}

const handleEditAvatarChange = (uploadFile) => {
    const file = uploadFile.raw
    const isImage = /^image\/(jpeg|png|jpg)$/.test(file.type)
    if (!isImage) {
        ElMessage.error('头像只能是 JPG/PNG 格式！')
        return
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
        ElMessage.error('头像大小不能超过 2MB！')
        return
    }
    edit_avatar_file.value = file
    edit_info.img1 = URL.createObjectURL(file)
}

const save_edit = async () => {
    if (!edit_info.name) {
        ElMessage.warning('请输入姓名')
        return
    }
    if (Number(edit_info.group_id) <= 0) {
        ElMessage.warning('请选择所属分组')
        return
    }
    let avatar_id = edit_old_avatar_id.value
    if (edit_avatar_file.value) {
        const name = `avatar_${Date.now()}`
        const res = await upload_file_common_('avatar', name, edit_avatar_file.value)
        if (res.data.code === 0) {
            const data = JSON.parse(res.data.data)
            avatar_id = data.file_info.id
        } else {
            ElMessage.error(res.data.message)
            return
        }
    }
    const call_name = DictCommon_store.Dict_common_list.find(
        item => item.id === edit_info.dict
    )?.content || ''
    const params = {
        id: Number(edit_info.id),
        name: edit_info.name,
        group_id: Number(edit_info.group_id),
        mobile: edit_info.phone,
        avatar: avatar_id,
        call_name
    }
    const result = await address_store.update_contact(params)
    if (result) {
        show_edit.value = false
        await get_contact_list()
    }
}

onMounted(() => {
    get_contact_list()
    get_group_list()
    DictCommon_store.get_dict_common_list({ type: 'CallName' })
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
                    <img v-if="user.avatar_url" :src="user.avatar_url" class="avatar-img" />
                    <span v-else>{{ user.name?.[0] || '?' }}</span>
                </div>
                <div class="user-info">
                    <div class="user-name">{{ user.name }} ({{ user.call_name }})</div>
                    <div class="user-mobile">{{ user.mobile }}</div>
                </div>
                <div class="user-actions">
                    <el-button type="primary" size="small" class="edit-btn" @click="open_edit(user)">编辑</el-button>
                    <el-button type="danger" size="small" class="delete-btn" @click="handle_delete(user)">删除</el-button>
                </div>
            </div>
        </div>
    </div>

    <el-dialog
        v-model="show_edit"
        @close="show_edit = false"
        title="编辑联系人"
    >
        <el-form label-width="100px">
            <el-form-item label="姓名">
                <el-input v-model="edit_info.name" placeholder="请输入姓名" clearable />
            </el-form-item>
            <el-form-item label="所属分组">
                <el-select v-model="edit_info.group_id" placeholder="请选分组">
                    <el-option
                        v-for="item in group_store.group_list"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="手机号">
                <el-input v-model="edit_info.phone" placeholder="请输入手机号" />
            </el-form-item>
            <el-form-item label="头像">
                <el-upload
                    class="avatar-uploader"
                    action="#"
                    :show-file-list="false"
                    :on-change="handleEditAvatarChange"
                    :auto-upload="false"
                    accept="image/png, image/jpeg, image/jpg"
                >
                    <img v-if="edit_info.img1" :src="edit_info.img1" class="avatar" />
                    <div v-else class="avatar-uploader-icon">
                        <el-icon><Plus /></el-icon>
                    </div>
                </el-upload>
            </el-form-item>
            <el-form-item label="称呼">
                <el-select v-model="edit_info.dict">
                    <el-option
                        v-for="item in DictCommon_store.Dict_common_list"
                        :key="item.id"
                        :label="item.content"
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="show_edit = false">取消</el-button>
            <el-button type="primary" @click="save_edit">保存</el-button>
        </template>
    </el-dialog>
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
    overflow: hidden;
}
.avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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
.avatar-uploader {
    width: 120px;
    height: 120px;
    border: 1px dashed #d9d9d9;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}
.avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
}
</style>
