<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
    HomeFilled,
    Folder,
    Setting,
    View,
    Bell,
    DataLine,
    Fold,
    Expand,
    User,
    SwitchButton,
    ArrowDown,
} from "@element-plus/icons-vue";
import { useAuth } from "../composables/useAuth";
import type { RouteRecordRaw } from "vue-router";

const route = useRoute();
const router = useRouter();
const { clearToken } = useAuth();

const collapsed = ref(false);

const layoutRoute = computed(() =>
    router.options.routes.find((r) => r.path === "/" && r.children?.length),
);

const menuItems = computed(() => {
    const children = layoutRoute.value?.children ?? [];
    const withSidebar = children.filter(
        (r) =>
            (r as RouteRecordRaw).meta?.sidebarTitle ||
            (r as RouteRecordRaw).meta?.sidebarGroup,
    ) as RouteRecordRaw[];

    const groups = new Map<
        string,
        { title: string; icon?: string; routes: RouteRecordRaw[] }
    >();
    const topLevel: RouteRecordRaw[] = [];

    for (const r of withSidebar) {
        const meta = r.meta ?? {};
        const group = meta.sidebarGroup as string | undefined;
        const path = r.path.startsWith("/") ? r.path : `/${r.path}`;
        if (group) {
            const existing = groups.get(group);
            if (!existing) {
                groups.set(group, {
                    title: group,
                    icon: (meta.sidebarGroupIcon as string) ?? undefined,
                    routes: [],
                });
            }
            groups.get(group)!.routes.push(r);
        } else {
            topLevel.push(r);
        }
    }

    return { topLevel, groups: Array.from(groups.entries()) };
});

const breadcrumbs = computed(() => {
    const matched = route.matched.filter((r) => r.meta?.title);
    return matched.map((r) => ({ path: r.path, title: r.meta!.title }));
});

function handleLogout() {
    clearToken();
    router.push("/login");
}

const iconMap: Record<string, unknown> = {
    HomeFilled,
    Folder,
    Setting,
    View,
    Bell,
    DataLine,
};
</script>

<template>
    <el-container class="layout-container">
        <el-aside :width="collapsed ? '64px' : '200px'" class="layout-aside shadow-sm">
            <div class="logo text-sm tracking-wide">{{ collapsed ? "管" : "后台管理" }}</div>
            <el-menu
                :default-active="route.path"
                :collapse="collapsed"
                router
                class="layout-menu"
            >
                <template v-for="r in menuItems.topLevel" :key="r.path">
                    <el-menu-item :index="r.path.startsWith('/') ? r.path : `/${r.path}`">
                        <el-icon v-if="(r.meta?.sidebarIcon as string)">
                            <component
                                :is="iconMap[(r.meta?.sidebarIcon as string)] ?? HomeFilled"
                            />
                        </el-icon>
                        <template #title>
                            {{ (r.meta?.sidebarTitle as string) ?? r.meta?.title }}
                        </template>
                    </el-menu-item>
                </template>
                <el-sub-menu
                    v-for="[groupName, group] in menuItems.groups"
                    :key="groupName"
                    :index="groupName"
                >
                    <template #title>
                        <el-icon>
                            <component
                                :is="iconMap[group.icon ?? 'Folder'] ?? Folder"
                            />
                        </el-icon>
                        <span>{{ group.title }}</span>
                    </template>
                    <el-menu-item
                        v-for="r in group.routes"
                        :key="r.path"
                        :index="r.path.startsWith('/') ? r.path : `/${r.path}`"
                    >
                        {{ (r.meta?.sidebarTitle as string) ?? r.meta?.title }}
                    </el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-aside>
        <el-container direction="vertical">
            <el-header class="layout-header shadow-sm">
                <div class="header-left">
                    <el-button
                        link
                        type="primary"
                        class="collapse-btn"
                        @click="collapsed = !collapsed"
                    >
                        <el-icon>
                            <Fold v-if="!collapsed" />
                            <Expand v-else />
                        </el-icon>
                    </el-button>
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item
                            v-for="(b, i) in breadcrumbs"
                            :key="b.path"
                        >
                            <router-link
                                v-if="i < breadcrumbs.length - 1"
                                :to="b.path"
                            >
                                {{ b.title }}
                            </router-link>
                            <span v-else>{{ b.title }}</span>
                        </el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
                <el-dropdown trigger="click" @command="handleLogout">
                    <span class="user-dropdown">
                        <el-icon><User /></el-icon>
                        <span>管理员</span>
                        <el-icon class="el-icon--right">
                            <ArrowDown />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="logout">
                                <el-icon><SwitchButton /></el-icon>
                                退出登录
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-header>
            <el-main class="layout-main min-h-0">
                <router-view />
            </el-main>
        </el-container>
    </el-container>
</template>
