<template>
  <v-dialog :model-value="dialog" max-width="800" @update:model-value="closeDialog">
    <v-card>
      <v-card-title class="text-h5"> Добавить группу документов </v-card-title>

      <form @submit.prevent="addHandler">
        <v-card-text class="form-wrapper">
          <v-checkbox
            v-for="item of docTypeItems"
            :key="item.value"
            v-model="docTypes"
            :label="item.text"
            :value="item.value"
            color="primary"
            hide-details
            @update:model-value="changeDocTypesHandler"
          />

          <v-text-field
            v-model="numberStr"
            ref="numberStrNode"
            label="Номера документов"
            hint="Номера документов через запятую"
            class="mt-5"
          />
          <v-radio-group v-model="docStatus" label="Статус документов">
            <v-radio
              v-for="item in docStatusItems"
              :key="item.value"
              :label="item.text"
              :value="item.value"
              color="primary"
            />
          </v-radio-group>
          <v-text-field v-model="note" label="Общий комментарий" />
          <v-checkbox label="Включать документы в опись" v-model="addToRegistry" color="primary" />
          <span>Будет создано документов: </span>{{ docCount }}
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="closeDialog"> Отмена </v-btn>
          <v-btn color="primary" :disabled="!docCount" type="submit"> Добавить </v-btn>
        </v-card-actions>
      </form>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, ref } from 'vue'
import dayjs from 'dayjs'
import { useStore } from 'vuex'

defineOptions({ name: 'GroupDocDialog' })

defineProps({
  dialog: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'pushDocs'])

const store = useStore()

const numberStrNode = ref(null)
const numberStr = ref('')
const note = ref('')
const docTypes = ref([])
const addToRegistry = ref(false)
const docStatus = ref('accepted')
const docTypeItems = computed(() => store.getters.documentTypes)
const docStatusItems = computed(() => store.getters.documentStatuses)

function closeDialog() {
  clear()
  emit('close')
}

const docCount = computed(() => {
  const numbers = numberStr.value
    .split(',')
    .map((i) => i.trim())
    .filter((i) => !!i).length
  return docTypes.value.length * (numbers || 1)
})

function clear() {
  docTypes.value = []
  numberStr.value = ''
}

const getNumbers = () => {
  return numberStr.value
    .split(',')
    .map((i) => i.trim())
    .filter((i) => !!i)
}

const createDocument = (type, number = '') => ({
  type,
  number,
  status: docStatus.value,
  date: dayjs().toISOString(),
  addToRegistry: addToRegistry.value,
  note: note.value,
})

async function addHandler() {
  if (!docCount.value) return
  try {
    const numbers = getNumbers()
    const res = []
    if (numbers.length > 0) {
      numbers.forEach((number) => {
        docTypes.value.forEach((type) => {
          res.push(createDocument(type, number))
        })
      })
    } else {
      docTypes.value.forEach((type) => {
        res.push(createDocument(type))
      })
    }
    emit('pushDocs', res)
    closeDialog()
  } catch (error) {
    console.error('Ошибка при добавлении документов:', error)
  }
}

function changeDocTypesHandler() {
  numberStrNode.value?.focus()
}
</script>

<style scoped></style>
