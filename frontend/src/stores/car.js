import { defineStore } from "pinia";

export const useCarStore = defineStore("car", {
  state: () => ({
    car: 0,
    items: [],
    order: [],
  }),
  getters: {},
  actions: {
    setCar(item) {
      this.$state.car++;
      this.items.push(item);
    },
    setOrder(order) {
      this.order.push(order);
    },
    removeFromItems(itemId) {
      console.log(itemId)
      const index = this.items.findIndex((item) => item._id === itemId);
      if (index !== -1) {
        this.items.splice(index, 1);
        this.$state.car--;
      }
    },
    removeFromOrder(orderId) {
      const index = this.order.findIndex((order) => order._id === orderId);
      if (index !== -1) {
        this.order.splice(index, 1);
      }
    },
  },
});
