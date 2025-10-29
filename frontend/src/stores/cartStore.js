import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // Estado del carrito
  const items = ref([])
  const customer = ref({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    notes: ''
  })

  // Configuración de pago
  const paymentMethod = ref('cash')
  const paymentStatus = ref('pending')
  const discount = ref(0)
  const shippingCost = ref(0)

  // Computadas
  const itemCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  const subtotal = computed(() => {
    return items.value.reduce((total, item) => {
      // Prioridad: precio de variante > precio del item > 0
      const price = item.selectedVariant?.price || item.price || 0
      console.log('CartStore subtotal calculation:', {
        itemName: item.name,
        variantPrice: item.selectedVariant?.price,
        itemPrice: item.price,
        finalPrice: price,
        quantity: item.quantity,
        itemTotal: price * item.quantity
      })
      return total + (price * item.quantity)
    }, 0)
  })

  const discountAmount = computed(() => {
    return (subtotal.value * discount.value) / 100
  })

  const total = computed(() => {
    return subtotal.value - discountAmount.value + shippingCost.value
  })

  const hasItems = computed(() => items.value.length > 0)

  const isValidOrder = computed(() => {
    // Solo requiere productos en el carrito para permitir procesar
    // La información del cliente se captura en el checkout
    const valid = hasItems.value
    console.log('CartStore isValidOrder:', {
      hasItems: hasItems.value,
      itemCount: items.value.length,
      isValid: valid
    })
    return valid
  })

  const isValidCheckout = computed(() => {
    // Validación completa para finalizar la orden
    return hasItems.value &&
           customer.value.name.trim() !== '' &&
           (customer.value.phone.trim() !== '' || customer.value.email.trim() !== '')
  })

  // Acciones
  function addItem(product, variant = null) {
    const productPrice = product.salePrice || product.basePrice || product.price || 0

    console.log('CartStore: Adding item:', {
      productName: product.name,
      productPrice: productPrice,
      basePrice: product.basePrice,
      salePrice: product.salePrice,
      variant: variant
    })

    // Buscar si el item ya existe con la misma configuración exacta
    const existingIndex = items.value.findIndex(item => {
      const productId = product._id || product.id
      const itemProductId = item.product

      console.log('CartStore: Comparing products:', {
        newProductId: productId,
        existingProductId: itemProductId,
        areEqual: itemProductId === productId
      })

      // Productos sin variantes
      if (!variant && !item.selectedVariant) {
        return itemProductId === productId
      }

      // Solo uno tiene variante - son diferentes
      if (!variant || !item.selectedVariant) {
        console.log('CartStore: Different variant configurations - treating as different items')
        return false
      }

      // Ambos tienen variantes - comparar configuraciones
      if (variant.selections && item.selectedVariant.selections) {
        // Variantes múltiples - comparar todas las selecciones
        const currentSelections = JSON.stringify(variant.selections)
        const itemSelections = JSON.stringify(item.selectedVariant.selections)
        const isSameProduct = itemProductId === productId
        const isSameConfig = currentSelections === itemSelections

        console.log('CartStore: Comparing multiple variants:', {
          isSameProduct,
          isSameConfig,
          current: variant.selections,
          existing: item.selectedVariant.selections,
          currentString: currentSelections,
          existingString: itemSelections
        })

        return isSameProduct && isSameConfig
      } else {
        // Variante simple (compatibilidad)
        return itemProductId === productId &&
               item.selectedVariant.referenceName === variant.referenceName &&
               item.selectedVariant.optionValue === variant.optionValue
      }
    })

    if (existingIndex !== -1) {
      // Incrementar cantidad del item existente
      console.log('CartStore: Incrementing existing item')
      items.value[existingIndex].quantity += 1
    } else {
      // Agregar nuevo item (configuración única)
      console.log('CartStore: Adding new item with unique configuration')

      const productId = product._id || product.id
      const productPrice = product.salePrice || product.basePrice || product.price || 0

      const newItem = {
        product: productId,
        name: product.name,
        sku: product.sku,
        price: variant?.price || productPrice,
        quantity: 1,
        image: product.images?.[0] || null,
        selectedVariant: variant ? {
          selections: variant.selections || null,
          referenceName: variant.referenceName || null,
          optionValue: variant.optionValue || null,
          optionLabel: variant.optionLabel,
          price: variant.price || productPrice
        } : null
      }

      console.log('CartStore: New item created:', newItem)
      items.value.push(newItem)
    }
  }

  function removeItem(index) {
    if (index >= 0 && index < items.value.length) {
      items.value.splice(index, 1)
    }
  }

  function updateQuantity(index, quantity) {
    if (index >= 0 && index < items.value.length) {
      if (quantity <= 0) {
        removeItem(index)
      } else {
        items.value[index].quantity = quantity
      }
    }
  }

  function clearCart() {
    items.value = []
    customer.value = {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      notes: ''
    }
    paymentMethod.value = 'cash'
    paymentStatus.value = 'pending'
    discount.value = 0
    shippingCost.value = 0
  }

  function setCustomer(customerData) {
    customer.value = { ...customer.value, ...customerData }
  }

  function setPaymentMethod(method) {
    paymentMethod.value = method
  }

  function setPaymentStatus(status) {
    paymentStatus.value = status
  }

  function setDiscount(discountPercent) {
    discount.value = Math.max(0, Math.min(100, discountPercent))
  }

  function setShippingCost(cost) {
    shippingCost.value = Math.max(0, cost)
  }

  // Generar datos de la orden
  function generateOrderData() {
    return {
      customer: customer.value,
      items: items.value,
      subtotal: subtotal.value,
      discount: discount.value,
      discountAmount: discountAmount.value,
      shippingCost: shippingCost.value,
      total: total.value,
      paymentMethod: paymentMethod.value,
      paymentStatus: paymentStatus.value,
      status: 'pending',
      orderDate: new Date().toISOString(),
      internalNotes: ''
    }
  }

  return {
    // Estado
    items,
    customer,
    paymentMethod,
    paymentStatus,
    discount,
    shippingCost,

    // Computadas
    itemCount,
    subtotal,
    discountAmount,
    total,
    hasItems,
    isValidOrder,
    isValidCheckout,

    // Acciones
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setCustomer,
    setPaymentMethod,
    setPaymentStatus,
    setDiscount,
    setShippingCost,
    generateOrderData
  }
})
