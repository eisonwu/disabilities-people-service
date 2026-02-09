import type { StatsOverview, ChartData } from "./types";
import { delay } from "./_mock";

const statsOverview: StatsOverview = {
    totalDisabled: 1234,
    totalDevice: 856,
    todayAlert: 12,
    onlineDevice: 782,
};

const chartData: ChartData = {
    xAxis: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    series: [
        { name: "入档人数", type: "line", smooth: true, data: [120, 132, 101, 134, 90, 230, 210], itemStyle: { color: "#0d9488" } },
        { name: "预警数", type: "line", smooth: true, data: [22, 18, 19, 23, 16, 25, 12], itemStyle: { color: "#f59e0b" } },
    ],
};

export async function getStatsOverview(): Promise<StatsOverview> {
    await delay();
    return statsOverview;
}

export async function getChartData(): Promise<ChartData> {
    await delay();
    return chartData;
}
