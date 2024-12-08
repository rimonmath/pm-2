<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import TheToast from "./components/TheToast.vue";
import { eventBus } from "./utils/eventBus";

// Reactive state
const toasts = ref([]);

// Remove a toast after a delay
const removeOneToast = () => {
  setTimeout(() => {
    toasts.value.shift();
  }, 2222);
};

// Listen for toast events
onMounted(() => {
  eventBus.on("toast", (data) => {
    toasts.value.push(data);
    removeOneToast();
  });
});
</script>

<template>
  <router-view></router-view>

  <TransitionGroup name="slide-left" tag="div" class="toasts">
    <TheToast
      v-for="(toast, i) in toasts"
      :key="i"
      :toastType="toast.type"
      :message="toast.message"
    />
  </TransitionGroup>
</template>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.25s ease;
}
.slide-left-enter-from,
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
</style>
