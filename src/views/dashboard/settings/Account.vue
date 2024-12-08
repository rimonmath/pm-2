<script setup>
import { ref, shallowRef, onMounted } from "vue";
import TheButton from "../../../components/TheButton.vue";
import privateService from "../../../service/privateService";
import { showErrorMessage, showSuccessMessage } from "../../../utils/functions";

import { useMouse } from "../../../composables/useMouse.js";

const { x, y } = useMouse();

// Reactive variables
const getting = shallowRef(true);
const saving = shallowRef(false);
const accountSettings = ref({
  fullName: "",
  email: "",
  phone: ""
});

// Methods
const getAccountSettings = () => {
  getting.value = true;
  privateService
    .getAccountSettings()
    .then((res) => {
      if (res.data.fullName) {
        accountSettings.value = res.data;
      }
    })
    .catch(() => {
      showErrorMessage("Failed to fetch account settings.");
    })
    .finally(() => {
      getting.value = false;
    });
};

const saveData = () => {
  saving.value = true;
  privateService
    .updateAccountSettings(accountSettings.value)
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

// Lifecycle hook
onMounted(() => {
  setTimeout(getAccountSettings, 333);
});
</script>

<template>
  <div class="pt-3">
    <div class="text-center" v-if="getting">Loading...</div>
    <div v-else>
      <label class="block">Full Name</label>
      <input type="text" v-model="accountSettings.fullName" />
      <label class="mt-3 block">Email</label>
      <input type="text" v-model="accountSettings.email" />
      <label class="mt-3 block">Phone</label>
      <input type="text" v-model="accountSettings.phone" />
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
