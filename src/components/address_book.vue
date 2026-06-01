<script setup>
import {computed, onMounted, reactive, ref} from "vue";
import {use_group_management_store} from "../stores/group_management.js";
import {use_address_book_store} from "../stores/address_book.js";
import {useRouter, useRoute} from 'vue-router'
import use_DictCommon_store from "../stores/Dictionary_Management.js";
import {ElMessage} from "element-plus";
import {upload_file_common_} from "../api/upload.js";

const router = useRouter()
const route = useRoute()
const DictCommon_store = use_DictCommon_store()

// 当前激活的tab
const activeTab = computed({
    get: () => route.path,
    set: (val) => router.push(val)
})

const group_store = use_group_management_store()
const address_store = use_address_book_store()

// 获取分组列表
const get_group = async () => {
    await group_store.get_contact_group_by_name()
}

// 查询条件
const query_contact = reactive({
    group_id: '-1',
    filter: ''
})

// 获取联系人列表
const get_contact_list = async () => {
    const params = {
        group_id: Number(query_contact.group_id),
        filter: query_contact.filter,
    }
    await address_store.get_group_contact_list(params)
}

// 新增联系人弹窗
const show_add = ref(false)

// 新增联系人表单
const contact_info = reactive({
    id: '',
    name: '',
    group_id: '-1',
    phone: '',
    img1: '',
    dict: ''
})

const avatarFile = ref(null)

// 重置新增表单
const resetForm = () => {
    if (contact_info.img1 && contact_info.img1.startsWith('blob:')) {
        URL.revokeObjectURL(contact_info.img1)
    }
    contact_info.id = ''
    contact_info.name = ''
    contact_info.group_id = '-1'
    contact_info.phone = ''
    contact_info.img1 = ''
    contact_info.dict = ''
    avatarFile.value = null
}

// 头像文件变更处理
const handleAvatarChange = (uploadFile) => {
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
    if (contact_info.img1 && contact_info.img1.startsWith('blob:')) {
        URL.revokeObjectURL(contact_info.img1)
    }
    avatarFile.value = file
    contact_info.img1 = URL.createObjectURL(file)
}

// 保存联系人（新增/更新）
const save_contact = async () => {
    if (!contact_info.name) {
        ElMessage.warning('请输入姓名')
        return
    }
    if (Number(contact_info.group_id) <= 0) {
        ElMessage.warning('请选择所属分组')
        return
    }
    let avatar_id = ''
    if (avatarFile.value) {
        const name = `avatar_${Date.now()}`
        const res = await upload_file_common_('avatar', name, avatarFile.value)
        if (res.data.code === 0) {
            const data = JSON.parse(res.data.data)
            avatar_id = data.file_info.id
        } else {
            ElMessage.error(res.data.message)
            return
        }
    }
    const call_name = DictCommon_store.Dict_common_list.find(
        item => item.id === contact_info.dict
    )?.content || ''
    const params = {
        id: Number(contact_info.id) || 0,
        name: contact_info.name,
        group_id: Number(contact_info.group_id),
        mobile: contact_info.phone,
        avatar: avatar_id,
        call_name
    }
    const result = await address_store.update_contact(params)
    if (result) {
        show_add.value = false
        resetForm()
        await get_contact_list()
    }
}

onMounted(() => {
    get_contact_list()
    get_group()
    DictCommon_store.get_dict_common_list({ type: 'CallName' })
})
</script>

<template>
    <div class="page-toolbar">
        <div class="toolbar-left">
            <el-radio-group v-model="activeTab">
                <el-radio-button value="/group">分组显示</el-radio-button>
                <el-radio-button value="/letter_sort">字母排序显示</el-radio-button>
            </el-radio-group>
            <el-select
                v-model="query_contact.group_id"
                placeholder="请选择分组"
                class="filter-select"
            >
                <el-option label="[全部]" value="-1" />
                <el-option
                    v-for="item in group_store.group_list"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                />
            </el-select>
            <el-input
                v-model="query_contact.filter"
                placeholder="姓名/手机号/称呼"
                clearable
                class="filter-input"
            />
        </div>
        <div class="toolbar-right">
            <el-button type="primary" @click="show_add = true">新增</el-button>
            <el-button icon="Refresh" @click="get_contact_list">刷新列表</el-button>
        </div>
    </div>

    <div class="page-body">
        <router-view />
    </div>

    <el-dialog
        v-model="show_add"
        @close="resetForm"
        title="新增联系人"
        width="500px"
    >
        <el-form label-width="100px">
            <el-form-item label="姓名">
                <el-input v-model="contact_info.name" placeholder="请输入姓名" clearable />
            </el-form-item>
            <el-form-item label="所属分组">
                <el-select v-model="contact_info.group_id" placeholder="请选分组" class="full-width">
                    <el-option label="[全部]" value="-1" />
                    <el-option
                        v-for="item in group_store.group_list"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="手机号">
                <el-input v-model="contact_info.phone" placeholder="请输入手机号" />
            </el-form-item>
            <el-form-item label="头像">
                <el-upload
                    class="avatar-uploader"
                    action="#"
                    :show-file-list="false"
                    :on-change="handleAvatarChange"
                    :auto-upload="false"
                    accept="image/png, image/jpeg, image/jpg"
                >
                    <img v-if="contact_info.img1" :src="contact_info.img1" class="avatar" />
                    <div v-else class="avatar-uploader-icon">
                        <el-icon><Plus /></el-icon>
                    </div>
                </el-upload>
            </el-form-item>
            <el-form-item label="称呼">
                <el-select v-model="contact_info.dict" class="full-width">
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
            <el-button @click="show_add = false">取消</el-button>
            <el-button type="primary" @click="save_contact">保存</el-button>
        </template>
    </el-dialog>
</template>

<style scoped>
.page-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    padding: 16px 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
    margin-bottom: 16px;
}
.toolbar-left {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
}
.toolbar-right {
    display: flex;
    align-items: center;
    gap: 8px;
}
.filter-select {
    width: 180px;
}
.filter-input {
    width: 200px;
}
.page-body {
    background: transparent;
    min-height: 200px;
}
.full-width {
    width: 100%;
}
.avatar-uploader {
    width: 120px;
    height: 120px;
    border: 1px dashed #d9d9d9;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: border-color 0.2s;
}
.avatar-uploader:hover {
    border-color: #409eff;
}
.avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 7px;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
}
</style>
