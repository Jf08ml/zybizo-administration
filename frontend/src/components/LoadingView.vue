<template>
    <div v-if="loadingStore.isLoading" class="loading-overlay">
      <q-spinner color="primary" size="50px" />
    </div>
  </template>
  
  <script setup>
  import { loadingStore } from '../stores/loadingStore.js';
  
  // Importas el componente QSpinner de Quasar si estás utilizando Quasar Framework
  import { QSpinner } from 'quasar';
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
  