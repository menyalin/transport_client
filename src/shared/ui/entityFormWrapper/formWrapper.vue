<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-alert type="error" closable :value="showError">
          {{ errorMessage }}
        </v-alert>
        <LoadSpinner v-if="loading" />
        <slot v-else />
        <v-btn v-if="displayDeleteBtn" color="error" @click="deleteHandler">
          <v-icon start> mdi-delete </v-icon>
          Удалить
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { LoadSpinner } from '@/shared/ui'

defineProps<{
  showError: boolean
  errorMessage: string
  loading: boolean
  displayDeleteBtn: boolean
}>()

const emit = defineEmits(['delete'])

const deleteHandler = async () => {
  // TODO: add confirmation

  // const res = await this.$confirm(
  //   'Вы действительно хотите удалить запись? '
  // )
  // if (res) {
  emit('delete')
  // }
}
</script>

<style></style>
