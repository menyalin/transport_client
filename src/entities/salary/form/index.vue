<template>
  <div>
    <v-dialog
      :model-value="tmpDialog"
      @update:model-value="showDialog = $event"
      max-width="800px"
      persistent
    >
      <v-card>
        <v-card-title>
          {{ tmpItem._id ? 'Редактировать тариф' : 'Добавить тариф' }}
        </v-card-title>
        <v-card-text id="fields-wrapper">
          <v-select
            v-model="tmpItem.type"
            label="Тип"
            :items="$store.getters.salaryTariffTypes"
            hide-details
          />

          <v-select
            v-model="tmpItem.tks"
            label="ТК"
            :items="carrierItems"
            multiple
            item-title="name"
            item-value="_id"
            hide-details
          />

          <v-text-field v-model="tmpItem.date" type="date" label="Дата" hide-details readonly />

          <v-select
            v-model="tmpItem.liftCapacity"
            :items="$store.getters.liftCapacityTypes"
            label="Грузоподъемность ТС"
            multiple
            hide-details
          />
          <v-select
            label="Типы грузополучателей"
            :items="$store.getters.partnerGroups"
            multiple
            hide-details
            v-model="tmpItem.consigneeTypes"
          />
          <app-points
            v-if="tmpItem.type === 'points'"
            ref="points"
            v-model="points"
            :style="{ 'min-width': '550px' }"
          />
          <app-zones
            v-if="tmpItem.type === 'zones'"
            ref="zones"
            v-model="zones"
            :style="{ 'min-width': '550px' }"
          />
          <app-additional-points
            v-if="tmpItem.type === 'additionalPoints'"
            ref="additionalPoints"
            v-model="additionalPoints"
            :style="{ 'min-width': '550px' }"
          />
          <app-regions
            v-if="tmpItem.type === 'regions'"
            ref="regions"
            v-model="regions"
            :style="{ 'min-width': '550px' }"
          />

          <app-waiting
            v-if="tmpItem.type === 'waiting'"
            ref="waiting"
            v-model="waiting"
            :style="{ 'min-width': '550px' }"
          />
          <app-return
            v-if="tmpItem.type === 'return'"
            ref="return"
            v-model="returnTariff"
            :style="{ 'min-width': '550px' }"
          />
          <v-text-field v-model.number="tmpItem.sum" type="number" label="Тариф" hide-details />
          <v-text-field v-model.trim="tmpItem.note" label="Примечание" hide-details />
        </v-card-text>
        <v-card-actions>
          <v-btn @click="tmpDialog = false"> Отмена </v-btn>
          <v-btn v-if="tmpItem._id" :disabled="invalidItem" color="primary" @click="update">
            Обновить
          </v-btn>
          <v-btn v-else :disabled="invalidItem" color="primary" @click="pushItem">
            Добавить в список
          </v-btn>
          <v-spacer />
          <v-btn v-if="showDeleteBtn" color="error" @click="deleteItem"> Удалить </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import AppPoints from './points.vue'
import AppZones from './zones.vue'
import AppRegions from './regions.vue'
import AppAdditionalPoints from './additionalPoints.vue'
import AppWaiting from './waiting.vue'
import AppReturn from './return.vue'
import { SalaryTariffDTO } from './salaryTariff.dto'

export default {
  name: 'TariffForm',
  components: {
    AppPoints,
    AppAdditionalPoints,
    AppWaiting,
    AppReturn,
    AppZones,
    AppRegions,
  },
  model: {
    prop: 'item',
    event: 'change',
  },
  props: {
    item: Object,
    dialog: Boolean,
    carrierItems: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      tks: [],
      tmpDialog: false,
      points: {
        loading: '',
        unloading: '',
      },
      zones: {
        loadingZone: '',
        unloadingZone: '',
      },
      regions: {
        loadingRegion: '',
        unloadingRegion: '',
      },
      additionalPoints: {
        includedPoints: 2,
        orderType: '',
        clients: [],
      },
      tmpItem: {
        liftCapacity: [],
        consigneeTypes: [],
      },

      waiting: {
        includeHours: '',
        roundByHours: '',
        orderType: '',
        tariffBy: '',
        clients: [],
      },
      returnTariff: {
        clients: [],
        isPltReturn: false,
        orderType: '',
      },
    }
  },
  computed: {
    invalidItem() {
      return SalaryTariffDTO.invalidItem({
        ...this.tmpItem,
        ...(this.tmpItem.type ? this[this.tmpItem.type] : {}),
        ...(this.tmpItem.type && this.tmpItem.type === 'return' ? this.returnTariff : {}),
      })
    },
    showDeleteBtn() {
      return this.item._id && this.$store.getters.hasPermission('salaryTariff:delete')
    },
    formState() {
      if (!this.tmpItem.type) return {}
      return new SalaryTariffDTO({
        ...this.tmpItem,
        ...(this.tmpItem.type ? this[this.tmpItem.type] : {}),
        ...(this.tmpItem.type && this.tmpItem.type === 'return' ? this.returnTariff : {}),
      })
    },
  },
  watch: {
    dialog: function (val) {
      this.tmpDialog = val
    },
    tmpDialog: function (val) {
      if (!val) this.cancel()
    },
    item: {
      deep: true,
      immediate: true,
      handler: function (val) {
        if (val) {
          const item = SalaryTariffDTO.tariffFromDBItem(val)
          const itemKeys = Object.keys(item)
          itemKeys.forEach((key) => (this[key] = { ...item[key] }))
          if (val.type === 'return') this.returnTariff = item.return
        }
      },
    },
  },
  created() {
    document.addEventListener('keyup', this.keypressEventHandler)
  },
  beforeDestroy() {
    document.removeEventListener('keyup', this.keypressEventHandler)
  },
  methods: {
    keypressEventHandler(e) {
      if (e.altKey && e.key === 'Enter') this.pushItem()
    },

    cancel() {
      this.$emit('cancel')
    },
    pushItem() {
      if (!this.invalidItem) {
        this.$emit('push', this.formState)
        this.$nextTick(() => {
          this.$refs[this.tmpItem.type].focus()
        })
      }
    },
    update() {
      this.$emit('update', this.formState)
      this.tmpDialog = false
    },
    deleteItem() {
      const res = confirm('Вы уверены? Запись будет удалена')
      if (!res) return null
      else this.$emit('deletedItem', this.item._id)
    },
  },
}
</script>
<style scoped>
#fields-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
