<template>
  <div class="wrapper ma-2">
    <h5>{{ title }}</h5>
    <v-btn color="primary" @click="addHandler" size="small" :disabled="disabled"> Добавить </v-btn>
    <component
      :is="tariffListComponent"
      :items="itemsWithIdx"
      @deleteByIdx="removeHandler"
      @updateByIdx="updateHandler"
    />
    <v-dialog
      :model-value="dialog"
      @update:model-value="showDialog = $event"
      max-width="800"
      persistent
    >
      <component
        :is="tariffFormComponent"
        :editableMode="Boolean(item)"
        :initialFormState="item"
        :formTitle="formTitle"
        @cancel="cancelHandler"
        @submit="saveHandler"
        @add="addTariffHandler"
      />
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'

const items = defineModel({ type: Array, default: () => [] })

defineProps({
  formTitle: String,
  title: String,
  disabled: {
    type: Boolean,
    default: false,
  },
  tariffFormComponent: {
    type: [Object, Function],
    required: true,
  },
  tariffListComponent: {
    type: [Object, Function],
    required: true,
  },
})

const item = ref(null)
const dialog = ref(false)

function addHandler() {
  dialog.value = true
}
function cancelHandler() {
  dialog.value = false
  item.value = null
}
function saveHandler(val) {
  if (item.value) {
    const newItems = [...items.value]
    newItems.splice(item.value.idx, 1, { ...val })
    items.value = newItems
    item.value = null
  } else {
    items.value = [...items.value, { ...val }]
  }
  dialog.value = false
}

const itemsWithIdx = computed(() => {
  return items.value.map((i, idx) => ({ ...i, idx }))
})

function addTariffHandler(val) {
  items.value = [...items.value, { ...val }]
}

function updateHandler(idx) {
  item.value = { ...items.value[idx], idx }
  nextTick(() => {
    dialog.value = true
  })
}

function removeByIdx(idx) {
  items.value = [...items.value.slice(0, idx), ...items.value.slice(idx + 1)]
}

function removeHandler(idx) {
  const res = confirm('Вы действительно хотите удалить запись? ')
  if (res) {
    removeByIdx(idx)
  }
}
</script>
<style scoped>
.wrapper {
  display: flex;
  gap: 15px;
  flex-direction: column;
  align-items: flex-start;
}
</style>
