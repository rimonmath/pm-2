<script setup>
import { ref, reactive, onMounted } from "vue";
import TheButton from "../../components/TheButton.vue";
import TheModal from "../../components/TheModal.vue";
import { showErrorMessage, showSuccessMessage } from "../../utils/functions";
import privateService from "../../service/privateService";

// State variables
const addModal = ref(false);
const deleteModal = ref(false);
const editModal = ref(false);

const newVendor = reactive({
  name: "",
  description: ""
});

const selectedVendor = reactive({});
const deleting = ref(false);
const editing = ref(false);
const adding = ref(false);
const vendors = ref([]);
const gettingVendors = ref(false);

// Methods
const resetForm = () => {
  newVendor.name = "";
  newVendor.description = "";
};

const getAllVendors = () => {
  gettingVendors.value = true;
  privateService
    .getVendors()
    .then((res) => {
      vendors.value = res.data;
    })
    .catch((err) => {
      showErrorMessage(err);
    })
    .finally(() => {
      gettingVendors.value = false;
    });
};

const addNew = () => {
  adding.value = true;
  privateService
    .addVendor(newVendor)
    .then((res) => {
      showSuccessMessage(res);
      addModal.value = false;
      resetForm();
      getAllVendors();
    })
    .catch((err) => {
      showErrorMessage(err);
    })
    .finally(() => {
      adding.value = false;
    });
};

const deleteVendor = () => {
  deleting.value = true;
  privateService
    .deleteVendor(selectedVendor._id)
    .then((res) => {
      showSuccessMessage(res);
      deleteModal.value = false;
      getAllVendors();
    })
    .catch((err) => {
      showErrorMessage(err);
    })
    .finally(() => {
      deleting.value = false;
    });
};

const editVendor = () => {
  editing.value = true;
  privateService
    .editVendor(selectedVendor)
    .then((res) => {
      showSuccessMessage(res);
      editModal.value = false;
    })
    .catch((err) => {
      showErrorMessage(err);
    })
    .finally(() => {
      editing.value = false;
    });
};

// Lifecycle hook
onMounted(() => {
  setTimeout(getAllVendors, 100);
});
</script>

<template>
  <div class="d-flex jc-between ai-center">
    <h2>All vendors</h2>
    <TheButton @click="addModal = true">Add New</TheButton>
  </div>

  <div class="text-center" v-if="gettingVendors">Loading...</div>
  <table class="mt-4" v-else>
    <thead>
      <tr>
        <th>Name</th>
        <th>Description</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="vendor in vendors" :key="vendor.name">
        <td>
          {{ vendor.name }}
        </td>
        <td>{{ vendor.description }}</td>
        <td>
          <img
            src="/img/edit.png"
            alt=""
            class="action-icon"
            @click="
              selectedVendor.name = vendor.name;
              selectedVendor.description = vendor.description;
              selectedVendor._id = vendor._id;
              editModal = true;
            "
          />
          <img
            src="/img/trash.png"
            alt=""
            class="action-icon action-icon--delete ml-3"
            @click="
              selectedVendor.name = vendor.name;
              selectedVendor._id = vendor._id;
              deleteModal = true;
            "
          />
        </td>
      </tr>
    </tbody>
  </table>

  <TheModal v-model="addModal" heading="Add new vendor">
    <form @submit.prevent="addNew">
      <label class="block">Vendor Name</label>
      <input
        type="text"
        placeholder="Enter vendor name"
        class="mt-1 w-100"
        required
        v-model="newVendor.name"
      />

      <label class="block mt-3">Description</label>
      <input
        type="text"
        placeholder="Write short description"
        class="mt-1 w-100"
        required
        v-model="newVendor.description"
      />

      <TheButton :loading="adding" class="w-100 mt-4">Add</TheButton>
    </form>
  </TheModal>

  <TheModal v-model="editModal" heading="Edit vendor">
    <form @submit.prevent="editVendor">
      <label class="block">Vendor Name</label>
      <input
        type="text"
        placeholder="Enter vendor name"
        class="mt-1 w-100"
        required
        v-model="selectedVendor.name"
      />

      <label class="block mt-3">Description</label>
      <input
        type="text"
        placeholder="Write short description"
        class="mt-1 w-100"
        required
        v-model="selectedVendor.description"
      />

      <TheButton :loading="editing" class="w-100 mt-4">
        Save Changes
      </TheButton>
    </form>
  </TheModal>

  <TheModal v-model="deleteModal" heading="Are you sure?">
    <p>
      Do you really want to delete
      <strong>{{ selectedVendor.name }}</strong>
    </p>

    <TheButton class="mt-4" @click="deleteVendor" :loading="deleting">
      Yes
    </TheButton>
    <TheButton class="ml-4" color="gray" @click="deleteModal = false">
      No
    </TheButton>
  </TheModal>
</template>
