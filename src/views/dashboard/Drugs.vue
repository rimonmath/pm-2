<script setup>
import axios from "axios";
import TheButton from "../../components/TheButton.vue";
import TheModal from "../../components/TheModal.vue";
import { showErrorMessage, showSuccessMessage } from "../../utils/functions";
import privateService from "../../service/privateService";
import { shallowRef, ref } from "vue";
import { shallowReactive } from "vue";
import { onMounted } from "vue";

const addModal = shallowRef(false);
const deleteModal = shallowRef(false);
const editModal = shallowRef(false);
const newDrug = shallowReactive({
  name: "",
  weight: "",
  type: "",
  vendor: "",
  price: "",
  quantity: ""
});

const selectedDrug = ref({});

const deleting = shallowRef(false);
const editing = shallowRef(false);
const adding = shallowRef(false);

const drugs = ref([]);

const gettingDrugs = shallowRef(false);
const vendors = ref([]);

onMounted(() => {
  setTimeout(getAllDrugs, 100);
  setTimeout(getAllVendors, 100);
});

function resetForm() {
  newDrug.name = "";
  newDrug.weight = "";
  newDrug.type = "";
  newDrug.vendor = "";
  newDrug.price = "";
  newDrug.quantity = "";
}

function getAllDrugs() {
  gettingDrugs.value = true;

  privateService
    .getDrugs()
    .then((res) => {
      drugs.value = res.data;
    })
    .catch((err) => {
      showErrorMessage(err);
    })
    .finally(() => {
      gettingDrugs.value = false;
    });
}

function getAllVendors() {
  // this.gettingDrugs = true;
  privateService
    .getVendors()
    .then((res) => {
      vendors.value = res.data;
    })
    .catch((err) => {
      showErrorMessage(err);
    })
    .finally(() => {
      // this.gettingDrugs = false;
    });
}

function addNew() {
  // console.log(localStorage.getItem("accessToken"));
  adding.value = true;
  privateService
    .addDrug(newDrug)
    .then((res) => {
      showSuccessMessage(res);
      addModal.value = false;
      resetForm();
      getAllDrugs();
    })
    .catch((err) => {
      showErrorMessage(err);
    })
    .finally(() => {
      adding.value = false;
    });
}

function deleteDrug() {
  deleting.value = true;
  privateService
    .deleteDrug(selectedDrug.value._id)
    .then((res) => {
      showSuccessMessage(res);
      deleteModal.value = false;
      getAllDrugs();
    })
    .catch((err) => {
      showErrorMessage(res);
    })
    .finally(() => {
      deleting.value = false;
    });
}

function editDrug() {
  editing.value = true;
  privateService
    .editDrug(selectedDrug.value)
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
}
</script>

