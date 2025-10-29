<template>
  <div class="customer-search">
    <!-- Campo de búsqueda principal -->
    <q-input
      v-model="searchQuery"
      :label="label"
      :placeholder="placeholder"
      outlined
      dense
      clearable
      :loading="searching"
      @update:model-value="onSearchChange"
      @keyup.enter="searchCustomer"
      @clear="clearSelection"
      hint="Mínimo 2 caracteres para buscar"
    >
      <template v-slot:prepend>
        <q-icon name="person_search" />
      </template>

      <template v-slot:append>
        <q-btn
          icon="search"
          flat
          round
          dense
          :loading="searching"
          :disable="!searchQuery || searchQuery.length < 2"
          @click="searchCustomer"
        >
          <q-tooltip v-if="!searchQuery || searchQuery.length < 2">
            Ingresa al menos 2 caracteres
          </q-tooltip>
        </q-btn>
      </template>
    </q-input>

    <!-- Resultados de búsqueda -->
    <q-list
      v-if="showResults && searchResults.length > 0"
      class="search-results bg-white shadow-2 rounded"
      bordered
    >
      <q-item
        v-for="customer in searchResults"
        :key="customer._id"
        clickable
        @click="selectCustomer(customer)"
        class="search-result-item"
      >
        <q-item-section>
          <q-item-label class="text-weight-medium">
            {{ customer.fullName }}
          </q-item-label>
          <q-item-label caption class="text-grey-6">
            <q-icon name="phone" size="xs" class="q-mr-xs" />
            {{ customer.contactInfo.phone }}
            <span v-if="customer.contactInfo.email">
              <q-icon name="email" size="xs" class="q-ml-sm q-mr-xs" />
              {{ customer.contactInfo.email }}
            </span>
          </q-item-label>
          <q-item-label caption class="text-grey-5">
            <q-icon name="badge" size="xs" class="q-mr-xs" />
            {{ customer.personalInfo.documentType }}: {{ customer.personalInfo.documentNumber }}
            <span v-if="customer.identifier !== customer.contactInfo.phone" class="q-ml-sm">
              • ID: {{ customer.identifier }}
            </span>
          </q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-chip
            :color="customer.status === 'active' ? 'positive' : 'grey'"
            text-color="white"
            size="sm"
          >
            {{ customer.status }}
          </q-chip>
        </q-item-section>
      </q-item>
    </q-list>

    <!-- No results -->
    <q-banner
      v-if="showResults && searchResults.length === 0 && searchQuery.length >= 2"
      class="bg-grey-2 text-grey-7 q-mt-sm"
      rounded
    >
      <template v-slot:avatar>
        <q-icon name="info" color="grey-6" />
      </template>
      <div>
        No se encontraron clientes con: <strong>"{{ searchQuery }}"</strong>
        <br>
        <small class="text-grey-6">
          Busca por: teléfono, cédula, email, nombre o apellido
        </small>
      </div>
      <template v-slot:action>
        <q-btn
          flat
          color="primary"
          label="Crear nuevo"
          @click="createNewCustomer"
          size="sm"
        />
      </template>
    </q-banner>

    <!-- Cliente seleccionado -->
    <q-card
      v-if="selectedCustomer"
      class="customer-selected q-mt-sm"
      flat
      bordered
    >
      <q-card-section class="q-pa-sm">
        <div class="row items-center justify-between">
          <div class="col">
            <div class="text-weight-bold text-primary">
              {{ selectedCustomer.fullName }}
            </div>
            <div class="text-caption text-grey-6">
              {{ selectedCustomer.contactInfo.phone }}
              <span v-if="selectedCustomer.contactInfo.email"> • {{ selectedCustomer.contactInfo.email }}</span>
            </div>
            <div v-if="selectedCustomer.primaryAddress" class="text-caption text-grey-5">
              {{ selectedCustomer.primaryAddress.street }}, {{ selectedCustomer.primaryAddress.city }}
            </div>
          </div>

          <div class="col-auto">
            <q-btn
              icon="clear"
              size="sm"
              flat
              round
              @click="clearSelection"
            >
              <q-tooltip>Limpiar selección</q-tooltip>
            </q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import customerService from 'src/services/customerService'

