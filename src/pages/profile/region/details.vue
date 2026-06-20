<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <load-spinner v-if="loading" />
        <app-region-form
          v-else
          :region="item"
          :displayDeleteBtn="!!props.id && $store.getters.hasPermission('region:delete')"
          @cancel="cancel"
          @submit="submit"
          @delete="deleteHandler"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import AppRegionForm from '@/modules/profile/components/regionForm/index.vue'
import { LoadSpinner } from '@/shared/ui'
import { RegionService } from '@/shared/services'
import { usePageDetails } from '@/shared/hooks'

defineOptions({ name: 'RegionDetails' })

const props = defineProps({
  id: String,
})

const emit = defineEmits(['submit', 'cancel'])

const { item, loading, submit, cancel, deleteHandler } = usePageDetails(
  RegionService,
  () => props.id,
  { emit }
)
</script>
<style></style>
