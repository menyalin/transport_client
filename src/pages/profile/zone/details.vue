<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <load-spinner v-if="loading" />
        <app-zone-form
          v-else
          :zone="item"
          :displayDeleteBtn="!!props.id && $store.getters.hasPermission('zone:delete')"
          @cancel="cancel"
          @submit="submit"
          @delete="deleteHandler"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import AppZoneForm from '@/modules/profile/components/zoneForm/index.vue'
import { LoadSpinner } from '@/shared/ui'
import { ZoneService } from '@/shared/services'
import { usePageDetails } from '@/shared/hooks'

defineOptions({ name: 'PartnerDetails' })

const props = defineProps({
  id: String,
})

const emit = defineEmits(['submit', 'cancel'])

const { item, loading, submit, cancel, deleteHandler } = usePageDetails(
  ZoneService,
  () => props.id,
  { emit }
)
</script>
<style></style>
