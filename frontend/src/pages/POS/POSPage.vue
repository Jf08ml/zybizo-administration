<template>
  <q-page class="pos-page">
    <div class="row no-wrap full-height">
      <!-- Panel izquierdo - Productos y categorías -->
      <div class="col-8 products-panel">
        <q-card flat class="full-height">
          <q-card-section class="q-pa-sm">
            <div class="row items-center justify-between q-mb-sm">
              <div class="text-h6 text-grey-8">
                Productos
                <q-chip
                  v-if="loading"
                  size="sm"
                  color="orange"
                  text-color="white"
                  icon="sync"
                  class="q-ml-sm"
                >
                  Actualizando...
                </q-chip>
              </div>
              <div class="row q-gutter-xs">
                <q-btn
                  icon="refresh"
                  size="sm"
                  dense
                  flat
                  color="grey-6"
                  @click="refreshProducts"
                  :loading="loading"
                >
                  <q-tooltip>Actualizar stock</q-tooltip>
                </q-btn>
                <q-btn-group flat>
                  <q-btn
                    :color="viewMode === 'grid' ? 'primary' : 'grey-6'"
                    :unelevated="viewMode === 'grid'"
                    icon="grid_view"
                    @click="viewMode = 'grid'"
                    size="sm"
                    dense
                  />
                  <q-btn
                    :color="viewMode === 'list' ? 'primary' : 'grey-6'"
                    :unelevated="viewMode === 'list'"
                    icon="view_list"
                    @click="viewMode = 'list'"
                    size="sm"
                    dense
                  />
                </q-btn-group>
              </div>
            </div>

            <!-- Filtros compactos -->
            <div class="row q-col-gutter-xs">
              <div class="col-7">
                <q-input
                  v-model="searchQuery"
                  placeholder="Buscar productos..."
                  debounce="300"
                  outlined
                  dense
                  clearable
                  class="compact-input"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" size="sm" />
                  </template>
                </q-input>
              </div>
              <div class="col-5">
                <q-select
                  v-model="selectedCategory"
                  :options="categoryOptions"
                  placeholder="Categoría"
                  outlined
                  dense
                  emit-value
                  map-options
                  clearable
                  class="compact-input"
                />
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <!-- Lista de productos -->
          <q-card-section class="q-pa-xs products-container">
            <div v-if="loading" class="flex flex-center q-pa-md">
              <q-spinner-dots size="40px" color="primary" />
            </div>

            <div v-else-if="filteredProducts.length === 0" class="flex flex-center q-pa-md text-grey-6">
              <div class="text-center">
                <q-icon name="inventory_2" size="48px" class="q-mb-sm" />
                <div class="text-subtitle1">No hay productos</div>
                <div class="text-caption">Ajusta los filtros</div>
              </div>
            </div>

            <!-- Vista en grid compacta -->
            <div v-else-if="viewMode === 'grid'" class="row q-col-gutter-xs">
              <div
                v-for="product in filteredProducts"
                :key="product._id"
                class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-6"
              >
                <ProductPOSCard
                  :product="product"
                  @add-to-cart="addToCart"
                />
              </div>
            </div>

            <!-- Vista en lista compacta -->
            <div v-else class="column q-gutter-xs">
              <ProductPOSRow
                v-for="product in filteredProducts"
                :key="product._id"
                :product="product"
                @add-to-cart="addToCart"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Panel derecho - Carrito y checkout -->
      <div class="col-4 cart-panel">
        <POSCart @order-completed="onOrderCompleted" />
      </div>
    </div>

    <!-- Dialog mejorado para seleccionar variante -->
    <q-dialog v-model="showVariantDialog" persistent maximized>
      <q-card class="variant-dialog">
        <q-card-section class="row items-center q-pb-none">
          <div class="col">
            <div class="text-h6">{{ selectedProduct?.name }}</div>
            <div class="text-subtitle2 text-grey-7">Seleccionar características</div>
          </div>
          <q-btn
            icon="close"
            flat
            round
            dense
            @click="closeVariantDialog"
          />
        </q-card-section>

        <q-separator />

        <q-card-section class="row q-col-gutter-md" style="height: calc(100vh - 140px)">
          <!-- Panel izquierdo - Selección de variantes -->
          <div class="col-7">
            <q-scroll-area class="full-height">
              <div v-if="selectedProduct?.references" class="q-pa-md">
                <div v-for="reference in selectedProduct.references" :key="reference.name" class="q-mb-xl">
                  <div class="text-subtitle1 q-mb-md text-weight-medium">
                    {{ reference.name }}
                    <q-chip
                      v-if="!selectedVariants[reference.name]"
                      size="sm"
                      color="orange"
                      text-color="white"
                      class="q-ml-sm"
                    >
                      Requerido
                    </q-chip>
                    <q-chip
                      v-else
                      size="sm"
                      color="green"
                      text-color="white"
                      class="q-ml-sm"
                    >
                      ✓ {{ selectedVariants[reference.name] }}
                    </q-chip>
                  </div>

                  <div class="row q-col-gutter-sm">
                    <div
                      v-for="option in reference.options"
                      :key="option.value"
                      class="col-auto"
                    >
                      <q-card
                        flat
                        bordered
                        :class="{
                          'bg-primary text-white': isSelectedVariant(reference.name, option.value),
                          'bg-grey-1': !isSelectedVariant(reference.name, option.value),
                          'option-disabled': option.stocks === 0
                        }"
                        class="option-card cursor-pointer"
                        @click="selectVariant(reference.name, option.value, option.price)"
                      >
                        <q-card-section class="q-pa-sm text-center">
                          <div class="text-weight-medium">{{ option.value }}</div>
                          <div v-if="option.price" class="text-caption">
                            ${{ option.price.toLocaleString() }}
                          </div>
                          <div class="text-caption">
                            <span v-if="option.stocks === 0" class="text-red">Sin stock</span>
                            <span v-else class="text-grey-6">{{ option.stocks }} disponibles</span>
                          </div>
                        </q-card-section>
                      </q-card>
                    </div>
                  </div>
                </div>
              </div>
            </q-scroll-area>
          </div>

          <!-- Panel derecho - Resumen y acciones -->
          <div class="col-5">
            <q-card flat bordered class="full-height">
              <q-card-section>
                <div class="text-subtitle1 text-weight-bold q-mb-md">Resumen de selección</div>

                <div v-if="selectedVariantLabel" class="q-mb-md">
                  <q-card flat class="bg-blue-1 q-pa-md">
                    <div class="text-subtitle2 text-weight-medium q-mb-xs">Configuración actual:</div>
                    <div class="text-body2">{{ selectedVariantLabel }}</div>
                    <div class="text-h6 text-primary text-weight-bold q-mt-sm">
                      ${{ selectedVariantPrice.toLocaleString() }}
                    </div>
                  </q-card>
                </div>

                <div v-else class="q-mb-md">
                  <q-banner class="bg-orange-1 text-orange-8">
                    <template v-slot:avatar>
                      <q-icon name="tune" />
                    </template>
                    Selecciona una opción para cada característica
                  </q-banner>
                </div>

                <!-- Cantidad a agregar -->
                <div class="q-mb-md">
                  <q-input
                    v-model.number="quantityToAdd"
                    label="Cantidad"
                    type="number"
                    outlined
                    dense
                    min="1"
                    :max="getMaxQuantity()"
                  >
                    <template v-slot:prepend>
                      <q-icon name="shopping_cart" />
                    </template>
                  </q-input>
                </div>

                <!-- Historial de agregados -->
                <div v-if="variantHistory.length > 0" class="q-mb-md">
                  <div class="text-subtitle2 q-mb-sm">Agregados al carrito:</div>
                  <q-list dense bordered>
                    <q-item
                      v-for="(item, index) in variantHistory"
                      :key="index"
                      class="q-pa-xs"
                    >
                      <q-item-section>
                        <q-item-label class="text-caption">{{ item.label }}</q-item-label>
                        <q-item-label caption>Cant: {{ item.quantity }} × ${{ item.price.toLocaleString() }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </q-card-section>

              <q-separator />

              <q-card-actions class="q-pa-md">
                <q-btn
                  label="Agregar"
                  color="primary"
                  icon="add_shopping_cart"
                  :disable="!isValidVariantSelection"
                  @click="confirmAddToCart(false)"
                  class="full-width q-mb-sm"
                />

                <div class="row q-gutter-sm full-width">
                  <q-btn
                    label="Agregar y continuar"
                    color="positive"
                    outline
                    icon="add"
                    :disable="!isValidVariantSelection"
                    @click="confirmAddToCart(true)"
                    class="col"
                    size="sm"
                  />
                  <q-btn
                    label="Finalizar"
                    color="grey-7"
                    outline
                    icon="done"
                    @click="closeVariantDialog"
                    class="col"
                    size="sm"
                  />
                </div>
              </q-card-actions>
            </q-card>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useCartStore } from 'src/stores/cartStore'
