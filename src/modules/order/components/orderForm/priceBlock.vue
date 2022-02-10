<template>
  <div>
    <div>
      <app-block-title>{{ title }}</app-block-title>
    </div>
    <div>
      <div id="button-panel">
        <v-btn
          small
          text
          outlined
          :disabled="calcMethod === 'fixed'"
          color="primary"
          class="mx-1"
          @click="fillBasePrice"
        >
          Заполнить тариф
        </v-btn>
        <v-btn
          small
          text
          outlined
          color="primary"
          @click="openDialog"
        >
          Добавить сумму
        </v-btn>
      </div>
      <v-simple-table dense>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-center">
                Тип
              </th>
              <th class="text-center">
                Цена без НДС
              </th>
              <th class="text-center">
                Сумма НДС
              </th>
              <th class="text-center">
                Цена итоговая
              </th>
              <th class="text-center">
                Примечание
              </th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, idx) in tmpItems"
              :key="idx"
            >
              <td class="text-center">
                {{
                  $store.getters.orderPriceTypesMap.has(item.type)
                    ? $store.getters.orderPriceTypesMap.get(item.type)
                    : '-'
                }}
              </td>
              <td class="text-center">
                {{ new Intl.NumberFormat().format(item.priceWOVat) }}
              </td>
              <td class="text-center">
                {{ new Intl.NumberFormat().format(item.sumVat) }}
              </td>
              <td class="text-center">
                {{ new Intl.NumberFormat().format(item.price) }}
              </td>
              <td class="text-center">
                {{ item.note }}
              </td>
              <td class="text-right">
                <v-btn
                  v-if="!(item.type === 'base' && calcMethod !== 'fixed')"
                  icon
                  @click="editPrice(item.type)"
                >
                  <v-icon
                    color="green"
                    small
                  >
                    mdi-pencil
                  </v-icon>
                </v-btn>
                <v-btn
                  icon
                  @click="deletePrice(item.type)"
                >
                  <v-icon
                    color="red"
                    small
                  >
                    mdi-delete
                  </v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
          <v-dialog
            v-model="dialog"
            max-width="800"
          >
            <v-card>
              <v-card-title>Редактировать сумму</v-card-title>
              <v-card-text>
                <div class="form-wrapper">
                  <div class="row">
                    <v-select
                      v-model="editedPrice.type"
                      :readonly="editMode"
                      label="Тип затрат"
                      :items="availablePriceTypes"
                      hide-details
                      dense
                      outlined
                      :style="{ 'max-width': '250px' }"
                    />
                    <v-text-field
                      v-model.number="editedPrice.tmpPrice"
                      label="Сумма"
                      hide-details
                      outlined
                      dense
                      :style="{ 'max-width': '150px' }"
                    />
                    <v-checkbox
                      v-model="withVat"
                      label="c НДС"
                      hide-details
                      dense
                    />
                  </div>
                  <div class="row">
                    <v-text-field
                      v-model.lazy="editedPrice.note"
                      label="Комментарий"
                      outlined
                      dense
                      hide-details
                    />
                  </div>
                </div>
              </v-card-text>
              <v-card-actions>
                <v-btn @click="cancelDialog">
                  Отмена
                </v-btn>
                <v-btn
                  color="primary"
                  :disabled="!isValidNewPrice"
                  @click="addPrice"
                >
                  Сохранить
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
      </v-simple-table>
    </div>
  </div>
</template>
<script>
import AppBlockTitle from './blockTitle.vue'
import AgreementService from '@/modules/profile/services/agreement.service'

