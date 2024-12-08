<script setup>
import { ref, shallowRef, onMounted } from "vue";
import TheButton from "../../../components/TheButton.vue";
import privateService from "../../../service/privateService";
import { showErrorMessage, showSuccessMessage } from "../../../utils/functions";

import { useMouse } from "../../../composables/useMouse.js";
import { useSettings } from "@/composables/useSettings";

const { x, y } = useMouse();

const { getting, settings } = useSettings("account");
const saving = shallowRef(false);

const saveData = () => {
  saving.value = true;
  privateService
    .updateAccountSettings(settings.value)
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
      <label class="block">Full Name</label>
      <input type="text" v-model="settings.fullName" />
      <label class="mt-3 block">Email</label>
      <input type="text" v-model="settings.email" />
      <label class="mt-3 block">Phone</label>
      <input type="text" v-model="settings.phone" />
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
