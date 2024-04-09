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
  },
});
