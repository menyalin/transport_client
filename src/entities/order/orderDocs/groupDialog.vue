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
            density="compact"
            @update:model-value="changeDocTypesHandler"
          />

          <v-text-field
            ref="numberStrNode"
            v-model="numberStr"
            label="Номера документов"
            hint="Номера документов через запятую"
            class="mt-5"
            variant="outlined"
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
          <v-checkbox
            v-model="addToRegistry"
            label="Включать документы в опись"
            color="primary"
          />
          <span>Будет создано документов: </span>{{ docCount }}
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" variant="text" @click="closeDialog"> Отмена </v-btn>
          <v-btn color="primary" variant="text" :disabled="!docCount" type="submit">
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
    const numberStrNode = ref(null)
    const numberStr = ref('')
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

    function addHandler() {
      if (!docCount.value) return null
      const res = []
      const date = dayjs().format('YYYY-MM-DD')
      const numbers = numberStr.value
        .split(',')
        .map((i) => i.trim())
        .filter((i) => !!i)

      if (numbers.length) {
        numbers.forEach((number) => {
          docTypes.value.forEach((type) => {
            res.push({
              type,
              number,
              status: docStatus.value,
              date,
              addToRegistry: addToRegistry.value,
            })
          })
        })
      } else {
        docTypes.value.forEach((type) => {
          res.push({
            type,
            number: '',
            status: docStatus.value,
            date,
            addToRegistry: addToRegistry.value,
          })
        })
      }

      emit('pushDocs', res)
      clear()
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
    }
  },
}
</script>
<style scoped></style>
