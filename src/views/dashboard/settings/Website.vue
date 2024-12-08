<script setup>
import { reactive, shallowRef, onMounted } from "vue";
import TheButton from "../../../components/TheButton.vue";
import privateService from "../../../service/privateService";
import { showErrorMessage, showSuccessMessage } from "../../../utils/functions";
import { shallowReactive } from "vue";

import { useMouse } from "../../../composables/useMouse.js";
import { useSettings } from "@/composables/useSettings";

const { x, y } = useMouse();

const { getting, settings } = useSettings("website");

const saving = shallowRef(false);

// Save website settings
const saveData = () => {
  saving.value = true;
  privateService
    .updateWebsiteSettings(settings.value)
    .then((res) => {
      showSuccessMessage(res);
    })
    .catch((err) => {
      showErrorMessage(err);
    })
    .finally(() => {
      saving.value = false;
    });
};
</script>

<template>
  <div class="pt-3">
    <div class="text-center" v-if="getting">Loading...</div>
    <div v-else>
      <label class="block">Shop Name</label>
      <input type="text" v-model="settings.shopName" />
      <label class="mt-3 block">Address</label>
      <input type="text" v-model="settings.address" />
      <br />
      <TheButton class="inline-block mt-4" :loading="saving" @click="saveData">
        Save
      </TheButton>

      <hr />
      <p>x: {{ x }}, y: {{ y }}</p>
    </div>
  </div>
</template>

<style scoped></style>
