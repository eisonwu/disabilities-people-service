// 档案
export interface ArchiveItem {
    id: number;
    name: string;
    idCard: string;
    phone: string;
    address: string;
}

export interface DeviceItem {
    id: number;
    deviceId: string;
    name: string;
    online: boolean;
    battery: number;
    location: string;
}

// 监测 - 地图点位
export interface MapPoint {
    lng: number;
    lat: number;
    /** 人名 */
    name: string;
    online: boolean;
    /** 是否为异常点（地图上显示为红色） */
    abnormal?: boolean;
}

// 设备异常 / 健康异常
export interface DeviceAlertItem {
    id: number;
    deviceId: string;
    type: string;
    level: string;
    time: string;
}

export interface HealthAlertItem {
    id: number;
    name: string;
    type: string;
    value: string;
    time: string;
}

// 预警 - 求助 / 工单
export interface HelpItem {
    id: number;
    name: string;
    type: string;
    level: string;
    status: string;
    time: string;
}

export interface WorkorderItem {
    id: number;
    title: string;
    status: string;
    assignee: string;
    time: string;
}

// 系统 - 成员
export interface MemberItem {
    id: number;
    username: string;
    name: string;
    role: string;
    status: string;
    /** 管辖区名称 */
    districtName: string;
    /** 管辖区代码（如 adcode） */
    districtCode: string;
}

// 分页查询参数
export interface PageQuery {
    page?: number;
    pageSize?: number;
}

// 首页
export interface StatsOverview {
    totalDisabled: number;
    totalDevice: number;
    todayAlert: number;
    onlineDevice: number;
}

export interface ChartSeriesItem {
    name: string;
    type: string;
    smooth: boolean;
    data: number[];
    itemStyle: { color: string };
}

export interface ChartData {
    xAxis: string[];
    series: ChartSeriesItem[];
}

export interface PageData<T> {
    list: T[];
    total: number;
    page: number;
    pageSize: number;
}

// 统计报表
export interface ReportQuery {
    startDate?: string;
    endDate?: string;
}

/** 入档统计行（按月份/区域） */
export interface ReportArchiveRow {
    period: string;
    district: string;
    newCount: number;
    totalCount: number;
}

/** 预警统计行（按类型/级别） */
export interface ReportAlertRow {
    type: string;
    level: string;
    count: number;
    period: string;
}

/** 服务统计行（服务类型、次数等） */
export interface ReportServiceRow {
    serviceType: string;
    count: number;
    period: string;
}

export interface ReportArchiveData {
    table: ReportArchiveRow[];
    chart: ChartData;
}

export interface ReportAlertData {
    table: ReportAlertRow[];
    chart: ChartData;
    pie: { name: string; value: number }[];
}

export interface ReportServiceData {
    table: ReportServiceRow[];
    chart: ChartData;
}

export interface ReportData {
    archive: ReportArchiveData;
    alert: ReportAlertData;
    service: ReportServiceData;
}