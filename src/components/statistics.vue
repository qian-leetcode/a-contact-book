<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { use_address_book_store } from "../stores/address_book.js";

const address_store = use_address_book_store()

let groupChart = null
let callChart = null

const groupRef = ref(null)
const callRef = ref(null)

const get_data = async () => {
    const params = {
        group_id: '-1',
        filter: ''
    }
    await address_store.get_group_contact_list(params)
    await address_store.get_contact_group_statices_list(params)
}

function renderCharts() {
    const groupStatistics = address_store.contact_group_statices_list || []
    const callStatistics = address_store.contact_dict_statices_list || []

    const groupData = groupStatistics.map(item => ({
        name: item.group_name || '未分组',
        value: item.users ? item.users.length : 0,
    }))

    const callData = callStatistics.map(item => ({
        name: item.call_name || '未知称呼',
        value: item.users ? item.users.length : 0,
    }))


    // 配置：显式显示名称，字体加大，并添加指示线
    const labelConfig = {
        show: true,
        formatter: '{b}',          // 只显示名称
        fontSize: 14,
        color: '#333',
        // 距离饼图边缘的距离，避免标签贴边
        distance: 15,
        // 省略较长的名称（可选）
        overflow: 'truncate',
        width: 80
    }

    // 指示线（连接扇区与标签）
    const labelLineConfig = {
        show: true,
        length: 10,
        length2: 20,
        smooth: true
    }

    groupChart.setOption({
        title: { text: '分组统计', left: 'center' },
        tooltip: { trigger: 'item', formatter: (p) => `${p.name}<br/>数量：${p.value}` },
        series: [{
            type: 'pie',
            radius: '55%',        // 缩小饼图留出标签位置
            center: ['50%', '55%'],
            label: labelConfig,
            labelLine: labelLineConfig,
            data: groupData,
            // 隐藏过小扇区的标签（小于5%的扇区不显示标签）
            minAngle: 5,
            avoidLabelOverlap: true
        }]
    })

    callChart.setOption({
        title: { text: '称呼统计', left: 'center' },
        tooltip: { trigger: 'item', formatter: (p) => `${p.name}<br/>数量：${p.value}` },
        series: [{
            type: 'pie',
            radius: '55%',
            center: ['50%', '55%'],
            label: labelConfig,
            labelLine: labelLineConfig,
            data: callData,
            minAngle: 5,
            avoidLabelOverlap: true
        }]
    })
}

onMounted(async () => {
    await nextTick()
    requestAnimationFrame(() => {
        groupChart = echarts.init(groupRef.value)
        callChart = echarts.init(callRef.value)
        get_data().then(renderCharts)
    })
})

onUnmounted(() => {
    groupChart?.dispose()
    callChart?.dispose()
})
</script>

<template>
    <div class="flex gap-5 p-5 w-full" style="height: 500px">
        <div ref="groupRef" class="flex-1 border rounded-lg" style="height: 100%;"></div>
        <div ref="callRef" class="flex-1 border rounded-lg" style="height: 100%;"></div>
    </div>
</template>

<style scoped>
</style>