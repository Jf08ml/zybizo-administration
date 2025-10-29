<template>
  <q-card
    class="product-row cursor-pointer q-mb-xs"
    @click="$emit('add-to-cart', product)"
    :class="{ 'out-of-stock': !hasStock }"
    flat
    bordered
  >
    <q-card-section class="row items-center q-pa-sm q-col-gutter-sm">
      <!-- Imagen más pequeña -->
      <div class="col-auto">
        <q-avatar size="50px" square>
          <q-img
            :src="productImage"
            fit="cover"
            spinner-color="primary"
          >
            <template v-slot:error>
              <div class="absolute-full flex flex-center bg-grey-3 text-grey-6">
                <q-icon name="image" size="20px" />
              </div>
            </template>
          </q-img>
        </q-avatar>
      </div>

      <!-- Información del producto compacta -->
      <div class="col">
        <div class="row items-center justify-between">
          <div class="col-8">
            <div class="text-subtitle2 text-weight-medium ellipsis">
              {{ product.name }}
            </div>
            <div class="row items-center q-gutter-sm">
              <div class="text-caption text-grey-6">
                <q-badge
                  :color="stockBadgeColor"
                  :label="`${totalStock} und`"
                  style="font-size: 10px;"
                />
              </div>
              <div v-if="hasVariants" class="text-caption text-orange-8">
                <q-icon name="tune" size="xs" />
                Var.
              </div>
            </div>
          </div>

          <!-- Precio y acción -->
          <div class="col-4 text-right">
            <div class="text-h6 text-primary text-weight-bold">
              ${{ formatPrice(displayPrice) }}
            </div>
            <q-btn
              icon="add_shopping_cart"
              color="primary"
              round
              size="sm"
              :disable="!hasStock"
              @click.stop="$emit('add-to-cart', product)"
            />
          </div>
        </div>
      </div>
    </q-card-section>

    <!-- Overlay para productos sin stock -->
    <div v-if="!hasStock" class="absolute-full bg-grey-4 opacity-60 flex flex-center">
      <div class="text-center text-grey-8">
        <q-icon name="inventory_2" size="16px" />
        <span class="text-caption q-ml-xs">Sin stock</span>
      </div>
    </div>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

defineEmits(['add-to-cart'])

// Computadas
const productImage = computed(() => {
  return props.product.images?.[0] || '/placeholder-product.png'
})

const hasVariants = computed(() => {
  return props.product.references && props.product.references.length > 0
})

const hasStock = computed(() => {
  // Siempre verificar el stock general del producto
  return props.product.stock > 0
})

const totalStock = computed(() => {
  // Siempre usar el campo stock del producto, no sumar variantes
  return props.product.stock || 0
})

const displayPrice = computed(() => {
  // Obtener precio base del producto
  const basePrice = props.product.salePrice || props.product.basePrice || props.product.price || 0

  if (hasVariants.value) {
    // Mostrar rango de precios o precio base
    const prices = []

    props.product.references.forEach(ref => {
      ref.options?.forEach(option => {
        if (option.price) prices.push(option.price)
      })
    })

    if (prices.length > 0) {
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)
      return minPrice === maxPrice ? minPrice : `${minPrice} - ${maxPrice}`
    }
  }

  return basePrice
})

const stockText = computed(() => {
  if (!hasStock.value) return 'Sin stock'
  return `${totalStock.value} unidades`
})

const stockTextColor = computed(() => {
  if (!hasStock.value) return 'text-red-6'
  if (totalStock.value <= 5) return 'text-orange-6'
  return 'text-green-6'
})

// Métodos
function formatPrice(price) {
  if (typeof price === 'string' && price.includes(' - ')) {
    return price
  }
  return typeof price === 'number' ? price.toLocaleString() : '0'
}
</script>

<style lang="scss" scoped>
.product-row {
  position: relative;
  transition: all 0.2s ease;
  border: 1px solid $grey-4;
  height: 70px; // Altura fija más compacta

  &:hover {
    border-color: $primary;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  &.out-of-stock {
    opacity: 0.7;

    &:hover {
      border-color: $grey-4;
    }
  }
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// Responsive
@media (max-width: 768px) {
  .product-row {
    height: 60px;
  }
}
</style>
