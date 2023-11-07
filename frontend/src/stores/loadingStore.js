// loadingStore.js
import { reactive } from 'vue';

export const loadingStore = reactive({
  isLoading: false
});

export function showLoading() {
  loadingStore.isLoading = true;
}

export function hideLoading() {
  loadingStore.isLoading = false;
}
