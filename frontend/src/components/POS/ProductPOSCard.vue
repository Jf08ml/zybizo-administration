<template>
  <q-card
    class="product-card cursor-pointer"
    @click="$emit('add-to-cart', product)"
    :class="{ 'out-of-stock': !hasStock }"
    flat
    bordered
  >
    <!-- Imagen del producto compacta -->
    <div class="product-image-container">
      <q-img
        :src="productImage"
        :ratio="1"
        fit="cover"
        class="product-image"
        spinner-color="primary"
        loading="lazy"
      >
        <template v-slot:error>
          <div class="absolute-full flex flex-center bg-grey-3 text-grey-6">
            <q-icon name="image" size="24px" />
          </div>
        </template>
      </q-img>

      <!-- Badge de stock compacto -->
      <div class="absolute-top-right q-ma-xs">
        <q-badge
          :color="stockBadgeColor"
          :label="totalStock"
          class="text-weight-bold"
          style="font-size: 10px;"
        />
      </div>

      <!-- Indicador de variantes -->
      <div v-if="hasVariants" class="absolute-bottom-left q-ma-xs">
        <q-badge
          color="orange"
          icon="tune"
          class="text-weight-bold"
          style="font-size: 9px;"
        />
      </div>
    </div>

    <q-card-section class="q-pa-xs">
      <!-- Nombre del producto compacto -->
      <div class="text-subtitle2 text-weight-medium ellipsis" style="line-height: 1.2;">
        {{ product.name }}
      </div>

      <!-- Precio prominente -->
      <div class="text-h6 text-primary text-weight-bold q-mt-xs">
        ${{ formatPrice(displayPrice) }}
      </div>

      <!-- SKU solo si existe y es corto -->
      <div v-if="product.sku && product.sku.length <= 10" class="text-caption text-grey-6">
        {{ product.sku }}
      </div>
    </q-card-section>

    <!-- Overlay para productos sin stock -->
    <div v-if="!hasStock" class="absolute-full bg-grey-4 opacity-80 flex flex-center">
      <div class="text-center text-grey-8">
        <q-icon name="inventory_2" size="20px" />
        <div class="text-caption">Sin stock</div>
      </div>
    </div>

    <!-- Botón hover compacto -->
    <q-card-section class="absolute-full card-hover-overlay">
      <div class="flex flex-center full-height">
        <q-btn
          icon="add_shopping_cart"
          color="primary"
          round
          size="md"
          class="hover-button"
          :disable="!hasStock"
        />
      </div>
    </q-card-section>
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

const stockBadgeColor = computed(() => {
  if (!hasStock.value) return 'red'
  if (totalStock.value <= 5) return 'orange'
  return 'green'
})

const stockLabel = computed(() => {
  if (!hasStock.value) return '0'
  return totalStock.value.toString()
})

const stockText = computed(() => {
  if (!hasStock.value) return 'Producto agotado'
  return `${totalStock.value} unidades disponibles`
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
.product-card {
  position: relative;
  transition: all 0.2s ease;
  border: 1px solid $grey-4;
  height: 180px; // Altura fija más compacta

  &:hover {
    border-color: $primary;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);

    .card-hover-overlay {
      opacity: 1;
    }
  }

  &.out-of-stock {
    opacity: 0.7;

    &:hover {
      transform: none;
      border-color: $grey-4;
    }
  }
}

.product-image-container {
  position: relative;
  background: $grey-1;
  height: 120px; // Altura más compacta
}

.product-image {
  border-radius: 4px 4px 0 0;
}

.card-hover-overlay {
  opacity: 0;
  transition: opacity 0.2s ease;
  background: rgba(255, 255, 255, 0.95);
  border-radius: inherit;
  pointer-events: none;

  .hover-button {
    pointer-events: all;
  }
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-height: 2.4em;
}

// Responsive
@media (max-width: 768px) {
  .product-card {
    height: 160px;
  }

  .product-image-container {
    height: 100px;
  }
}
</style>
