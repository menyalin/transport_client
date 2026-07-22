<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-alert v-model="error.show" closable type="error">
          {{ error.message }}
        </v-alert>
        <load-spinner v-if="loading" />
        <app-order-template-form
          v-else
          v-model="item"
          :displayDeleteBtn="!!props.id && store.getters.hasPermission('orderTemplate:delete')"
          @cancel="cancel"
          @submit="submit"
          @delete="deleteHandler"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import AppOrderTemplateForm from '@/modules/profile/components/orderTemplateForm/index.vue'
import { LoadSpinner } from '@/shared/ui'
import { OrderTemplateService } from '@/shared/services'
import { usePageDetails } from '@/shared/hooks'
import { useStore } from 'vuex'

defineOptions({ name: 'OrderTemplateDetails' })

const props = defineProps({
  id: String,
})

const store = useStore()
const emit = defineEmits(['submit', 'cancel'])

const { item, loading, error, submit, cancel, deleteHandler } = usePageDetails(
  OrderTemplateService,
  () => props.id,
  { emit }
)
</script>

<style></style>
