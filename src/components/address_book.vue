<script setup>
import {computed, onMounted, reactive, ref} from "vue";
import {use_group_management_store} from "../stores/group_management.js";
import {use_address_book_store} from "../stores/address_book.js";

import { useRouter, useRoute } from 'vue-router'
import use_DictCommon_store from "../stores/Dictionary_Management.js";
import {ElMessage} from "element-plus";

const router = useRouter()
const route = useRoute()
const DictCommon_store = use_DictCommon_store()

const activeTab = computed({
    get: () => route.path,
    set: (val) => router.push(val)
})

const group_store  = use_group_management_store()
const address_store = use_address_book_store()


// 获取分组
const get_group = async () => {
    await group_store.get_contact_group_by_name()
}

const query_contact = reactive({
    group_id:'-1',
    filter:''
})

// 查询所有联系人
const get_contact_list = async () => {
    const params = {
        group_id:Number(query_contact.group_id),
        filter:query_contact.filter,
    }
    await address_store.get_group_contact_list(params)
}

// 新增
const show_add = ref(false)

const contact_info = reactive({
    id:'',
    name:'',
    group_id:'-1',
    phone:'',
    img1:'',
    dict:''
})



// 头像上传前校验
const beforeAvatarUpload = (file) => {
    const isImage = /^image\/(jpeg|png|jpg)$/.test(file.type)
    if (!isImage) {
        ElMessage.error('头像只能是 JPG/PNG 格式！')
        return false
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
        ElMessage.error('头像大小不能超过 2MB！')
        return false
    }
    return true
}

// 上传成功回调（这里直接用本地预览，如需上传到后端可修改）
const handleAvatarSuccess = (response, file) => {
    // 本地预览
    contact_info.img1 = URL.createObjectURL(file.raw)

    ElMessage.success('头像预览已更新')
}

const handleAvatarError = () => {
    ElMessage.error('头像上传失败，请重试')
}

onMounted(()=>{
    get_contact_list()
    get_group()
})


</script>

<template>
    <el-header>
    <div>
        <el-space>
            <el-radio-group v-model="activeTab">
                <el-radio-button value="/group">分组显示</el-radio-button>
                <el-radio-button value="/letter_sort">字母排序显示</el-radio-button>
            </el-radio-group>
            <div style="display: flex;width: 200px">
                <span style="width: 100px">分组:</span>
                <el-select
                    v-model="query_contact.group_id"
                    placeholder="请选择分组"
                    style="width: 300px"
                >
                    <el-option label="[全部]" value="-1" />
                    <el-option
                        v-for="item in group_store.group_list"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    />
                </el-select>
            </div>
            <div style="display: flex;width: 200px" >
                <span style="width: 100px;margin: 0 auto ">筛选:</span>
                <el-input v-model="query_contact.filter" placeholder="姓名/手机号/称呼" clearable />
            </div>
                <el-button type="primary" @click="show_add = true"> 新增 </el-button>
                <el-dialog
                    v-model="show_add"
                    @close="show_add = false"
                >
                    <el-form label-width="100px">
                        <el-form-item label="姓名">
                            <el-input v-model="contact_info.name" placeholder="请输入姓名" clearable />
                        </el-form-item>
                        <el-form-item label="所属分组">
                            <el-select
                                v-model="contact_info.group_id"
                                placeholder="请选分组"
                            >
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
                                :before-upload="beforeAvatarUpload"
                                :on-success="handleAvatarSuccess"
                                :on-error="handleAvatarError"
                                :auto-upload="false"
                                accept="image/png, image/jpeg, image/jpg"
                            >
                                <img
                                    v-if="contact_info.img1"
                                    :src="contact_info.img1"
                                    class="avatar"
                                />
                                <div v-else class="avatar-uploader-icon">
                                    <el-icon><Plus /></el-icon>
                                </div>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="称呼">
                            <el-select
                                v-model="contact_info.dict"
                            >
                                <el-option
                                    v-for="item in DictCommon_store.Dict_common_list"
                                    :key="item.id"
                                    :label="item.content"
                                    :value="item.id"
                                ></el-option>

                            </el-select>
                        </el-form-item>
                    </el-form>
                </el-dialog>
                <el-button icon="Refresh" @click="get_contact_list"> 刷新列表 </el-button>
        </el-space>
    </div>
    </el-header>
    <hr>
    <router-view></router-view>
</template>


<style scoped>
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