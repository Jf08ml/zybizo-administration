<template>
  <q-card style="min-width: 600px; max-width: 700px">
    <q-card-section>
      <div class="text-h6">Procesar Orden</div>
      <div class="text-subtitle2 text-grey-7">
        Completa los datos del cliente para finalizar la venta
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <!-- Resumen rápido -->
      <q-banner rounded class="bg-grey-2 q-mb-md">
        <div class="row items-center justify-between">
          <div>
            <div class="text-weight-bold">{{ cartStore.itemCount }} productos</div>
            <div class="text-caption">{{ getPaymentMethodLabel(paymentData.method) }}</div>
          </div>
          <div class="text-h6 text-primary text-weight-bold">
            ${{ cartStore.total.toLocaleString() }}
          </div>
        </div>
      </q-banner>

      <!-- Formulario de cliente -->
      <q-form ref="form" @submit="processOrder">
        <div class="text-subtitle2 q-mb-sm">Información del Cliente</div>

        <!-- Búsqueda de cliente existente -->
        <div class="q-mb-md">
          <CustomerSearch
            v-model="selectedCustomer"
            label="Buscar cliente existente"
            placeholder="Ingresa teléfono, cédula o nombre del cliente..."
            @customer-selected="onCustomerSelected"
            @create-new="onCreateNew"
          />
        </div>

        <!-- Formulario de datos del cliente -->
        <q-expansion-item
          v-model="showCustomerForm"
          :label="selectedCustomer ? 'Editar datos del cliente' : 'Datos del cliente'"
          header-class="text-weight-bold"
          default-opened
        >
          <div class="q-pt-md">
            <!-- Primera fila: Teléfono e Identificador -->
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-6">
                <q-input
                  v-model="customerData.phone"
                  label="Teléfono *"
                  outlined
                  dense
                  mask="(###) ###-####"
                  placeholder="(310) 123-4567"
                  :rules="[val => !!val || 'Teléfono es requerido']"
                  @update:model-value="onPhoneChange"
                />
              </div>

              <div class="col-6">
                <q-input
                  v-model="customerData.identifier"
                  label="Identificador"
                  outlined
                  dense
                  hint="Deja vacío para usar el teléfono"
                />
              </div>
            </div>

            <!-- Segunda fila: Tipo y Número de documento -->
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-4">
                <q-select
                  v-model="customerData.documentType"
                  :options="documentTypes"
                  label="Tipo documento"
                  outlined
                  dense
                  emit-value
                  map-options
                />
              </div>

              <div class="col-8">
                <q-input
                  v-model="customerData.documentNumber"
                  label="Número de documento"
                  outlined
                  dense
                />
              </div>
            </div>

            <!-- Tercera fila: Nombres -->
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-6">
                <q-input
                  v-model="customerData.firstName"
                  label="Nombres *"
                  outlined
                  dense
                  :rules="[val => !!val || 'Nombres son requeridos']"
                />
              </div>

              <div class="col-6">
                <q-input
                  v-model="customerData.lastName"
                  label="Apellidos *"
                  outlined
                  dense
                  :rules="[val => !!val || 'Apellidos son requeridos']"
                />
              </div>
            </div>

            <!-- Cuarta fila: Email -->
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-12">
                <q-input
                  v-model="customerData.email"
                  label="Email"
                  type="email"
                  outlined
                  dense
                />
              </div>
            </div>

            <!-- Dirección (opcional) -->
            <q-expansion-item
              v-model="showAddressForm"
              label="Dirección (opcional)"
              icon="location_on"
            >
              <div class="q-pt-md">
                <div class="row q-col-gutter-md q-mb-md">
                  <div class="col-8">
                    <q-input
                      v-model="customerData.address"
                      label="Dirección completa"
                      outlined
                      dense
                      placeholder="Calle 123 # 45-67"
                    />
                  </div>

                  <div class="col-4">
                    <q-input
                      v-model="customerData.city"
                      label="Ciudad"
                      outlined
                      dense
                      placeholder="Neiva"
                    />
                  </div>
                </div>
              </div>
            </q-expansion-item>

            <!-- Notas -->
            <div class="q-mt-md">
              <q-input
                v-model="customerData.notes"
                label="Notas adicionales"
                type="textarea"
                rows="2"
                outlined
                dense
              />
            </div>
          </div>
        </q-expansion-item>

        <!-- Configuración de pago -->
        <q-separator class="q-my-md" />

        <div class="text-subtitle2 q-mb-sm">Configuración de Pago</div>

        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-6">
            <q-select
              v-model="paymentData.method"
              :options="paymentMethods"
              label="Método de pago"
              outlined
              dense
              emit-value
              map-options
            />
          </div>

          <div class="col-6">
            <q-select
              v-model="paymentData.status"
              :options="paymentStatuses"
              label="Estado del pago"
              outlined
              dense
              emit-value
              map-options
            />
          </div>
        </div>

        <!-- Notas internas -->
        <div class="q-mb-md">
          <q-input
            v-model="internalNotes"
            label="Notas internas (opcional)"
            type="textarea"
            rows="2"
            outlined
            dense
            hint="Estas notas son solo para uso interno"
          />
        </div>
      </q-form>
    </q-card-section>

    <!-- Acciones -->
    <q-separator />

    <q-card-actions align="right" class="q-pa-md">
      <q-btn
        label="Cancelar"
        color="grey"
        flat
        @click="$emit('cancel')"
        :disable="processing"
      />

      <q-btn
        label="Procesar Orden"
        color="primary"
        :loading="processing"
        :disable="!isFormValid"
        @click="processOrder"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useCartStore } from 'src/stores/cartStore'
import CustomerSearch from './CustomerSearch.vue'
import orderService from 'src/services/orderService'