import { getProducts } from 'src/services/productService'
import { getCategories } from 'src/services/categoryService'
import ProductPOSCard from 'src/components/POS/ProductPOSCard.vue'
import ProductPOSRow from 'src/components/POS/ProductPOSRow.vue'
import POSCart from 'src/components/POS/POSCart.vue'

const $q = useQuasar()
const cartStore = useCartStore()

// Estado reactivo
const loading = ref(false)
const products = ref([])
const categories = ref([])
const searchQuery = ref('')
const selectedCategory = ref(null)
const viewMode = ref('grid')

// Dialog de variantes
const showVariantDialog = ref(false)
const selectedProduct = ref(null)
const selectedVariants = ref({})
const quantityToAdd = ref(1)
const variantHistory = ref([])

// Computadas
const categoryOptions = computed(() => {
  return categories.value.map(cat => ({
    label: cat.name,
    value: cat._id
  }))
})

const isValidVariantSelection = computed(() => {
  if (!selectedProduct.value?.references) return true

  // Verificar que se haya seleccionado una opción para cada referencia
  return selectedProduct.value.references.every(reference =>
    selectedVariants.value[reference.name]
  )
})

const selectedVariantPrice = computed(() => {
  // Obtener precio base del producto
  const basePrice = selectedProduct.value?.salePrice || selectedProduct.value?.basePrice || 0

  if (!selectedProduct.value?.references || Object.keys(selectedVariants.value).length === 0) {
    return basePrice
  }

  // Calcular precio basado en las selecciones
  let totalPrice = basePrice

  selectedProduct.value.references.forEach(reference => {
    const selectedOptionValue = selectedVariants.value[reference.name]
    if (selectedOptionValue) {
      const option = reference.options?.find(opt => opt.value === selectedOptionValue)
      if (option?.price) {
        totalPrice = option.price // O sumar si es aditivo: totalPrice += option.price
      }
    }
  })

  return totalPrice
})

