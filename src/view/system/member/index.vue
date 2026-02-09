<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getMemberList } from "@/api";
import type { MemberItem, PageData } from "@/api";

const pageData = ref<PageData<MemberItem>>({ list: [], total: 0, page: 1, pageSize: 10 });
const loading = ref(true);
const filterRole = ref("");
const filterStatus = ref("");

async function load(page = 1, pageSize = 10) {
    loading.value = true;
    try {
        pageData.value = await getMemberList({ page, pageSize });
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

function handleEdit(row: MemberItem) {
    console.log(row);
}

function handleDelete(row: MemberItem) {
    console.log(row);
}

onMounted(() => load());
</script>

<template>
    <div class="member-page">
        <div class="toolbar">
            <div class="toolbar-left">
                <el-form inline>
                    <el-form-item label="角色">
                        <el-select v-model="filterRole" placeholder="请选择" clearable style="width: 120px">
                            <el-option label="超级管理员" value="admin" />
                            <el-option label="经办员" value="operator" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select v-model="filterStatus" placeholder="请选择" clearable style="width: 100px">
                            <el-option label="正常" value="normal" />
                            <el-option label="禁用" value="disabled" />
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
            <el-table-column prop="username" label="登录账号" width="120" />
            <el-table-column prop="name" label="姓名" width="100" />
            <el-table-column prop="role" label="角色" width="120" />
            <el-table-column prop="status" label="状态" width="80" />
            <el-table-column prop="districtName" label="管辖区名称" width="120" />
            <el-table-column prop="districtCode" label="管辖区代码" width="120" />
            <el-table-column label="操作" width="150">
                <template #default="{ row }">
                    <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
                    <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
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
