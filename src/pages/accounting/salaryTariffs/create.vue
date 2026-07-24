<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-alert v-model="error.show" closable type="error">
          {{ error.message }}
        </v-alert>
        <div class="text-h5 ma-3">Создать группу тарифов</div>

        <load-spinner v-if="loading" />
        <div v-else class="pt-2">
          <buttons-panel
            panel-type="form"
            :disabled-submit="!hasWritePermission || disabledSubmit"
            @cancel="cancel"
            @submit="submit"
          />
          <app-salary-tariff-settings
            v-model="settings"
            :disabled="disabledSettings"
            :carriers="carrierStore.carriers"
          />
          <v-tooltip text="alt + N" location="bottom">
            <template #activator="{ props }">
              <v-btn
                color="primary"
                size="small"
                class="ma-2"
                :disabled="!allowCreateTariffItem"
                v-bind="props"
                @click="addBtnHandler"
              >
                Добавить тариф alt+N
              </v-btn>
            </template>
          </v-tooltip>
          <SalaryTariffForm
            v-model="editableTariff"
            :dialog="dialog"
            :carrierItems="carrierStore.carriers"
            @cancel="closeDialog"
            @push="pushItem"
          />
          <app-salary-tariff-group-list v-model="items" @removeItem="deleteItem" />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { LoadSpinner } from '@/shared/ui'
import AppSalaryTariffSettings from '@/modules/accounting/components/salaryTariffSettings/index.vue'
import AppSalaryTariffGroupList from '@/modules/accounting/components/salaryTariffGroupList/index.vue'

import { ButtonsPanel } from '@/shared/ui'
import { SalaryTariffService } from '@/shared/services'
import { useCarrierStore } from '@/entities/carrier/useCarrierStore'
import { SalaryTariffForm } from '@/entities/salary'

defineOptions({ name: 'CreateTariff' })

const router = useRouter()
const store = useStore()
const carrierStore = useCarrierStore()

const items = ref([])
const editableTariff = ref({})
const settings = ref({})
const dialog = ref(false)
const loading = ref(false)
const error = ref({
  message: null,
  show: false,
})

const allowCreateTariffItem = computed(
  () => settings.value.date && Array.isArray(settings.value.tks) && settings.value.tks.length
)
const disabledSettings = computed(() => items.value.length > 0)
const disabledSubmit = computed(() => items.value.length === 0)
const hasWritePermission = computed(() => store.getters.hasPermission('salaryTariff:write'))

function deleteItem(ind) {
  items.value.splice(ind, 1)
}

function keypressEventHandler(e) {
  if (e.altKey && (e.key === 'n' || e.key === 'т')) addBtnHandler()
}

function addBtnHandler() {
  if (!allowCreateTariffItem.value) return null
  editableTariff.value = { ...settings.value }
  if (editableTariff.value.type === 'additionalPoints') editableTariff.value.includedPoints = 2
  dialog.value = false
  nextTick(() => {
    dialog.value = true
  })
}

function pushItem(item) {
  items.value.push(item)
  editableTariff.value = { ...settings.value }
}

function closeDialog() {
  dialog.value = false
}

function cancel() {
  router.go(-1)
}

async function submit() {
  try {
    loading.value = true
    await SalaryTariffService.create(
      items.value.map((i) => ({
        ...i,
        company: store.getters.directoriesProfile,
      }))
    )
    loading.value = false
    router.push({ name: 'SalaryTariffList' })
  } catch (e) {
    loading.value = false
    store.commit('setError', e.message)
  }
}

onMounted(() => {
  document.addEventListener('keyup', keypressEventHandler)
})

onBeforeUnmount(() => {
  document.removeEventListener('keyup', keypressEventHandler)
})
</script>

<style></style>
