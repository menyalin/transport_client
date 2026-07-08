<template>
  <div>
    <v-autocomplete
      ref="input"
      v-model="modelValue"
      :hide-details="hideDetails"
      hide-no-data
      :items="items"
      :disabled="disabled"
      auto-select-first
      clearable
      :multiple="multiple"
      persistent-hint
      :label="label"
      :append-icon="hideAppendIcon || multiple ? null : appendIcon"
      @click:append="appendClick"
    />
    <v-dialog v-model="dialog" max-width="700" persistent>
      <v-card>
        <app-details-zone
          :id="modelValue"
          openInModal
          @cancel="cancelDialog"
          @submit="submit"
          @deleteItem="deleteHandler"
        />
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import AppDetailsZone from '@/pages/profile/zone/details.vue'

const modelValue = defineModel({ type: [String, Array] })

defineProps({
  label: String,
  hideDetails: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  hideAppendIcon: { type: Boolean, default: false },
  multiple: { type: Boolean, default: false },
})

const store = useStore()
const input = ref(null)
const dialog = ref(false)

const appendIcon = computed(() => {
  return modelValue.value ? 'mdi-pencil' : 'mdi-plus-circle'
})

const items = computed(() => {
  return store.getters.zonesForAutocomplete
})

function focus() {
  input.value?.focus()
}

function appendClick() {
  dialog.value = true
}

function cancelDialog() {
  dialog.value = false
}

function submit(val) {
  modelValue.value = val
  dialog.value = false
}

function deleteHandler() {
  modelValue.value = null
}

defineExpose({ focus })
</script>
<style scoped></style>
