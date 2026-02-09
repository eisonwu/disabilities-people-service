<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getDeviceAlertList } from "@/api";
import type { DeviceAlertItem, PageData } from "@/api";

const pageData = ref<PageData<DeviceAlertItem>>({ list: [], total: 0, page: 1, pageSize: 10 });
const loading = ref(true);
const filterType = ref("");

async function load(page = 1, pageSize = 10) {
    loading.value = true;
    try {
        pageData.value = await getDeviceAlertList({ page, pageSize });
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
    <div class="device-alert-page">
        <div class="toolbar">
            <div class="toolbar-left">
                <el-form inline>
                    <el-form-item label="类型">
                        <el-select v-model="filterType" placeholder="请选择" clearable style="width: 120px">
                            <el-option label="离线超时" value="offline" />
                            <el-option label="电量过低" value="battery" />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="toolbar-right" />
        </div>
        <el-table v-loading="loading" :data="pageData.list" stripe>
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="deviceId" label="设备编号" width="120" />
            <el-table-column prop="type" label="异常类型" />
            <el-table-column prop="level" label="级别" width="80">
                <template #default="{ row }">
                    <el-tag :type="row.level === '高' ? 'danger' : 'warning'" size="small">
                        {{ row.level }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="time" label="发生时间" width="180" />
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
