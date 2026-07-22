<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-alert v-model="showError" type="error" closable>
          {{ errorMessage }}
        </v-alert>
        <load-spinner v-if="loading" />
        <fine-form
          v-else
          v-model="item"
          :displayDeleteBtn="!!id && store.getters.hasPermission('fine:delete')"
          @cancel="cancel"
          @submit="submit"
          @delete="deleteHandler"
          @fineNumberUpdated="checkFine"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { FineForm } from '@/entities/fine'
import { LoadSpinner } from '@/shared/ui'
import { FineService } from '@/shared/services'

defineOptions({ name: 'FineDetails' })

const props = defineProps({
  id: String,
})

const router = useRouter()
const store = useStore()

const loading = ref(false)
const showError = ref(false)
const errorMessage = ref('')
const item = ref({})

async function getItem() {
  if (!props.id) return
  loading.value = true
  try {
    item.value = await FineService.getById(props.id)
  } catch (e) {
    store.commit('setError', e.message)
  } finally {
    loading.value = false
  }
}

onMounted(getItem)

async function submit(formState) {
  try {
    if (props.id) await FineService.updateOne(props.id, formState)
    else await FineService.create(formState)
    router.push('/profile/fines')
  } catch (e) {
    showError.value = true
    errorMessage.value = e?.response?.data || e.message
    store.commit('setError', e.message)
  }
}

function cancel() {
  router.go(-1)
}

async function deleteHandler() {
  const res = confirm('Вы действительно хотите удалить запись? ')
  if (!res) return
  try {
    await FineService.deleteById(props.id)
    router.go(-1)
  } catch (e) {
    store.commit('setError', e.message)
  }
}

async function checkFine(event) {
  const fineNumber = event?.target?.value
  if (!fineNumber || fineNumber === item.value?.number) return
  const existedFine = await FineService.getByNumber(fineNumber)
  if (existedFine) {
    showError.value = true
    errorMessage.value = `Штраф с номером ${existedFine.number} уже есть. id штрафа: ${existedFine._id}`
  } else {
    showError.value = false
    errorMessage.value = ''
  }
}
</script>

<style></style>
