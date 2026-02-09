<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getHelpList } from "@/api";
import type { HelpItem, PageData } from "@/api";

const pageData = ref<PageData<HelpItem>>({ list: [], total: 0, page: 1, pageSize: 10 });
const loading = ref(true);
const filterType = ref("");
const filterLevel = ref("");

async function load(page = 1, pageSize = 10) {
    loading.value = true;
    try {
        pageData.value = await getHelpList({ page, pageSize });
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
    <div class="alert-help-page">
        <div class="toolbar">
            <div class="toolbar-left">
                <el-form inline>
                    <el-form-item label="类型">
                        <el-select v-model="filterType" placeholder="请选择" clearable style="width: 120px">
                            <el-option label="一键求助" value="sos" />
                            <el-option label="越界" value="out" />
                            <el-option label="心率异常" value="heart" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="级别">
                        <el-select v-model="filterLevel" placeholder="请选择" clearable style="width: 100px">
                            <el-option label="紧急" value="urgent" />
                            <el-option label="高" value="high" />
                            <el-option label="中" value="mid" />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="toolbar-right">
                <el-button type="primary">派送</el-button>
            </div>
        </div>
        <el-table v-loading="loading" :data="pageData.list" stripe>
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="name" label="姓名" width="100" />
            <el-table-column prop="type" label="预警类型" width="120" />
            <el-table-column prop="level" label="级别" width="80">
                <template #default="{ row }">
                    <el-tag
                        :type="row.level === '紧急' ? 'danger' : row.level === '高' ? 'warning' : 'info'"
                        size="small"
                    >
                        {{ row.level }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100" />
            <el-table-column prop="time" label="时间" width="180" />
            <el-table-column label="操作" width="80">
                <template #default>
                    <el-button link type="primary">派送</el-button>
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
