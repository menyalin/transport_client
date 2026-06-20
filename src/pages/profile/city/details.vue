<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <load-spinner v-if="loading" />
        <app-city-form
          v-else
          :city="item"
          :displayDeleteBtn="!!props.id && $store.getters.hasPermission('city:delete')"
          @cancel="cancel"
          @submit="submit"
          @delete="deleteHandler"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import AppCityForm from '@/modules/profile/components/cityForm/index.vue'
import { LoadSpinner } from '@/shared/ui'
import { CityService } from '@/shared/services'
import { usePageDetails } from '@/shared/hooks'

defineOptions({ name: 'RegionDetails' })

const props = defineProps({
  id: String,
})

const emit = defineEmits(['submit', 'cancel'])

const { item, loading, submit, cancel, deleteHandler } = usePageDetails(
  CityService,
  () => props.id,
  { emit }
)
</script>
<style></style>
