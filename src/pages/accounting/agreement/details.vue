<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-alert v-model="error.show" closable type="error">
          {{ error.message }}
        </v-alert>
        <load-spinner v-if="loading" />
        <agreement-form
          v-else
          :agreement="item"
          :displayDeleteBtn="!!props.id && store.getters.hasPermission('agreement:delete')"
          :carrierItems="carrierItems"
          @cancel="cancel"
          @submit="submit"
          @delete="deleteHandler"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed } from 'vue'
import { AgreementForm } from '@/entities/agreement'
import { useCarrierStore } from '@/entities/carrier/useCarrierStore'
import { AgreementService } from '@/shared/services'
import { usePageDetails } from '@/shared/hooks'
import { LoadSpinner } from '@/shared/ui'
import { useStore } from 'vuex'

defineOptions({ name: 'AgreementDetails' })

const props = defineProps({
  id: String,
  openInModal: { type: Boolean, default: false },
})

const store = useStore()
const emit = defineEmits(['submit', 'cancel'])

const carrierStore = useCarrierStore()
const carrierItems = computed(() => carrierStore.carriers)

const { item, loading, error, submit, cancel, deleteHandler } = usePageDetails(
  AgreementService,
  () => props.id,
  { emit, openInModal: props.openInModal }
)
</script>

<style></style>
