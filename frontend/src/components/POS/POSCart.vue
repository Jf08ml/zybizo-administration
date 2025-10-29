<template>
  <q-card class="pos-cart full-height">
    <!-- Header del carrito -->
    <q-card-section class="q-pb-sm">
      <div class="row items-center justify-between">
        <div class="text-h6">Carrito</div>
        <q-btn
          v-if="cartStore.hasItems"
          icon="clear_all"
          size="sm"
          flat
          round
          color="grey-7"
          @click="clearCart"
        >
          <q-tooltip>Limpiar carrito</q-tooltip>
        </q-btn>
      </div>

      <!-- Resumen rápido -->
      <div class="row items-center justify-between q-mt-sm">
        <div class="text-caption text-grey-6">
          {{ cartStore.itemCount }} {{ cartStore.itemCount === 1 ? 'artículo' : 'artículos' }}
        </div>
        <div class="text-weight-bold text-primary">
          ${{ cartStore.total.toLocaleString() }}
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <!-- Lista de items del carrito -->
    <q-card-section class="cart-items-container q-pa-sm">
      <div v-if="!cartStore.hasItems" class="flex flex-center full-height text-grey-6">
        <div class="text-center">
          <q-icon name="shopping_cart" size="60px" class="q-mb-md" />
          <div class="text-h6">Carrito vacío</div>
          <div>Agrega productos para comenzar</div>
        </div>
      </div>

      <div v-else class="column q-gutter-sm">
        <CartItem
          v-for="(item, index) in cartStore.items"
          :key="`${item.product}-${item.selectedVariant?.referenceName || 'no-variant'}-${item.selectedVariant?.optionValue || 'no-value'}`"
          :item="item"
          :index="index"
          @update-quantity="updateQuantity"
          @remove-item="removeItem"
        />
      </div>
    </q-card-section>

    <!-- Resumen de totales -->
    <div v-if="cartStore.hasItems">
      <q-separator />

      <q-card-section class="q-py-sm">
        <!-- Subtotal -->
        <div class="row justify-between items-center q-mb-xs">
          <span class="text-body2">Subtotal:</span>
          <span class="text-weight-medium">${{ cartStore.subtotal.toLocaleString() }}</span>
        </div>

        <!-- Descuento -->
        <div v-if="cartStore.discount > 0" class="row justify-between items-center q-mb-xs">
          <span class="text-body2 text-orange-8">Descuento ({{ cartStore.discount }}%):</span>
          <span class="text-weight-medium text-orange-8">-${{ cartStore.discountAmount.toLocaleString() }}</span>
        </div>

        <!-- Envío -->
        <div v-if="cartStore.shippingCost > 0" class="row justify-between items-center q-mb-xs">
          <span class="text-body2">Envío:</span>
          <span class="text-weight-medium">${{ cartStore.shippingCost.toLocaleString() }}</span>
        </div>

        <q-separator class="q-my-sm" />

        <!-- Total -->
        <div class="row justify-between items-center">
          <span class="text-h6 text-weight-bold">Total:</span>
          <span class="text-h6 text-weight-bold text-primary">${{ cartStore.total.toLocaleString() }}</span>
        </div>
      </q-card-section>
    </div>

    <!-- Acciones del carrito -->
    <div v-if="cartStore.hasItems" class="q-pa-md">
      <!-- Configuración rápida -->
      <div class="row q-col-gutter-sm q-mb-sm">
        <div class="col-6">
          <q-input
            v-model.number="discountInput"
            label="Descuento %"
            type="number"
            min="0"
            max="100"
            outlined
            dense
            @update:model-value="updateDiscount"
          />
        </div>
        <div class="col-6">
          <q-input
            v-model.number="shippingInput"
            label="Envío"
            type="number"
            min="0"
            outlined
            dense
            @update:model-value="updateShipping"
          />
        </div>
      </div>

      <!-- Método de pago -->
      <q-select
        v-model="cartStore.paymentMethod"
        :options="paymentMethods"
        label="Método de pago"
        outlined
        dense
        emit-value
        map-options
        class="q-mb-sm"
      />

      <!-- Botón de checkout -->
      <q-btn
        :label="cartStore.hasItems ? 'Procesar Orden' : 'Carrito vacío'"
        color="primary"
        size="lg"
        class="full-width"
        :disable="!cartStore.isValidOrder"
        @click="showCheckout = true"
      />
    </div>

    <!-- Dialog de checkout -->
    <q-dialog v-model="showCheckout" persistent>
      <CheckoutDialogNew
        @order-completed="onOrderCompleted"
        @cancel="showCheckout = false"
      />
    </q-dialog>
  </q-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useCartStore } from 'src/stores/cartStore'
import CartItem from './CartItem.vue'
import CheckoutDialogNew from './CheckoutDialogNew.vue'

const emit = defineEmits(['order-completed'])

const $q = useQuasar()
const cartStore = useCartStore()

// Estado local
const showCheckout = ref(false)
const discountInput = ref(0)
const shippingInput = ref(0)

// Opciones de pago
const paymentMethods = [
  { label: 'Efectivo', value: 'cash' },
  { label: 'Tarjeta de Débito', value: 'debit_card' },
  { label: 'Tarjeta de Crédito', value: 'credit_card' },
  { label: 'Transferencia', value: 'transfer' },
  { label: 'QR/Digital', value: 'digital' }
]

// Métodos
function updateQuantity(index, quantity) {
  cartStore.updateQuantity(index, quantity)
}

function removeItem(index) {
  cartStore.removeItem(index)

  $q.notify({
    type: 'info',
    message: 'Producto eliminado del carrito',
    position: 'top-right',
    timeout: 1500
  })
}

function clearCart() {
  $q.dialog({
    title: 'Limpiar carrito',
    message: '¿Estás seguro de que quieres eliminar todos los productos del carrito?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    cartStore.clearCart()
    discountInput.value = 0
    shippingInput.value = 0

    $q.notify({
      type: 'info',
      message: 'Carrito limpiado',
      position: 'top-right',
      timeout: 1500
    })
  })
}

function updateDiscount(value) {
  cartStore.setDiscount(value || 0)
}

function updateShipping(value) {
  cartStore.setShippingCost(value || 0)
}

function onOrderCompleted() {
  showCheckout.value = false
  discountInput.value = 0
  shippingInput.value = 0

  // Emitir evento al componente padre para recargar productos
  emit('order-completed')

  $q.notify({
    type: 'positive',
    message: 'Orden procesada exitosamente',
    position: 'top-right',
    timeout: 3000
  })
}
</script>

<style lang="scss" scoped>
.pos-cart {
  display: flex;
  flex-direction: column;

  .cart-items-container {
    flex: 1;
    overflow-y: auto;
    max-height: calc(100vh - 400px);
  }
}
</style>
