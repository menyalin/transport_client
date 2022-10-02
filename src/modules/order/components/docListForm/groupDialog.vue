<template>
  <v-dialog 
    :value="dialog" 
    max-width="800"
    persistent
  >
    <v-card>
      <v-card-title class="text-h5">
        Добавить группу документов
      </v-card-title>

      <v-card-text class="form-wrapper">
        <v-select 
          v-model="variant"
          :items="variantItems"
          label="Вариант создания группы"
          outlined
          
          :style="{maxWidth: '400px'}"
        />
        
        <v-select 

          v-if="variant==='oneNumber'"
          v-model="docTypes"
          label="Типы документа"
          :items="docTypeItems"
          outlined
          multiple
        />
        <v-select 
          v-else-if="variant==='oneType'"
          v-model="docType"
          label="Тип документа"
          :items="docTypeItems"
          outlined
        />
        <v-text-field
          v-model="numberStr"
          :label="variant === 'oneNumber' ? 'Номер документа' : 'Номера документов'"
          :hint="variant === 'oneType' ? 'Номера документов через запятую' : null"
          outlined
        />
        <v-select
          v-model="docStatus" 
          :items="docStatusItems"
          label="Статус документа"
          outlined
        />
        <span>Будет создано документов: </span>{{ docCount }}
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn 
          color="primary" 
          text 
          @click="closeDialog"
        > 
          Отмена 
        </v-btn>

        <v-btn 
          color="primary" 
          text 
          :disabled="!docCount"
          @click="addHandler"
        >
          Добавить
        </v-btn>
      </v-card-actions>
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
  setup(props, { emit }) {
    const variantItems = [
      {value: 'oneType', text: 'Один тип с разными номерами'},
      {value: 'oneNumber', text: 'Разные типы с одним номером'},
    ]
    
    const numberStr = ref('')
    const docTypes = ref([])
    const docType = ref(null)
    const docStatus = ref('accepted')
    const docTypeItems = computed(() => store.getters.documentTypes)
    const docStatusItems = computed(() => store.getters.documentStatuses)
    const variant = ref('oneType')

    function closeDialog() {
      emit('close')
    }

    const docCount = computed(() => {
      if (variant.value === 'oneType' && !!docType.value) 
        return numberStr.value.split(',').map(i => i.trim()).filter(i => !!i).length
      
      else if (variant.value === 'oneNumber' && !!numberStr.value.trim()) 
        return docTypes.value.length
      
      else return 0
    })

    function addHandler() {
      if (!docCount.value) return null
        const res = []
        const date = dayjs().format('YYYY-MM-DD')
        
      if (variant.value === 'oneType') {
        const numbers = numberStr.value.split(',').map(i => i.trim()).filter(i => !!i)
        numbers.forEach(number => {
          res.push({type: docType.value, number, status: docStatus.value, date})
        })
      } else if (variant.value === 'oneNumber') {
        docTypes.value.forEach(type => {
          res.push({ type, number: numberStr.value.trim(), status: docStatus.value, date })
        })
      } else return null
    
      emit('pushDocs', res)  
    }


    return {
      addHandler,
      numberStr,
      docTypes,
      docType,
      docStatus,
      docTypeItems,
      docCount,
      docStatusItems,
      variant,
      variantItems,
      closeDialog,
    }
  },
}
</script>
<style scoped></style>
