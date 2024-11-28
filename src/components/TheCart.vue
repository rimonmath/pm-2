<script setup>
import { shallowRef } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "../store/cartStore";
import TheButton from "./TheButton.vue";
import privateService from "../service/privateService";
import { showErrorMessage, showSuccessMessage } from "../utils/functions";

const phone = shallowRef("");
const customer = shallowRef("");
const enteringCustomerInfo = shallowRef(false);
const confirming = shallowRef(false);

const cartStore = useCartStore();
const router = useRouter();

function confirmNow() {
  const orderData = {
    customer: customer.value,
    phone: phone.value,
    cartItems: cartStore.products
  };

  // console.log(orderData);
  confirming.value = true;

  privateService
    .sellDrug(orderData)
    .then((res) => {
      showSuccessMessage(res);
      phone.value = "";
      customer.value = "";
      enteringCustomerInfo.value = false;
      cartStore.clearCart();
      router.push("/dashboard/selling-history");
    })
    .catch((err) => {
      showErrorMessage(err);
    })
    .finally(() => {
      confirming.value = false;
    });
}
</script>

<template>
  <div class="the-cart">
    <div class="the-cart__heading">Cart Items</div>

    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Weight</th>
          <th>Price</th>
          <th>Qty</th>
          <th>Total</th>
          <th>
            <img
              src="/img/trash.png"
              class="action-icon action-icon--delete-small"
              alt=""
            />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, key) in cartStore.products" :key="key">
          <td>{{ item.name }}</td>
          <td>{{ item.weight }}</td>
          <td>{{ item.price }}</td>

          <td>
            <input class="qty-input" type="number" v-model="item.quantity" />
          </td>

          <td class="text-right">
            {{ item.price * item.quantity }}
          </td>
          <td>
            <img
              src="/img/trash.png"
              class="action-icon action-icon--delete-small"
              alt=""
              @click="cartStore.remove(item._id)"
            />
          </td>
        </tr>
      </tbody>

      <tfoot>
        <tr>
          <td colspan="6">
            <div class="text-right">
              <hr />
              <strong>Grand Total : {{ cartStore.totalPrice }} </strong>
            </div>
          </td>
        </tr>
      </tfoot>
    </table>

    <TheButton
      class="w-100 mt-4"
      v-if="!enteringCustomerInfo"
      @click="enteringCustomerInfo = true"
    >
      Checkout
    </TheButton>

    <div v-if="enteringCustomerInfo" class="mt-4">
      <label for="" class="block">Customer Name</label>
      <input
        type="text"
        placeholder="Enter customer name"
        v-model="customer"
        class="w-100"
      />
      <label for="" class="block mt-4">Customer Phone</label>
      <input
        type="text"
        placeholder="Enter customer phone"
        v-model="phone"
        class="w-100"
      />
      <TheButton class="w-100 mt-4" @click="confirmNow" :loading="confirming">
        Confirm
      </TheButton>
    </div>
  </div>
</template>

<style>
.the-cart {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 11px 22px;
}

.the-cart__heading {
  font-size: 25px;
  font-weight: bold;
  border-bottom: 1px solid rgb(173, 173, 173);
}

.qty-input {
  width: 50px;
  padding: 5px 7px !important;
}

.action-icon--delete-small {
  height: 14px !important;
}
</style>
