<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import * as echarts from "echarts";
import { getStatsOverview, getChartData } from "@/api";
import type { StatsOverview } from "@/api";

const chartRef = ref<HTMLElement | null>(null);
const stats = ref<StatsOverview | null>(null);
const loading = ref(true);
let chart: echarts.ECharts | null = null;

function initChart(xAxis: string[], series: { name: string; type: string; smooth: boolean; data: number[]; itemStyle: { color: string } }[]) {
    if (!chartRef.value) return;
    chart = echarts.init(chartRef.value);
    chart.setOption({
        tooltip: { trigger: "axis" },
        legend: { data: series.map((s) => s.name), bottom: 0 },
        grid: { left: "3%", right: "4%", bottom: "15%", top: "10%", containLabel: true },
        xAxis: { type: "category", boundaryGap: false, data: xAxis },
        yAxis: { type: "value" },
        series,
    });
}

function onResize() {
    chart?.resize();
}

onMounted(async () => {
    loading.value = true;
    try {
        const [overview, chartData] = await Promise.all([getStatsOverview(), getChartData()]);
        stats.value = overview;
        initChart(chartData.xAxis, chartData.series);
    } finally {
        loading.value = false;
    }
    window.addEventListener("resize", onResize);
});

onBeforeUnmount(() => {
    window.removeEventListener("resize", onResize);
    chart?.dispose();
    chart = null;
});
</script>

<template>
    <div class="home-page">
        <h2 class="page-title">数据概览</h2>
        <el-row v-loading="loading" :gutter="16" class="stat-row">
            <el-col :span="6">
                <el-card shadow="hover" class="stat-card">
                    <template #header><span class="font-medium text-slate-700">残疾人总数</span></template>
                    <p class="stat-value">{{ stats?.totalDisabled?.toLocaleString() ?? "-" }}</p>
                    <p class="stat-desc">管辖区内入档人数</p>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" class="stat-card">
                    <template #header><span class="font-medium text-slate-700">设备总数</span></template>
                    <p class="stat-value">{{ stats?.totalDevice?.toLocaleString() ?? "-" }}</p>
                    <p class="stat-desc">已绑定设备数量</p>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" class="stat-card">
                    <template #header><span class="font-medium text-slate-700">今日预警</span></template>
                    <p class="stat-value">{{ stats?.todayAlert?.toLocaleString() ?? "-" }}</p>
                    <p class="stat-desc">待处理预警数</p>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" class="stat-card">
                    <template #header><span class="font-medium text-slate-700">在线设备</span></template>
                    <p class="stat-value">{{ stats?.onlineDevice?.toLocaleString() ?? "-" }}</p>
                    <p class="stat-desc">当前在线</p>
                </el-card>
            </el-col>
        </el-row>
        <el-card class="chart-card" shadow="hover">
            <template #header><span class="font-medium text-slate-700">统计图表</span></template>
            <div ref="chartRef" class="chart-container"></div>
        </el-card>
    </div>
</template>
