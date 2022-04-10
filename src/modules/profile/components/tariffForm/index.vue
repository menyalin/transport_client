<template>
  <div>
    <v-dialog
      v-model="tmpDialog"
      max-width="800px"
    >
      <v-card>
        <v-card-title>Добавить тариф</v-card-title>
        <v-card-text>
          <p>tariff: {{ item }}</p>
          <v-select
            v-model="tmpItem.truckKind"
            :items="$store.getters.truckKinds"
            label="Вид ТС"
            outlined
            dense
            hide-details
          />
          <v-select
            v-model="tmpItem.liftCapacity"
            :items="$store.getters.liftCapacityTypes"
            label="Грузоподъемность ТС"
            outlined
            dense
            hide-details
          />
          <app-address-autocomplete
            v-model="tmpItem.loading"
            label="Погрузка"
            dense
            :style="{ 'min-width': '550px' }"
            outlined
            hide-details
          />
          <app-address-autocomplete
            v-model="tmpItem.unloading"
            label="Разгрузка"
            dense
            :style="{ 'min-width': '550px' }"
            outlined
            hide-details
          />
          <v-text-field
            v-model.number="tmpItem.price"
            dense
            type="number"
            :label="tmpItem.groupVat ? 'Тариф c НДС' : 'Тариф без НДС'"
            outlined
            hide-details
          />
          tmpItem: {{ tmpItem }}
        </v-card-text>
        <v-card-actions>
          <v-btn @click="tmpDialog = false">
            Отмена
          </v-btn>
          <v-btn @click="save">
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import AppAddressAutocomplete from '@/modules/common/components/addressAutocomplete'
import { TariffDTO } from './tariff.dto'

export default {
  name: 'TariffForm',
  components: {
    AppAddressAutocomplete,
  },
  model: {
    prop: 'item',
    event: 'change',
  },
  props: {
    item: Object,
    dialog: Boolean,
  },
  data() {
    return {
      tmpDialog: false,
      tmpItem: {},
    }
  },
  watch: {
    dialog: function (val) {
      if (val) this.tmpDialog = true
    },
    tmpDialog: function (val) {
      if (!val) this.cancel()
    },
    item: {
      deep: true,
      immediate: true,
      handler: function (val) {
        this.tmpItem = { ...val }
      },
    },
  },
  methods: {
    cancel() {
      this.$emit('cancel')
    },
    save() {
      try {
        console.log({ ...new TariffDTO(this.tmpItem) })
      } catch (e) {
        console.log(e)
      }

      // this.emit('save', { ...this.tmpItem })
    },
  },
}
</script>
<style scoped></style>
