<template>
  <q-page class="q-pa-md">
    <!-- Header mejorado con acciones -->
    <div class="row items-center q-mb-md">
      <div class="col">
        <div class="text-h5 text-weight-bold">Gestión de Productos</div>
        <div class="text-caption text-grey-6">
          <q-icon name="inventory_2" size="xs" class="q-mr-xs" />
          {{ totalProducts }} producto{{ totalProducts !== 1 ? 's' : '' }} registrado{{ totalProducts !== 1 ? 's' : '' }}
          <span v-if="filteredProducts.length !== totalProducts" class="text-primary">
            • {{ filteredProducts.length }} mostrado{{ filteredProducts.length !== 1 ? 's' : '' }}
          </span>
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
      </div>
      <div class="col-auto">
        <div class="row q-gutter-sm">
          <q-btn
            label="Exportar"
            icon="download"
            color="grey-7"
            outline
            @click="exportProducts"
            size="md"
            dense
          >
            <q-menu>
              <q-list dense>
                <q-item clickable @click="exportToExcel">
                  <q-item-section avatar>
                    <q-icon name="table_chart" color="green" />
                  </q-item-section>
                  <q-item-section>Excel</q-item-section>
                </q-item>
                <q-item clickable @click="exportToCSV">
                  <q-item-section avatar>
                    <q-icon name="description" color="blue" />
                  </q-item-section>
                  <q-item-section>CSV</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
          <q-btn
            label="Añadir producto"
            icon="add"
            color="primary"
            @click="showAddProductDialog = true"
            size="md"
            unelevated
            :loading="loading"
          />
        </div>
      </div>
    </div>

    <!-- Filtros y búsqueda mejorados -->
    <q-card flat bordered class="q-mb-md filters-card">
      <q-card-section class="q-pa-md">
        <div class="row q-col-gutter-md items-end">
          <div class="col-12 col-md-4">
            <q-input
              v-model="searchQuery"
              label="Buscar productos"
              outlined
              dense
              clearable
              debounce="300"
              hint="Busca por nombre, SKU o descripción"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
              <template v-slot:append v-if="searchQuery">
                <q-chip size="sm" color="primary" text-color="white">
                  {{ filteredProducts.length }}
                </q-chip>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-2">
            <q-select
              v-model="categoryFilter"
              :options="categoryOptions"
              label="Categoría"
              outlined
              dense
              clearable
              emit-value
              map-options
            >
              <template v-slot:prepend>
                <q-icon name="category" size="sm" />
              </template>
            </q-select>
          </div>

          <div class="col-12 col-md-2">
            <q-select
              v-model="stockFilter"
              :options="stockFilterOptions"
              label="Stock"
              outlined
              dense
              clearable
              emit-value
              map-options
            >
              <template v-slot:prepend>
                <q-icon name="inventory" size="sm" />
              </template>
            </q-select>
          </div>

          <div class="col-12 col-md-2">
            <q-select
              v-model="statusFilter"
              :options="statusFilterOptions"
              label="Estado"
              outlined
              dense
              clearable
              emit-value
              map-options
            >
              <template v-slot:prepend>
                <q-icon name="toggle_on" size="sm" />
              </template>
            </q-select>
          </div>

          <div class="col-12 col-md-auto">
            <q-btn
              icon="refresh"
              color="grey-7"
              outline
              @click="getAllProducts"
              :loading="loading"
              dense
            >
              <q-tooltip>Actualizar lista</q-tooltip>
            </q-btn>
          </div>

          <div class="col-12 col-md-auto" v-if="hasActiveFilters">
            <q-btn
              label="Limpiar filtros"
              icon="clear"
              color="grey-7"
              flat
              dense
              @click="clearFilters"
              size="sm"
            />
          </div>
        </div>

        <!-- Filtros activos visuales -->
        <div v-if="hasActiveFilters" class="q-mt-md">
          <div class="text-caption text-grey-6 q-mb-xs">Filtros activos:</div>
          <div class="row q-gutter-xs">
            <q-chip
              v-if="searchQuery"
              removable
              @remove="searchQuery = ''"
              color="primary"
              text-color="white"
              size="sm"
            >
              <q-icon name="search" size="xs" class="q-mr-xs" />
              "{{ searchQuery }}"
            </q-chip>
            <q-chip
              v-if="categoryFilter"
              removable
              @remove="categoryFilter = null"
              color="blue"
              text-color="white"
              size="sm"
            >
              <q-icon name="category" size="xs" class="q-mr-xs" />
              {{ getCategoryName(categoryFilter) }}
            </q-chip>
            <q-chip
              v-if="stockFilter"
              removable
              @remove="stockFilter = null"
              color="orange"
              text-color="white"
              size="sm"
            >
              <q-icon name="inventory" size="xs" class="q-mr-xs" />
              {{ getStockFilterLabel(stockFilter) }}
            </q-chip>
            <q-chip
              v-if="statusFilter"
              removable
              @remove="statusFilter = null"
              color="purple"
              text-color="white"
              size="sm"
            >
              <q-icon name="toggle_on" size="xs" class="q-mr-xs" />
              {{ getStatusFilterLabel(statusFilter) }}
            </q-chip>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Estadísticas mejoradas con iconos y animaciones -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="stat-card cursor-pointer" @click="clearFilters">
          <q-card-section class="q-pa-md">
            <div class="row items-center">
              <div class="col">
                <div class="text-h4 text-weight-bold text-primary">{{ totalProducts }}</div>
                <div class="text-caption text-grey-7">Total productos</div>
              </div>
              <div class="col-auto">
                <q-avatar size="50px" color="blue-1" text-color="primary">
                  <q-icon name="inventory_2" size="md" />
                </q-avatar>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="stat-card cursor-pointer" @click="setQuickFilter('active')">
          <q-card-section class="q-pa-md">
            <div class="row items-center">
              <div class="col">
                <div class="text-h4 text-weight-bold text-positive">{{ activeProducts }}</div>
                <div class="text-caption text-grey-7">Activos</div>
              </div>
              <div class="col-auto">
                <q-avatar size="50px" color="green-1" text-color="positive">
                  <q-icon name="check_circle" size="md" />
                </q-avatar>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="stat-card cursor-pointer" @click="setQuickFilter('low_stock')">
          <q-card-section class="q-pa-md">
            <div class="row items-center">
              <div class="col">
                <div class="text-h4 text-weight-bold text-warning">{{ lowStockProducts }}</div>
                <div class="text-caption text-grey-7">Stock bajo</div>
              </div>
              <div class="col-auto">
                <q-avatar size="50px" color="orange-1" text-color="warning">
                  <q-icon name="warning" size="md" />
                </q-avatar>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card flat bordered class="stat-card cursor-pointer" @click="setQuickFilter('out_of_stock')">
          <q-card-section class="q-pa-md">
            <div class="row items-center">
              <div class="col">
                <div class="text-h4 text-weight-bold text-negative">{{ outOfStockProducts }}</div>
                <div class="text-caption text-grey-7">Sin stock</div>
              </div>
              <div class="col-auto">
                <q-avatar size="50px" color="red-1" text-color="negative">
                  <q-icon name="remove_circle" size="md" />
                </q-avatar>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Lista de productos -->
    <div v-if="loading" class="flex flex-center q-py-xl">
      <q-spinner-gears size="50px" color="primary" />
      <div class="q-ml-md">Cargando productos...</div>
    </div>

    <div v-else-if="filteredProducts.length === 0" class="text-center q-py-xl">
      <q-icon name="inventory" size="4em" class="text-grey-5 q-mb-md" />
      <div class="text-h6 text-grey-6">
        {{ totalProducts === 0 ? 'No hay productos registrados' : 'No se encontraron productos con los filtros aplicados' }}
      </div>
      <div class="text-caption text-grey-5 q-mb-md">
        {{ totalProducts === 0 ? 'Comienza añadiendo tu primer producto' : 'Intenta ajustar los filtros de búsqueda' }}
      </div>
      <q-btn
        v-if="totalProducts === 0"
        label="Añadir primer producto"
        color="primary"
        icon="add"
        @click="showAddProductDialog = true"
      />
    </div>

    <div v-else class="row q-gutter-md">
      <ProductCard
        v-for="item in filteredProducts"
        :key="item._id || item.id"
        :product="item"
        @delete-product="deleteItem"
        @add-stock="dialogAddStock"
        @edit-product="editProduct"
        @toggle-catalog="toggleProductCatalog"
        @toggle-active="toggleProductActive"
      />
    </div>

    <!-- Diálogo para añadir producto -->
    <q-dialog v-model="showAddProductDialog" persistent>
      <q-card style="width: 700px; max-width: 100vw">
        <div class="flex justify-end">
          <q-btn icon="close" flat round dense v-close-popup />
        </div>
        <AddNewProductStepper
          :loadingAdd="loadingAdd"
          @add-product="addProduct"
        />
      </q-card>
    </q-dialog>

    <!-- Diálogo para editar producto -->
    <q-dialog v-model="showEditProductDialog" persistent>
      <q-card style="width: 700px; max-width: 100vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">
            <q-icon name="edit" color="orange" class="q-mr-sm" />
            Editar Producto
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="productToEdit = null" />
        </q-card-section>

        <AddNewProductStepper
          v-if="productToEdit"
          :loadingAdd="loadingEdit"
          :initialProduct="productToEdit"
          :isEditMode="true"
          @add-product="handleUpdateProduct"
        />
      </q-card>
    </q-dialog>

    <!-- Diálogo mejorado para gestión de stock -->
    <q-dialog v-model="addItemStock" persistent transition-show="scale" transition-hide="scale">
      <q-card style="min-width: 500px; max-width: 600px">
        <q-card-section class="row items-center q-pb-none">
          <div class="col">
            <div class="text-h6">
              <q-icon name="inventory" color="primary" class="q-mr-sm" />
              Gestión de Stock
            </div>
            <div class="text-subtitle2 text-grey-7">{{ productUpdate.name }}</div>
          </div>
          <q-btn icon="close" flat round dense v-close-popup @click="resetStockOperation" />
        </q-card-section>

        <q-separator />

        <q-card-section>
          <!-- Stock actual destacado -->
          <q-card flat bordered class="bg-blue-1 q-mb-md">
            <q-card-section class="q-pa-md">
              <div class="row items-center justify-between">
                <div>
                  <div class="text-caption text-grey-7">Stock actual</div>
                  <div class="text-h4 text-weight-bold text-primary">
                    {{ productUpdate.stock || 0 }}
                    <span class="text-body2">unidades</span>
                  </div>
                </div>
                <div v-if="stockOperation.quantity && stockOperation.type">
                  <div class="text-caption text-grey-7">Nuevo stock</div>
                  <div class="text-h4 text-weight-bold text-positive">
                    {{ calculateNewStockPreview() }}
                    <span class="text-body2">unidades</span>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-select
                v-model="stockOperation.type"
                :options="stockOperationTypes"
                label="Tipo de operación"
                outlined
                dense
              >
                <template v-slot:prepend>
                  <q-icon :name="getOperationIcon(stockOperation.type)" />
                </template>
              </q-select>
            </div>

            <div class="col-12">
              <q-input
                v-model.number="stockOperation.quantity"
                label="Cantidad"
                type="number"
                min="1"
                outlined
                dense
                :hint="getOperationHint()"
              >
                <template v-slot:prepend>
                  <q-icon name="pin" />
                </template>
                <template v-slot:append>
                  <div class="row q-gutter-xs">
                    <q-btn
                      icon="remove"
                      size="sm"
                      flat
                      round
                      dense
                      @click="stockOperation.quantity = Math.max(1, (stockOperation.quantity || 1) - 1)"
                    />
                    <q-btn
                      icon="add"
                      size="sm"
                      flat
                      round
                      dense
                      @click="stockOperation.quantity = (stockOperation.quantity || 0) + 1"
                    />
                  </div>
                </template>
              </q-input>
            </div>

            <div class="col-12">
              <q-input
                v-model="stockOperation.reason"
                label="Motivo (opcional)"
                outlined
                dense
                hint="Ej: Reposición, Ajuste de inventario, Devolución, Merma"
              >
                <template v-slot:prepend>
                  <q-icon name="description" />
                </template>
              </q-input>
            </div>

            <!-- Presets rápidos -->
            <div class="col-12">
              <div class="text-caption text-grey-6 q-mb-sm">Acciones rápidas:</div>
              <div class="row q-gutter-xs">
                <q-btn
                  label="+10"
                  size="sm"
                  outline
                  color="positive"
                  @click="quickStockOperation('add', 10)"
                />
                <q-btn
                  label="+50"
                  size="sm"
                  outline
                  color="positive"
                  @click="quickStockOperation('add', 50)"
                />
                <q-btn
                  label="+100"
                  size="sm"
                  outline
                  color="positive"
                  @click="quickStockOperation('add', 100)"
                />
                <q-btn
                  label="Ajustar a 0"
                  size="sm"
                  outline
                  color="negative"
                  @click="quickStockOperation('set', 0)"
                />
              </div>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="q-pa-md">
          <q-btn
            label="Cancelar"
            flat
            color="grey-7"
            v-close-popup
            @click="resetStockOperation"
          />
          <q-btn
            label="Confirmar cambio"
            unelevated
            color="primary"
            @click="sendUpdateStock"
            :loading="loadingStock"
            :disable="!stockOperation.quantity || stockOperation.quantity <= 0"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onBeforeMount, computed } from "vue";
