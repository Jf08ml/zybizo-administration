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

        <!-- Información de pago -->
        <div class="text-subtitle2 q-mb-sm q-mt-md">Información de Pago</div>

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
              :options="paymentStatusOptions"
              label="Estado del pago"
              outlined
              dense
              emit-value
              map-options
            />
          </div>
        </div>

        <!-- Notas internas -->
        <q-input
          v-model="internalNotes"
          label="Notas internas (opcional)"
          type="textarea"
          rows="2"
          outlined
          dense
          class="q-mb-md"
        />

        <!-- Resumen final -->
        <q-card flat bordered class="q-pa-md">
          <div class="text-subtitle2 q-mb-sm">Resumen de la orden</div>

          <div class="row justify-between q-mb-xs">
            <span>Subtotal:</span>
            <span>${{ cartStore.subtotal.toLocaleString() }}</span>
          </div>

          <div v-if="cartStore.discount > 0" class="row justify-between q-mb-xs text-orange-8">
            <span>Descuento ({{ cartStore.discount }}%):</span>
            <span>-${{ cartStore.discountAmount.toLocaleString() }}</span>
          </div>

          <div v-if="cartStore.shippingCost > 0" class="row justify-between q-mb-xs">
            <span>Envío:</span>
            <span>${{ cartStore.shippingCost.toLocaleString() }}</span>
          </div>

          <q-separator class="q-my-sm" />

          <div class="row justify-between text-h6 text-weight-bold">
            <span>Total:</span>
            <span class="text-primary">${{ cartStore.total.toLocaleString() }}</span>
          </div>
        </q-card>

        <!-- Botones de acción -->
        <div class="row q-col-gutter-sm q-mt-lg">
          <div class="col-6">
            <q-btn
              label="Cancelar"
              color="grey-7"
              outline
              class="full-width"
              @click="$emit('cancel')"
              :disable="processing"
            />
          </div>
          <div class="col-6">
            <q-btn
              label="Procesar Orden"
              color="primary"
              type="submit"
              class="full-width"
              :loading="processing"
              :disable="!isFormValid"
            />
          </div>
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useCartStore } from 'src/stores/cartStore'
import orderService from 'src/services/orderService'

const emit = defineEmits(['order-completed', 'cancel'])

const $q = useQuasar()
const cartStore = useCartStore()

// Referencias
const form = ref(null)

// Estado del formulario
const processing = ref(false)
const customerData = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  notes: ''
})

const paymentData = ref({
  method: 'cash',
  status: 'pending'
})

const internalNotes = ref('')

// Opciones
const paymentMethods = [
  { label: 'Efectivo', value: 'cash' },
  { label: 'Tarjeta de Débito', value: 'debit_card' },
  { label: 'Tarjeta de Crédito', value: 'credit_card' },
  { label: 'Transferencia', value: 'transfer' },
  { label: 'QR/Digital', value: 'digital' }
]

const paymentStatusOptions = [
  { label: 'Pendiente', value: 'pending' },
  { label: 'Pagado', value: 'paid' },
  { label: 'Parcial', value: 'partial' }
]

// Computadas
const isFormValid = computed(() => {
  return customerData.value.name.trim() !== '' &&
         (customerData.value.phone.trim() !== '' || customerData.value.email.trim() !== '')
})

// Métodos
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
      customer: customerData.value,
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
      message: 'Error al procesar la orden: ' + error.message,
      position: 'top-right',
      timeout: 5000
    })
  } finally {
    processing.value = false
  }
}

// Lifecycle
onMounted(() => {
  // Sincronizar datos del carrito
  customerData.value = { ...cartStore.customer }
  paymentData.value.method = cartStore.paymentMethod
  paymentData.value.status = cartStore.paymentStatus
})
</script>

<style lang="scss" scoped>
// Estilos específicos si son necesarios
</style>
