<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useAuth } from "@/composables/useAuth.ts";

const route = useRoute();
const router = useRouter();
const { setToken } = useAuth();

const formRef = ref();
const loading = ref(false);

const form = reactive({
    username: "",
    password: "",
});

const rules = {
    username: [{ required: true, message: "请输入账号", trigger: "blur" }],
    password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};

async function onSubmit() {
    if (!formRef.value) return;
    await formRef.value.validate((valid: boolean) => {
        if (!valid) return;
        doLogin();
    });
}

function doLogin() {
    loading.value = true;
    // 模拟登录成功，后续可替换为真实接口
    setTimeout(() => {
        setToken("mock-token-" + Date.now());
        ElMessage.success("登录成功");
        const redirect =
            typeof route.query.redirect === "string"
                ? route.query.redirect
                : "/home";
        router.push(redirect);
        loading.value = false;
    }, 300);
}
</script>

<template>
    <div class="login-page">
        <el-card class="login-card" shadow="always">
            <template #header>
                <span class="card-title">后台登录</span>
            </template>
            <el-form
                ref="formRef"
                :model="form"
                :rules="rules"
                label-width="0"
                @submit.prevent="onSubmit"
            >
                <el-form-item prop="username">
                    <el-input
                        v-model="form.username"
                        placeholder="账号"
                        size="large"
                        clearable
                    />
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        v-model="form.password"
                        type="password"
                        placeholder="密码"
                        size="large"
                        show-password
                        clearable
                        @keyup.enter="onSubmit"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button
                        type="primary"
                        size="large"
                        :loading="loading"
                        class="submit-btn"
                        @click="onSubmit"
                    >
                        登录
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>