import { useQuasar } from "quasar";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../../services/productService.js";
import { uploadImagesFile } from "../../services/uploadImages";
import { useCategoryStore } from "../../stores/categories";
import ProductCard from "./Cards/ProductCard.vue";
import AddNewProductStepper from "./forms/AddNewProductStepper.vue";

const $q = useQuasar();

// Stores
const categoryStore = useCategoryStore();

// Estado reactivo
const products = ref([]);
const loading = ref(false);
const loadingAdd = ref(false);
const loadingStock = ref(false);
const loadingEdit = ref(false);
const addItemStock = ref(false);
const showAddProductDialog = ref(false);
const showEditProductDialog = ref(false);
const productToEdit = ref(null);

// Filtros
const searchQuery = ref("");
const categoryFilter = ref(null);
const stockFilter = ref(null);
const statusFilter = ref(null);

// Formularios
const productUpdate = ref({});
const stockOperation = ref({
  quantity: null,
  type: 'add',
  reason: ''
});

// Opciones para filtros
const stockFilterOptions = [
  { label: "Todos", value: null },
  { label: "Con stock", value: "in_stock" },
  { label: "Stock bajo", value: "low_stock" },
  { label: "Sin stock", value: "out_of_stock" }
];

const statusFilterOptions = [
  { label: "Todos", value: null },
  { label: "Activos", value: "active" },
  { label: "Inactivos", value: "inactive" },
  { label: "En catálogo", value: "in_catalog" }
];