export default {
  name: 'PriceBlock',
  components: {
    AppBlockTitle,
  },
  model: {
    prop: 'items',
    event: 'change',
  },
  props: {
    items: Array,
    title: String,
    agreementId: String,
  },
  data() {
    return {
      editMode: true,
      calcMethod: null,
      tmpItems: [],
      agreement: {},
      withVat: true,
      dialog: false,
      editedPrice: {
        type: null,
        tmpPrice: 0,
        note: null,
      },
    }
  },
  computed: {
    availablePriceTypes() {
      if (!this.calcMethod) return []
      return this.$store.getters.orderPriceTypes.filter((t) =>
        this.calcMethod === 'fixed' ? true : t.value !== 'base'
      )
    },
    isValidNewPrice() {
      return this.editedPrice.tmpPrice > 0 && !!this.editedPrice.type
    },
  },
  watch: {
    items: {
      immediate: true,
      handler: function (val) {
        if (val) {
          this.tmpItems = val
        }
        if (
          val &&
          val.map((i) => i.type).includes('base')
          // this.agreement?.vatRate
        ) {
          const base = val.find((i) => i.type === 'base')
          this.basePrice =
            this.agreement?.vatRate !== 0 && this.withVat
              ? base.price
              : base.priceWOVat

          this.basePriceNote = base.note
        }
      },
    },
    tmpItems: {
      deep: true,
      handler: function () {
        this.$emit('change', this.tmpItems)
      },
    },
    agreementId: {
      immediate: true,
      handler: async function (val) {
        if (val) {
          this.agreement = await AgreementService.getById(val)
          this.withVat = this.agreement.vatRate !== 0
          this.calcMethod = this.agreement.calcMethod
        } else {
          this.agreement = { ...{} }
        }
      },
    },
  },
  methods: {
    setPrice() {
      const parsedVal = parseFloat(this.editedPrice.tmpPrice)
      if (!this.agreement?.vatRate) return null
      if (isNaN(parsedVal)) return null
      const vatKoef = parseFloat(1 + this.agreement.vatRate / 100)
      const newPriceItem = {
        type: this.editedPrice.type,
        priceWOVat: this.withVat ? parsedVal / vatKoef : parsedVal,
        sumVat: this.withVat
          ? parsedVal - parsedVal / vatKoef
          : parsedVal * ((vatKoef * 10 - 10) / 10),
        price: this.withVat
          ? parsedVal
          : parsedVal + parsedVal * ((vatKoef * 10 - 10) / 10),
        note: this.editedPrice.note,
      }
      const idx = this.tmpItems.findIndex(
        (i) => i.type === this.editedPrice.type
      )
      if (idx === -1) this.tmpItems.push(newPriceItem)
      else this.tmpItems.splice(idx, 1, newPriceItem)
    },
    cancelDialog() {
      this.dialog = false
    },
    openDialog() {
      this.editMode = false
      this.editedPrice.tmpPrice = 0
      this.editedPrice.type = null
      this.editedPrice.note = null
      this.dialog = true
    },
    async deletePrice(type) {
      const idx = this.tmpItems.findIndex((i) => i.type === type)
      if (idx === -1) return null
      const res = await this.$confirm('Вы уверены?')
      if (res) this.tmpItems = this.tmpItems.splice(idx, 1)
    },
    addPrice() {
      this.setPrice()
      this.editedPrice = {
        type: null,
        tmpPrice: 0,
        note: null,
      }
      this.dialog = false
    },
    editPrice(type) {
      const idx = this.tmpItems.findIndex((i) => i.type === type)
      if (idx === -1) return null
      this.editMode = true
      this.editedPrice.type = this.tmpItems[idx].type
      this.editedPrice.tmpPrice = this.withVat
        ? this.tmpItems[idx].price
        : this.tmpItems[idx].priceWOVat
      this.editedPrice.note = this.tmpItems[idx].note
      this.$nextTick(() => {
        this.dialog = true
      })
    },
    fillBasePrice() {
      console.log('Должен заполниться базовый тариф')
    },
  },
}
</script>
<style scoped>
.base-price-block {
  display: flex;
  flex-direction: row;
  max-width: 800px;
}
.base-price-block > * {
  margin: 10px;
}
#button-panel {
  display: flex;
  flex-direction: row;
  justify-content: end;
}
.row {
  display: flex;
  flex-direction: row;
}
.row > * {
  margin: 10px;
}
</style>
