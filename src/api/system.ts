import type { MemberItem, PageData, PageQuery } from "./types";
import { delay } from "./_mock";

const memberList: MemberItem[] = [
    { id: 1, username: "admin", name: "管理员", role: "超级管理员", status: "正常", districtName: "潮阳区", districtCode: "440513" },
    { id: 2, username: "user1", name: "张三", role: "经办员", status: "正常", districtName: "潮阳区", districtCode: "440513" },
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

export async function getMemberList(query?: PageQuery): Promise<PageData<MemberItem>> {
    await delay();
    return toPageData(memberList, query);
}
