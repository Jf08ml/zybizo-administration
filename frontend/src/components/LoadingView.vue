<template>
    <div v-if="loadingStore.isLoading" class="loading-overlay">
      <q-spinner-puff  color="pink" size="5.5em" />
    </div>
  </template>
  
  <script setup>
  import { loadingStore } from '../stores/loadingStore.js';

  </script>
  
  <style>
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.5);
    z-index: 9999;
  }
  </style>
  