const selectedVariantLabel = computed(() => {
  if (Object.keys(selectedVariants.value).length === 0) return ''

  return Object.entries(selectedVariants.value)
    .map(([refName, optionValue]) => `${refName}: ${optionValue}`)
    .join(', ')
})

const filteredProducts = computed(() => {
  let filtered = products.value

  // Filtro por búsqueda
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.sku?.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query)
    )
  }

  // Filtro por categoría
  if (selectedCategory.value) {
    filtered = filtered.filter(product =>
      product.category?._id === selectedCategory.value
    )
  }

  // Solo productos activos y con stock
  filtered = filtered.filter(product =>
    product.isActive && product.stock > 0
  )

  return filtered
})

// Métodos
function addToCart(product, variant = null) {
  console.log('POSPage addToCart called:', {
    productName: product.name,
    productId: product._id,
    basePrice: product.basePrice,
    salePrice: product.salePrice,
    hasReferences: !!(product.references && product.references.length > 0),
    variant: variant
  })

  if (product.references && product.references.length > 0 && !variant) {
    // Abrir dialog para seleccionar variantes
    selectedProduct.value = product
    selectedVariants.value = {}
    quantityToAdd.value = 1
    variantHistory.value = []
    showVariantDialog.value = true

    // Opcional: Actualizar stock del producto específico cuando se abre el modal
    // para asegurar datos más recientes en productos con alta rotación
    updateSingleProductStock(product._id)
  } else {
    // Agregar directamente al carrito
    console.log('POSPage: Adding simple product to cart')
    cartStore.addItem(product, variant)

    $q.notify({
      type: 'positive',
      message: `${product.name} agregado al carrito`,
      position: 'top-right',
      timeout: 1500
    })
  }
}function selectVariant(referenceName, optionValue, price) {
  const reference = selectedProduct.value.references.find(ref => ref.name === referenceName)
  const option = reference?.options?.find(opt => opt.value === optionValue)

  if (option && option.stocks > 0) {
    // Actualizar la selección para esta referencia específica
    selectedVariants.value[referenceName] = optionValue
  }
}

function isSelectedVariant(referenceName, optionValue) {
  return selectedVariants.value[referenceName] === optionValue
}

