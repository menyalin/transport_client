<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <load-spinner v-if="loading" />
        <app-document-form
          v-else
          :document="item"
          :displayDeleteBtn="!!props.id && $store.getters.hasPermission('document:delete')"
          @cancel="cancel"
          @submit="submit"
          @delete="deleteHandler"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import AppDocumentForm from '@/modules/profile/components/documentForm/index.vue'
import { LoadSpinner } from '@/shared/ui'
import { DocumentService } from '@/shared/services'
import { usePageDetails } from '@/shared/hooks'

defineOptions({ name: 'DocumentDetails' })

const props = defineProps({
  id: String,
})

const emit = defineEmits(['submit', 'cancel'])

const { item, loading, submit, cancel, deleteHandler } = usePageDetails(
  DocumentService,
  () => props.id,
  { emit }
)
</script>
<style></style>
