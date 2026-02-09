import type { MapPoint, DeviceAlertItem, HealthAlertItem, PageData, PageQuery } from "./types";
import { delay } from "./_mock";

// 汕头市大致范围（经度 116.5~116.85，纬度 23.25~23.45）
const SHANTOU_LNG_MIN = 116.5;
const SHANTOU_LNG_MAX = 116.85;
const SHANTOU_LAT_MIN = 23.25;
const SHANTOU_LAT_MAX = 23.45;

const PERSON_NAMES = [
    "王芳", "李强", "张伟", "刘洋", "陈静", "杨敏", "黄磊", "赵娜", "周杰", "吴娟",
    "徐明", "孙丽", "马超", "朱婷", "胡军", "郭艳", "林峰", "何琳", "高鹏", "罗敏",
    "梁斌", "宋佳", "唐磊", "韩雪", "冯涛", "于洋", "董华", "萧红", "程刚", "曹敏",
    "袁伟", "邓芳", "许静", "沈杰", "曾丽", "彭涛", "吕娜", "苏明", "卢强", "蒋琳",
    "蔡军", "贾敏", "丁磊", "魏娟", "薛峰", "叶婷", "阎刚", "余娜", "潘伟", "杜静",
    "戴军", "夏琳", "钟敏", "汪涛", "田丽", "任杰", "姜芳", "范刚", "方娜", "石伟",
    "姚静", "谭军", "邹敏", "熊磊", "金琳", "陆婷", "郝刚", "孔伟", "白静", "崔军",
    "康敏", "毛磊", "邱琳", "秦涛", "江芳", "史刚", "顾娜", "侯伟", "邵静", "孟军",
];

function randomIn(min: number, max: number): number {
    return min + Math.random() * (max - min);
}

function pickName(names: string[], index: number): string {
    return names[index % names.length] ?? "未知";
}

function generateShantouPoints(count: number, abnormalRatio: number): MapPoint[] {
    const list: MapPoint[] = [];
    const abnormalCount = Math.round(count * abnormalRatio);
    const indices = new Set<number>();
    while (indices.size < abnormalCount) {
        indices.add(Math.floor(Math.random() * count));
    }
    for (let i = 0; i < count; i++) {
        list.push({
            lng: randomIn(SHANTOU_LNG_MIN, SHANTOU_LNG_MAX),
            lat: randomIn(SHANTOU_LAT_MIN, SHANTOU_LAT_MAX),
            name: pickName(PERSON_NAMES, i),
            online: Math.random() > 0.3,
            abnormal: indices.has(i),
        });
    }
    return list;
}

const mapPoints: MapPoint[] = generateShantouPoints(100, 0.15);

const deviceAlertList: DeviceAlertItem[] = [
    { id: 1, deviceId: "DEV001", type: "离线超时", level: "高", time: "2025-02-06 10:30" },
    { id: 2, deviceId: "DEV002", type: "电量过低", level: "中", time: "2025-02-06 09:15" },
];

const healthAlertList: HealthAlertItem[] = [
    { id: 1, name: "张三", type: "心率异常", value: "120次/分", time: "2025-02-06 10:20" },
    { id: 2, name: "李四", type: "血压异常", value: "150/95", time: "2025-02-06 09:00" },
];

function toPageData<T>(arr: T[], query?: PageQuery): PageData<T> {
    const page = query?.page ?? 1;
    const pageSize = query?.pageSize ?? 10;
    const start = (page - 1) * pageSize;
    return {
        list: arr.slice(start, start + pageSize),
        total: arr.length,
        page,
        pageSize,
    };
}

export async function getMapPoints(): Promise<MapPoint[]> {
    await delay();
    return mapPoints;
}

export async function getDeviceAlertList(query?: PageQuery): Promise<PageData<DeviceAlertItem>> {
    await delay();
    return toPageData(deviceAlertList, query);
}

export async function getHealthAlertList(query?: PageQuery): Promise<PageData<HealthAlertItem>> {
    await delay();
    return toPageData(healthAlertList, query);
}
