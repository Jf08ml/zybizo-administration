<template>
  <div>
    <q-card class="q-ma-md full-width">
      <q-card-section>
        <div class="text-h6">Lista de productos</div>
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
                  <div class="text-overline q-mt-sm q-mb-xs">
                    {{ itemToBuy.name }}
                  </div>

                  <div class="text-caption text-grey">
                    Cantidad:
                    <input
                      v-model="itemToBuy.quantity"
                      style="width: 30px; text-align: center"
                      @change="reCalculate(index)"
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
                  class="flex justify-center text-h6 q-mt-xs q-mb-xs text-primary shadow-2"
                  align="center"
                >
                  <span class="q-mt-xs">{{
                    formatPrice(itemToBuy.totalPrice)
                  }}</span>
                  <div>
                    <q-btn
                      flat
                      round
                      color="red"
                      icon="delete"
                      @click="removeItem(index)"
                    />
                  </div>
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

const reCalculate = (index) => {
  emit("reCalculate", index);
};

const removeItem = (index) => {
    emit("removeItem", index)
}
</script>
