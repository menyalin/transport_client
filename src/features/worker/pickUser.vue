<template>
  <div>
    <v-text-field
      v-model="emailStr"
     
      label="Поиск пользователя по EMAIL"
      variant="outlined"
       density="compact"
      clearable
      :disabled="loading"
      :loading="loading"
      :errorMessages="errorMessages"
      @change="changeHandler"
    />
    <div v-if="candidate.name" class="text-h5 mb-5">
      <small>Имя:</small>
      {{ candidate.name }}
    </div>
  </div>
</template>
<script>
import { ref } from 'vue'
import { WorkerService } from '@/shared/services'

export default {
  name: 'PickUserFeature',
  model: {
    prop: 'value',
    event: 'change',
  },
  setup(_props, ctx) {
    const emailStr = ref('')
    const loading = ref(false)
    const candidate = ref({})
    const errorMessages = ref([])

    function setCandidate(val) {
      candidate.value = val
      ctx.emit('change', { ...val })
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
      } catch (e) {
        loading.value = false
      }
    }

    return {
      loading,
      emailStr,
      changeHandler,
      errorMessages,
      candidate,
    }
  },
}
</script>
