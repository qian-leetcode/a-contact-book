<script setup>
import {ref, onMounted, onUnmounted, watch, reactive} from 'vue'
import * as echarts from 'echarts'

// 你原来的 store 引入（完全保留）
import {use_address_book_store} from "../stores/address_book.js";

// 你原来的实例（完全保留）
const  address_store = use_address_book_store()

// 图表实例
let groupChart = null
let callChart = null

// DOM 容器
const groupRef = ref(null)
const callRef = ref(null)

const get_data = async () => {
    const params = {
        group_id:'-1',
        filter:''
    }
    // 根据分组得到联系人
    await address_store.get_group_contact_list(params)

    // 根据称呼得到联系人
    await address_store.get_contact_group_statices_list(params)
}

onMounted(() => {
    get_data()
})

// 统一渲染方法
function renderCharts() {

    const groupData =  address_store.contact_group_list.map(item => ({
        name: item.group_name,
        value: item.users.length,
    }))

    const callData = address_store.contact_dict_list.map(item => ({
        name: item.name ,
        value: item.value
    }))

    // 左图：分组统计 → 用 group_store.list
    groupChart.setOption({
        title: { text: '分组统计', left: 'center' },
        tooltip: { trigger: 'item' },
        series: [{
            type: 'pie',
            radius: '65%',
            label: { show: true, formatter: '{b}' },
            data: groupData  // <-- 直接用你的 list
        }]
    })

    // 右图：称呼统计 → 用 DictCommon_store.list
    callChart.setOption({
        title: { text: '称呼统计', left: 'center' },
        tooltip: { trigger: 'item' },
        series: [{
            type: 'pie',
            radius: '65%',
            label: { show: true, formatter: '{b}' },
            data:  callData // <-- 直接用你的 list
        }]
    })
}

onUnmounted(() => {
    groupChart?.dispose()
    callChart?.dispose()
})
</script>

<template>
    <div class="flex gap-5 p-5 w-full">
        <div ref="groupRef" class="flex-1 h-[450px] border rounded-lg"></div>
        <div ref="callRef" class="flex-1 h-[450px] border rounded-lg"></div>
    </div>
</template>

<style scoped>
.flex {
    display: flex;
}
.gap-5 {
    gap: 20px;
}
.p-5 {
    padding: 20px;
}
.w-full {
    width: 100%;
}
.flex-1 {
    flex: 1;
}
.h-\\[450px\\] {
    height: 450px;
}
.border {
    border: 1px solid #eee;
}
.rounded-lg {
    border-radius: 8px;
}
</style>