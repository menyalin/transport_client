<template>
  <v-dialog :value="dialog" max-width="800" @input="closeDialog">
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
            dense
            @change="changeDocTypesHandler"
          />

          <v-text-field
            v-model="numberStr"
            ref="numberStrNode"
            label="Номера документов"
            hint="Номера документов через запятую"
            class="mt-5"
            outlined
            autofocus
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
          <v-text-field v-model="note" label="Общий комментарий" outlined />
          <v-checkbox
            label="Включать документы в опись"
            v-model="addToRegistry"
            color="primary"
          />
          <span>Будет создано документов: </span>{{ docCount }}
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" text @click="closeDialog"> Отмена </v-btn>
          <v-btn color="primary" text :disabled="!docCount" type="submit">
            Добавить
          </v-btn>
        </v-card-actions>
      </form>
    </v-card>
  </v-dialog>
</template>
<script>
import { computed, ref } from 'vue'
import dayjs from 'dayjs'
import store from '@/store'

export default {
  name: 'GroupDocDialog',
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
  },
  setup(_props, { emit }) {
    const numberStrNode = ref(null) // ссылка на DOM элемент
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

    // Вспомогательная функция для получения номеров документов
    const getNumbers = () => {
      return numberStr.value
        .split(',')
        .map((i) => i.trim())
        .filter((i) => !!i)
    }

    // Вспомогательная функция для создания документа
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

        // Если есть номера
        if (numbers.length > 0) {
          numbers.forEach((number) => {
            docTypes.value.forEach((type) => {
              res.push(createDocument(type, number))
            })
          })
        } else {
          // Если нет номеров, создаем пустые
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
      numberStrNode.value.focus()
    }

    return {
      addHandler,
      numberStr,
      docTypes,
      docStatus,
      addToRegistry,
      docTypeItems,
      docCount,
      docStatusItems,
      closeDialog,
      numberStrNode,
      changeDocTypesHandler,
      note,
    }
  },
}
</script>
<style scoped></style>