const stockOperationTypes = [
  { label: "Añadir stock", value: "add" },
  { label: "Reducir stock", value: "subtract" },
  { label: "Establecer stock", value: "set" }
];

// Computadas
const categoryOptions = computed(() => {
  const options = [{ label: "Todas las categorías", value: null }];
  options.push(...categoryStore.categories.map(cat => ({
    label: cat.name,
    value: cat._id
  })));
  return options;
});

const hasActiveFilters = computed(() => {
  return !!(searchQuery.value || categoryFilter.value || stockFilter.value || statusFilter.value);
});

const filteredProducts = computed(() => {
  // Asegurar que products.value sea un array
  const productsArray = Array.isArray(products.value) ? products.value : [];
  let filtered = [...productsArray];

  // Filtro por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(product =>
      product.name?.toLowerCase().includes(query) ||
      product.namePublic?.toLowerCase().includes(query) ||
      product.sku?.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query)
    );
  }  // Filtro por categoría
  if (categoryFilter.value) {
    filtered = filtered.filter(product => product.category === categoryFilter.value);
  }

  // Filtro por stock
  if (stockFilter.value) {
    filtered = filtered.filter(product => {
      const stock = product.stock || 0;
      const minStock = product.minStock || 0;

      switch (stockFilter.value) {
        case 'in_stock':
          return stock > minStock;
        case 'low_stock':
          return stock > 0 && stock <= minStock;
        case 'out_of_stock':
          return stock === 0;
        default:
          return true;
      }
    });
  }

  // Filtro por estado
  if (statusFilter.value) {
    filtered = filtered.filter(product => {
      switch (statusFilter.value) {
        case 'active':
          return product.isActive === true;
        case 'inactive':
          return product.isActive === false;
        case 'in_catalog':
          return product.isActiveInCatalog === true;
        default:
          return true;
      }
    });
  }

  return filtered;
});

