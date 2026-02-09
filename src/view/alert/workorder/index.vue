<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getWorkorderList } from "@/api";
import type { WorkorderItem, PageData } from "@/api";

const pageData = ref<PageData<WorkorderItem>>({ list: [], total: 0, page: 1, pageSize: 10 });
const loading = ref(true);
const filterStatus = ref("");

async function load(page = 1, pageSize = 10) {
    loading.value = true;
    try {
        pageData.value = await getWorkorderList({ page, pageSize });
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
    <div class="alert-workorder-page">
        <div class="toolbar">
            <div class="toolbar-left">
                <el-form inline>
                    <el-form-item label="状态">
                        <el-select v-model="filterStatus" placeholder="请选择" clearable style="width: 120px">
                            <el-option label="待处理" value="pending" />
                            <el-option label="处理中" value="doing" />
                            <el-option label="已完成" value="done" />
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
            <el-table-column prop="id" label="工单ID" width="80" />
            <el-table-column prop="title" label="工单内容" min-width="160" />
            <el-table-column prop="status" label="状态" width="100">
                <template #default="{ row }">
                    <el-tag :type="row.status === '已完成' ? 'success' : 'warning'" size="small">
                        {{ row.status }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="assignee" label="处理人" width="100" />
            <el-table-column prop="time" label="派送时间" width="180" />
            <el-table-column label="操作" width="80">
                <template #default>
                    <el-button link type="primary">查看过程</el-button>
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
