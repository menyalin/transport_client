<template>
  <div class="docs-wrapper">
    <h5>Деление стоимости рейса:</h5>
    <div class="btn-wrapper">
      <v-btn
        variant="text"
        size="small"
        color="primary"
        :loading="loading"
        @click="openDialog"
        :disabled="loading || readonly"
      >
        Добавить часть
      </v-btn>
    </div>
    <div v-if="loading">Загружаю...</div>
    <PaymentPartsTable
      v-else
      :items="preparedItems"
      :hideDelete="readonly || loading"
      @deleteRow="deleteRowHandler"
    />
    <PaymentPartFormDialog
      :routeDate="routeDate"
      :dialog="dialog"
      @submit="submitHandler"
      @close="closeDialog"
    />
  </div>
</template>
<script setup>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { AgreementService } from '@/shared/services/index'
import PaymentPartFormDialog from './formDialog.vue'
import PaymentPartsTable from './paymentPartsTable.vue'

defineOptions({ name: 'OrderPaymentParts' })

const modelValue = defineModel({ type: Array })

const props = defineProps({
  routeDate: { type: String },
  readonly: { type: Boolean },
})

const store = useStore()

const loading = ref(false)
const agreements = ref([])
const parts = ref([])
const dialog = ref(false)

const clientsInParts = computed(() => parts.value.map((i) => i.client))

const preparedItems = computed(() =>
  parts.value.map((part) => {
    const agreement = agreements.value.find((agreement) => agreement._id === part.agreement)
    return {
      ...part,
      agreementName: agreement?.name || '__no name__',
    }
  })
)

watch(
  modelValue,
  (val, oldVal) => {
    if (JSON.stringify(val) === JSON.stringify(oldVal)) return
    parts.value = val
  },
  { deep: true, immediate: true }
)

watch(
  parts,
  (val) => {
    modelValue.value = val
  },
  { deep: true }
)

watch(
  clientsInParts,
  async (newVal, oldVal) => {
    if (Array.isArray(newVal) && newVal.some((i) => !Array.isArray(oldVal) || !oldVal.includes(i)))
      await getAgreements()
  },
  { deep: true, immediate: true }
)

function submitHandler(formState) {
  if (props.readonly) return
  parts.value.push(formState)
  closeDialog()
}

function openDialog() {
  dialog.value = true
}

function closeDialog() {
  dialog.value = false
}

function deleteRowHandler(idx) {
  parts.value.splice(idx, 1)
}

async function getAgreements() {
  try {
    loading.value = true
    const res = await AgreementService.getForClient({
      company: store.getters.directoriesProfile,
      date: props.routeDate,
      clients: clientsInParts.value,
    })
    agreements.value = Object.assign([], res)
  } catch (e) {
    console.log('Ошибка получения соглашений для частей рейса: ', e)
  } finally {
    loading.value = false
  }
}
</script>
<style scoped>
.docs-wrapper {
  margin: 5px;
  padding: 15px;
}
.invalid {
  border: tomato 2px solid;
  border-radius: 5px;
}
.btn-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 15px;
  align-items: center;
  margin: 10px;
}
.not-accepted {
  background-color: rgba(255, 0, 0, 0.4);
}
</style>
