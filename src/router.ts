import { createRouter, createWebHistory } from "vue-router";
import { useAuth } from "./composables/useAuth";

declare module "vue-router" {
    interface RouteMeta {
        title?: string;
        sidebarTitle?: string;
        sidebarIcon?: string;
        sidebarGroup?: string;
        sidebarGroupIcon?: string;
        auth?: boolean;
    }
}

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/login",
            name: "Login",
            component: () => import("./view/login/index.vue"),
            meta: { title: "登录", auth: false },
        },
        {
            path: "/",
            component: () => import("./layout/index.vue"),
            redirect: "/home",
            children: [
                {
                    path: "home",
                    name: "Home",
                    component: () => import("./view/home/index.vue"),
                    meta: {
                        title: "首页",
                        sidebarTitle: "首页",
                        sidebarIcon: "HomeFilled",
                    },
                },
                {
                    path: "archive/list",
                    name: "ArchiveList",
                    component: () =>
                        import("./view/archive/list/index.vue"),
                    meta: {
                        title: "档案列表",
                        sidebarTitle: "档案列表",
                        sidebarGroup: "档案管理",
                        sidebarGroupIcon: "Folder",
                    },
                },
                {
                    path: "archive/device",
                    name: "ArchiveDevice",
                    component: () =>
                        import("./view/archive/device/index.vue"),
                    meta: {
                        title: "设备列表",
                        sidebarTitle: "设备列表",
                        sidebarGroup: "档案管理",
                        sidebarGroupIcon: "Folder",
                    },
                },
                {
                    path: "monitor/map",
                    name: "MonitorMap",
                    component: () => import("./view/monitor/map/index.vue"),
                    meta: {
                        title: "监测视图",
                        sidebarTitle: "监测视图",
                        sidebarGroup: "数据监查",
                        sidebarGroupIcon: "View",
                    },
                },
                {
                    path: "monitor/device-alert",
                    name: "MonitorDeviceAlert",
                    component: () =>
                        import("./view/monitor/device-alert/index.vue"),
                    meta: {
                        title: "设备异常列表",
                        sidebarTitle: "设备异常列表",
                        sidebarGroup: "数据监查",
                        sidebarGroupIcon: "View",
                    },
                },
                {
                    path: "monitor/health-alert",
                    name: "MonitorHealthAlert",
                    component: () =>
                        import("./view/monitor/health-alert/index.vue"),
                    meta: {
                        title: "健康异常列表",
                        sidebarTitle: "健康异常列表",
                        sidebarGroup: "数据监查",
                        sidebarGroupIcon: "View",
                    },
                },
                {
                    path: "alert/help",
                    name: "AlertHelp",
                    component: () => import("./view/alert/help/index.vue"),
                    meta: {
                        title: "求助列表",
                        sidebarTitle: "求助列表",
                        sidebarGroup: "预警处理",
                        sidebarGroupIcon: "Bell",
                    },
                },
                {
                    path: "alert/workorder",
                    name: "AlertWorkorder",
                    component: () =>
                        import("./view/alert/workorder/index.vue"),
                    meta: {
                        title: "工单列表",
                        sidebarTitle: "工单列表",
                        sidebarGroup: "预警处理",
                        sidebarGroupIcon: "Bell",
                    },
                },
                {
                    path: "stats/report",
                    name: "StatsReport",
                    component: () =>
                        import("./view/stats/report/index.vue"),
                    meta: {
                        title: "统计报表",
                        sidebarTitle: "统计报表",
                        sidebarGroup: "统计分析",
                        sidebarGroupIcon: "DataLine",
                    },
                },
                {
                    path: "system/member",
                    name: "SystemMember",
                    component: () =>
                        import("./view/system/member/index.vue"),
                    meta: {
                        title: "成员管理",
                        sidebarTitle: "成员管理",
                        sidebarGroup: "系统管理",
                        sidebarGroupIcon: "Setting",
                    },
                },
            ],
        },
        {
            path: "/:pathMatch(.*)",
            name: "NotFound",
            component: () => import("./view/error/404.vue"),
            meta: { title: "页面不存在", auth: false },
        },
    ],
});

router.beforeEach((to, _from, next) => {
    const { isLoggedIn } = useAuth();
    const auth = to.meta.auth !== false;

    if (to.name === "Login") {
        if (isLoggedIn.value) {
            const redirect =
                typeof to.query.redirect === "string"
                    ? to.query.redirect
                    : "/home";
            next(redirect);
        } else {
            next();
        }
        return;
    }

    if (to.name === "NotFound") {
        next();
        return;
    }

    if (auth && !isLoggedIn.value) {
        next({
            path: "/login",
            query: { redirect: to.fullPath },
        });
        return;
    }

    next();
});

router.afterEach((to) => {
    const title = to.meta.title as string | undefined;
    if (title) {
        document.title = `${title} - 后台管理`;
    }
});

export default router;