// Estadísticas
const totalProducts = computed(() => {
  const productsArray = Array.isArray(products.value) ? products.value : [];
  return productsArray.length;
});

const activeProducts = computed(() => {
  const productsArray = Array.isArray(products.value) ? products.value : [];
  return productsArray.filter(p => p.isActive).length;
});

const lowStockProducts = computed(() => {
  const productsArray = Array.isArray(products.value) ? products.value : [];
  return productsArray.filter(p => {
    const stock = p.stock || 0;
    const minStock = p.minStock || 0;
    return stock > 0 && stock <= minStock;
  }).length;
});

const outOfStockProducts = computed(() => {
  const productsArray = Array.isArray(products.value) ? products.value : [];
  return productsArray.filter(p => (p.stock || 0) === 0).length;
});

// Lifecycle
onBeforeMount(async () => {
  // Cargar categorías si no están cargadas
  if (!categoryStore.categories.length) {
    await categoryStore.fetchCategories();
  }

  // Cargar productos
  await getAllProducts();
});

// Métodos
const getAllProducts = async () => {
  loading.value = true;
  try {
    const response = await getProducts();
    console.log("Products response:", response);

    // La API devuelve { status: "success", data: { data: [...], pagination: {...} } }
    if (response.data && response.data.data) {
      products.value = Array.isArray(response.data.data) ? response.data.data : [];
    } else if (Array.isArray(response.data)) {
      products.value = response.data;
    } else {
      products.value = [];
    }

    console.log("Products loaded:", products.value);
  } catch (error) {
    console.error("Error al cargar productos:", error);
    products.value = [];
  } finally {
    loading.value = false;
  }
};