const props = defineProps({
  label: {
    type: String,
    default: 'Buscar cliente'
  },
  placeholder: {
    type: String,
    default: 'Busca por teléfono, cédula, email, nombre o apellido...'
  },
  modelValue: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:model-value', 'customer-selected', 'create-new'])

const $q = useQuasar()

// Estado reactivo
const searchQuery = ref('')
const searching = ref(false)
const searchResults = ref([])
const selectedCustomer = ref(props.modelValue)
const showResults = ref(false)
const searchTimeout = ref(null)

// Computadas
const hasSelection = computed(() => !!selectedCustomer.value)

// Watchers
watch(() => props.modelValue, (newValue) => {
  selectedCustomer.value = newValue
  if (newValue) {
    searchQuery.value = newValue.identifier || newValue.contactInfo?.phone || ''
    showResults.value = false
  }
})

// Métodos
function onSearchChange(value) {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }

  // Limpiar espacios extra y normalizar
  const normalizedValue = value?.toString().trim()

  if (!normalizedValue || normalizedValue.length < 2) {
    searchResults.value = []
    showResults.value = false
    return
  }

  // Debounce search - tiempo más corto para mejor UX
  searchTimeout.value = setTimeout(() => {
    performSearch(normalizedValue)
  }, 250)
}

async function searchCustomer() {
  if (!searchQuery.value || searchQuery.value.length < 2) return
  await performSearch(searchQuery.value)
}

async function performSearch(query) {
  searching.value = true
  showResults.value = true

  try {
    // Normalizar la consulta
    const normalizedQuery = query.trim()

    // Determinar el tipo de búsqueda para dar contexto al usuario
    let searchType = 'general'
    if (/^\d+$/.test(normalizedQuery)) {
      searchType = normalizedQuery.length >= 7 ? 'phone_or_document' : 'document'
    } else if (normalizedQuery.includes('@')) {
      searchType = 'email'
    } else if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(normalizedQuery)) {
      searchType = 'name'
    }

    const response = await customerService.searchCustomers(normalizedQuery, 10)

    if (response.success) {
      searchResults.value = response.data

      // Si no hay resultados y es un número, sugerir diferentes formatos
      if (response.data.length === 0 && searchType === 'phone_or_document') {
        console.log(`No se encontraron resultados para: ${normalizedQuery}`)
        console.log('Tip: Verifica el formato del teléfono o cédula')
      }
    } else {
      searchResults.value = []
      $q.notify({
        type: 'warning',
        message: response.message || 'No se encontraron resultados',
        position: 'top-right'
      })
    }
  } catch (error) {
    console.error('Search error:', error)
    searchResults.value = []

    let errorMessage = 'Error al buscar clientes'
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    }

    $q.notify({
      type: 'negative',
      message: errorMessage,
      position: 'top-right'
    })
  } finally {
    searching.value = false
  }
}

function selectCustomer(customer) {
  selectedCustomer.value = customer
  searchQuery.value = customer.identifier || customer.contactInfo?.phone || ''
  showResults.value = false

  emit('update:model-value', customer)
  emit('customer-selected', customer)

  $q.notify({
    type: 'positive',
    message: `Cliente ${customer.fullName} seleccionado`,
    position: 'top-right',
    timeout: 2000
  })
}

function clearSelection() {
  selectedCustomer.value = null
  searchQuery.value = ''
  searchResults.value = []
  showResults.value = false

  emit('update:model-value', null)
  emit('customer-selected', null)
}

function createNewCustomer() {
  emit('create-new', searchQuery.value)
  showResults.value = false
}

// Buscar por identificador específico
async function findByIdentifier(identifier) {
  if (!identifier) return null

  searching.value = true

  try {
    const response = await customerService.findByIdentifier(identifier)

    if (response.success && response.data) {
      selectCustomer(response.data)
      return response.data
    }

    return null
  } catch (error) {
    console.error('Find by identifier error:', error)
    return null
  } finally {
    searching.value = false
  }
}

// Exponer métodos
defineExpose({
  findByIdentifier,
  clearSelection,
  performSearch
})
</script>

<style lang="scss" scoped>
.customer-search {
  position: relative;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
}

.search-result-item {
  &:hover {
    background-color: $grey-2;
  }
}

.customer-selected {
  border: 2px solid $primary;
  background-color: $blue-1;
}
</style>
