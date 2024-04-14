<template>
  <div>
    <q-card class="q-ma-md full-width">
      <q-card-section>
        <div class="text-h6 text-pink">Lista de productos</div>
        <q-separator />
        <div
          class="card-item q-mt-sm"
          v-for="(itemToBuy, index) in listItems"
          :key="itemToBuy._id"
        >
          <q-card flat>
            <q-card-section horizontal class="full-width">
              <q-card-section
                class="flex flex-grow column justify-between full-width"
              >
                <div>
                  <div class="q-mt-sm q-mb-xs">
                    {{ itemToBuy.name }}
                  </div>

                  <div class="text-caption">
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
                    class="text-caption text-grey"
                    v-if="
                      itemToBuy.references && itemToBuy.references.length > 0
                    "
                  >
                    {{
                      itemToBuy.references
                        .map((reference) => reference.selectedOption)
                        .join(", ")
                    }}
                  </div>
                </div>

                <div
                  class="flex justify-center align-center text-body1 shadow-1 rounded-borders"
                  align="center"
                >
                  <span class="text-weight-bold" style="margin-top: 1.3px;">{{
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
              </q-card-section>

              <q-card-section
                v-if="itemToBuy.image"
                class="col-xs-6 col-md-4 col-lg-3 flex flex-center"
              >
                <q-img class="rounded-borders" :src="itemToBuy?.image" />
              </q-card-section>
            </q-card-section>
          </q-card>
        </div>
      </q-card-section>
    </q-card>
  </div>
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
