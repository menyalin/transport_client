<template>
  <div>
    <v-text-field
      v-model="emailStr"
      label="Поиск пользователя по EMAIL"
      clearable
      :disabled="loading"
      :loading="loading"
      :errorMessages="errorMessages"
      @change="changeHandler"
    />
    <div v-if="candidate.name" class="text-headline-medium mb-5">
      <small>Имя:</small> {{ candidate.name }}
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { WorkerService } from '@/shared/services'

const model = defineModel({ type: Object })

const emailStr = ref('')
const loading = ref(false)
const candidate = ref({})
const errorMessages = ref([])

function setCandidate(val) {
  candidate.value = val
  model.value = { ...val }
}

async function changeHandler(value) {
  errorMessages.value = []
  if (value) await searchUser(value)
}

async function searchUser(value) {
  try {
    loading.value = true
    const candidate = await WorkerService.getUserByEmail(value)
    loading.value = false
    if (!candidate) {
      errorMessages.value.push('Пользователь не найден!')
      setCandidate({})
      return
    } else {
      setCandidate(candidate)
    }
  } catch {
    loading.value = false
  }
}
</script>
