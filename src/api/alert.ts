import type { HelpItem, WorkorderItem, PageData, PageQuery } from "./types";
import { delay } from "./_mock";

const helpList: HelpItem[] = [
    { id: 1, name: "张三", type: "一键求助", level: "紧急", status: "待派送", time: "2025-02-06 10:35" },
    { id: 2, name: "李四", type: "越界", level: "高", status: "已派送", time: "2025-02-06 10:00" },
    { id: 3, name: "王五", type: "心率异常", level: "中", status: "待派送", time: "2025-02-06 09:45" },
];

const workorderList: WorkorderItem[] = [
    { id: 1, title: "张三 一键求助", status: "处理中", assignee: "李员", time: "2025-02-06 10:40" },
    { id: 2, title: "李四 越界预警", status: "已完成", assignee: "王员", time: "2025-02-06 10:05" },
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

export async function getHelpList(query?: PageQuery): Promise<PageData<HelpItem>> {
    await delay();
    return toPageData(helpList, query);
}

export async function getWorkorderList(query?: PageQuery): Promise<PageData<WorkorderItem>> {
    await delay();
    return toPageData(workorderList, query);
}
