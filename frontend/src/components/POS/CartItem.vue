<template>
  <q-card class="cart-item" flat bordered>
    <q-card-section class="q-pa-sm">
      <div class="row q-col-gutter-sm">
        <!-- Imagen del producto -->
        <div class="col-auto">
          <q-avatar size="50px" square>
            <q-img
              :src="item.image || '/placeholder-product.png'"
              fit="cover"
            >
              <template v-slot:error>
                <div class="absolute-full flex flex-center bg-grey-3 text-grey-6">
                  <q-icon name="image" size="20px" />
                </div>
              </template>
            </q-img>
          </q-avatar>
        </div>

        <!-- Información del producto -->
        <div class="col">
          <div class="text-subtitle2 text-weight-medium">
            {{ item.name }}
          </div>

          <!-- Variante seleccionada -->
          <div v-if="item.selectedVariant" class="text-caption text-orange-8 text-weight-medium">
            {{ item.selectedVariant.optionLabel }}
          </div>

          <!-- SKU -->
          <div v-if="item.sku" class="text-caption text-grey-6">
            SKU: {{ item.sku }}
          </div>

          <!-- Precio y cantidad -->
          <div class="row items-center justify-between q-mt-xs">
            <div class="text-body2 text-primary text-weight-bold">
              ${{ displayPrice.toLocaleString() }}
            </div>

            <!-- Controles de cantidad -->
            <div class="row items-center q-gutter-xs">
              <q-btn
                icon="remove"
                size="sm"
                flat
                round
                color="grey-7"
                :disable="item.quantity <= 1"
                @click="updateQuantity(item.quantity - 1)"
              />

              <q-input
                v-model.number="localQuantity"
                type="number"
                min="1"
                max="999"
                style="width: 60px"
                outlined
                dense
                input-class="text-center"
                @update:model-value="onQuantityChange"
                @blur="validateQuantity"
              />

              <q-btn
                icon="add"
                size="sm"
                flat
                round
                color="grey-7"
                @click="updateQuantity(item.quantity + 1)"
              />
            </div>
          </div>

          <!-- Subtotal del item -->
          <div class="row items-center justify-between q-mt-xs">
            <div class="text-caption text-grey-6">
              Subtotal: ${{ itemSubtotal.toLocaleString() }}
            </div>

            <!-- Botón eliminar -->
            <q-btn
              icon="delete_outline"
              size="sm"
              flat
              round
              color="red-6"
              @click="confirmRemove"
            >
              <q-tooltip>Eliminar del carrito</q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useQuasar } from 'quasar'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['update-quantity', 'remove-item'])

const $q = useQuasar()

// Estado local
const localQuantity = ref(props.item.quantity)

// Computadas
const displayPrice = computed(() => {
  // Prioridad: precio de variante > precio del item > 0
  if (props.item.selectedVariant?.price) {
    return props.item.selectedVariant.price
  }
  return props.item.price || 0
})

const itemSubtotal = computed(() => {
  return displayPrice.value * props.item.quantity
})

// Watchers
watch(() => props.item.quantity, (newQuantity) => {
  localQuantity.value = newQuantity
})

// Métodos
function updateQuantity(newQuantity) {
  if (newQuantity >= 1 && newQuantity <= 999) {
    localQuantity.value = newQuantity
    emit('update-quantity', props.index, newQuantity)
  }
}

function onQuantityChange(value) {
  const quantity = parseInt(value) || 1
  if (quantity >= 1 && quantity <= 999) {
    emit('update-quantity', props.index, quantity)
  }
}

function validateQuantity() {
  if (localQuantity.value < 1) {
    localQuantity.value = 1
    emit('update-quantity', props.index, 1)
  } else if (localQuantity.value > 999) {
    localQuantity.value = 999
    emit('update-quantity', props.index, 999)
  }
}

function confirmRemove() {
  $q.dialog({
    title: 'Eliminar producto',
    message: `¿Quieres eliminar "${props.item.name}" del carrito?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    emit('remove-item', props.index)
  })
}
</script>

<style lang="scss" scoped>
.cart-item {
  border: 1px solid $grey-4;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: $grey-6;
  }
}
</style>
