<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getArchiveList } from "@/api";
import type { ArchiveItem, PageData } from "@/api";

const pageData = ref<PageData<ArchiveItem>>({ list: [], total: 0, page: 1, pageSize: 10 });
const loading = ref(true);
const detailVisible = ref(false);
const detailRow = ref<ArchiveItem | null>(null);
const searchOptions = ref({ name: "", idCard: "", phone: "" });

function showDetail(row: ArchiveItem) {
    detailRow.value = row;
    detailVisible.value = true;
}

async function load(page = 1, pageSize = 10) {
    loading.value = true;
    try {
        pageData.value = await getArchiveList({ page, pageSize });
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
    <div class="archive-list-page">
        <div class="toolbar">
            <div class="toolbar-left">
                <el-form inline>
                    <el-form-item label="姓名">
                        <el-input v-model="searchOptions.name" placeholder="请输入姓名" clearable style="width: 140px" />
                    </el-form-item>
                    <el-form-item label="身份证号">
                        <el-input v-model="searchOptions.idCard" placeholder="请输入身份证号" clearable style="width: 160px" />
                    </el-form-item>
                    <el-form-item label="联系电话">
                        <el-input v-model="searchOptions.phone" placeholder="请输入联系电话" clearable style="width: 140px" />
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
            <el-table-column prop="name" label="姓名" />
            <el-table-column prop="idCard" label="身份证号" width="160" />
            <el-table-column prop="phone" label="联系电话" width="120" />
            <el-table-column prop="address" label="地址" min-width="120" />
            <el-table-column label="操作" width="200" fixed="right">
                <template #default="{ row }">
                    <el-button link type="primary" @click="showDetail(row)">详情</el-button>
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
        <el-dialog v-model="detailVisible" title="档案详情" size="400px">
            <template v-if="detailRow">
                <p><strong>姓名：</strong>{{ detailRow.name }}</p>
                <p><strong>身份证号：</strong>{{ detailRow.idCard }}</p>
                <p><strong>联系电话：</strong>{{ detailRow.phone }}</p>
                <p><strong>地址：</strong>{{ detailRow.address }}</p>
                <el-divider>亲友列表</el-divider>
                <p class="placeholder">此处展示关联亲友列表（待对接接口）</p>
            </template>
        </el-dialog>
    </div>
</template>
