import { defineStore } from "pinia";
import { reactive, computed } from "vue";

const initialProducts = JSON.parse(localStorage.getItem("products") || "{}");

export const useCartStore = defineStore("cart", () => {
  // State using reactive for deep reactivity
  const products = reactive(initialProducts);

  // Getter: Calculate total price
  const totalPrice = computed(() => {
    let total = 0;
    for (const key in products) {
      total += products[key].price * products[key].quantity;
    }
    return total;
  });

  // Actions
  const add = (payload) => {
    if (products[payload._id]) {
      products[payload._id].quantity += payload.quantity;
    } else {
      products[payload._id] = payload;
    }
    saveToLocalStorage();
  };

  const remove = (id) => {
    delete products[id];
    saveToLocalStorage();
  };

  const clearCart = () => {
    for (const key in products) {
      delete products[key];
    }
    saveToLocalStorage();
  };

  // Sync with localStorage
  const saveToLocalStorage = () => {
    localStorage.setItem("products", JSON.stringify(products));
  };

  return {
    products,
    totalPrice,
    add,
    remove,
    clearCart
  };
});
