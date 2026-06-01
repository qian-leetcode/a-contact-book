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

    const labelConfig = {
        show: true,
        formatter: '{b}',
        fontSize: 14,
        color: '#333',
        distance: 15,
        overflow: 'truncate',
        width: 80
    }

    const labelLineConfig = {
        show: true,
        length: 10,
        length2: 20,
        smooth: true
    }

    const legendConfig = {
        type: 'scroll',
        bottom: 0,
        textStyle: { fontSize: 12 }
    }

    groupChart.setOption({
        title: { text: '分组统计', left: 'center' },
        tooltip: { trigger: 'item', formatter: (p) => `${p.name}<br/>数量：${p.value}` },
        legend: legendConfig,
        series: [{
            type: 'pie',
            radius: '50%',
            center: ['50%', '50%'],
            label: labelConfig,
            labelLine: labelLineConfig,
            data: groupData,
            minAngle: 5,
            avoidLabelOverlap: true
        }]
    })

    callChart.setOption({
        title: { text: '称呼统计', left: 'center' },
        tooltip: { trigger: 'item', formatter: (p) => `${p.name}<br/>数量：${p.value}` },
        legend: legendConfig,
        series: [{
            type: 'pie',
            radius: '50%',
            center: ['50%', '50%'],
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
    <div class="page-body card">
        <div class="chart-container">
            <div ref="groupRef" class="chart-box"></div>
            <div ref="callRef" class="chart-box"></div>
        </div>
    </div>
</template>

<style scoped>
.card {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
    padding: 20px;
}
.chart-container {
    display: flex;
    gap: 20px;
    height: 500px;
}
.chart-box {
    flex: 1;
    border: 1px solid #ebeef5;
    border-radius: 8px;
    height: 100%;
}
</style>
