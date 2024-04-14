import { defineStore } from "pinia";

export const useCarStore = defineStore("car", {
  state: () => ({
    itemCount: JSON.parse(localStorage.getItem("items"))?.length || 0,
    items: JSON.parse(localStorage.getItem("items")) || [],
    order: [],
  }),
  actions: {
    addItem(item) {
      this.itemCount++;
      this.items.push(item);
      localStorage.setItem("items", JSON.stringify(this.items));
    },
    addOrder(order) {
      this.order.push(order);
    },
    removeItem(index) {
      if (index !== -1) {
        this.items.splice(index, 1);
        this.itemCount--;
        localStorage.setItem("items", JSON.stringify(this.items));
      }
      console.log(this.items);
    },
    removeOrder(orderId) {
      const index = this.order.findIndex((order) => order._id === orderId);
      if (index !== -1) {
        this.order.splice(index, 1);
      }
    },
  },
});