function confirmAddToCart(continueAdding = false) {
  if (selectedProduct.value && isValidVariantSelection.value) {
    const quantity = quantityToAdd.value || 1

    // Crear objeto de variante combinada
    const combinedVariant = {
      selections: { ...selectedVariants.value },
      optionLabel: selectedVariantLabel.value,
      price: selectedVariantPrice.value
    }

    // Agregar al carrito la cantidad especificada
    for (let i = 0; i < quantity; i++) {
      cartStore.addItem(selectedProduct.value, combinedVariant)
    }

    // Agregar al historial
    variantHistory.value.push({
      label: selectedVariantLabel.value,
      quantity: quantity,
      price: selectedVariantPrice.value
    })

    $q.notify({
      type: 'positive',
      message: `${quantity}x ${selectedProduct.value.name} (${selectedVariantLabel.value}) agregado al carrito`,
      position: 'top-right',
      timeout: 2000
    })

    if (continueAdding) {
      // Limpiar selección para continuar agregando
      selectedVariants.value = {}
      quantityToAdd.value = 1
    } else {
      closeVariantDialog()
    }
  } else {
    $q.notify({
      type: 'warning',
      message: 'Por favor selecciona una opción para cada característica del producto',
      position: 'top-right',
      timeout: 2000
    })
  }
}

function getMaxQuantity() {
  if (!selectedProduct.value?.references || Object.keys(selectedVariants.value).length === 0) {
    return selectedProduct.value?.stock || 1
  }

  // Encontrar el stock mínimo entre las opciones seleccionadas
  let minStock = selectedProduct.value.stock

  selectedProduct.value.references.forEach(reference => {
    const selectedOptionValue = selectedVariants.value[reference.name]
    if (selectedOptionValue) {
      const option = reference.options?.find(opt => opt.value === selectedOptionValue)
      if (option && option.stocks < minStock) {
        minStock = option.stocks
      }
    }
  })

  return Math.max(1, minStock)
}function closeVariantDialog() {
  showVariantDialog.value = false
  selectedProduct.value = null
  selectedVariants.value = {}
  quantityToAdd.value = 1
  variantHistory.value = []
}

async function loadProducts(showUpdatedNotification = false) {
  loading.value = true

  try {
    console.log('POS: Starting to load products...')
    const response = await getProducts()
    console.log('POS: Raw response from getProducts:', response)

    // Ser más flexible con la estructura de respuesta
    if (response) {
      // Intentar extraer los datos de diferentes estructuras posibles
      let productsData = null

      if (response.data && Array.isArray(response.data)) {
        productsData = response.data
      } else if (Array.isArray(response)) {
        productsData = response
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        productsData = response.data.data
      }

      if (productsData) {
        // Si es una actualización, detectar cambios en el stock
        const stockChanges = []
        if (showUpdatedNotification && products.value.length > 0) {
          productsData.forEach(newProduct => {
            const oldProduct = products.value.find(p => p._id === newProduct._id)
            if (oldProduct && oldProduct.stock !== newProduct.stock) {
              stockChanges.push({
                name: newProduct.name,
                oldStock: oldProduct.stock,
                newStock: newProduct.stock,
                difference: newProduct.stock - oldProduct.stock
              })
            }
          })
        }

        products.value = productsData
        console.log('POS: Products loaded successfully:', productsData.length, 'products')

        // Mostrar notificación de cambios de stock si los hay
        if (stockChanges.length > 0) {
          const updatedProducts = stockChanges.slice(0, 3).map(change =>
            `${change.name}: ${change.difference > 0 ? '+' : ''}${change.difference}`
          ).join(', ')

          $q.notify({
            type: 'info',
            message: `Stock actualizado: ${updatedProducts}${stockChanges.length > 3 ? ` y ${stockChanges.length - 3} más...` : ''}`,
            position: 'top-right',
            timeout: 4000,
            icon: 'inventory_2'
          })
        }
      } else {
        console.warn('POS: Could not extract products from response:', response)
        products.value = []
      }
    } else {
      products.value = []
    }
  } catch (error) {
    console.error('POS: Error loading products:', error)

    // En desarrollo, mostrar más información sobre el error
    console.log('POS: Error type:', typeof error)
    console.log('POS: Error keys:', Object.keys(error))
    if (error.response) {
      console.log('POS: Error response:', error.response)
      console.log('POS: Error response data:', error.response.data)
    }

    $q.notify({
      type: 'negative',
      message: 'Error al cargar productos. Ver consola para más detalles.',
      position: 'top-right'
    })

    products.value = []
  } finally {
    loading.value = false
  }
}

