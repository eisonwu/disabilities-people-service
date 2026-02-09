<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import * as echarts from "echarts";
import { ElMessage } from "element-plus";
import { getReportData } from "@/api";
import type { ReportData, ReportArchiveRow, ReportAlertRow, ReportServiceRow } from "@/api";

const dateRange = ref<[string, string] | null>(null);
const loading = ref(false);
const report = ref<ReportData | null>(null);

const archiveChartRef = ref<HTMLElement | null>(null);
const alertChartRef = ref<HTMLElement | null>(null);
const alertPieRef = ref<HTMLElement | null>(null);
const serviceChartRef = ref<HTMLElement | null>(null);

let archiveChart: echarts.ECharts | null = null;
let alertChart: echarts.ECharts | null = null;
let alertPie: echarts.ECharts | null = null;
let serviceChart: echarts.ECharts | null = null;

const grid = { left: "3%", right: "4%", bottom: "15%", top: "12%", containLabel: true };

function initArchiveChart(xAxis: string[], series: { name: string; type: string; smooth: boolean; data: number[]; itemStyle: { color: string } }[]) {
    if (!archiveChartRef.value) return;
    archiveChart?.dispose();
    archiveChart = echarts.init(archiveChartRef.value);
    archiveChart.setOption({
        tooltip: { trigger: "axis" },
        legend: { data: series.map((s) => s.name), bottom: 0 },
        grid,
        xAxis: { type: "category", data: xAxis },
        yAxis: [{ type: "value", name: "新增" }, { type: "value", name: "累计" }],
        series: series.map((s, i) => ({
            name: s.name,
            type: s.type as "bar" | "line",
            smooth: s.smooth,
            data: s.data,
            itemStyle: s.itemStyle,
            yAxisIndex: s.name === "累计人数" ? 1 : 0,
        })),
    });
}

function initAlertChart(xAxis: string[], series: { name: string; type: string; smooth: boolean; data: number[]; itemStyle: { color: string } }[]) {
    if (!alertChartRef.value) return;
    alertChart?.dispose();
    alertChart = echarts.init(alertChartRef.value);
    alertChart.setOption({
        tooltip: { trigger: "axis" },
        legend: { data: series.map((s) => s.name), bottom: 0 },
        grid,
        xAxis: { type: "category", data: xAxis },
        yAxis: { type: "value" },
        series: series.map((s) => ({ name: s.name, type: "line", smooth: s.smooth, data: s.data, itemStyle: s.itemStyle })),
    });
}

function initAlertPie(pieData: { name: string; value: number }[]) {
    if (!alertPieRef.value) return;
    alertPie?.dispose();
    alertPie = echarts.init(alertPieRef.value);
    alertPie.setOption({
        tooltip: { trigger: "item" },
        legend: { orient: "vertical", right: 10, top: "center" },
        series: [
            {
                type: "pie",
                radius: ["40%", "65%"],
                center: ["40%", "50%"],
                data: pieData,
                label: { show: true, formatter: "{b}: {c}" },
                itemStyle: {
                    borderRadius: 6,
                    borderColor: "#fff",
                    borderWidth: 2,
                },
                color: ["#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"],
            },
        ],
    });
}

function initServiceChart(xAxis: string[], series: { name: string; type: string; smooth: boolean; data: number[]; itemStyle: { color: string } }[]) {
    if (!serviceChartRef.value) return;
    serviceChart?.dispose();
    serviceChart = echarts.init(serviceChartRef.value);
    serviceChart.setOption({
        tooltip: { trigger: "axis" },
        legend: { data: series.map((s) => s.name), bottom: 0 },
        grid,
        xAxis: { type: "category", data: xAxis },
        yAxis: { type: "value", name: "次数" },
        series: series.map((s) => ({ name: s.name, type: "bar", data: s.data, itemStyle: s.itemStyle })),
    });
}

function onResize() {
    archiveChart?.resize();
    alertChart?.resize();
    alertPie?.resize();
    serviceChart?.resize();
}

async function load() {
    loading.value = true;
    try {
        const data = await getReportData(
            dateRange.value ? { startDate: dateRange.value[0], endDate: dateRange.value[1] } : undefined
        );
        report.value = data;
        initArchiveChart(data.archive.chart.xAxis, data.archive.chart.series);
        initAlertChart(data.alert.chart.xAxis, data.alert.chart.series);
        initAlertPie(data.alert.pie);
        initServiceChart(data.service.chart.xAxis, data.service.chart.series);
    } finally {
        loading.value = false;
    }
}

function onExport() {
    ElMessage.info("导出功能待对接（可接入 xlsx 等库）");
}

onMounted(() => {
    load();
    window.addEventListener("resize", onResize);
});

onBeforeUnmount(() => {
    window.removeEventListener("resize", onResize);
    archiveChart?.dispose();
    alertChart?.dispose();
    alertPie?.dispose();
    serviceChart?.dispose();
});
</script>

<template>
    <div class="stats-report-page">
        <div class="toolbar">
            <div class="toolbar-left">
                <el-form inline>
                    <el-form-item label="时间段">
                        <el-date-picker
                            v-model="dateRange"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="YYYY-MM-DD"
                            style="width: 240px"
                        />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" :loading="loading" @click="load">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="toolbar-right">
                <el-button type="success" @click="onExport">导出 Excel</el-button>
            </div>
        </div>

        <!-- 入档统计 -->
        <el-card class="report-card" shadow="hover">
            <template #header><span class="card-title">残疾人入档统计</span></template>
            <el-table :data="(report?.archive?.table ?? []) as ReportArchiveRow[]" stripe border max-height="220">
                <el-table-column prop="period" label="统计周期" width="110" />
                <el-table-column prop="district" label="辖区" width="100" />
                <el-table-column prop="newCount" label="新增入档" width="100" align="right" />
                <el-table-column prop="totalCount" label="累计人数" align="right" />
            </el-table>
            <div ref="archiveChartRef" class="report-chart"></div>
        </el-card>

        <!-- 预警统计 -->
        <el-card class="report-card" shadow="hover">
            <template #header><span class="card-title">预警统计</span></template>
            <el-table :data="(report?.alert?.table ?? []) as ReportAlertRow[]" stripe border max-height="220">
                <el-table-column prop="type" label="预警类型" width="120" />
                <el-table-column prop="level" label="级别" width="80" />
                <el-table-column prop="count" label="数量" width="100" align="right" />
                <el-table-column prop="period" label="统计周期" />
            </el-table>
            <div class="chart-row">
                <div ref="alertChartRef" class="report-chart report-chart--half"></div>
                <div ref="alertPieRef" class="report-chart report-chart--half"></div>
            </div>
        </el-card>

        <!-- 服务统计 -->
        <el-card class="report-card" shadow="hover">
            <template #header><span class="card-title">服务统计</span></template>
            <el-table :data="(report?.service?.table ?? []) as ReportServiceRow[]" stripe border max-height="220">
                <el-table-column prop="serviceType" label="服务类型" width="120" />
                <el-table-column prop="count" label="服务次数" width="100" align="right" />
                <el-table-column prop="period" label="统计周期" />
            </el-table>
            <div ref="serviceChartRef" class="report-chart"></div>
        </el-card>
    </div>
</template>
