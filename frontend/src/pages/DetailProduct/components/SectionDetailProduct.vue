<template>
  <div class="product-info">
    <!-- Título del producto -->
    <div class="product-header">
      <h1 class="product-title">{{ product.name || product.namePublic }}</h1>

      <!-- Stock badge -->
      <div class="product-meta row items-center q-gutter-sm q-mt-sm">
        <q-badge
          v-if="product.stock <= product.minStock && product.stock > 0"
          color="orange"
          label="Últimas unidades"
          class="q-px-sm"
        />
        <q-badge
          v-else-if="product.stock > product.minStock"
          color="positive"
          label="Disponible"
          class="q-px-sm"
        />
        <q-badge
          v-else
          color="negative"
          label="Agotado"
          class="q-px-sm"
        />
      </div>
    </div>

    <q-separator class="q-my-lg" />

    <!-- Precio -->
    <div class="price-section">
      <div class="current-price">
        <span class="price-label">Precio:</span>
        <span class="price-value">{{ formatPrice(displayPrice) }}</span>
      </div>

      <div v-if="hasWholesalePrice" class="wholesale-info q-mt-sm">
        <q-icon name="local_offer" color="black" size="1.2rem" />
        <span class="text-body2 text-grey-8">
          Al comprar <strong>{{ product.wholesaleQuantity }} o más unidades</strong>, obtienes un precio más económico:
          <span class="text-black text-weight-bold">{{ formatPrice(product.wholesalePrice) }}</span> c/u
        </span>
      </div>
    </div>

    <!-- Promoción mayorista -->
    <q-card v-if="product.isWholesaleMix" flat bordered class="promo-card q-mt-md">
      <q-card-section class="q-pa-md">
        <div class="row items-center">
          <q-icon name="campaign" color="black" size="2rem" class="q-mr-md" />
          <div>
            <div class="text-subtitle2 text-weight-bold">¡Promoción Especial!</div>
            <div class="text-body2 text-grey-8">
              Obtén precio <strong>MAYORISTA</strong> en pedidos superiores a <strong>$100.000</strong>
            </div>
            <div class="text-caption text-grey-6 q-mt-xs">
              *El descuento se aplica automáticamente en el carrito
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-separator class="q-my-lg" />

    <!-- Referencias/Variantes -->
    <div v-if="product?.references && product?.references.length > 0" class="references-section q-mb-lg">
      <div
        v-for="(reference, index) in product.references"
        :key="index"
        class="reference-group q-mb-md"
      >
        <div class="reference-label text-subtitle2 text-weight-medium q-mb-sm">
          {{ reference.name }}
        </div>
        <q-btn-toggle
          v-model="reference.selectedOption"
          @update:model-value="updateReferenceOption(index, $event)"
          toggle-color="black"
          color="white"
          text-color="grey-8"
          unelevated
          no-caps
          class="reference-toggle full-width"
          :options="
            reference.options.map((option) => ({
              label: option.label,
              value: option.value,
              disable: option.stocks === 0,
            }))
          "
        />
      </div>
    </div>

    <!-- Cantidad -->
    <div class="quantity-section q-mb-lg">
      <div class="text-subtitle2 text-weight-medium q-mb-sm">Cantidad</div>
      <div class="quantity-selector">
        <q-btn
          round
          flat
          icon="remove"
          color="grey-7"
          @click="changeQuantity(-1)"
          :disable="quantity <= 1"
        />
        <q-input
          v-model.number="quantity"
          type="number"
          min="1"
          dense
          borderless
          input-class="text-center text-h6"
          style="width: 80px"
          @update:model-value="updateQuantity"
        />
        <q-btn
          round
          flat
          icon="add"
          color="grey-7"
          @click="changeQuantity(1)"
        />
      </div>
    </div>

    <!-- Botones de acción -->
    <div class="action-buttons">
      <q-btn
        unelevated
        no-caps
        color="black"
        label="Comprar ahora"
        icon="shopping_bag"
        size="lg"
        class="full-width q-mb-sm btn-black"
        @click="buyItem"
      />
      <q-btn
        outline
        no-caps
        color="black"
        label="Añadir al carrito"
        icon="add_shopping_cart"
        size="lg"
        class="full-width btn-outline-black"
        @click="addCar"
      />
    </div>

    <!-- Información adicional -->
    <div class="additional-info q-mt-lg">
      <q-list dense bordered separator class="rounded-borders">
        <q-item>
          <q-item-section avatar>
            <q-icon name="verified" color="positive" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-caption">Producto original</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section avatar>
            <q-icon name="local_shipping" color="primary" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-caption">Envío a todo el país</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section avatar>
            <q-icon name="support_agent" color="orange" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-caption">Soporte 24/7</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { formatPrice } from "src/utils/utilsFunctions";

const props = defineProps({
  product: Object,
  totalPrice: Number,
});

const emit = defineEmits([
  "buy-item",
  "add-car",
  "update-reference-option",
  "update-quantity",
  "update-buy-wholesale",
]);

const quantity = ref(1);
const buyWholesale = ref(false);

