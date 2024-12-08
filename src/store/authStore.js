import { defineStore } from "pinia";
import { shallowRef, computed } from "vue";

export const useAuthStore = defineStore("auth", () => {
  // State (using shallowRef for primitive types)
  const username = shallowRef("");
  const accessToken = shallowRef("");
  const refreshToken = shallowRef("");

  // Getter
  const isLoggedIn = computed(() => username.value && accessToken.value);

  // Actions
  const login = (payload) => {
    username.value = payload.username;
    accessToken.value = payload.accessToken;
    refreshToken.value = payload.refreshToken;
  };

  return {
    username,
    accessToken,
    refreshToken,
    isLoggedIn,
    login
  };
});
