import { ref, shallowRef, onMounted } from "vue";
import privateService from "../service/privateService";

export function useSettings(settingsName) {
  // Reactive variables
  const getting = shallowRef(true);
  const settings = ref({});

  // Methods
  const getSettings = () => {
    getting.value = true;
    privateService
      .getSettings(settingsName)
      .then((res) => {
        settings.value = res.data;
      })
      .catch(() => {
        showErrorMessage("Failed to fetch account settings.");
      })
      .finally(() => {
        getting.value = false;
      });
  };

  // Lifecycle hook
  onMounted(() => {
    setTimeout(getSettings, 333);
  });

  return {
    getting,
    settings,
    getSettings
  };
}
