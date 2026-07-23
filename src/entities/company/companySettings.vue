<template>
  <div class="mt-2">
    <v-card v-if="!disabledSettings">
      <v-card-title>Настройки компании:</v-card-title>

      <v-card-text>
        <div id="truck-kinds">
          <v-select
            v-model="settings.truckKinds"
            label="Используемые виды транспорта"
            :items="store.getters.allTruckKinds"
            clearable
            multiple
            item-title="text"
            :style="{ 'max-width': '400px' }"
          />
          <v-select
            v-model="settings.defaultTruckKind"
            label="Вид транспорта по умолчанию"
            :items="
              store.getters.allTruckKinds.filter((i) => settings.truckKinds.includes(i.value))
            "
            :style="{ 'max-width': '220px' }"
            item-title="text"
            clearable
          />
        </div>
        <div id="lift-capacity-types">
          <v-select
            v-model="settings.liftCapacityTypes"
            label="Типы грузоподъемности"
            :items="store.getters.allLiftCapacityTypes"
            item-title="text"
            multiple
            clearable
            :style="{ 'max-width': '400px' }"
          />
          <v-select
            v-model="settings.defaultLiftCapacity"
            label="Грузоподъемность по умолчанию"
            :items="
              store.getters.allLiftCapacityTypes.filter((i) =>
                settings.liftCapacityTypes.includes(i)
              )
            "
            clearable
            item-title="text"
            :style="{ 'max-width': '220px' }"
          />
        </div>
        <div v-if="showLoadDirectionSettings" id="load-directions">
          <v-select
            v-model="settings.loadDirections"
            label="Варианты загрузки"
            item-title="text"
            :items="store.getters.allLoadDirection"
            multiple
            clearable
            :style="{ 'max-width': '400px' }"
          />
          <v-select
            v-model="settings.defaultLoadDirection"
            label="Вариант загрузки по умолчанию"
            :items="
              store.getters.allLoadDirection.filter((i) =>
                settings.loadDirections.includes(i.value)
              )
            "
            item-title="text"
            clearable
            :style="{ 'max-width': '220px' }"
          />
        </div>
        <v-textarea
          v-model="settings.commonOrderContractNote"
          label="Примечание для договора-заявки"
          rows="15"
        />
      </v-card-text>
      <v-card-actions>
        <v-btn :disabled="!changed" @click="cancel"> Отмена </v-btn>
        <v-btn color="primary" :disabled="!changed" @click="submit"> Сохранить </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { CompanyService } from '@/shared/services'

defineOptions({ name: 'CompanySettings' })

const props = defineProps({
  companyId: { type: String, required: true },
})

const store = useStore()

const loading = ref(false)
const settings = ref({
  truckKinds: [],
  defaultTruckKind: null,
  liftCapacityTypes: [],
  defaultLiftCapacity: null,
  loadDirections: [],
  defaultLoadDirection: null,
  commonOrderContractNote: null,
})

const disabledSettings = computed(
  () =>
    !store.getters.hasPermission('fullAccess') ||
    store.getters.directoriesProfile !== props.companyId
)

const showLoadDirectionSettings = computed(() => settings.value.truckKinds.includes('tent'))

const storedSettings = computed(() => store.getters.companySettings)

const changed = computed(() => {
  if (!storedSettings.value) return false
  const keys = Object.keys(settings.value)
  return keys.some(
    (key) => settings.value[key]?.toString() !== storedSettings.value[key]?.toString()
  )
})

function setSettings() {
  if (storedSettings.value) {
    const keys = Object.keys(settings.value)
    keys.forEach((key) => {
      settings.value[key] = storedSettings.value[key]
    })
  }
}

watch(
  () => settings.value.truckKinds,
  (val) => {
    if (!val || val.length === 0) {
      settings.value.loadDirections = []
      settings.value.defaultLoadDirection = null
      return
    }
    if (!val.includes('tent')) {
      settings.value.loadDirections = ['rear']
      settings.value.defaultLoadDirection = 'rear'
    }
    if (!val.includes(settings.value.defaultTruckKind)) settings.value.defaultTruckKind = null
    if (val.length === 1) settings.value.defaultTruckKind = val[0]
  }
)

watch(
  () => settings.value.liftCapacityTypes,
  (val) => {
    if (!val.includes(settings.value.defaultLiftCapacity)) settings.value.defaultLiftCapacity = null
    if (val.length === 1) settings.value.defaultLiftCapacity = val[0]
  }
)

async function submit() {
  loading.value = true
  try {
    await CompanyService.updateSettings({
      settings: settings.value,
    })
  } catch (e) {
    store.commit('setError', e.message)
  } finally {
    loading.value = false
  }
}

function cancel() {
  setSettings()
}

onMounted(() => {
  setSettings()
})
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
