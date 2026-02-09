import { computed } from "vue";

const TOKEN_KEY = "admin_token";

export function useAuth() {
    const token = computed(() => localStorage.getItem(TOKEN_KEY) ?? "");

    const isLoggedIn = computed(() => !!token.value);

    function setToken(value: string) {
        localStorage.setItem(TOKEN_KEY, value);
    }

    function clearToken() {
        localStorage.removeItem(TOKEN_KEY);
    }

    return { token, isLoggedIn, setToken, clearToken };
}
