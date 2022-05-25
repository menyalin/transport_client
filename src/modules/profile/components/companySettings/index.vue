<template>
  <div class="mt-2">
    <v-card v-if="!disabledSettings">
      <v-card-title>Настройки компании:</v-card-title>
      <v-card-text>
        <div id="truck-kinds">
          <v-select
            v-model="settings.truckKinds"
            label="Используемые виды транспорта"
            :items="$store.getters.allTruckKinds"
            clearable
            multiple
            :style="{ 'max-width': '400px' }"
          />
          <v-select
            v-model="settings.defaultTruckKind"
            label="Вид транспорта по умолчанию"
            :items="
              $store.getters.allTruckKinds.filter((i) =>
                settings.truckKinds.includes(i.value)
              )
            "
            :style="{ 'max-width': '220px' }"
            clearable
          />
        </div>
        <div id="lift-capacity-types">
          <v-select
            v-model="settings.liftCapacityTypes"
            label="Типы грузоподъемности"
            :items="$store.getters.allLiftCapacityTypes"
            multiple
            clearable
            :style="{ 'max-width': '400px' }"
          />
          <v-select
            v-model="settings.defaultLiftCapacity"
            label="Грузоподъемность по умолчанию"
            :items="
              $store.getters.allLiftCapacityTypes.filter((i) =>
                settings.liftCapacityTypes.includes(i)
              )
            "
            clearable
            :style="{ 'max-width': '220px' }"
          />
        </div>
        <div
          v-if="showLoadDirectionSettings"
          id="load-directions"
        >
          <v-select
            v-model="settings.loadDirections"
            label="Варианты загрузки"
            :items="$store.getters.allLoadDirection"
            multiple
            clearable
            :style="{ 'max-width': '400px' }"
          />
          <v-select
            v-model="settings.defaultLoadDirection"
            label="Вариант загрузки по умолчанию"
            :items="
              $store.getters.allLoadDirection.filter((i) =>
                settings.loadDirections.includes(i.value)
              )
            "
            clearable
            :style="{ 'max-width': '220px' }"
          />
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn
          :disabled="!changed"
          @click="cancel"
        >
          Отмена
        </v-btn>
        <v-btn
          color="primary"
          :disabled="!changed"
          @click="submit"
        >
          Сохранить
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
import CompanyService from '../../services/company.service'

export default {
  name: 'CompanySettings',
  props: {
    companyId: { type: String, required: true },
  },
  data() {
    return {
      loading: false,
      settings: {
        truckKinds: [],
        defaultTruckKind: null,
        liftCapacityTypes: [],
        defaultLiftCapacity: null,
        loadDirections: [],
        defaultLoadDirection: null,
      },
    }
  },
  computed: {
    disabledSettings() {
      return (
        !this.$store.getters.hasPermission('fullAccess') ||
        this.$store.getters.directoriesProfile !== this.companyId
      )
    },
    showLoadDirectionSettings() {
      if (this.settings.truckKinds.includes('tent')) return true
      return false
    },
    storedSettings() {
      return this.$store.getters.companySettings
    },
    changed() {
      const keys = Object.keys(this.settings)
      for (let i = 0; i < keys.length; i++) {
        if (
          this.settings[keys[i]]?.toString() !==
          this.storedSettings[keys[i]]?.toString()
        )
          return true
      }
      return false
    },
  },
  watch: {
    ['settings.truckKinds']: {
      handler: function (val) {
        if (!val || val.length === 0) {
          this.settings.loadDirections = []
          this.settings.defaultLoadDirection = null
          return null
        }
        if (!val.includes('tent')) {
          this.settings.loadDirections = ['rear']
          this.settings.defaultLoadDirection = 'rear'
        }
        if (!val.includes(this.settings.defaultTruckKind))
          this.settings.defaultTruckKind = null
        if (val.length === 1) this.settings.defaultTruckKind = val[0]
      },

      ['settings.liftCapacityTypes']: {
        handler: function (val) {
          if (!val.includes(this.settings.defaultLiftCapacity))
            this.settings.defaultLiftCapacity = null
          if (val.length === 1) this.settings.defaultLiftCapacity = val[0]
        },
      },
    },
  },
  created() {
    this.setSettings()
  },
  methods: {
    async submit() {
      await CompanyService.updateSettings({
        settings: this.settings,
      })
    },
    cancel() {
      this.setSettings()
    },
    setSettings() {
      const keys = Object.keys(this.settings)
      keys.forEach((key) => {
        this.settings[key] = this.storedSettings[key]
      })
    },
  },
}
</script>
<style scoped>
#truck-kinds,
#lift-capacity-types,
#load-directions {
  display: flex;
  flex-direction: row;
  gap: 15px;
  justify-content: flex-start;
  align-items: center;
}
</style>
