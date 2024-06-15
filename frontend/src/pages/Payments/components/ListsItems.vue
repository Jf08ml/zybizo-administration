<template>
  <q-card class="full-width q-mb-lg" style="height: auto">
    <q-card-section>
      <div class="text-body1 text-pink">Lista de productos</div>
      <q-separator />
      <div
        class="card-item q-mt-sm custom-padding-x"
        v-for="(itemToBuy, index) in listItems"
        :key="itemToBuy._id"
      >
        <q-card flat bordered>
          <q-card-section horizontal>
            <q-card-section
              class="flex flex-grow column full-width justify-between"
            >
              <div>
                <div class="custom-text q-mt-sm q-mb-xs">
                  {{ itemToBuy.name }}
                </div>

                <div class="custom-text">
                  <span class="text-grey q-mr-sm">Cantidad:</span>
                  <q-btn
                    btn
                    round
                    size="xs"
                    icon="remove"
                    class="text-body2 text-pink"
                    @click="changeQuantity(itemToBuy, index, -1)"
                  />
                  <span class="q-mx-sm">{{ itemToBuy.quantity }}</span>
                  <q-btn
                    btn
                    round
                    size="xs"
                    icon="add"
                    class="text-body2 text-pink"
                    @click="changeQuantity(itemToBuy, index, 1)"
                  />
                </div>

                <div
                  class="custom-text text-grey"
                  v-if="itemToBuy.references && itemToBuy.references.length > 0"
                >
                  {{
                    itemToBuy.references
                      .map((reference) => reference.selectedOption)
                      .join(", ")
                  }}
                </div>
              </div>
            </q-card-section>

            <q-card-section
              v-if="itemToBuy.image"
              class="col-xs-5 col-md-4 col-lg-3 flex flex-center"
            >
              <q-img class="rounded-borders" :src="itemToBuy?.image" />
            </q-card-section>
          </q-card-section>

          <q-card-actions class="full-width" align="center">
            <div
              class="flex justify-center align-center full-width text-body1 shadow-1 rounded-borders"
            >
              <span class="text-weight-bold" style="margin-top: 2.1px">{{
                formatPrice(itemToBuy.totalPrice)
              }}</span>
              <q-btn
                flat
                round
                size="sm"
                color="red"
                icon="delete"
                @click="removeItem(index)"
              />
            </div>
          </q-card-actions>
        </q-card>
      </div>
      <div>
        <div
          v-if="listItems.length === 0"
          class="text-body1 text-black q-mt-md"
          align="center"
        >
          ¡No has agregado productos, revisa el
          <a href="/catalogozybizo">cátalogo</a>!
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { formatPrice } from "src/utils/utilsFunctions";

const props = defineProps({
  listItems: Array,
});


const emit = defineEmits(["reCalculate", "removeItem"]);

const changeQuantity = (item, index, increment) => {
  if (increment === 1) {
    item.quantity++;
    reCalculate(index);
  } else if (increment === -1 && item.quantity > 1) {
    item.quantity--;
    reCalculate(index);
  }
};

const reCalculate = (index) => {
  emit("reCalculate", index);
};

const removeItem = (index) => {
  emit("removeItem", index);
};
</script>

<style scoped>
/* Estilos por defecto para dispositivos móviles pequeños */
.custom-text {
  font-size: 13px;
}

.custom-padding-x {
  padding: 0;
}

/* Estilos para tablets y pantallas medianas */
@media (min-width: 600px) {
  .custom-text {
    font-size: 14px;
  }
}

/* Estilos para pantallas grandes y desktop */
@media (min-width: 1024px) {
  .custom-text {
    font-size: 15px;
  }
  .custom-padding-x {
    padding-inline: 30px;
  }
}
</style>
