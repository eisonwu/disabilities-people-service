<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getDeviceList } from "@/api";
import type { DeviceItem, PageData } from "@/api";

const pageData = ref<PageData<DeviceItem>>({ list: [], total: 0, page: 1, pageSize: 10 });
const loading = ref(true);
const filterOnline = ref<boolean | null>(null);

async function load(page = 1, pageSize = 10) {
    loading.value = true;
    try {
        pageData.value = await getDeviceList({ page, pageSize });
    } finally {
        loading.value = false;
    }
}

function onPageChange(page: number) {
    load(page, pageData.value.pageSize);
}

function onSizeChange(pageSize: number) {
    load(1, pageSize);
}

onMounted(() => load());
</script>

<template>
    <div class="archive-device-page">
        <div class="toolbar">
            <div class="toolbar-left">
                <el-form inline>
                    <el-form-item label="在线状态">
                        <el-select v-model="filterOnline" placeholder="全部" clearable style="width: 100px">
                            <el-option label="在线" :value="true" />
                            <el-option label="离线" :value="false" />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="toolbar-right">
                <el-button type="primary">新增</el-button>
            </div>
        </div>
        <el-table v-loading="loading" :data="pageData.list" stripe>
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="deviceId" label="设备编号" width="120" />
            <el-table-column prop="name" label="绑定人员" width="100" />
            <el-table-column label="在线状态" width="100">
                <template #default="{ row }">
                    <el-tag :type="row.online ? 'success' : 'info'" size="small">
                        {{ row.online ? "在线" : "离线" }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="电量" width="100">
                <template #default="{ row }">
                    {{ row.battery }}%
                </template>
            </el-table-column>
            <el-table-column prop="location" label="位置" min-width="140" />
            <el-table-column label="操作" width="150">
                <template #default>
                    <el-button link type="primary">编辑</el-button>
                    <el-button link type="danger">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-wrap">
            <el-pagination
                :current-page="pageData.page"
                :page-size="pageData.pageSize"
                :total="pageData.total"
                :page-sizes="[10, 20, 50]"
                layout="total, sizes, prev, pager, next"
                @current-change="onPageChange"
                @size-change="onSizeChange"
            />
        </div>
    </div>
</template>