const addProduct = async (product) => {
  loadingAdd.value = true;
  try {
    const imageUrls = await getUrlImg(product);
    if (imageUrls) {
      product.images = imageUrls;
    }
    await createProduct(product);
    showAddProductDialog.value = false;
    await getAllProducts();
  } catch (error) {
    console.error(error);
  }
  loadingAdd.value = false;
};

const getUrlImg = async (product) => {
  if (product.images.length > 0) {
    try {
      const uploadedImageUrls = await Promise.all(
        product.images.map((file) => uploadImagesFile(file))
      );
      return uploadedImageUrls;
    } catch (error) {
      console.error("Error uploading images:", error);
      throw new Error("Error uploading images");
    }
  }
  return [];
};

// Métodos de gestión de productos
const dialogAddStock = async (product) => {
  productUpdate.value = { ...product };
  resetStockOperation();
  addItemStock.value = true;
};

const resetStockOperation = () => {
  stockOperation.value = {
    quantity: null,
    type: 'add',
    reason: ''
  };
};

const sendUpdateStock = async () => {
  loadingStock.value = true;
  try {
    const newStock = calculateNewStock();

    await updateProduct(productUpdate.value._id, {
      stock: newStock,
      quantity: newStock // Sincronizar quantity con stock
    });

    $q.notify({
      type: 'positive',
      message: `Stock actualizado: ${newStock} unidades`,
      position: 'top',
      timeout: 2000
    });

    addItemStock.value = false;
    await getAllProducts();

    // Log de movimientos de inventario
    console.log(`Stock actualizado: ${productUpdate.value.name} - ${stockOperation.value.type} ${stockOperation.value.quantity} = ${newStock}`);

  } catch (error) {
    console.error("Error al actualizar stock:", error);
    $q.notify({
      type: 'negative',
      message: 'Error al actualizar el stock',
      position: 'top'
    });
  } finally {
    loadingStock.value = false;
  }
};

const calculateNewStock = () => {
  const currentStock = productUpdate.value.stock || 0;
  const quantity = stockOperation.value.quantity;

  switch (stockOperation.value.type) {
    case 'add':
      return currentStock + quantity;
    case 'subtract':
      return Math.max(0, currentStock - quantity);
    case 'set':
      return Math.max(0, quantity);
    default:
      return currentStock;
  }
};

const editProduct = (product) => {
  productToEdit.value = { ...product };
  showEditProductDialog.value = true;
};

const handleUpdateProduct = async (updatedProduct) => {
  loadingEdit.value = true;
  try {
    // Si hay nuevas imágenes (archivos), subirlas
    let imageUrls = updatedProduct.images;
    if (updatedProduct.images && updatedProduct.images.length > 0 && updatedProduct.images[0] instanceof File) {
      imageUrls = await getUrlImg(updatedProduct);
      updatedProduct.images = imageUrls;
    }

    await updateProduct(updatedProduct._id, updatedProduct);

    $q.notify({
      type: 'positive',
      message: 'Producto actualizado correctamente',
      position: 'top',
      timeout: 2000
    });

    showEditProductDialog.value = false;
    productToEdit.value = null;
    await getAllProducts();
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    $q.notify({
      type: 'negative',
      message: 'Error al actualizar el producto',
      position: 'top'
    });
  } finally {
    loadingEdit.value = false;
  }
};

