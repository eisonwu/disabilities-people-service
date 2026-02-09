import type { ArchiveItem, DeviceItem, PageData, PageQuery } from "./types";
import { delay } from "./_mock";

const archiveList: ArchiveItem[] = [
    { id: 1, name: "张三", idCard: "310***********1234", phone: "138****5678", address: "某区某街道" },
    { id: 2, name: "李四", idCard: "310***********5678", phone: "139****1234", address: "某区某路" },
];

const deviceList: DeviceItem[] = [
    { id: 1, deviceId: "DEV001", name: "张三", online: true, battery: 85, location: "某区某街道" },
    { id: 2, deviceId: "DEV002", name: "李四", online: false, battery: 20, location: "某区某路" },
    { id: 3, deviceId: "DEV003", name: "王五", online: true, battery: 60, location: "某区某巷" },
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

export async function getArchiveList(query?: PageQuery): Promise<PageData<ArchiveItem>> {
    await delay();
    return toPageData(archiveList, query);
}

export async function getDeviceList(query?: PageQuery): Promise<PageData<DeviceItem>> {
    await delay();
    return toPageData(deviceList, query);
}