// Computed para verificar si tiene precio al por mayor válido
const hasWholesalePrice = computed(() => {
  return props.product?.wholesalePrice &&
         props.product.wholesalePrice > 0 &&
         props.product.wholesalePrice < props.product.salePrice &&
         props.product.wholesaleQuantity > 0;
});

// Computed para el precio a mostrar (precio de venta por defecto)
const displayPrice = computed(() => {
  return props.product?.salePrice || 0;
});

const buyItem = () => {
  emit("buy-item", { quantity: quantity.value, buyWholesale });
};

const addCar = () => {
  emit("add-car", { quantity: quantity.value, buyWholesale });
};

const changeQuantity = (increment) => {
  if (increment === 1) {
    quantity.value++;
    emit("update-quantity", quantity.value);
  } else if (increment === -1 && quantity.value > 1) {
    quantity.value--;
    emit("update-quantity", quantity.value);
  }
};

const updateReferenceOption = (referenceIndex, selectedOption) => {
  emit("update-reference-option", { referenceIndex, selectedOption });
};

const updateQuantity = () => {
  emit("update-quantity", quantity.value);
};
watch(quantity, (newValue, oldValue) => {
  if (newValue <= 1) {
    quantity.value = 1;
  }
});

watch(buyWholesale, (newValue, oldValue) => {
  emit("update-buy-wholesale", newValue);
});
</script>

<style lang="scss" scoped>
.product-info {
  height: 100%;
}

.product-header {
  .product-title {
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 1.3;
    margin: 0;
    color: #1a1a1a;
  }

  .product-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
}

.price-section {
  .current-price {
    display: flex;
    align-items: baseline;
    gap: 12px;

    .price-label {
      font-size: 1rem;
      color: #666;
    }

    .price-value {
      font-size: 2rem;
      font-weight: 700;
      color: #000000;
    }
  }

  .wholesale-info {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 12px 16px;
    background: #f5f5f5;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
  }
}

.promo-card {
  border-radius: 12px;
  border: 2px solid #000000;
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
}

.references-section {
  .reference-group {
    .reference-label {
      color: #1a1a1a;
      margin-bottom: 8px;
    }

    .reference-toggle {
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      display: flex;
      width: 100%;

      :deep(.q-btn) {
        flex: 1;
        min-width: 0;
      }
    }
  }
}

.quantity-section {
  .quantity-selector {
    display: inline-flex;
    align-items: center;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 4px;
    background: white;
  }
}

.action-buttons {
  margin-top: 24px;

  .q-btn {
    border-radius: 8px;
    padding: 12px 24px;
    font-weight: 600;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }

  .btn-black {
    background: #000000 !important;
    color: white !important;

    &:hover {
      background: #333333 !important;
    }
  }

  .btn-outline-black {
    border: 2px solid #000000 !important;
    color: #000000 !important;

    &:hover {
      background: #000000 !important;
      color: white !important;
    }
  }
}

.additional-info {
  .q-list {
    background: #f8f9fa;
    border: none;
  }

  .q-item {
    padding: 12px 16px;
  }
}

// Responsive
@media (max-width: 1023px) {
  .product-info {
    padding: 0;
  }

  .price-section {
    .wholesale-info {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }
  }
}

@media (max-width: 599px) {
  .product-info {
    padding: 0;
  }

  .product-header {
    .product-title {
      font-size: 1.25rem;
      line-height: 1.4;
    }

    .product-meta {
      margin-top: 12px;
    }
  }

  .price-section {
    .current-price {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;

      .price-label {
        font-size: 0.875rem;
      }

      .price-value {
        font-size: 1.75rem;
      }
    }

    .wholesale-info {
      padding: 10px 12px;
      font-size: 0.875rem;
    }
  }

  .promo-card {
    .q-card-section {
      padding: 12px;
    }

    .row {
      flex-direction: column;
      align-items: flex-start;
    }

    .q-icon {
      margin-bottom: 8px;
      margin-right: 0 !important;
    }

    .text-subtitle2 {
      font-size: 0.9rem;
    }

    .text-body2 {
      font-size: 0.85rem;
    }
  }

  .references-section {
    .reference-group {
      .reference-label {
        font-size: 0.9rem;
      }

      .reference-toggle {
        :deep(.q-btn) {
          font-size: 0.8rem;
          padding: 6px 10px;
          min-height: 36px;
        }
      }
    }
  }

  .quantity-section {
    .text-subtitle2 {
      font-size: 0.9rem;
    }

    .quantity-selector {
      padding: 2px;

      .q-input {
        width: 60px !important;
      }

      :deep(.text-h6) {
        font-size: 1rem;
      }
    }
  }

  .action-buttons {
    margin-top: 20px;

    .q-btn {
      padding: 10px 16px;
      font-size: 0.9rem;

      &:hover {
        transform: none;
      }
    }
  }

  .additional-info {
    margin-top: 16px;

    .q-item {
      padding: 10px 12px;
    }

    .q-icon {
      font-size: 1.2rem;
    }

    .text-caption {
      font-size: 0.8rem;
    }
  }

  // Ajustar separadores
  .q-separator {
    margin-top: 16px;
    margin-bottom: 16px;
  }
}
</style>
