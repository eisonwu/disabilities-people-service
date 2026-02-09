import type { ReportData, ReportQuery, ChartData } from "./types";
import { delay } from "./_mock";

const archiveTable = [
    { period: "2025-01", district: "潮阳区", newCount: 28, totalCount: 1186 },
    { period: "2025-01", district: "潮南区", newCount: 19, totalCount: 892 },
    { period: "2025-02", district: "潮阳区", newCount: 15, totalCount: 1201 },
    { period: "2025-02", district: "潮南区", newCount: 22, totalCount: 914 },
    { period: "2025-03", district: "潮阳区", newCount: 31, totalCount: 1232 },
    { period: "2025-03", district: "潮南区", newCount: 18, totalCount: 932 },
];

const archiveChart: ChartData = {
    xAxis: ["1月", "2月", "3月", "4月", "5月", "6月"],
    series: [
        { name: "新增入档", type: "bar", smooth: false, data: [47, 37, 49, 42, 38, 45], itemStyle: { color: "#2563eb" } },
        { name: "累计人数", type: "line", smooth: true, data: [2078, 2115, 2164, 2206, 2244, 2289], itemStyle: { color: "#0d9488" } },
    ],
};

const alertTable = [
    { type: "心率异常", level: "高", count: 24, period: "2025-02" },
    { type: "心率异常", level: "中", count: 56, period: "2025-02" },
    { type: "一键求助", level: "高", count: 12, period: "2025-02" },
    { type: "越界预警", level: "中", count: 18, period: "2025-02" },
    { type: "血压异常", level: "中", count: 31, period: "2025-02" },
];

const alertChart: ChartData = {
    xAxis: ["1月", "2月", "3月", "4月", "5月", "6月"],
    series: [
        { name: "预警总数", type: "line", smooth: true, data: [142, 141, 158, 135, 149, 132], itemStyle: { color: "#f59e0b" } },
        { name: "已处理", type: "line", smooth: true, data: [128, 135, 152, 130, 142, 125], itemStyle: { color: "#22c55e" } },
    ],
};

const alertPie = [
    { name: "心率异常", value: 80 },
    { name: "一键求助", value: 12 },
    { name: "越界预警", value: 18 },
    { name: "血压异常", value: 31 },
];

const serviceTable = [
    { serviceType: "上门走访", count: 156, period: "2025-02" },
    { serviceType: "康复服务", count: 89, period: "2025-02" },
    { serviceType: "就业帮扶", count: 42, period: "2025-02" },
    { serviceType: "辅具适配", count: 28, period: "2025-02" },
    { serviceType: "其他服务", count: 67, period: "2025-02" },
];

const serviceChart: ChartData = {
    xAxis: ["1月", "2月", "3月", "4月", "5月", "6月"],
    series: [
        { name: "服务次数", type: "bar", smooth: false, data: [312, 382, 358, 401, 389, 420], itemStyle: { color: "#8b5cf6" } },
    ],
};

export async function getReportData(query?: ReportQuery): Promise<ReportData> {
    await delay();
    return {
        archive: { table: archiveTable, chart: archiveChart },
        alert: { table: alertTable, chart: alertChart, pie: alertPie },
        service: { table: serviceTable, chart: serviceChart },
    };
}
