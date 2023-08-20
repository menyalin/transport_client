<template>
  <div>
    <v-dialog v-model="tmpDialog" max-width="800px" persistent>
      <v-card>
        <v-card-title>
          {{ tmpItem._id ? 'Редактировать тариф' : 'Добавить тариф' }}
        </v-card-title>
        <v-card-text id="fields-wrapper">
          <v-autocomplete
            v-if="tmpItem.agreement"
            v-model="tmpItem.document"
            :items="documents"
            label="Документ"
            item-value="_id"
            clearable
            item-text="name"
            dense
            outlined
            hide-details
          />
          <v-select
            v-model="tmpItem.type"
            label="Тип"
            :items="$store.getters.tariffTypes"
            dense
            outlined
            hide-details
          />
          <v-text-field
            v-model="tmpItem.date"
            type="date"
            label="Дата"
            dense
            outlined
            hide-details
            readonly
          />
          <v-select
            ref="truckKindEl"
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
          <app-direct-distance-zones
            v-if="tmpItem.type === 'directDistanceZones'"
            ref="directDistanceZones"
            v-model="directDistanceZones"
            :withVat="tmpItem.withVat"
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
          <v-text-field
            v-if="!['return', 'directDistanceZones'].includes(tmpItem.type)"
            v-model.number="tmpItem.price"
            dense
            type="number"
            :label="tmpItem.withVat ? 'Тариф c НДС' : 'Тариф без НДС'"
            outlined
            hide-details
          />
          <v-text-field
            v-model.trim="tmpItem.note"
            label="Примечание"
            dense
            outlined
            hide-details
          />
        </v-card-text>
        <v-card-actions>
          <v-btn @click="tmpDialog = false"> Отмена </v-btn>
          <v-btn
            v-if="tmpItem._id"
            :disabled="invalidItem"
            color="primary"
            @click="update"
          >
            Обновить
          </v-btn>
          <v-btn
            v-else
            :disabled="invalidItem"
            color="primary"
            @click="pushItem"
          >
            Добавить в список
          </v-btn>
          <v-spacer />
          <v-btn v-if="showDeleteBtn" color="error" @click="deleteItem">
            Удалить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import AppPoints from './points.vue'
import AppAdditionalPoints from './additionalPoints.vue'
import AppDirectDistanceZones from './directDistanceZones.vue'
import AppWaiting from './waiting.vue'
import AppZones from './zones.vue'
import AppReturn from './return.vue'

import { Tariff } from '@/entities/tariff/model'
import { AgreementService, TariffService } from '@/shared/services'

export default {
  name: 'TariffForm',
  components: {
    AppPoints,
    AppAdditionalPoints,
    AppDirectDistanceZones,
    AppWaiting,
    AppReturn,
    AppZones,
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
      agreement: null,
      tmpDialog: false,
      points: {},
      additionalPoints: {},
      tmpItem: {},
      directDistanceZones: {},
      waiting: {},
      returnTariff: {},
      zones: {},
    }
  },
  computed: {
    documents() {
      if (!this.tmpItem.agreement || !this.agreement) return []
      const { clients, outsourceCarriers } = this.agreement
      const partners = [...(clients || []), ...(outsourceCarriers || [])]
      return this.$store.getters.documents.filter((i) =>
        partners.includes(i.partner)
      )
    },
    invalidItem() {
      return Tariff.invalidItem({
        ...this.tmpItem,
        ...(this.tmpItem.type ? this[this.tmpItem.type] : {}),
        ...(this.tmpItem.type === 'return' ? this.returnTariff : {}),
      })
    },
    showDeleteBtn() {
      return this.item._id && this.$store.getters.hasPermission('tariff:delete')
    },
    formState() {
      return {
        ...new Tariff({
          ...this.tmpItem,
          ...(this.tmpItem.type ? this[this.tmpItem.type] : {}),
          ...(this.tmpItem.type === 'return' ? this.returnTariff : {}),
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
          const item = Tariff.tariffFromDBItem(val)
          const itemKeys = Object.keys(item)
          itemKeys.forEach((key) => (this[key] = { ...item[key] }))
          if (val.type === 'return') this.returnTariff = item.return
        }
      },
    },
    ['tmpItem.agreement']: {
      immediate: true,
      handler: async function (val) {
        if (!val) this.agreement = null
        else
          this.agreement = await AgreementService.getById(
            this.tmpItem.agreement
          )
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

    async deleteItem() {
      const res = await this.$confirm('Вы уверены? Запись будет удалена')
      if (!res) return null
      try {
        this.loading = true
        await TariffService.deleteById(this.item._id)
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
