<script setup>
import { computed } from "vue"; // Import computed
import { useThemeStore } from "../../../store/themeStore";
import TheButton from "../../../components/TheButton.vue";

// Access the theme store
const themeStore = useThemeStore();

// Reactive computed state
const brandColor = computed(() => themeStore.brandColor);

// Methods
const handleInput = (e) => {
  themeStore.setBrandColor(e.target.value);
};
</script>

<template>
  <div>
    <br />
    <div>Brand color</div>
    <div class="brand-color"></div>
    <input
      :value="brandColor"
      type="color"
      name="bc"
      id="bc"
      class="mt-2"
      @input="handleInput"
    />
    <br />
    <TheButton>Save</TheButton>
  </div>
</template>

<style scoped>
.brand-color {
  background-color: var(--brand-color);
  width: 444px;
  height: 444px;
}
</style>
