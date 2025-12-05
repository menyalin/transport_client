<template>
  <div>
    <v-dialog v-model="tmpDialog" maxWidth="800px" persistent>
      <v-card>
        <v-card-title>
          {{ tmpItem._id ? 'Редактировать тариф' : 'Добавить тариф' }}
        </v-card-title>
        <v-card-text id="fields-wrapper">
          <v-select
            v-model="tmpItem.type"
            label="Тип"
            :items="$store.getters.salaryTariffTypes"
            variant="outlined"
            density="compact"
            hideDetails
          />

          <v-select
            v-model="tmpItem.tks"
            label="ТК"
            :items="$store.getters.tkNamesForSelect"
            multiple
            variant="outlined"
            density="compact"
            hideDetails
          />

          <v-text-field v-model="tmpItem.date" type="date" label="Дата" variant="outlined" hideDetails readonly />
          density="compact"

          <v-select
            v-model="tmpItem.liftCapacity"
            :items="$store.getters.liftCapacityTypes"
            label="Грузоподъемность ТС"
            variant="outlined"
            density="compact"
            multiple
            hideDetails
          />
          <v-select
            v-model="tmpItem.consigneeTypes"
            label="Типы грузополучателей"
            :items="$store.getters.partnerGroups"
            multiple
            variant="outlined"
            density="compact"
            hideDetails
          />
          <AppPoints v-if="tmpItem.type === 'points'" ref="points" v-model="points" :style="{ 'min-width': '550px' }" />
          <AppZones v-if="tmpItem.type === 'zones'" ref="zones" v-model="zones" :style="{ 'min-width': '550px' }" />
          <AppAdditionalPoints
            v-if="tmpItem.type === 'additionalPoints'"
            ref="additionalPoints"
            v-model="additionalPoints"
            :style="{ 'min-width': '550px' }"
          />
          <AppRegions
            v-if="tmpItem.type === 'regions'"
            ref="regions"
            v-model="regions"
            :style="{ 'min-width': '550px' }"
          />

          <app-direct-distance-zones
            v-if="tmpItem.type === 'directDistanceZones'"
            ref="directDistanceZones"
            v-model="directDistanceZones"
            :groupVat="tmpItem.groupVat"
            :style="{ 'min-width': '550px' }"
          />
          <AppWaiting
            v-if="tmpItem.type === 'waiting'"
            ref="waiting"
            v-model="waiting"
            :style="{ 'min-width': '550px' }"
          />
          <AppReturn
            v-if="tmpItem.type === 'return'"
            ref="return"
            v-model="returnTariff"
            :style="{ 'min-width': '550px' }"
          />
          <v-text-field
            v-if="!['directDistanceZones'].includes(tmpItem.type)"
            v-model.number="tmpItem.sum"
            type="number"
            label="Тариф"
            variant="outlined"
            density="compact"
            hideDetails
          />
          <v-text-field
            v-model.trim="tmpItem.note"
            label="Примечание"
            variant="outlined"
            density="compact"
            hideDetails
          />
        </v-card-text>
        <v-card-actions>
          <v-btn @click="tmpDialog = false">Отмена</v-btn>
          <v-btn v-if="tmpItem._id" :disabled="invalidItem" color="primary" @click="update">Обновить</v-btn>
          <v-btn v-else :disabled="invalidItem" color="primary" @click="pushItem">Добавить в список</v-btn>
          <v-spacer />
          <v-btn v-if="showDeleteBtn" color="error" @click="deleteItem">Удалить</v-btn>
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
  import { SalaryTariffService } from '@/shared/services'
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
    },
    data() {
      return {
        tks: [],
        tmpDialog: false,
        points: {},
        zones: {},
        regions: {},
        additionalPoints: {},
        tmpItem: {
          liftCapacity: [],
          consigneeTypes: [],
        },
        directDistanceZones: {},
        waiting: {},
        returnTariff: {},
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
        return {
          ...new SalaryTariffDTO({
            ...this.tmpItem,
            ...(this.tmpItem.type ? this[this.tmpItem.type] : {}),
            ...(this.tmpItem.type && this.tmpItem.type === 'return' ? this.returnTariff : {}),
          }),
        }
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
            itemKeys.forEach(key => (this[key] = { ...item[key] }))
            if (val.type === 'return') this.returnTariff = item.return
          }
        },
      },
    },
    created() {
      document.addEventListener('keyup', this.keypressEventHandler)
    },
    beforeUnmount() {
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
      async deleteItem() {
        const res = await this.$confirm('Вы уверены? Запись будет удалена')
        if (!res) return null
        try {
          this.loading = true
          await SalaryTariffService.deleteById(this.item._id)
          this.loading = false
          this.$emit('deletedItem', this.item._id)
        } catch (e) {
          this.loading = false
          this.$store.commit('setError', e.message)
        }
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