<template>
  <div class="d-flex jc-between ai-center">
    <h2>All drugs</h2>
    <TheButton @click="addModal = true">Add New</TheButton>
  </div>

  <div class="text-center" v-if="gettingDrugs">Loading...</div>
  <table class="mt-4" v-else>
    <thead>
      <tr>
        <th>Name</th>
        <th>Weight</th>
        <th>Type</th>
        <th>Vendor</th>
        <th>Price</th>
        <th>Quantity</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="vendor in drugs" :key="vendor.name">
        <td>
          {{ vendor.name }}
        </td>
        <td>
          {{ vendor.weight }}
        </td>
        <td>
          {{ vendor.type }}
        </td>
        <td>
          {{ vendor.vendor }}
        </td>
        <td>
          {{ vendor.price }}
        </td>
        <td>
          {{ vendor.quantity }}
        </td>
        <td>
          <img
            src="/img/edit.png"
            alt=""
            class="action-icon"
            @click="
              selectedDrug = vendor;
              editModal = true;
            "
          />
          <img
            src="/img/trash.png"
            alt=""
            class="action-icon action-icon--delete ml-3"
            @click="
              selectedDrug = vendor;
              deleteModal = true;
            "
          />
        </td>
      </tr>
    </tbody>
  </table>

  <TheModal v-model="addModal" heading="Add new vendor">
    <form @submit.prevent="addNew">
      <label class="block">Select Drug Type</label>
      <div class="mt-2">
        <label>
          <input
            type="radio"
            name="drugtype"
            value="Tab"
            v-model="newDrug.type"
          />
          Tab
        </label>

        <label class="ml-2">
          <input
            type="radio"
            name="drugtype"
            value="Capsule"
            v-model="newDrug.type"
          />
          Capsule
        </label>

        <label class="ml-2">
          <input
            type="radio"
            name="drugtype"
            value="Syrup"
            v-model="newDrug.type"
          />
          Syrup
        </label>

        <label class="ml-2">
          <input
            type="radio"
            name="drugtype"
            value="Suppository"
            v-model="newDrug.type"
          />
          Suppository
        </label>
      </div>

      <label class="block mt-3">Drug Name</label>
      <input
        type="text"
        placeholder="Drug Name"
        class="mt-1 w-100"
        v-model="newDrug.name"
      />

      <label class="block mt-3">Weight</label>
      <input
        type="text"
        placeholder="weight in mg"
        class="mt-1 w-100"
        v-model="newDrug.weight"
      />

      <label class="block mt-3">Vendor</label>
      <select v-model="newDrug.vendor">
        <option value="">Select One</option>
        <option
          v-for="vendor in vendors"
          :key="vendor.name"
          :value="vendor.name"
        >
          {{ vendor.name }}
        </option>
      </select>

      <label class="block mt-3">Price</label>
      <input
        type="text"
        placeholder="Pack Price"
        class="mt-1 w-100"
        v-model="newDrug.price"
      />

      <label class="block mt-3">Quantity</label>
      <input
        type="number"
        placeholder="Enter Quantity"
        class="mt-1 w-100"
        v-model="newDrug.quantity"
      />

      <the-button :loading="adding" class="w-100 mt-4"> Add </the-button>
    </form>
  </TheModal>

  <TheModal v-model="editModal" heading="Edit vendor">
    <form @submit.prevent="editDrug">
      <label class="block">Select Drug Type</label>
      <div class="mt-2">
        <label>
          <input
            type="radio"
            name="drugtype"
            value="Tab"
            v-model="selectedDrug.type"
          />
          Tab
        </label>

        <label class="ml-2">
          <input
            type="radio"
            name="drugtype"
            value="Capsule"
            v-model="selectedDrug.type"
          />
          Capsule
        </label>

        <label class="ml-2">
          <input
            type="radio"
            name="drugtype"
            value="Syrup"
            v-model="selectedDrug.type"
          />
          Syrup
        </label>

        <label class="ml-2">
          <input
            type="radio"
            name="drugtype"
            value="Suppository"
            v-model="selectedDrug.type"
          />
          Suppository
        </label>
      </div>

      <label class="block mt-3">Drug Name</label>
      <input
        type="text"
        placeholder="Drug Name"
        class="mt-1 w-100"
        v-model="selectedDrug.name"
      />

      <label class="block mt-3">Weight</label>
      <input
        type="text"
        placeholder="weight in mg"
        class="mt-1 w-100"
        v-model="selectedDrug.weight"
      />

      <label class="block mt-3">Vendor</label>
      <select v-model="selectedDrug.vendor">
        <option value="">Select One</option>
        <option
          v-for="vendor in vendors"
          :key="vendor.name"
          :value="vendor.name"
        >
          {{ vendor.name }}
        </option>
      </select>

      <label class="block mt-3">Price</label>
      <input
        type="text"
        placeholder="Pack Price"
        class="mt-1 w-100"
        v-model="selectedDrug.price"
      />

      <label class="block mt-3">Quantity</label>
      <input
        type="number"
        placeholder="Enter Quantity"
        class="mt-1 w-100"
        v-model="selectedDrug.quantity"
      />

      <the-button :loading="editing" class="w-100 mt-4">
        Save Changes
      </the-button>
    </form>
  </TheModal>

  <TheModal v-model="deleteModal" heading="Are you sure?">
    <p>
      Do you really want to delete
      <strong>{{ selectedDrug.name }}</strong>
    </p>

    <TheButton class="mt-4" @click="deleteDrug" :loading="deleting">
      Yes
    </TheButton>
    <TheButton class="ml-4" color="gray" @click="deleteModal = false">
      No
    </TheButton>
  </TheModal>
</template>
