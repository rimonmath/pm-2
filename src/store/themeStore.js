import { defineStore } from "pinia";
import { shallowRef } from "vue";

const initialBrandColor = localStorage.getItem("brandColor") || "#491D34";

export const useThemeStore = defineStore("theme", () => {
  // State with shallowRef for primitive reactivity
  const brandColor = shallowRef(initialBrandColor);

  // Actions
  const setBrandColor = (payload) => {
    brandColor.value = payload;
    localStorage.setItem("brandColor", payload); // Save to localStorage
  };

  return {
    brandColor,
    setBrandColor
  };
});
