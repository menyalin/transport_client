<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-alert v-model="error.show" closable type="error" @change="toggleAlert">
          {{ error.message }}
        </v-alert>
        <load-spinner v-if="loading" />
        <app-order-template-form
          v-else
          :orderTemplate="item"
          :displayDeleteBtn="!!props.id && $store.getters.hasPermission('orderTemplate:delete')"
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

defineOptions({ name: 'OrderTemplateDetails' })

const props = defineProps({
  id: String,
})

const emit = defineEmits(['submit', 'cancel'])

const { item, loading, error, toggleAlert, submit, cancel, deleteHandler } = usePageDetails(
  OrderTemplateService,
  () => props.id,
  { emit }
)
</script>
<style></style>