const props = defineProps({
  // Props si son necesarios
})

const emit = defineEmits(['order-completed', 'cancel'])

const $q = useQuasar()
const cartStore = useCartStore()

// Referencias
const form = ref(null)

// Estado del formulario
const processing = ref(false)
const showCustomerForm = ref(true)
const showAddressForm = ref(false)
const selectedCustomer = ref(null)

// Datos del cliente
const customerData = ref({
  identifier: '',
  phone: '',
  documentType: 'CC',
  documentNumber: '',
  firstName: '',
  lastName: '',
  email: '',
  address: '',
  city: 'Neiva',
  notes: ''
})

// Datos de pago
const paymentData = ref({
  method: cartStore.paymentMethod,
  status: 'pending'
})

const internalNotes = ref('')

// Opciones
const documentTypes = [
  { label: 'Cédula de Ciudadanía', value: 'CC' },
  { label: 'Tarjeta de Identidad', value: 'TI' },
  { label: 'Cédula de Extranjería', value: 'CE' },
  { label: 'Pasaporte', value: 'PA' },
  { label: 'NIT', value: 'NIT' }
]

const paymentMethods = [
  { label: 'Efectivo', value: 'cash' },
  { label: 'Tarjeta de Débito', value: 'debit_card' },
  { label: 'Tarjeta de Crédito', value: 'credit_card' },
  { label: 'Transferencia', value: 'transfer' },
  { label: 'QR/Digital', value: 'digital' }
]

const paymentStatuses = [
  { label: 'Pendiente', value: 'pending' },
  { label: 'Pagado', value: 'paid' },
  { label: 'Pago Parcial', value: 'partial' }
]

// Computadas
const fullName = computed(() => {
  return `${customerData.value.firstName} ${customerData.value.lastName}`.trim()
})

const isFormValid = computed(() => {
  return customerData.value.phone?.trim() !== '' &&
         customerData.value.firstName?.trim() !== '' &&
         customerData.value.lastName?.trim() !== '' &&
         (customerData.value.phone?.trim() !== '' || customerData.value.email?.trim() !== '')
})

// Watchers
watch(() => paymentData.value.method, (newMethod) => {
  cartStore.setPaymentMethod(newMethod)
})

// Métodos
function getPaymentMethodLabel(method) {
  const paymentMethod = paymentMethods.find(pm => pm.value === method)
  return paymentMethod ? paymentMethod.label : 'No definido'
}

function onCustomerSelected(customer) {
  if (customer) {
    customerData.value = {
      identifier: customer.identifier,
      phone: customer.contactInfo.phone || '',
      documentType: customer.personalInfo.documentType || 'CC',
      documentNumber: customer.personalInfo.documentNumber || '',
      firstName: customer.personalInfo.firstName || '',
      lastName: customer.personalInfo.lastName || '',
      email: customer.contactInfo.email || '',
      address: customer.primaryAddress?.street || '',
      city: customer.primaryAddress?.city || 'Neiva',
      notes: ''
    }

    showAddressForm.value = !!(customer.primaryAddress?.street)
  }
}

function onCreateNew(searchTerm) {
  // Limpiar formulario para nuevo cliente
  customerData.value = {
    identifier: searchTerm || '',
    phone: searchTerm || '',
    documentType: 'CC',
    documentNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: 'Neiva',
    notes: ''
  }

  showCustomerForm.value = true
  selectedCustomer.value = null
}

function onPhoneChange(phone) {
  // Si no hay identificador, usar el teléfono como identificador
  if (!customerData.value.identifier || customerData.value.identifier === customerData.value.phone) {
    customerData.value.identifier = phone
  }
}

async function processOrder() {
  if (!isFormValid.value) {
    $q.notify({
      type: 'negative',
      message: 'Por favor completa los campos requeridos',
      position: 'top-right'
    })
    return
  }

  processing.value = true

  try {
    // Preparar datos de la orden
    const orderData = {
      customer: {
        identifier: customerData.value.identifier || customerData.value.phone,
        name: fullName.value,
        firstName: customerData.value.firstName,
        lastName: customerData.value.lastName,
        phone: customerData.value.phone,
        email: customerData.value.email,
        documentType: customerData.value.documentType,
        documentNumber: customerData.value.documentNumber,
        address: customerData.value.address,
        city: customerData.value.city,
        notes: customerData.value.notes
      },
      items: cartStore.items,
      subtotal: cartStore.subtotal,
      discount: cartStore.discount,
      discountAmount: cartStore.discountAmount,
      shippingCost: cartStore.shippingCost,
      total: cartStore.total,
      paymentMethod: paymentData.value.method,
      paymentStatus: paymentData.value.status,
      status: 'pending',
      internalNotes: internalNotes.value.trim()
    }

    console.log('Creating order with data:', orderData)

    // Crear la orden
    const response = await orderService.createOrder(orderData)

    if (response.success) {
      $q.notify({
        type: 'positive',
        message: `Orden ${response.data.orderNumber} creada exitosamente`,
        position: 'top-right',
        timeout: 3000
      })

      // Limpiar carrito
      cartStore.clearCart()

      // Emitir evento de completado
      emit('order-completed', response.data)
    } else {
      throw new Error(response.message || 'Error al crear la orden')
    }

  } catch (error) {
    console.error('Error processing order:', error)
    $q.notify({
      type: 'negative',
      message: error.message || 'Error al procesar la orden',
      position: 'top-right',
      timeout: 5000
    })
  } finally {
    processing.value = false
  }
}
</script>

<style lang="scss" scoped>
.q-expansion-item {
  border: 1px solid $grey-4;
  border-radius: 4px;
  margin-bottom: 16px;
}
</style>