const deleteItem = async (product) => {
  $q.dialog({
    title: 'Confirmar eliminación',
    message: `¿Estás seguro de que deseas eliminar el producto "${product.name}"? Esta acción no se puede deshacer.`,
    cancel: {
      label: 'Cancelar',
      color: 'grey-7',
      flat: true
    },
    ok: {
      label: 'Eliminar',
      color: 'negative',
      unelevated: true
    },
    persistent: true
  }).onOk(async () => {
    try {
      await deleteProduct(product._id);
      $q.notify({
        type: 'positive',
        message: 'Producto eliminado correctamente',
        position: 'top'
      });
      await getAllProducts();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      $q.notify({
        type: 'negative',
        message: 'Error al eliminar el producto',
        position: 'top'
      });
    }
  });
};

const toggleProductCatalog = async (product) => {
  try {
    const newStatus = !product.isActiveInCatalog;
    await updateProduct(product._id, {
      isActiveInCatalog: newStatus
    });
    $q.notify({
      type: 'positive',
      message: newStatus ? 'Producto añadido al catálogo' : 'Producto removido del catálogo',
      position: 'top',
      timeout: 2000
    });
    await getAllProducts();
  } catch (error) {
    console.error("Error al actualizar catálogo:", error);
    $q.notify({
      type: 'negative',
      message: 'Error al actualizar el catálogo',
      position: 'top'
    });
  }
};

const toggleProductActive = async (product) => {
  try {
    const newStatus = !product.isActive;
    await updateProduct(product._id, {
      isActive: newStatus
    });
    $q.notify({
      type: 'positive',
      message: newStatus ? 'Producto activado' : 'Producto desactivado',
      position: 'top',
      timeout: 2000
    });
    await getAllProducts();
  } catch (error) {
    console.error("Error al actualizar estado:", error);
    $q.notify({
      type: 'negative',
      message: 'Error al actualizar el estado',
      position: 'top'
    });
  }
};

// Funciones de utilidad para filtros
const clearFilters = () => {
  searchQuery.value = '';
  categoryFilter.value = null;
  stockFilter.value = null;
  statusFilter.value = null;
};

const setQuickFilter = (filterType) => {
  clearFilters();

  switch (filterType) {
    case 'active':
      statusFilter.value = 'active';
      break;
    case 'low_stock':
      stockFilter.value = 'low_stock';
      break;
    case 'out_of_stock':
      stockFilter.value = 'out_of_stock';
      break;
  }
};

const getCategoryName = (categoryId) => {
  const category = categoryStore.categories.find(cat => cat._id === categoryId);
  return category ? category.name : 'Categoría';
};

const getStockFilterLabel = (value) => {
  const option = stockFilterOptions.find(opt => opt.value === value);
  return option ? option.label : value;
};

const getStatusFilterLabel = (value) => {
  const option = statusFilterOptions.find(opt => opt.value === value);
  return option ? option.label : value;
};

// Funciones de gestión de stock mejoradas
const calculateNewStockPreview = () => {
  return calculateNewStock();
};

const getOperationIcon = (type) => {
  switch (type) {
    case 'add': return 'add_circle';
    case 'subtract': return 'remove_circle';
    case 'set': return 'settings';
    default: return 'inventory';
  }
};

const getOperationHint = () => {
  const current = productUpdate.value.stock || 0;
  const quantity = stockOperation.value.quantity || 0;

  switch (stockOperation.value.type) {
    case 'add':
      return `Se añadirán ${quantity} unidades al stock actual (${current})`;
    case 'subtract':
      return `Se restarán ${quantity} unidades del stock actual (${current})`;
    case 'set':
      return `El stock se establecerá exactamente en ${quantity} unidades`;
    default:
      return '';
  }
};

const quickStockOperation = (type, quantity) => {
  stockOperation.value.type = type;
  stockOperation.value.quantity = quantity;
};

// Funciones de exportación
const exportProducts = () => {
  console.log('Exportar productos');
};

const exportToExcel = () => {
  console.log('Exportar a Excel');
  // TODO: Implementar exportación a Excel
};

const exportToCSV = () => {
  console.log('Exportar a CSV');
  // TODO: Implementar exportación a CSV
};
</script>

<style lang="scss" scoped>
.filters-card {
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
}

.stat-card {
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    border-color: var(--q-primary);
  }
}

// Animaciones para estadísticas
.text-h4 {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Mejoras responsive
@media (max-width: 768px) {
  .row.q-col-gutter-md {
    .col-12 {
      padding-left: 0;
      padding-right: 0;
    }
  }
}
</style>