async function loadCategories() {
  try {
    const response = await getCategories()

    // getCategories también usa la estructura similar
    if (response.status === "success" || response.data) {
      categories.value = response.data || []
    } else {
      categories.value = []
    }
  } catch (error) {
    console.error('Error loading categories:', error)
    categories.value = []
  }
}

// Manejar orden completada - recargar productos para actualizar stock
async function onOrderCompleted() {
  console.log('POS: Order completed, reloading products to update stock...')

  // Mostrar indicador de carga brevemente
  loading.value = true

  try {
    // Esperar un momento para que el backend procese completamente la orden
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Recargar productos para obtener el stock actualizado
    await loadProducts(true)

    $q.notify({
      type: 'info',
      message: 'Stock de productos actualizado',
      position: 'top-right',
      timeout: 2000,
      icon: 'refresh'
    })
  } catch (error) {
    console.error('Error reloading products after order:', error)
    $q.notify({
      type: 'warning',
      message: 'No se pudo actualizar el stock automáticamente',
      position: 'top-right',
      timeout: 3000
    })
  }
}

// Función para refrescar productos manualmente
async function refreshProducts() {
  console.log('POS: Manual refresh triggered')

  try {
    await loadProducts(true)

    $q.notify({
      type: 'positive',
      message: 'Productos actualizados',
      position: 'top-right',
      timeout: 1500,
      icon: 'refresh'
    })
  } catch (error) {
    console.error('Error refreshing products:', error)
    $q.notify({
      type: 'negative',
      message: 'Error al actualizar productos',
      position: 'top-right',
      timeout: 2000
    })
  }
}

// Función para actualizar un producto específico (opcional, para alta precisión)
async function updateSingleProductStock(productId) {
  try {
    console.log('POS: Updating single product stock for ID:', productId)
    // Esta función podría hacer una consulta específica del producto
    // Por ahora, simplemente recarga todos los productos de forma silenciosa
    const response = await getProducts()

    if (response) {
      let productsData = null
      if (response.data && Array.isArray(response.data)) {
        productsData = response.data
      } else if (Array.isArray(response)) {
        productsData = response
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        productsData = response.data.data
      }

      if (productsData) {
        // Actualizar solo el producto específico si se encuentra
        const updatedProduct = productsData.find(p => p._id === productId)
        if (updatedProduct) {
          const index = products.value.findIndex(p => p._id === productId)
          if (index !== -1) {
            products.value[index] = updatedProduct
            // Actualizar también selectedProduct si es el mismo
            if (selectedProduct.value && selectedProduct.value._id === productId) {
              selectedProduct.value = updatedProduct
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error updating single product stock:', error)
    // Fallar silenciosamente para no interrumpir el flujo del usuario
  }
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadProducts(),
    loadCategories()
  ])
})

// Watchers
watch([searchQuery, selectedCategory], () => {
  // Los filtros son reactivos automáticamente
}, { deep: true })
</script>

<style lang="scss" scoped>
.pos-page {
  padding: 0;
  height: 100vh;
  overflow: hidden;

  .products-panel {
    border-right: 1px solid $grey-4;
  }

  .cart-panel {
    background: $grey-1;
  }

  .products-container {
    height: calc(100vh - 120px);
    overflow-y: auto;
  }

  .compact-input {
    .q-field__control {
      height: 36px;
    }
  }
}

.variant-dialog {
  .option-card {
    min-width: 80px;
    transition: all 0.2s ease;
    border: 2px solid transparent;

    &:hover:not(.option-disabled) {
      border-color: $primary;
      transform: translateY(-1px);
    }

    &.option-disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}

.full-height {
  height: 100vh;
}

// Responsive adjustments
@media (max-width: 1024px) {
  .pos-page {
    .row {
      flex-direction: column;
    }

    .products-panel {
      height: 60vh;
      border-right: none;
      border-bottom: 1px solid $grey-4;
    }

    .cart-panel {
      height: 40vh;
    }
  }
}

@media (max-width: 768px) {
  .variant-dialog {
    .q-card-section.row {
      flex-direction: column;
    }

    .col-7, .col-5 {
      width: 100%;
    }
  }
}
</style>
