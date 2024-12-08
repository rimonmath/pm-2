<script setup>
import { reactive, shallowRef, onMounted } from "vue";
import TheButton from "../../../components/TheButton.vue";
import privateService from "../../../service/privateService";
import { showErrorMessage, showSuccessMessage } from "../../../utils/functions";
import { shallowReactive } from "vue";

// State variables
const getting = shallowRef(true);
const saving = shallowRef(false);
const websiteSettings = shallowReactive({
  shopName: "",
  address: ""
});

// Fetch website settings
const getWebsiteSettings = () => {
  getting.value = true;
  privateService
    .getWebsiteSettings()
    .then((res) => {
      if (res.data.shopName) {
        Object.assign(websiteSettings, res.data);
      }
    })
    .catch((e) => {
      console.error(e);
    })
    .finally(() => {
      getting.value = false;
    });
};

// Save website settings
const saveData = () => {
  saving.value = true;
  privateService
    .updateWebsiteSettings(websiteSettings)
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

// Fetch settings on mount
onMounted(() => {
  setTimeout(getWebsiteSettings, 333);
});
</script>

<template>
  <div class="pt-3">
    <div class="text-center" v-if="getting">Loading...</div>
    <div v-else>
      <label class="block">Shop Name</label>
      <input type="text" v-model="websiteSettings.shopName" />
      <label class="mt-3 block">Address</label>
      <input type="text" v-model="websiteSettings.address" />
      <br />
      <TheButton class="inline-block mt-4" :loading="saving" @click="saveData">
        Save
      </TheButton>
    </div>
  </div>
</template>

<style scoped></style>
