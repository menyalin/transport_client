<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-alert type="error" closable :model-value="showError">
          {{ errorMessage }}
        </v-alert>
        <v-alert type="error" v-if="itemIsMissing && !loading"> Запись не найдена </v-alert>
        <LoadSpinner v-if="loading" />
        <div v-else class="slot-wrapper">
          <slot />
          <v-btn v-if="displayDeleteBtn" color="error" @click="deleteHandler" class="ma-3">
            <v-icon start icon="mdi-delete" />
            Удалить
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { LoadSpinner } from '@/shared/ui'

defineOptions({ name: 'EntityFormWrapper' })

defineProps({
  itemIsMissing: {
    type: Boolean,
    default: false,
  },
  showError: Boolean,
  errorMessage: String,
  loading: {
    type: Boolean,
    default: false,
  },
  displayDeleteBtn: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['delete'])

async function deleteHandler() {
  const res = confirm('Вы действительно хотите удалить запись? ')
  if (res) {
    emit('delete')
  }
}
</script>

<style scoped>
.slot-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 15px;
}
.slot-wrapper div {
  flex: 0 1 auto;
}
</style>
